import { useState } from 'react'
import FileDrop from '../../components/tools/FileDrop'
import { ErrorBanner, FieldLabel, PrimaryButton, SuccessBanner, ToolPage, textInputClass } from '../../components/tools/ToolPage'
import { downloadTextFile, serializeXmlPretty } from '../../lib/jmx'
import { harToJmx, parseHar, type ConversionSummary } from '../../lib/harToJmx'

export default function HarToJmx() {
  const [fileName, setFileName] = useState<string | null>(null)
  const [rawHar, setRawHar] = useState<string | null>(null)
  const [planName, setPlanName] = useState('Test Plan (from HAR)')
  const [error, setError] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)
  const [result, setResult] = useState<{ xml: string; summary: ConversionSummary } | null>(null)

  async function handleFile(file: File) {
    setError(null)
    setResult(null)
    try {
      const text = await file.text()
      parseHar(text) // validate up front
      setRawHar(text)
      setFileName(file.name)
    } catch (err) {
      setRawHar(null)
      setFileName(null)
      setError(err instanceof Error ? err.message : 'Failed to read file.')
    }
  }

  function convert() {
    if (!rawHar) return
    setBusy(true)
    setError(null)
    setTimeout(() => {
      try {
        const har = parseHar(rawHar)
        const { doc, summary } = harToJmx(har, planName || 'Test Plan (from HAR)')
        setResult({ xml: serializeXmlPretty(doc), summary })
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Conversion failed.')
      } finally {
        setBusy(false)
      }
    }, 0)
  }

  return (
    <ToolPage
      title="HAR → JMX Converter"
      description="Upload a browser-captured .har file (DevTools → Network → Save all as HAR) and get back a runnable JMeter test plan: one HTTPSamplerProxy + HeaderManager per request, wrapped in a Thread Group."
    >
      <FileDrop accept=".har,application/json" label="Drop a .har file, or click to browse" fileName={fileName} onFile={handleFile} />

      {error && <ErrorBanner message={error} />}

      {rawHar && (
        <>
          <div>
            <FieldLabel>Test Plan name</FieldLabel>
            <input className={textInputClass} value={planName} onChange={(e) => setPlanName(e.target.value)} />
          </div>
          <PrimaryButton onClick={convert} disabled={busy}>
            {busy ? 'Converting…' : 'Convert to JMX'}
          </PrimaryButton>
        </>
      )}

      {result && (
        <>
          <SuccessBanner>
            Converted {result.summary.requestCount} request{result.summary.requestCount === 1 ? '' : 's'} across{' '}
            {result.summary.hosts.length} host{result.summary.hosts.length === 1 ? '' : 's'}
            {result.summary.skippedCount > 0 && ` (${result.summary.skippedCount} skipped — unparseable URL)`}.
          </SuccessBanner>
          {result.summary.hosts.length > 0 && (
            <p className="text-xs text-slate-500">Hosts: {result.summary.hosts.join(', ')}</p>
          )}
          <PrimaryButton
            onClick={() => downloadTextFile(result.xml, `${(fileName ?? 'converted.har').replace(/\.har$/i, '')}.jmx`)}
          >
            Download JMX
          </PrimaryButton>
        </>
      )}
    </ToolPage>
  )
}
