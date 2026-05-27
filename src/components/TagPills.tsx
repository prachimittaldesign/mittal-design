import type { ReactNode } from 'react'

interface TagPillsProps {
  activeTag: string | null
  onChange: (tag: string | null) => void
}

// Maps-style category pills, but for project tags. Clicking one highlights
// matching project towers and dims the rest (handled in Building via appearance).
const TAGS: { tag: string; icon: ReactNode }[] = [
  { tag: 'Enterprise', icon: <BuildingIcon /> },
  { tag: 'Consumer', icon: <UserIcon /> },
  { tag: 'B2B', icon: <SwapIcon /> },
  { tag: 'Mobile', icon: <PhoneIcon /> },
  { tag: 'TV', icon: <TvIcon /> },
  { tag: 'AI', icon: <SparkIcon /> },
  { tag: 'UX Research', icon: <LensIcon /> },
]

export function TagPills({ activeTag, onChange }: TagPillsProps) {
  return (
    <div className="pointer-events-none absolute left-0 right-0 top-[calc(0.75rem+env(safe-area-inset-top)+52px)] z-30 flex max-w-full gap-2 overflow-x-auto px-3 [scrollbar-width:none] sm:left-1/2 sm:right-auto sm:top-4 sm:max-w-[min(620px,62vw)] sm:-translate-x-1/2 sm:px-2 [&::-webkit-scrollbar]:hidden">
      {TAGS.map(({ tag, icon }) => {
        const active = activeTag === tag
        return (
          <button
            key={tag}
            onClick={() => onChange(active ? null : tag)}
            className={[
              'pointer-events-auto flex flex-shrink-0 items-center gap-[6px] rounded-full border px-[13px] py-[7px]',
              'text-[12px] font-medium shadow-[0_2px_10px_rgba(0,0,0,0.08)] backdrop-blur-md transition-colors',
              active
                ? 'hud-on'
                : 'hud hud-text hud-hover',
            ].join(' ')}
          >
            <span className="flex-shrink-0">{icon}</span>
            {tag}
          </button>
        )
      })}
    </div>
  )
}

const ICON = 'h-[13px] w-[13px]'

function BuildingIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={ICON}>
      <rect x="5" y="3" width="14" height="18" rx="1" stroke="currentColor" strokeWidth="2" />
      <path d="M9 8h0M15 8h0M9 12h0M15 12h0M9 16h0M15 16h0" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" />
    </svg>
  )
}
function UserIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={ICON}>
      <circle cx="12" cy="8" r="3.4" stroke="currentColor" strokeWidth="2" />
      <path d="M5 20c1.5-4 12.5-4 14 0" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  )
}
function SwapIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={ICON}>
      <path d="M7 8h11l-3-3M17 16H6l3 3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}
function PhoneIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={ICON}>
      <rect x="7" y="3" width="10" height="18" rx="2" stroke="currentColor" strokeWidth="2" />
      <path d="M11 18h2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  )
}
function TvIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={ICON}>
      <rect x="3" y="6" width="18" height="11" rx="1.5" stroke="currentColor" strokeWidth="2" />
      <path d="M9 21h6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  )
}
function SparkIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={ICON}>
      <path d="M12 3l2 6 6 2-6 2-2 6-2-6-6-2 6-2 2-6z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
    </svg>
  )
}
function LensIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={ICON}>
      <circle cx="11" cy="11" r="6" stroke="currentColor" strokeWidth="2" />
      <path d="M20 20l-4.5-4.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  )
}
