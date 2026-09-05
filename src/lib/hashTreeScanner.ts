// A hand-rolled XML tag scanner used only by the hashTree Validator.
//
// Why not just use DOMParser + walkPairs here? Because the validator's job
// is specifically to report *line numbers*, and correlating a parsed DOM
// node back to a source line is fragile. Scanning the raw text ourselves
// gives us exact line numbers directly, for free.
//
// The tricky part is JSR223 samplers: their Groovy/BeanShell script bodies
// are typically wrapped in <![CDATA[ ... ]]> and can contain arbitrary
// text — including characters that look like tags (`<foo>`, comparisons
// like `a < b`, etc.). A naive "find the next <...>" scan would misfire
// inside that content, so CDATA sections (and comments, and the XML/PI
// declaration) are explicitly skipped as opaque blocks.

export type HashTreeIssue = {
  line: number
  element: string
  message: string
}

type Frame = {
  name: string
  line: number
  isHashTree: boolean
  children: { name: string; line: number }[]
}

export function scanHashTreeIssues(xmlText: string): HashTreeIssue[] {
  const issues: HashTreeIssue[] = []
  const stack: Frame[] = []
  const n = xmlText.length
  let i = 0
  let line = 1

  const advanceTo = (target: number) => {
    for (let k = i; k < target && k < n; k++) {
      if (xmlText.charCodeAt(k) === 10 /* \n */) line++
    }
    i = target
  }

  while (i < n) {
    const lt = xmlText.indexOf('<', i)
    if (lt === -1) break
    advanceTo(lt)

    if (xmlText.startsWith('<!--', i)) {
      const end = xmlText.indexOf('-->', i + 4)
      advanceTo(end === -1 ? n : end + 3)
      continue
    }
    if (xmlText.startsWith('<![CDATA[', i)) {
      const end = xmlText.indexOf(']]>', i + 9)
      advanceTo(end === -1 ? n : end + 3)
      continue
    }
    if (xmlText.startsWith('<?', i)) {
      const end = xmlText.indexOf('?>', i + 2)
      advanceTo(end === -1 ? n : end + 2)
      continue
    }
    if (xmlText.startsWith('<!', i)) {
      // DOCTYPE or other markup declaration — not used by JMeter, skip safely.
      const end = xmlText.indexOf('>', i + 2)
      advanceTo(end === -1 ? n : end + 1)
      continue
    }

    const gt = xmlText.indexOf('>', i)
    if (gt === -1) break
    const tagLine = line
    const raw = xmlText.slice(i + 1, gt)
    advanceTo(gt + 1)

    if (raw.startsWith('/')) {
      // Closing tag: pop the frame and, if it was a hashTree, validate its
      // direct children's pairing now that we know the full list.
      const frame = stack.pop()
      if (frame?.isHashTree) validateFrame(frame, issues)
      continue
    }

    const selfClosing = raw.endsWith('/')
    const body = selfClosing ? raw.slice(0, -1) : raw
    const nameMatch = body.match(/^([A-Za-z_][\w.\-:]*)/)
    const name = nameMatch ? nameMatch[1] : '(unrecognized tag)'

    if (stack.length > 0) {
      stack[stack.length - 1].children.push({ name, line: tagLine })
    }
    if (!selfClosing) {
      stack.push({ name, line: tagLine, isHashTree: name === 'hashTree', children: [] })
    }
  }

  // Any frames still open at EOF means unclosed tags — surface that too,
  // rather than silently ignoring a truncated/corrupt file.
  for (const frame of stack) {
    if (frame.isHashTree) validateFrame(frame, issues)
    issues.push({
      line: frame.line,
      element: frame.name,
      message: `<${frame.name}> opened at line ${frame.line} was never closed — the file may be truncated.`,
    })
  }

  return issues.sort((a, b) => a.line - b.line)
}

function validateFrame(frame: Frame, issues: HashTreeIssue[]) {
  const kids = frame.children
  for (let idx = 0; idx < kids.length; idx++) {
    const kid = kids[idx]
    if (kid.name === 'hashTree') continue
    const next = kids[idx + 1]
    if (!next || next.name !== 'hashTree') {
      issues.push({
        line: kid.line,
        element: kid.name,
        message: `<${kid.name}> at line ${kid.line} is not immediately followed by a <hashTree> sibling.`,
      })
    }
  }
}
