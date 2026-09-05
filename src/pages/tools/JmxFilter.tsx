import { useState } from 'react'
import FileDrop from '../../components/tools/FileDrop'
import { ErrorBanner, FieldLabel, PrimaryButton, SuccessBanner, ToolPage, textInputClass } from '../../components/tools/ToolPage'
import {
  downloadTextFile,
  getRootHashTree,
  getSamplerDomain,
  getSamplerMethod,
  getTestname,
  isSamplerProxy,
  parseXml,
  readFileAsText,
  removeElementWithHashTree,
  serializeXmlPretty,
  walkPairs,
} from '../../lib/jmx'

const METHODS = ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'] as const
const DEFAULT_METHODS = new Set<string>(['GET', 'POST', 'PUT', 'OPTIONS'])

type Result = { xml: string; kept: string[]; removed: string[] }

export default function JmxFilter() {
  const [fileName, setFileName] = useState<string | null>(null)
  const [rawXml, setRawXml] = useState<string | null>(null)
  const [hostname, setHostname] = useState('')
  const [methods, setMethods] = useState<Set<string>>(new Set(DEFAULT_METHODS))
  const [error, setError] = useState<string | null>(null)
  const [result, setResult] = useState<Result | null>(null)
  const [busy, setBusy] = useState(false)

  async function handleFile(file: File) {
    setError(null)
    setResult(null)
    try {
      const text = await readFileAsText(file)
      parseXml(text) // validate up front so errors surface immediately
      setRawXml(text)
      setFileName(file.name)
    } catch (err) {
      setRawXml(null)
      setFileName(null)
      setError(err instanceof Error ? err.message : 'Failed to read file.')
    }
  }

  function toggleMethod(method: string) {
    setMethods((prev) => {
      const next = new Set(prev)
      if (next.has(method)) next.delete(method)
      else next.add(method)
      return next
    })
  }

  function applyFilter() {
    if (!rawXml) return
    setBusy(true)
    setError(null)
    // Yield a tick so the "processing" state actually paints before the
    // (synchronous, but potentially heavy on huge files) traversal runs.
    setTimeout(() => {
      try {
        const doc = parseXml(rawXml)
        const root = getRootHashTree(doc)
        const kept: string[] = []
        const removed: string[] = []
        const wantHostname = hostname.trim().toLowerCase()

        walkPairs(root, ({ element }) => {
          if (!isSamplerProxy(element)) return
          const name = getTestname(element) || '(unnamed sampler)'
          const domainOk = !wantHostname || getSamplerDomain(element).trim().toLowerCase() === wantHostname
          const methodOk = methods.has(getSamplerMethod(element))
          if (domainOk && methodOk) {
            kept.push(name)
          } else {
            removed.push(name)
            removeElementWithHashTree(element)
            return false // nothing left under this pair to recurse into
          }
        })

        setResult({ xml: serializeXmlPretty(doc), kept, removed })
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Filtering failed.')
      } finally {
        setBusy(false)
      }
    }, 0)
  }

  return (
    <ToolPage
      title="JMX Filter"
      description="Upload a .jmx plan, target a hostname and/or a set of HTTP methods, and download a copy with every non-matching HTTP request (and its paired hashTree) removed."
    >
      <FileDrop accept=".jmx,.xml" label="Drop a .jmx file, or click to browse" fileName={fileName} onFile={handleFile} />

      {error && <ErrorBanner message={error} />}

      {rawXml && (
        <>
          <div>
            <FieldLabel>Hostname filter (optional)</FieldLabel>
            <input
              className={textInputClass}
              placeholder="api.example.com"
              value={hostname}
              onChange={(e) => setHostname(e.target.value)}
            />
            <p className="mt-1 text-xs text-slate-500">Leave blank to keep every hostname; matches exactly (case-insensitive).</p>
          </div>

          <div>
            <FieldLabel>HTTP methods to keep</FieldLabel>
            <div className="mt-2 flex flex-wrap gap-3">
              {METHODS.map((method) => (
                <label key={method} className="flex items-center gap-2 rounded-md border border-slate-700 px-3 py-1.5 text-sm text-slate-300">
                  <input type="checkbox" checked={methods.has(method)} onChange={() => toggleMethod(method)} className="accent-teal-400" />
                  {method}
                </label>
              ))}
            </div>
          </div>

          <PrimaryButton onClick={applyFilter} disabled={busy || methods.size === 0}>
            {busy ? 'Filtering…' : 'Apply Filter'}
          </PrimaryButton>
        </>
      )}

      {result && (
        <>
          <SuccessBanner>
            Kept {result.kept.length} request{result.kept.length === 1 ? '' : 's'}, removed {result.removed.length}.
          </SuccessBanner>
          {result.removed.length > 0 && (
            <details className="rounded-lg border border-slate-800 p-3 text-sm text-slate-400">
              <summary className="cursor-pointer text-slate-300">Removed requests ({result.removed.length})</summary>
              <ul className="mt-2 max-h-48 space-y-1 overflow-y-auto">
                {result.removed.map((name, i) => (
                  <li key={i}>{name}</li>
                ))}
              </ul>
            </details>
          )}
          <PrimaryButton onClick={() => downloadTextFile(result.xml, `filtered-${fileName ?? 'plan.jmx'}`)}>
            Download Filtered JMX
          </PrimaryButton>
        </>
      )}
    </ToolPage>
  )
}
