import SectionHeading from '../components/SectionHeading'
import { projects } from '../data/resume'

export default function Projects() {
  return (
    <div className="mx-auto max-w-5xl px-6 py-16">
      <SectionHeading eyebrow="Selected Work" title="Projects" />
      <p className="-mt-4 mb-10 max-w-2xl text-sm text-slate-400">
        Most of my work lives inside enterprise environments rather than public repos — these are
        the frameworks and tools I've built on the job, described from real engagements.
      </p>

      <div className="grid gap-6 sm:grid-cols-2">
        {projects.map((project) => (
          <article
            key={project.title}
            className="flex flex-col rounded-lg border border-slate-800 p-6 transition-colors hover:border-teal-400/60"
          >
            <h3 className="text-lg font-semibold text-white">{project.title}</h3>
            <p className="mt-2 flex-1 text-sm leading-relaxed text-slate-400">{project.description}</p>
            <div className="mt-4 flex flex-wrap gap-2">
              {project.tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full bg-slate-800/70 px-3 py-1 text-xs font-medium text-slate-300"
                >
                  {tag}
                </span>
              ))}
            </div>
            {project.link && (
              <a
                href={project.link.href}
                target="_blank"
                rel="noreferrer"
                className="mt-4 inline-flex w-fit items-center gap-1 text-sm font-semibold text-teal-300 hover:text-teal-200"
              >
                {project.link.label} →
              </a>
            )}
          </article>
        ))}
      </div>
    </div>
  )
}
