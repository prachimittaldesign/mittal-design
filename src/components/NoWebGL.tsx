import { PROJECTS } from '../data/projects'
import type { Project } from '../types'

// Graceful fallback for browsers/devices without WebGL: an accessible,
// fast-loading list of every project in the same paper-and-ink language as
// the city. Clicking a project opens the same case-study overlay the 3D
// visitors get (it's plain DOM), so no content is lost — only the map.
export function NoWebGL({ onOpen }: { onOpen: (p: Project) => void }) {
  return (
    <div className="h-full w-full overflow-y-auto bg-paper">
      <div className="mx-auto max-w-[720px] px-6 py-14">
        <header>
          <div className="flex items-center gap-3">
            <span className="text-[34px] font-extrabold tracking-[-0.04em] text-ink">Prachi</span>
            <span className="rounded-[10px] border-2 border-ink px-3 pb-1 pt-[2px] text-[31px] font-extrabold leading-none tracking-[-0.03em] text-ink">
              Mittal
            </span>
          </div>
          <p className="mt-2 text-[15px] font-medium text-ink-soft">Product Designer · Architect</p>
          <p className="mt-5 max-w-[58ch] text-[15px] leading-[1.65] text-ink-soft">
            This portfolio is normally an explorable 3D city, which your browser can&rsquo;t
            display — but every project is right here. Tap one to read the full case study.
          </p>
          <nav aria-label="Profile links" className="mt-5 flex flex-wrap gap-2">
            {[
              ['About', '/about.html'],
              ['Resume', '/Prachi-Mittal-Resume-2026.pdf'],
              ['LinkedIn', 'https://www.linkedin.com/in/prachi15mittal'],
              ['Behance', 'https://www.behance.net/prachimittal2'],
            ].map(([label, href]) => (
              <a
                key={label}
                href={href}
                className="rounded-full border border-ink/20 px-4 py-[6px] text-[12px] font-semibold text-ink transition-colors hover:bg-ink/5"
              >
                {label}
              </a>
            ))}
          </nav>
        </header>

        <main className="mt-10">
          <h2 className="mb-4 font-mono text-[11px] font-bold uppercase tracking-[0.18em] text-ink-soft">
            Projects
          </h2>
          <ul className="flex flex-col gap-3">
            {PROJECTS.map((p) => (
              <li key={p.id}>
                <button
                  type="button"
                  onClick={() => onOpen(p)}
                  className="w-full rounded-[14px] border border-ink/10 bg-white/60 p-5 text-left transition-colors hover:bg-white"
                >
                  <span className="flex items-baseline gap-2">
                    <span className="text-[17px] font-bold tracking-[-0.01em] text-ink">{p.label}</span>
                    {p.featured && <span aria-label="featured">⭐</span>}
                    <span className="font-mono text-[10px] uppercase tracking-[0.1em] text-ink-soft">{p.sub}</span>
                  </span>
                  <span className="mt-1 block text-[13.5px] leading-[1.6] text-ink-soft">{p.desc}</span>
                </button>
              </li>
            ))}
          </ul>
        </main>
      </div>
    </div>
  )
}
