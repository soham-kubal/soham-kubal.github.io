import { NavLink, Outlet } from 'react-router-dom'

const tools = [
  { to: '/tools', label: 'Overview', end: true },
  { to: '/tools/jmx-filter', label: 'JMX Filter', end: false },
  { to: '/tools/renumberer', label: 'Test Case Renumberer', end: false },
  { to: '/tools/hashtree-validator', label: 'hashTree Validator', end: false },
  { to: '/tools/har-to-jmx', label: 'HAR → JMX Converter', end: false },
  { to: '/tools/disabled-cleaner', label: 'Disabled Element Cleaner', end: false },
]

function linkClass({ isActive }: { isActive: boolean }) {
  return [
    'block rounded-md px-3 py-2 text-sm font-medium transition-colors',
    isActive ? 'bg-teal-400/10 text-teal-300' : 'text-slate-400 hover:bg-slate-800/60 hover:text-slate-200',
  ].join(' ')
}

export default function ToolsLayout() {
  return (
    <div className="mx-auto max-w-6xl px-6 py-12">
      <div className="mb-8">
        <p className="text-sm font-semibold uppercase tracking-widest text-teal-400">In the Browser</p>
        <h1 className="mt-1 text-3xl font-bold text-white">JMeter / JMX Toolkit</h1>
        <p className="mt-2 max-w-2xl text-sm text-slate-400">
          Everything here runs client-side — files are parsed with your browser's own FileReader/DOMParser and never
          leave this page. Nothing is uploaded anywhere.
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-[220px_1fr]">
        <nav className="flex gap-2 overflow-x-auto pb-2 lg:flex-col lg:overflow-visible lg:pb-0">
          {tools.map((tool) => (
            <NavLink key={tool.to} to={tool.to} end={tool.end} className={linkClass}>
              <span className="whitespace-nowrap lg:whitespace-normal">{tool.label}</span>
            </NavLink>
          ))}
        </nav>

        <div className="min-w-0 rounded-xl border border-slate-800 bg-slate-900/40 p-6">
          <Outlet />
        </div>
      </div>
    </div>
  )
}
