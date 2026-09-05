import { profile } from '../data/resume'

const planned = [
  {
    title: 'JMX Flattener',
    description: 'Collapse nested Test Fragments and Modules into a single flat JMX for easier review and diffing.',
  },
  {
    title: 'Test Case Renumberer',
    description: 'Batch-renumber transaction/sampler names across a JMX plan to keep naming conventions consistent.',
  },
  {
    title: 'hashTree Validator',
    description: 'Catch malformed or mismatched <hashTree> structures before a plan fails silently in JMeter.',
  },
  {
    title: 'HAR → JMX Converter',
    description: 'Turn a browser-captured HAR file into a ready-to-run JMeter test plan skeleton.',
  },
  {
    title: 'Disabled Element Cleaner',
    description: 'Strip disabled samplers, listeners, and controllers out of a JMX before handing it off for review.',
  },
]

export default function Tools() {
  return (
    <div className="mx-auto max-w-5xl px-6 py-16">
      <p className="text-sm font-semibold uppercase tracking-widest text-teal-400">In the Works</p>
      <h1 className="mt-1 text-3xl font-bold text-white sm:text-4xl">JMeter / JMX Tools</h1>
      <p className="mt-4 max-w-2xl text-slate-400">
        Day to day, I write Python CLI tools to manipulate JMeter test plans — renumbering test cases,
        flattening structures, validating hashTrees, converting HAR captures, and cleaning up disabled
        elements. This page will host browser-based versions of that toolkit so other performance
        engineers can use them without installing anything — no test data or JMX content ever leaves
        your browser.
      </p>

      <div className="mt-10 grid gap-4 sm:grid-cols-2">
        {planned.map((tool) => (
          <div key={tool.title} className="relative rounded-lg border border-dashed border-slate-700 p-5">
            <span className="absolute right-4 top-4 rounded-full bg-slate-800 px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wide text-slate-400">
              Coming soon
            </span>
            <h3 className="pr-24 font-semibold text-white">{tool.title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-slate-400">{tool.description}</p>
          </div>
        ))}
      </div>

      <p className="mt-10 text-sm text-slate-500">
        Want early access or have a JMX headache you'd like turned into a tool?{' '}
        <a href={`mailto:${profile.email}`} className="font-semibold text-teal-300 hover:text-teal-200">
          Reach out
        </a>
        .
      </p>
    </div>
  )
}
