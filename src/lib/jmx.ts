// Shared browser-only utilities for the JMeter/JMX tools.
//
// Everything here runs entirely client-side (FileReader / DOMParser /
// XMLSerializer) — no network calls, no data ever leaves the page. This
// module holds the pieces every tool needs: reading the uploaded file,
// parsing it, walking JMeter's <hashTree> pairing structure, and
// serializing + downloading the result.
//
// --- JMeter's on-disk format, briefly ---
// A .jmx file alternates "content" elements with a <hashTree> sibling that
// holds that element's children (which are themselves pairs), e.g.:
//   <hashTree>
//     <ThreadGroup .../>
//     <hashTree>                <!-- ThreadGroup's children live here -->
//       <HTTPSamplerProxy .../>
//       <hashTree>               <!-- this sampler's headers/assertions/etc -->
//         <HeaderManager .../>
//         <hashTree/>            <!-- HeaderManager has no children: empty hashTree -->
//       </hashTree>
//     </hashTree>
//   </hashTree>
// Every non-hashTree element must be immediately followed by a hashTree
// sibling (even if that hashTree is empty) or JMeter's GUI can fail to load
// the plan, or silently drop parts of it.

export class JmxParseError extends Error {}

/** Read a File's contents as text via FileReader. */
export function readFileAsText(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(String(reader.result ?? ''))
    reader.onerror = () => reject(reader.error ?? new Error('Failed to read file'))
    reader.readAsText(file)
  })
}

/** Parse an XML string into a Document, throwing a friendly error if it's not well-formed. */
export function parseXml(xmlString: string): Document {
  const doc = new DOMParser().parseFromString(xmlString, 'application/xml')
  const parserError = doc.querySelector('parsererror')
  if (parserError) {
    throw new JmxParseError(
      `The file isn't well-formed XML: ${parserError.textContent?.trim().slice(0, 300) ?? 'unknown parse error'}`,
    )
  }
  return doc
}

/**
 * Serialize a Document back to a pretty-printed XML string.
 *
 * XMLSerializer alone produces a single unindented line, which is unusable
 * for a hand-editable JMX file. This rebuilds indentation by walking the
 * tree and inserting/replacing whitespace-only text nodes between element
 * children — it does not touch meaningful text content (e.g. Groovy script
 * bodies inside CDATA), only the whitespace *between* sibling elements.
 */
export function serializeXmlPretty(doc: Document, indent = '  '): string {
  const clone = doc.cloneNode(true) as Document
  indentNode(clone.documentElement, 0, indent)
  const xml = new XMLSerializer().serializeToString(clone)
  const declaration = '<?xml version="1.0" encoding="UTF-8"?>\n'
  return xml.startsWith('<?xml') ? xml : declaration + xml
}

function indentNode(node: Element, depth: number, indent: string) {
  const children = Array.from(node.childNodes)
  const elementChildren = children.filter((c) => c.nodeType === Node.ELEMENT_NODE) as Element[]

  if (elementChildren.length === 0) {
    return // leaf element (or text/CDATA-only) — leave its content untouched
  }

  // Remove existing whitespace-only text nodes, then re-insert consistent ones.
  for (const child of children) {
    if (child.nodeType === Node.TEXT_NODE && !child.textContent?.trim()) {
      node.removeChild(child)
    }
  }

  const childIndent = indent.repeat(depth + 1)
  const closingIndent = indent.repeat(depth)
  const doc = node.ownerDocument!

  for (const el of elementChildren) {
    node.insertBefore(doc.createTextNode('\n' + childIndent), el)
    indentNode(el, depth + 1, indent)
  }
  node.appendChild(doc.createTextNode('\n' + closingIndent))
}

/** Trigger a browser download of a string as a file, via a Blob object URL. */
export function downloadTextFile(content: string, filename: string, mimeType = 'application/xml') {
  const blob = new Blob([content], { type: mimeType })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  // Give the browser a tick to start the download before revoking the URL.
  setTimeout(() => URL.revokeObjectURL(url), 1000)
}

/** True if `el` is a <hashTree> element. */
export function isHashTree(el: Element): boolean {
  return el.tagName === 'hashTree'
}

/** The <hashTree> immediately following `el`, if any (its "children container"). */
export function getHashTreeSibling(el: Element): Element | null {
  const next = el.nextElementSibling
  return next && isHashTree(next) ? next : null
}

/**
 * Remove a JMeter element and its paired <hashTree> sibling (if present),
 * keeping the file structurally valid instead of leaving an orphaned
 * children-container behind.
 */
