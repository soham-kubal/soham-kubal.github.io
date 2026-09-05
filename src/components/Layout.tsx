import { useState } from 'react'
import { NavLink, Outlet } from 'react-router-dom'
import { profile } from '../data/resume'

const navLinks = [
  { to: '/', label: 'Home', end: true },
  { to: '/resume', label: 'Resume', end: false },
  { to: '/projects', label: 'Projects', end: false },
  { to: '/tools', label: 'Tools', end: false },
]

function navClass({ isActive }: { isActive: boolean }) {
  return [
    'rounded-md px-3 py-2 text-sm font-medium transition-colors',
    isActive ? 'bg-teal-400/10 text-teal-300' : 'text-slate-300 hover:text-white hover:bg-slate-800/60',
  ].join(' ')
}

export default function Layout() {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-40 border-b border-slate-800/80 bg-slate-950/85 backdrop-blur">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
          <NavLink to="/" className="text-lg font-semibold tracking-tight text-white">
            Soham Kubal
          </NavLink>

          <nav className="hidden items-center gap-1 md:flex">
            {navLinks.map((link) => (
              <NavLink key={link.to} to={link.to} end={link.end} className={navClass}>
                {link.label}
              </NavLink>
            ))}
            <a
              href="/Soham_Kubal_Resume.pdf"
              download
              className="ml-2 rounded-md bg-teal-400 px-3 py-2 text-sm font-semibold text-slate-950 transition-colors hover:bg-teal-300"
            >
              Download Résumé
            </a>
          </nav>

          <button
            type="button"
            className="inline-flex items-center rounded-md p-2 text-slate-300 hover:bg-slate-800/60 md:hidden"
            aria-label="Toggle navigation menu"
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((open) => !open)}
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              {menuOpen ? (
                <path d="M6 6l12 12M6 18L18 6" strokeLinecap="round" />
              ) : (
                <path d="M4 7h16M4 12h16M4 17h16" strokeLinecap="round" />
              )}
            </svg>
          </button>
        </div>

        {menuOpen && (
          <nav className="flex flex-col gap-1 border-t border-slate-800/80 px-6 py-3 md:hidden">
            {navLinks.map((link) => (
              <NavLink key={link.to} to={link.to} end={link.end} className={navClass} onClick={() => setMenuOpen(false)}>
                {link.label}
              </NavLink>
            ))}
            <a
              href="/Soham_Kubal_Resume.pdf"
              download
              className="mt-1 rounded-md bg-teal-400 px-3 py-2 text-center text-sm font-semibold text-slate-950"
            >
              Download Résumé
            </a>
          </nav>
        )}
      </header>

      <main className="flex-1">
        <Outlet />
      </main>

      <footer className="border-t border-slate-800/80">
        <div className="mx-auto flex max-w-5xl flex-col gap-3 px-6 py-8 text-sm text-slate-400 sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} {profile.name}. Built with React, Vite &amp; Tailwind.</p>
          <div className="flex flex-wrap gap-x-5 gap-y-2">
            <a className="hover:text-teal-300" href={`mailto:${profile.email}`}>
              {profile.email}
            </a>
            <a className="hover:text-teal-300" href={`tel:${profile.phone}`}>
              {profile.phone}
            </a>
            <a className="hover:text-teal-300" href={profile.github} target="_blank" rel="noreferrer">
              GitHub
            </a>
            <span>{profile.location}</span>
          </div>
        </div>
      </footer>
    </div>
  )
}
