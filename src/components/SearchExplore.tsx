import { useMemo, useState } from 'react'
import { PLACES, RECOMMENDED, type Place } from '../scene/lib/places'

interface SearchExploreProps {
  onFocus: (place: Place) => void
}

// A Google-Maps-style search pill, top-center. Focusing it (empty) reveals
// curated "explore" suggestions; typing filters all places. Selecting one flies
// the camera there.
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
    <div className="absolute left-1/2 top-6 z-30 w-[min(440px,86vw)] -translate-x-1/2">
      <div className="flex items-center gap-[10px] rounded-full border border-black/10 bg-white/85 px-[18px] py-[11px] shadow-[0_6px_24px_rgba(0,0,0,0.12)] backdrop-blur-md">
        <SearchIcon />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setOpen(true)}
          onBlur={() => setTimeout(() => setOpen(false), 140)}
          placeholder="Search Prachi's city…"
          className="w-full bg-transparent text-[14px] text-ink outline-none placeholder:text-ink-soft/50"
        />
      </div>

      {open && results.length > 0 && (
        <div className="mt-2 overflow-hidden rounded-[18px] border border-black/10 bg-white/95 shadow-[0_10px_34px_rgba(0,0,0,0.16)] backdrop-blur-md">
          {!query.trim() && (
            <div className="px-[18px] pb-1 pt-3 font-mono text-[9px] font-bold uppercase tracking-[0.18em] text-ink-soft/70">
              Explore
            </div>
          )}
          {results.map((p) => (
            <button
              key={p.id}
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => pick(p)}
              className="flex w-full items-center gap-3 px-[18px] py-[10px] text-left transition-colors hover:bg-black/[0.045]"
            >
              <span
                className="h-[10px] w-[10px] flex-shrink-0 rounded-full"
                style={{ background: p.accent }}
              />
              <span className="min-w-0 flex-1">
                <span className="block truncate text-[14px] font-semibold text-ink">{p.label}</span>
                <span className="block truncate font-mono text-[10px] uppercase tracking-[0.08em] text-ink-soft/70">
                  {p.kind === 'landmark' ? 'Place' : 'Project'} · {p.sub}
                </span>
              </span>
              <span className="flex-shrink-0 text-[13px] text-ink-soft/40">↗</span>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

function SearchIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="flex-shrink-0 text-ink-soft">
      <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2" />
      <line x1="16.5" y1="16.5" x2="21" y2="21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  )
}
