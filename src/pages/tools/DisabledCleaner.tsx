import { useState } from 'react'
import FileDrop from '../../components/tools/FileDrop'
import { ErrorBanner, PrimaryButton, SuccessBanner, ToolPage } from '../../components/tools/ToolPage'
import {
  describeElement,
  downloadTextFile,
  parseXml,
  readFileAsText,
  removeElementWithHashTree,
  serializeXmlPretty,
} from '../../lib/jmx'

type Result = { xml: string; counts: [string, number][]; total: number }

export default function DisabledCleaner() {
  const [fileName, setFileName] = useState<string | null>(null)
  const [rawXml, setRawXml] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)
  const [result, setResult] = useState<Result | null>(null)

  async function handleFile(file: File) {
    setError(null)
    setResult(null)
    try {
      const text = await readFileAsText(file)
      parseXml(text)
      setRawXml(text)
      setFileName(file.name)
    } catch (err) {
      setRawXml(null)
      setFileName(null)
      setError(err instanceof Error ? err.message : 'Failed to read file.')
    }
  }

  function clean() {
    if (!rawXml) return
    setBusy(true)
    setError(null)
    setTimeout(() => {
      try {
        const doc = parseXml(rawXml)
        const allDisabled = Array.from(doc.querySelectorAll('[enabled="false"]'))
        const disabledSet = new Set(allDisabled)

        // Only remove the outermost disabled elements — a disabled element's
        // own disabled descendants get removed along with it, and trying to
        // remove them separately would just fail to find an attached node.
        const outermost = allDisabled.filter((el) => {
          let parent = el.parentElement
          while (parent) {
            if (disabledSet.has(parent)) return false
            parent = parent.parentElement
          }
          return true
        })

        const counts = new Map<string, number>()
        for (const el of outermost) {
          const label = describeElement(el)
          counts.set(label, (counts.get(label) ?? 0) + 1)
        }
        for (const el of outermost) removeElementWithHashTree(el)

        setResult({ xml: serializeXmlPretty(doc), counts: Array.from(counts.entries()), total: outermost.length })
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Cleanup failed.')
      } finally {
        setBusy(false)
      }
    }, 0)
  }

  return (
    <ToolPage
      title="Disabled Element Cleaner"
      description={'Strips every disabled sampler, listener, controller, or config element (enabled="false") out of a .jmx plan — plus its paired hashTree — for a pristine file to hand off.'}
    >
      <FileDrop accept=".jmx,.xml" label="Drop a .jmx file, or click to browse" fileName={fileName} onFile={handleFile} />

      {error && <ErrorBanner message={error} />}

      {rawXml && (
        <PrimaryButton onClick={clean} disabled={busy}>
          {busy ? 'Cleaning…' : 'Remove Disabled Elements'}
        </PrimaryButton>
      )}

      {result && result.total === 0 && <SuccessBanner>No disabled elements found — this plan is already clean.</SuccessBanner>}

      {result && result.total > 0 && (
        <>
          <SuccessBanner>
            Removed {result.total} disabled element{result.total === 1 ? '' : 's'}:
            <ul className="mt-2 list-disc pl-5">
              {result.counts.map(([label, count]) => (
                <li key={label}>
                  {count} {label}
                  {count === 1 ? '' : 's'}
                </li>
              ))}
            </ul>
          </SuccessBanner>
          <PrimaryButton onClick={() => downloadTextFile(result.xml, `cleaned-${fileName ?? 'plan.jmx'}`)}>
            Download Cleaned JMX
          </PrimaryButton>
        </>
      )}
    </ToolPage>
  )
}