export function removeElementWithHashTree(el: Element) {
  const pair = getHashTreeSibling(el)
  el.remove()
  pair?.remove()
}

export type JmeterPair = { element: Element; hashTree: Element | null }

/**
 * Depth-first walk over every (element, hashTree) pair in the document,
 * starting from `root` (defaults to the document root's own hashTree).
 * `visit` returning `false` skips recursing into that pair's children
 * (useful once an element has been removed).
 */
export function walkPairs(root: Element, visit: (pair: JmeterPair) => void | false) {
  let child = root.firstElementChild
  while (child) {
    if (isHashTree(child)) {
      // Shouldn't normally happen (hashTrees are consumed as part of a pair
      // below) but skip defensively rather than mis-walk.
      child = child.nextElementSibling
      continue
    }
    const hashTree = getHashTreeSibling(child)
    // Capture where to resume *before* calling visit — visit may remove
    // `child` and/or `hashTree`, and a removed node's nextElementSibling
    // is always null, so we can't read it off `child` afterwards.
    const afterPair = hashTree ? hashTree.nextElementSibling : child.nextElementSibling
    const result = visit({ element: child, hashTree })
    if (result !== false && hashTree && hashTree.isConnected) {
      walkPairs(hashTree, visit)
    }
    child = afterPair
  }
}

/** Find the root <hashTree> directly under <jmeterTestPlan>. */
export function getRootHashTree(doc: Document): Element {
  const root = doc.documentElement
  const hashTree = root.firstElementChild
  if (!root || root.tagName !== 'jmeterTestPlan' || !hashTree || !isHashTree(hashTree)) {
    throw new JmxParseError('This does not look like a JMeter .jmx file (missing <jmeterTestPlan><hashTree>).')
  }
  return hashTree
}

/** Read a <stringProp name="..."> child's text content, or '' if absent. */
export function getStringProp(el: Element, propName: string): string {
  const prop = el.querySelector(`:scope > stringProp[name="${cssEscape(propName)}"]`)
  return prop?.textContent ?? ''
}

/** Set (creating if necessary) a <stringProp name="..."> child's text content. */
export function setStringProp(el: Element, propName: string, value: string) {
  let prop = el.querySelector(`:scope > stringProp[name="${cssEscape(propName)}"]`)
  if (!prop) {
    prop = el.ownerDocument.createElement('stringProp')
    prop.setAttribute('name', propName)
    el.appendChild(prop)
  }
  prop.textContent = value
}

function cssEscape(value: string): string {
  return value.replace(/(["\\])/g, '\\$1')
}

export function getTestname(el: Element): string {
  return el.getAttribute('testname') ?? ''
}

export function setTestname(el: Element, name: string) {
  el.setAttribute('testname', name)
}

export function isSamplerProxy(el: Element): boolean {
  return el.tagName === 'HTTPSamplerProxy'
}

export function isTransactionController(el: Element): boolean {
  return el.tagName === 'TransactionController'
}

export function isThreadGroup(el: Element): boolean {
  return el.tagName === 'ThreadGroup' || el.tagName === 'SetupThreadGroup' || el.tagName === 'PostThreadGroup'
}

export function getSamplerDomain(el: Element): string {
  return getStringProp(el, 'HTTPSampler.domain')
}

export function getSamplerMethod(el: Element): string {
  return getStringProp(el, 'HTTPSampler.method').toUpperCase()
}

/** Zero-pad a number to at least `width` digits. */
export function padNumber(n: number, width: number): string {
  return String(n).padStart(width, '0')
}

/** Friendly names for common JMeter GUI classes, for human-readable summaries. */
const FRIENDLY_GUICLASS: Record<string, string> = {
  ViewResultsFullVisualizer: 'View Results Tree listener',
  TableVisualizer: 'View Results in Table listener',
  SummaryReport: 'Summary Report listener',
  StatVisualizer: 'Aggregate Report listener',
  GraphVisualizer: 'Graph Results listener',
  HttpTestSampleGui: 'HTTP Request sampler',
  ThreadGroupGui: 'Thread Group',
  TransactionControllerGui: 'Transaction Controller',
  LogicControllerGui: 'Logic Controller',
  HeaderPanel: 'HTTP Header Manager',
}

/** A short, human-readable label for an element — its friendly GUI name if known, else its tag name. */
export function describeElement(el: Element): string {
  const guiclass = el.getAttribute('guiclass')
  return (guiclass && FRIENDLY_GUICLASS[guiclass]) || el.tagName
}
