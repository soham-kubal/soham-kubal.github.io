// Builds a runnable JMeter test plan (as a DOM Document) from a browser-
// captured HAR file. Produces: TestPlan > ThreadGroup > one HTTPSamplerProxy
// (+ HeaderManager) per HAR entry.

type HarHeader = { name: string; value: string }
type HarQueryParam = { name: string; value: string }
type HarPostDataParam = { name: string; value?: string }
type HarPostData = { mimeType?: string; text?: string; params?: HarPostDataParam[] }
type HarRequest = {
  method: string
  url: string
  headers?: HarHeader[]
  queryString?: HarQueryParam[]
  postData?: HarPostData
}
type HarEntry = { request: HarRequest }
type HarFile = { log?: { entries?: HarEntry[] } }

export class HarParseError extends Error {}

/** Headers that only make sense for the original browser request, not a JMeter replay. */
const SKIPPED_HEADER_NAMES = new Set(['host', 'content-length', 'cookie2'])

export type ConversionSummary = {
  requestCount: number
  skippedCount: number
  hosts: string[]
}

export function parseHar(text: string): HarFile {
  let json: unknown
  try {
    json = JSON.parse(text)
  } catch (err) {
    throw new HarParseError(`Not valid JSON: ${(err as Error).message}`)
  }
  const har = json as HarFile
  if (!har.log?.entries) {
    throw new HarParseError('Not a recognizable HAR file (missing log.entries).')
  }
  return har
}

export function harToJmx(har: HarFile, planName: string): { doc: Document; summary: ConversionSummary } {
  const doc = document.implementation.createDocument(null, '')
  const entries = har.log?.entries ?? []

  const jmeterTestPlan = doc.createElement('jmeterTestPlan')
  jmeterTestPlan.setAttribute('version', '1.2')
  jmeterTestPlan.setAttribute('properties', '5.0')
  jmeterTestPlan.setAttribute('jmeter', '5.6.3')
  doc.appendChild(jmeterTestPlan)

  const rootHashTree = doc.createElement('hashTree')
  jmeterTestPlan.appendChild(rootHashTree)

  const testPlan = createTestPlanElement(doc, planName)
  rootHashTree.appendChild(testPlan)
  const testPlanHashTree = doc.createElement('hashTree')
  rootHashTree.appendChild(testPlanHashTree)

  const threadGroup = createThreadGroupElement(doc)
  testPlanHashTree.appendChild(threadGroup)
  const threadGroupHashTree = doc.createElement('hashTree')
  testPlanHashTree.appendChild(threadGroupHashTree)

  const hosts = new Set<string>()
  let skipped = 0

  entries.forEach((entry, index) => {
    let url: URL
    try {
      url = new URL(entry.request.url)
    } catch {
      skipped++
      return // unparseable URL — nothing sensible to emit
    }
    hosts.add(url.hostname)

    const sampler = createHttpSamplerElement(doc, entry.request, url, index)
    threadGroupHashTree.appendChild(sampler)
    const samplerHashTree = doc.createElement('hashTree')
    threadGroupHashTree.appendChild(samplerHashTree)

    const headers = (entry.request.headers ?? []).filter(
      (h) => !SKIPPED_HEADER_NAMES.has(h.name.toLowerCase()) && !h.name.startsWith(':'),
    )
    if (headers.length > 0) {
      samplerHashTree.appendChild(createHeaderManagerElement(doc, headers))
      samplerHashTree.appendChild(doc.createElement('hashTree'))
    }
  })

  return {
    doc,
    summary: { requestCount: entries.length - skipped, skippedCount: skipped, hosts: Array.from(hosts) },
  }
}

function stringProp(doc: Document, name: string, value: string): Element {
  const el = doc.createElement('stringProp')
  el.setAttribute('name', name)
  el.textContent = value
  return el
}

function boolProp(doc: Document, name: string, value: boolean): Element {
  const el = doc.createElement('boolProp')
  el.setAttribute('name', name)
  el.textContent = String(value)
  return el
}

function createTestPlanElement(doc: Document, planName: string): Element {
  const el = doc.createElement('TestPlan')
  el.setAttribute('guiclass', 'TestPlanGui')
  el.setAttribute('testclass', 'TestPlan')
  el.setAttribute('testname', planName)
  el.setAttribute('enabled', 'true')
  el.append(
    stringProp(doc, 'TestPlan.comments', 'Generated from a HAR capture by the JMeter Toolkit.'),
    boolProp(doc, 'TestPlan.functional_mode', false),
    boolProp(doc, 'TestPlan.tearDown_on_shutdown', true),
    boolProp(doc, 'TestPlan.serialize_threadgroups', false),
    createArgumentsElementProp(doc, 'TestPlan.user_defined_variables', 'User Defined Variables', []),
    stringProp(doc, 'TestPlan.user_define_classpath', ''),
  )
  return el
}

function createThreadGroupElement(doc: Document): Element {
  const el = doc.createElement('ThreadGroup')
  el.setAttribute('guiclass', 'ThreadGroupGui')
  el.setAttribute('testclass', 'ThreadGroup')
  el.setAttribute('testname', 'Thread Group (from HAR)')
  el.setAttribute('enabled', 'true')

  const loopController = doc.createElement('elementProp')
  loopController.setAttribute('name', 'ThreadGroup.main_controller')
  loopController.setAttribute('elementType', 'LoopController')
  loopController.setAttribute('guiclass', 'LoopControlPanel')
  loopController.setAttribute('testclass', 'LoopController')
  loopController.setAttribute('testname', 'Loop Controller')
  loopController.setAttribute('enabled', 'true')
  loopController.append(boolProp(doc, 'LoopController.continue_forever', false), stringProp(doc, 'LoopController.loops', '1'))

  el.append(
    stringProp(doc, 'ThreadGroup.on_sample_error', 'continue'),
    loopController,
    stringProp(doc, 'ThreadGroup.num_threads', '1'),
    stringProp(doc, 'ThreadGroup.ramp_time', '1'),
    boolProp(doc, 'ThreadGroup.scheduler', false),
    stringProp(doc, 'ThreadGroup.duration', ''),
    stringProp(doc, 'ThreadGroup.delay', ''),
  )
  return el
}

