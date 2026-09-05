import { useRef, useState, type DragEvent } from 'react'

type FileDropProps = {
  accept: string
  label: string
  hint?: string
  onFile: (file: File) => void
  fileName?: string | null
}

/** Drag-and-drop + click-to-browse file picker. Never uploads anything — the
 *  File object is handed straight to the caller for local FileReader use. */
export default function FileDrop({ accept, label, hint, onFile, fileName }: FileDropProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [dragging, setDragging] = useState(false)

  function handleDrop(e: DragEvent<HTMLDivElement>) {
    e.preventDefault()
    setDragging(false)
    const file = e.dataTransfer.files?.[0]
    if (file) onFile(file)
  }

  return (
    <div>
      <div
        role="button"
        tabIndex={0}
        onClick={() => inputRef.current?.click()}
        onKeyDown={(e) => e.key === 'Enter' && inputRef.current?.click()}
        onDragOver={(e) => {
          e.preventDefault()
          setDragging(true)
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={handleDrop}
        className={[
          'cursor-pointer rounded-lg border-2 border-dashed p-8 text-center transition-colors',
          dragging ? 'border-teal-400 bg-teal-400/5' : 'border-slate-700 hover:border-slate-600',
        ].join(' ')}
      >
        <p className="font-medium text-slate-200">{label}</p>
        {hint && <p className="mt-1 text-sm text-slate-500">{hint}</p>}
        {fileName && <p className="mt-3 text-sm font-medium text-teal-300">Loaded: {fileName}</p>}
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0]
            if (file) onFile(file)
            e.target.value = '' // allow re-selecting the same file
          }}
        />
      </div>
    </div>
  )
}
