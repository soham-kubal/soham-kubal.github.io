import { Link } from 'react-router-dom'
import { profile } from '../../data/resume'

const tools = [
  {
    to: '/tools/jmx-filter',
    title: 'JMX Filter',
    description: 'Strip a .jmx plan down to specific hostnames and HTTP methods, keeping the file structurally valid.',
  },
  {
    to: '/tools/renumberer',
    title: 'Test Case Renumberer',
    description: 'Batch-rename transactions and samplers to a strict prefix/number convention for clean telemetry.',
  },
  {
    to: '/tools/hashtree-validator',
    title: 'hashTree Validator',
    description: "Catch broken <hashTree> pairing — with the exact line number — before JMeter's GUI chokes on it.",
  },
  {
    to: '/tools/har-to-jmx',
    title: 'HAR → JMX Converter',
    description: 'Turn a browser-captured HAR file into a ready-to-run JMeter test plan skeleton.',
  },
  {
    to: '/tools/disabled-cleaner',
    title: 'Disabled Element Cleaner',
    description: 'Strip every disabled sampler, listener, and controller out before a final review.',
  },
]

export default function ToolsHub() {
  return (
    <div>
      <p className="text-slate-400">
        Day to day I write Python CLI tools that do this exact job against enterprise JMX plans — these are browser
        ports of that toolkit, so any performance engineer can use them without installing anything.
      </p>

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        {tools.map((tool) => (
          <Link
            key={tool.to}
            to={tool.to}
            className="rounded-lg border border-slate-800 p-5 transition-colors hover:border-teal-400/60"
          >
            <h3 className="font-semibold text-white">{tool.title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-slate-400">{tool.description}</p>
          </Link>
        ))}
      </div>

      <p className="mt-8 text-sm text-slate-500">
        Found a bug or have a JMX headache you'd like turned into a tool?{' '}
        <a href={`mailto:${profile.email}`} className="font-semibold text-teal-300 hover:text-teal-200">
          Reach out
        </a>
        .
      </p>
    </div>
  )
}