function createArgumentsElementProp(doc: Document, name: string, testname: string, args: { name: string; value: string }[]): Element {
  const elementProp = doc.createElement('elementProp')
  elementProp.setAttribute('name', name)
  elementProp.setAttribute('elementType', 'Arguments')
  elementProp.setAttribute('guiclass', 'ArgumentsPanel')
  elementProp.setAttribute('testclass', 'Arguments')
  elementProp.setAttribute('testname', testname)
  elementProp.setAttribute('enabled', 'true')

  const collection = doc.createElement('collectionProp')
  collection.setAttribute('name', 'Arguments.arguments')
  for (const arg of args) {
    const argProp = doc.createElement('elementProp')
    argProp.setAttribute('name', arg.name)
    argProp.setAttribute('elementType', 'Argument')
    argProp.append(
      stringProp(doc, 'Argument.name', arg.name),
      stringProp(doc, 'Argument.value', arg.value),
      stringProp(doc, 'Argument.metadata', '='),
    )
    collection.appendChild(argProp)
  }
  elementProp.appendChild(collection)
  return elementProp
}

function createHttpArgumentElementProp(doc: Document, name: string, value: string, isRawBody: boolean): Element {
  const elementProp = doc.createElement('elementProp')
  elementProp.setAttribute('name', isRawBody ? '' : name)
  elementProp.setAttribute('elementType', 'HTTPArgument')
  elementProp.append(
    boolProp(doc, 'HTTPArgument.always_encode', false),
    stringProp(doc, 'Argument.value', value),
    stringProp(doc, 'Argument.metadata', '='),
  )
  if (!isRawBody) {
    elementProp.append(boolProp(doc, 'HTTPArgument.use_equals', true), stringProp(doc, 'Argument.name', name))
  }
  return elementProp
}

function createHttpSamplerElement(doc: Document, request: HarRequest, url: URL, index: number): Element {
  const el = doc.createElement('HTTPSamplerProxy')
  el.setAttribute('guiclass', 'HttpTestSampleGui')
  el.setAttribute('testclass', 'HTTPSamplerProxy')
  el.setAttribute('testname', `${request.method} ${url.pathname || '/'}`.trim() || `Request ${index + 1}`)
  el.setAttribute('enabled', 'true')

  const postData = request.postData
  const hasRawBody = Boolean(postData?.text) && !postData?.params?.length
  el.appendChild(boolProp(doc, 'HTTPSampler.postBodyRaw', hasRawBody))

  const collection = doc.createElement('collectionProp')
  collection.setAttribute('name', 'Arguments.arguments')

  for (const q of request.queryString ?? []) {
    collection.appendChild(createHttpArgumentElementProp(doc, q.name, q.value, false))
  }
  if (postData?.params?.length) {
    for (const p of postData.params) {
      collection.appendChild(createHttpArgumentElementProp(doc, p.name, p.value ?? '', false))
    }
  } else if (hasRawBody && postData?.text) {
    collection.appendChild(createHttpArgumentElementProp(doc, '', postData.text, true))
  }

  const argumentsElementProp = doc.createElement('elementProp')
  argumentsElementProp.setAttribute('name', 'HTTPsampler.Arguments')
  argumentsElementProp.setAttribute('elementType', 'Arguments')
  argumentsElementProp.appendChild(collection)
  el.appendChild(argumentsElementProp)

  el.append(
    stringProp(doc, 'HTTPSampler.domain', url.hostname),
    stringProp(doc, 'HTTPSampler.port', url.port || (url.protocol === 'https:' ? '443' : '80')),
    stringProp(doc, 'HTTPSampler.protocol', url.protocol.replace(':', '')),
    stringProp(doc, 'HTTPSampler.contentEncoding', ''),
    stringProp(doc, 'HTTPSampler.path', url.pathname || '/'),
    stringProp(doc, 'HTTPSampler.method', request.method.toUpperCase()),
    boolProp(doc, 'HTTPSampler.follow_redirects', true),
    boolProp(doc, 'HTTPSampler.auto_redirects', false),
    boolProp(doc, 'HTTPSampler.use_keepalive', true),
    boolProp(doc, 'HTTPSampler.DO_MULTIPART_POST', postData?.mimeType?.includes('multipart') ?? false),
  )
  return el
}

function createHeaderManagerElement(doc: Document, headers: HarHeader[]): Element {
  const el = doc.createElement('HeaderManager')
  el.setAttribute('guiclass', 'HeaderPanel')
  el.setAttribute('testclass', 'HeaderManager')
  el.setAttribute('testname', 'HTTP Header Manager')
  el.setAttribute('enabled', 'true')

  const collection = doc.createElement('collectionProp')
  collection.setAttribute('name', 'HeaderManager.headers')
  for (const h of headers) {
    const headerProp = doc.createElement('elementProp')
    headerProp.setAttribute('name', h.name)
    headerProp.setAttribute('elementType', 'Header')
    headerProp.append(stringProp(doc, 'Header.name', h.name), stringProp(doc, 'Header.value', h.value))
    collection.appendChild(headerProp)
  }
  el.appendChild(collection)
  return el
}
