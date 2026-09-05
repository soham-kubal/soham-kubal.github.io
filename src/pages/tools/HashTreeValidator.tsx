import { useState } from 'react'
import FileDrop from '../../components/tools/FileDrop'
import { ErrorBanner, PrimaryButton, SuccessBanner, ToolPage } from '../../components/tools/ToolPage'
import { readFileAsText } from '../../lib/jmx'
import { scanHashTreeIssues, type HashTreeIssue } from '../../lib/hashTreeScanner'

export default function HashTreeValidator() {
  const [fileName, setFileName] = useState<string | null>(null)
  const [rawXml, setRawXml] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [issues, setIssues] = useState<HashTreeIssue[] | null>(null)
  const [busy, setBusy] = useState(false)

  async function handleFile(file: File) {
    setError(null)
    setIssues(null)
    try {
      const text = await readFileAsText(file)
      setRawXml(text)
      setFileName(file.name)
    } catch (err) {
      setRawXml(null)
      setFileName(null)
      setError(err instanceof Error ? err.message : 'Failed to read file.')
    }
  }

  function analyze() {
    if (!rawXml) return
    setBusy(true)
    setError(null)
    setTimeout(() => {
      try {
        setIssues(scanHashTreeIssues(rawXml))
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Validation failed.')
      } finally {
        setBusy(false)
      }
    }, 0)
  }

  return (
    <ToolPage
      title="hashTree Validator"
      description="Checks JMeter's strict pairing rule — every functional element must be immediately followed by a <hashTree> sibling — and reports the exact line number where it breaks, before the GUI fails silently on it."
    >
      <FileDrop accept=".jmx,.xml" label="Drop a .jmx file, or click to browse" fileName={fileName} onFile={handleFile} />

      {error && <ErrorBanner message={error} />}

      {rawXml && (
        <PrimaryButton onClick={analyze} disabled={busy}>
          {busy ? 'Scanning…' : 'Validate Structure'}
        </PrimaryButton>
      )}

      {issues && issues.length === 0 && <SuccessBanner>No pairing issues found — this file's hashTree structure looks healthy.</SuccessBanner>}

      {issues && issues.length > 0 && (
        <div className="rounded-lg border border-amber-500/30 bg-amber-500/10 p-4">
          <p className="text-sm font-semibold text-amber-300">
            {issues.length} issue{issues.length === 1 ? '' : 's'} found
          </p>
          <ul className="mt-3 space-y-2 text-sm">
            {issues.map((issue, i) => (
              <li key={i} className="rounded-md bg-slate-950/40 px-3 py-2 text-amber-200">
                <span className="font-mono text-xs text-amber-400">Line {issue.line}</span> — {issue.message}
              </li>
            ))}
          </ul>
        </div>
      )}
    </ToolPage>
  )
}
