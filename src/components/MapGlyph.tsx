import type { GlyphName, LandmarkKind } from '../types'

// One consistent line-icon language for every 2D map marker — same stroke
// weight, caps and 24-unit grid as the HUD's search/pill icons, coloured by
// the pin's accent via currentColor. Replaces the emoji set, which rendered
// differently on every platform and clashed with the ink-and-paper design.
const PATHS: Record<GlyphName | LandmarkKind, React.ReactNode> = {
  // ── project glyphs ──────────────────────────────────────────────────────
  robot: (
    <>
      <rect x="5" y="9" width="14" height="9" rx="2" />
      <path d="M12 9V5m0 0h.01" />
      <path d="M9 13.5h.01M15 13.5h.01" strokeWidth="2.6" />
    </>
  ),
  scanner: (
    <>
      <circle cx="12" cy="12" r="8" />
      <path d="M12 12l4.2-4.2" />
      <path d="M12 12h.01" strokeWidth="2.6" />
    </>
  ),
  servers: (
    <>
      <ellipse cx="12" cy="6" rx="7" ry="2.6" />
      <path d="M5 6v12c0 1.4 3.1 2.6 7 2.6s7-1.2 7-2.6V6" />
      <path d="M5 12c0 1.4 3.1 2.6 7 2.6s7-1.2 7-2.6" />
    </>
  ),
  connector: (
    <>
      <path d="M10.5 13.5a3.5 3.5 0 005 0l3-3a3.5 3.5 0 00-5-5l-1.1 1.1" />
      <path d="M13.5 10.5a3.5 3.5 0 00-5 0l-3 3a3.5 3.5 0 005 5l1.1-1.1" />
    </>
  ),
  book: (
    <>
      <path d="M4 5.5A2.5 2.5 0 016.5 3H20v18H6.5A2.5 2.5 0 014 18.5v-13z" />
      <path d="M4 18.5A2.5 2.5 0 016.5 16H20" />
    </>
  ),
  tv: (
    <>
      <rect x="3" y="6" width="18" height="11" rx="1.5" />
      <path d="M9 21h6" />
    </>
  ),
  heart: <path d="M12 20s-7-4.4-7-9.8A3.9 3.9 0 0112 7.6a3.9 3.9 0 017 2.6c0 5.4-7 9.8-7 9.8z" />,
  bubble: <path d="M4 6a3 3 0 013-3h10a3 3 0 013 3v7a3 3 0 01-3 3H9.5L4.5 20 4 6z" />,
  ballot: (
    <>
      <rect x="4" y="11" width="16" height="9" rx="1.5" />
      <path d="M8 11l1-5.5 6.5 1.2-.8 4.3" />
    </>
  ),
  circles: (
    <>
      <circle cx="12" cy="8" r="3.1" />
      <circle cx="8" cy="15.5" r="3.1" />
      <circle cx="16" cy="15.5" r="3.1" />
    </>
  ),
  docs: (
    <>
      <path d="M7 3h7l4 4v14H7z" />
      <path d="M14 3v4h4" />
      <path d="M10 12.5h5M10 16h5" />
    </>
  ),
  cottage: (
    <>
      <path d="M4 11l8-7 8 7" />
      <path d="M6 9.5V20h12V9.5" />
      <path d="M10 20v-5h4v5" />
    </>
  ),
  sprout: <path d="M12 20v-7m0 0c0-3-2.5-5-6-5 0 3.4 2.5 5 6 5zm0-2c0-3 2.5-5 6-5 0 3.4-2.5 5-6 5z" />,
  trees: <path d="M8 20v-3M8 17l-4 0 4-9 4 9h-4zM16 20v-2.5M16 17.5l-3 0 3-7 3 7h-3z" />,
  rocks: <path d="M4 18l3-5 4 2 3-6 6 9H4z" />,
  sign: (
    <>
      <path d="M12 21v-8" />
      <path d="M6 5h11l2 2-2 2H6z" />
      <path d="M12 5V3" />
    </>
  ),
  // ── landmark glyphs ─────────────────────────────────────────────────────
  cinema: (
    <>
      <rect x="4" y="10.5" width="16" height="8.5" rx="1.5" />
      <path d="M4.5 10L19 6l.8 3M8 9l2.5-2.5M13 7.7l2.5-2.4" />
    </>
  ),
  stadium: (
    <>
      <ellipse cx="12" cy="14.5" rx="8" ry="4" />
      <path d="M4 14.5v-4c0-2.2 3.6-4 8-4s8 1.8 8 4v4" />
    </>
  ),
  library: (
    <>
      <path d="M5 4h3.2v16H5zM10.4 4h3.2v16h-3.2z" />
      <path d="M15.6 5.2l3.4.9-3.6 14-3.3-.9z" />
    </>
  ),
  gallery: (
    <>
      <rect x="4" y="4" width="16" height="16" rx="2" />
      <circle cx="9.3" cy="9.3" r="1.5" />
      <path d="M4 16.5l4.5-4.5 3.8 3.8 2.7-2.7 5 4.9" />
    </>
  ),
  cafe: (
    <>
      <path d="M5 9h11v5.5a5 5 0 01-5 5h-1a5 5 0 01-5-5V9z" />
      <path d="M16 10h1.6a2.4 2.4 0 010 4.8H16" />
      <path d="M8.5 6.5c0-1 .8-1 .8-2M12 6.5c0-1 .8-1 .8-2" />
    </>
  ),
  music: (
    <>
      <path d="M9 18V6l10-2v11" />
      <circle cx="6.6" cy="18" r="2.4" />
      <circle cx="16.6" cy="15" r="2.4" />
    </>
  ),
}

export function MapGlyph({ name, className }: { name: GlyphName | LandmarkKind; className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden
    >
      {PATHS[name]}
    </svg>
  )
}

// Small filled star for featured pins — matches the 3D gold star marker.
export function StarBadge({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden>
      <path
        d="M12 3l2.7 5.6 6.1.8-4.5 4.3 1.1 6L12 16.9 6.6 19.7l1.1-6L3.2 9.4l6.1-.8L12 3z"
        fill="#f5b912"
        stroke="#d99e05"
        strokeWidth="1"
        strokeLinejoin="round"
      />
    </svg>
  )
}
