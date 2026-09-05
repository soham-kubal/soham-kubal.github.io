import SectionHeading from '../components/SectionHeading'
import { education, experience, skills } from '../data/resume'

export default function Resume() {
  return (
    <div className="mx-auto max-w-5xl px-6 py-16">
      <div className="mb-12 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-widest text-teal-400">Résumé</p>
          <h1 className="mt-1 text-3xl font-bold text-white sm:text-4xl">Experience &amp; Background</h1>
        </div>
        <a
          href="/Soham_Kubal_Resume.pdf"
          download
          className="inline-flex w-fit items-center rounded-md bg-teal-400 px-4 py-2 text-sm font-semibold text-slate-950 transition-colors hover:bg-teal-300"
        >
          Download PDF
        </a>
      </div>

      <section aria-labelledby="experience-heading">
        <SectionHeading eyebrow="Career" title="Professional Experience" />
        <div className="space-y-10">
          {experience.map((job) => (
            <div key={`${job.company}-${job.dates}`} className="relative border-l border-slate-800 pl-6">
              <span className="absolute -left-[5px] top-1.5 h-2.5 w-2.5 rounded-full bg-teal-400" />
              <div className="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:justify-between">
                <h3 className="text-lg font-semibold text-white">
                  {job.role} <span className="font-normal text-slate-400">· {job.company}</span>
                </h3>
                <p className="text-sm text-slate-500">
                  {job.dates} · {job.location}
                </p>
              </div>
              <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-relaxed text-slate-400">
                {job.bullets.map((bullet) => (
                  <li key={bullet}>{bullet}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      <section aria-labelledby="education-heading" className="mt-16">
        <SectionHeading eyebrow="Academics" title="Education" />
        <div className="grid gap-6 sm:grid-cols-3">
          {education.map((entry) => (
            <div key={entry.degree} className="rounded-lg border border-slate-800 p-5">
              <p className="text-sm text-slate-500">{entry.dates}</p>
              <h3 className="mt-1 font-semibold text-white">{entry.degree}</h3>
              <p className="text-sm text-slate-400">{entry.school}</p>
              <ul className="mt-3 space-y-1 text-sm text-slate-400">
                {entry.details.map((detail) => (
                  <li key={detail}>{detail}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      <section aria-labelledby="skills-heading" className="mt-16">
        <SectionHeading eyebrow="Toolbox" title="Skills" />
        <div className="grid gap-4 sm:grid-cols-2">
          {skills.map((group) => (
            <div key={group.group} className="rounded-lg border border-slate-800 p-5">
              <h3 className="font-semibold text-teal-300">{group.group}</h3>
              <div className="mt-3 flex flex-wrap gap-2">
                {group.items.map((item) => (
                  <span
                    key={item}
                    className="rounded-full bg-slate-800/70 px-3 py-1 text-xs font-medium text-slate-300"
                  >
                    {item}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
