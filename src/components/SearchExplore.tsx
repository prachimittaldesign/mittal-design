import { useMemo, useState } from 'react'
import { PLACES, RECOMMENDED, type Place } from '../scene/lib/places'

interface SearchExploreProps {
  onFocus: (place: Place) => void
}

// A Google-Maps-style search box, top-left. Focusing it (empty) reveals
// recommended places; typing filters all places. Selecting one flies the
// camera there.
export function SearchExplore({ onFocus }: SearchExploreProps) {
  const [query, setQuery] = useState('')
  const [open, setOpen] = useState(false)

  const results = useMemo(() => {
    const s = query.trim().toLowerCase()
    if (!s) return RECOMMENDED
    return PLACES.filter(
      (p) => p.label.toLowerCase().includes(s) || p.sub.toLowerCase().includes(s),
    ).slice(0, 7)
  }, [query])

  const pick = (place: Place) => {
    onFocus(place)
    setQuery('')
    setOpen(false)
  }

  return (
    <div className="absolute left-3 right-[60px] top-[calc(0.75rem+env(safe-area-inset-top))] z-30 w-auto sm:left-4 sm:right-auto sm:top-4 sm:w-[min(360px,90vw)]">
      <div className="hud flex items-center gap-[10px] rounded-full border px-[18px] py-[11px] shadow-[0_6px_24px_rgba(0,0,0,0.12)] backdrop-blur-md">
        <SearchIcon />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setOpen(true)}
          onBlur={() => setTimeout(() => setOpen(false), 140)}
          placeholder="Search Prachi's city…"
          className="hud-input hud-text w-full bg-transparent text-[14px] outline-none"
        />
      </div>

      {open && results.length > 0 && (
        <div className="hud-strong mt-2 overflow-hidden rounded-[18px] border shadow-[0_10px_34px_rgba(0,0,0,0.16)] backdrop-blur-md">
          {!query.trim() && (
            <div className="hud-soft px-[18px] pb-1 pt-3 font-mono text-[9px] font-bold uppercase tracking-[0.18em]">
              Recommended
            </div>
          )}
          {results.map((p) => (
            <button
              key={p.id}
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => pick(p)}
              className="hud-hover flex w-full items-center gap-3 px-[18px] py-[10px] text-left transition-colors"
            >
              <span
                className={`h-[10px] w-[10px] flex-shrink-0 ${p.kind === 'landmark' ? 'rounded-full' : 'rounded-[3px]'}`}
                style={{ background: p.accent }}
              />
              <span className="min-w-0 flex-1">
                <span className="hud-text block truncate text-[14px] font-semibold">{p.label}</span>
                <span className="hud-soft block truncate font-mono text-[10px] uppercase tracking-[0.08em]">
                  {p.kind === 'landmark' ? 'Place' : 'Project'} · {p.sub}
                </span>
              </span>
              <span className="hud-soft flex-shrink-0 text-[13px]">↗</span>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

function SearchIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="hud-soft flex-shrink-0">
      <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2" />
      <line x1="16.5" y1="16.5" x2="21" y2="21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  )
}
