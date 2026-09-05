import { Link } from 'react-router-dom'
import headshot from '../assets/headshot.jpg'
import { highlights, profile } from '../data/resume'

export default function Home() {
  return (
    <div className="mx-auto max-w-5xl px-6 py-16 sm:py-24">
      <div className="flex flex-col-reverse items-center gap-10 sm:flex-row sm:items-center sm:justify-between">
        <div className="max-w-2xl text-center sm:text-left">
          <p className="text-sm font-semibold uppercase tracking-widest text-teal-400">
            {profile.location}
          </p>
          <h1 className="mt-2 text-4xl font-extrabold tracking-tight text-white sm:text-5xl">
            {profile.name}
          </h1>
          <p className="mt-2 text-xl font-medium text-teal-300">{profile.title}</p>
          <p className="mt-6 text-base leading-relaxed text-slate-400">{profile.summary}</p>

          <div className="mt-8 flex flex-wrap justify-center gap-3 sm:justify-start">
            <Link
              to="/resume"
              className="rounded-md bg-teal-400 px-5 py-2.5 text-sm font-semibold text-slate-950 transition-colors hover:bg-teal-300"
            >
              View Résumé
            </Link>
            <Link
              to="/projects"
              className="rounded-md border border-slate-700 px-5 py-2.5 text-sm font-semibold text-slate-200 transition-colors hover:border-teal-400 hover:text-teal-300"
            >
              See Projects
            </Link>
            <a
              href="/Soham_Kubal_Resume.pdf"
              download
              className="rounded-md border border-slate-700 px-5 py-2.5 text-sm font-semibold text-slate-200 transition-colors hover:border-teal-400 hover:text-teal-300"
            >
              Download PDF
            </a>
          </div>
        </div>

        <img
          src={headshot}
          alt={profile.name}
          className="h-40 w-40 flex-shrink-0 rounded-full border-4 border-slate-800 object-cover shadow-lg shadow-teal-500/10 sm:h-48 sm:w-48"
        />
      </div>

      <dl className="mt-16 grid grid-cols-2 gap-6 border-t border-slate-800 pt-10 sm:grid-cols-4">
        {highlights.map((item) => (
          <div key={item.label} className="text-center sm:text-left">
            <dt className="text-3xl font-bold text-white">{item.value}</dt>
            <dd className="mt-1 text-sm text-slate-400">{item.label}</dd>
          </div>
        ))}
      </dl>
    </div>
  )
}
