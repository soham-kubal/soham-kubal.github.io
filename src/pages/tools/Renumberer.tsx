import { useMemo, useState } from 'react'
import FileDrop from '../../components/tools/FileDrop'
import { ErrorBanner, FieldLabel, PrimaryButton, SuccessBanner, ToolPage, textInputClass } from '../../components/tools/ToolPage'
import {
  downloadTextFile,
  getRootHashTree,
  getTestname,
  isThreadGroup,
  isSamplerProxy,
  isTransactionController,
  padNumber,
  parseXml,
  readFileAsText,
  serializeXmlPretty,
  setTestname,
  walkPairs,
  type JmeterPair,
} from '../../lib/jmx'

type Rename = { before: string; after: string }

/** Find every ThreadGroup's testname, in document order, for the scope dropdown. */
function discoverThreadGroupNames(doc: Document): string[] {
  const names: string[] = []
  walkPairs(getRootHashTree(doc), ({ element }) => {
    if (isThreadGroup(element)) names.push(getTestname(element) || '(unnamed thread group)')
  })
  return names
}

export default function Renumberer() {
  const [fileName, setFileName] = useState<string | null>(null)
  const [rawXml, setRawXml] = useState<string | null>(null)
  const [threadGroups, setThreadGroups] = useState<string[]>([])
  const [prefix, setPrefix] = useState('TC01_Login_')
  const [startIndex, setStartIndex] = useState(1)
  const [scope, setScope] = useState<'all' | 'threadgroup'>('all')
  const [selectedGroup, setSelectedGroup] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)
  const [result, setResult] = useState<{ xml: string; renames: Rename[] } | null>(null)

  const canApply = useMemo(
    () => Boolean(rawXml) && prefix.trim().length > 0 && (scope === 'all' || selectedGroup),
    [rawXml, prefix, scope, selectedGroup],
  )

  async function handleFile(file: File) {
    setError(null)
    setResult(null)
    try {
      const text = await readFileAsText(file)
      const doc = parseXml(text)
      const groups = discoverThreadGroupNames(doc)
      setThreadGroups(groups)
      setSelectedGroup(groups[0] ?? '')
      setRawXml(text)
      setFileName(file.name)
    } catch (err) {
      setRawXml(null)
      setFileName(null)
      setError(err instanceof Error ? err.message : 'Failed to read file.')
    }
  }

  function applyRenumber() {
    if (!rawXml) return
    setBusy(true)
    setError(null)
    setTimeout(() => {
      try {
        const doc = parseXml(rawXml)
        const root = getRootHashTree(doc)

        // Resolve the scope root: either the whole plan, or one ThreadGroup's
        // own hashTree (its children), located by matching testname.
        let scopeRoot = root
        if (scope === 'threadgroup') {
          let found: Element | null = null
          walkPairs(root, ({ element, hashTree }) => {
            if (isThreadGroup(element) && getTestname(element) === selectedGroup && hashTree) {
              found = hashTree
              return false
            }
          })
          if (!found) throw new Error(`Couldn't find a Thread Group named "${selectedGroup}".`)
          scopeRoot = found
        }

        const matches: Element[] = []
        const visit = (pair: JmeterPair) => {
          if (isTransactionController(pair.element) || isSamplerProxy(pair.element)) {
            matches.push(pair.element)
          }
        }
        walkPairs(scopeRoot, visit)

        const width = Math.max(2, String(startIndex + matches.length - 1).length)
        const renames: Rename[] = matches.map((el, i) => {
          const before = getTestname(el)
          const after = `${prefix}${padNumber(startIndex + i, width)}`
          setTestname(el, after)
          return { before, after }
        })

        setResult({ xml: serializeXmlPretty(doc), renames })
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Renumbering failed.')
      } finally {
        setBusy(false)
      }
    }, 0)
  }

  return (
    <ToolPage
      title="Test Case Renumberer"
      description="Batch-rename every Transaction Controller and HTTP Sampler to a strict prefix + sequence number, for clean, consistent telemetry in Grafana or Application Insights."
    >
      <FileDrop accept=".jmx,.xml" label="Drop a .jmx file, or click to browse" fileName={fileName} onFile={handleFile} />

      {error && <ErrorBanner message={error} />}

      {rawXml && (
        <>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <FieldLabel>Prefix</FieldLabel>
              <input className={textInputClass} value={prefix} onChange={(e) => setPrefix(e.target.value)} placeholder="TC01_Login_" />
            </div>
            <div>
              <FieldLabel>Starting index</FieldLabel>
              <input
                type="number"
                min={0}
                className={textInputClass}
                value={startIndex}
                onChange={(e) => setStartIndex(Number(e.target.value) || 0)}
              />
            </div>
          </div>

          <div>
            <FieldLabel>Scope</FieldLabel>
            <div className="mt-2 flex flex-wrap items-center gap-3">
              <label className="flex items-center gap-2 text-sm text-slate-300">
                <input type="radio" checked={scope === 'all'} onChange={() => setScope('all')} className="accent-teal-400" />
                Entire Test Plan
              </label>
              <label className="flex items-center gap-2 text-sm text-slate-300">
                <input
                  type="radio"
                  checked={scope === 'threadgroup'}
                  onChange={() => setScope('threadgroup')}
                  disabled={threadGroups.length === 0}
                  className="accent-teal-400"
                />
                One Thread Group
              </label>
              {scope === 'threadgroup' && (
                <select
                  className={`${textInputClass} mt-0 w-auto`}
                  value={selectedGroup}
                  onChange={(e) => setSelectedGroup(e.target.value)}
                >
                  {threadGroups.map((name) => (
                    <option key={name} value={name}>
                      {name}
                    </option>
                  ))}
                </select>
              )}
            </div>
            {threadGroups.length === 0 && <p className="mt-1 text-xs text-slate-500">No Thread Groups found in this file.</p>}
          </div>

          <PrimaryButton onClick={applyRenumber} disabled={busy || !canApply}>
            {busy ? 'Renumbering…' : 'Apply Renumbering'}
          </PrimaryButton>
        </>
      )}

      {result && (
        <>
          <SuccessBanner>Renamed {result.renames.length} element{result.renames.length === 1 ? '' : 's'}.</SuccessBanner>
          {result.renames.length > 0 && (
            <details open className="rounded-lg border border-slate-800 p-3 text-sm">
              <summary className="cursor-pointer text-slate-300">Preview</summary>
              <div className="mt-2 max-h-64 overflow-y-auto">
                <table className="w-full text-left text-xs">
                  <thead className="text-slate-500">
                    <tr>
                      <th className="py-1 pr-4 font-medium">Before</th>
                      <th className="py-1 font-medium">After</th>
                    </tr>
                  </thead>
                  <tbody className="text-slate-300">
                    {result.renames.map((r, i) => (
                      <tr key={i} className="border-t border-slate-800">
                        <td className="py-1 pr-4 text-slate-500">{r.before || '(unnamed)'}</td>
                        <td className="py-1 font-medium text-teal-300">{r.after}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </details>
          )}
          <PrimaryButton onClick={() => downloadTextFile(result.xml, `renumbered-${fileName ?? 'plan.jmx'}`)}>
            Download Renumbered JMX
          </PrimaryButton>
        </>
      )}
    </ToolPage>
  )
}
