import type { ReactNode } from 'react'

export function ToolPage({ title, description, children }: { title: string; description: string; children: ReactNode }) {
  return (
    <div>
      <h1 className="text-2xl font-bold text-white sm:text-3xl">{title}</h1>
      <p className="mt-2 max-w-2xl text-sm leading-relaxed text-slate-400">{description}</p>
      <div className="mt-8 space-y-6">{children}</div>
    </div>
  )
}

export function ErrorBanner({ message }: { message: string }) {
  return (
    <div className="rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">{message}</div>
  )
}

export function SuccessBanner({ children }: { children: ReactNode }) {
  return (
    <div className="rounded-lg border border-teal-400/30 bg-teal-400/10 px-4 py-3 text-sm text-teal-200">
      {children}
    </div>
  )
}

export function PrimaryButton({
  onClick,
  disabled,
  children,
}: {
  onClick: () => void
  disabled?: boolean
  children: ReactNode
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className="rounded-md bg-teal-400 px-4 py-2 text-sm font-semibold text-slate-950 transition-colors hover:bg-teal-300 disabled:cursor-not-allowed disabled:bg-slate-700 disabled:text-slate-400"
    >
      {children}
    </button>
  )
}

export function FieldLabel({ children }: { children: ReactNode }) {
  return <label className="block text-sm font-medium text-slate-300">{children}</label>
}

export const textInputClass =
  'mt-1 w-full rounded-md border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-slate-200 placeholder:text-slate-600 focus:border-teal-400 focus:outline-none'
