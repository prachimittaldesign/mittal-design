// --- Hyderabad local time ----------------------------------------------------
// This module is deliberately three.js-free: the DOM shell (useIsNight,
// viewStore, WeatherClock, Hero) imports these clock helpers, and any three
// import here would drag the whole 3D bundle onto the shell's critical path.
// The Color-based lighting profile lives in ./skyProfile, used only by the scene.
// All day/night cues key off Prachi's timezone, regardless of where the page is
// viewed. The Intl formatter is cached — getHyderabadTime() runs every frame.
const IST = new Intl.DateTimeFormat('en-GB', {
  timeZone: 'Asia/Kolkata',
  hour: '2-digit',
  minute: '2-digit',
  hour12: false,
})

export interface HyderabadClock {
  hour: number
  minute: number
  frac: number // hour + minute/60, in [0,24)
  label: string // "9:42"
  period: string // "AM" | "PM"
}

// Dev/QA override: append ?hour=22.5 to force a time-of-day for screenshots.
// Ignored unless the param is present, so production always uses real IST.
let FORCED_FRAC: number | null = null
if (typeof window !== 'undefined') {
  const p = new URLSearchParams(window.location.search).get('hour')
  if (p !== null && !Number.isNaN(Number(p))) FORCED_FRAC = ((Number(p) % 24) + 24) % 24
}

export function getHyderabadTime(date = new Date()): HyderabadClock {
  if (FORCED_FRAC !== null) {
    const hour = Math.floor(FORCED_FRAC)
    const minute = Math.round((FORCED_FRAC - hour) * 60)
    const h12 = hour % 12 || 12
    return { hour, minute, frac: FORCED_FRAC, label: `${h12}:${String(minute).padStart(2, '0')}`, period: hour < 12 ? 'AM' : 'PM' }
  }
  const parts = IST.formatToParts(date)
  const hour = Number(parts.find((p) => p.type === 'hour')?.value ?? '0') % 24
  const minute = Number(parts.find((p) => p.type === 'minute')?.value ?? '0')
  const h12 = hour % 12 || 12
  return {
    hour,
    minute,
    frac: hour + minute / 60,
    label: `${h12}:${String(minute).padStart(2, '0')}`,
    period: hour < 12 ? 'AM' : 'PM',
  }
}

// Returns 0 during full day, 1 at night, with smooth transitions at dawn/dusk.
// Used to fade stars and the sky beam out when the sun is up.
export function nightFactor(): number {
  const { frac } = getHyderabadTime()
  if (frac >= 6.5 && frac < 18.5) return 0                  // daytime: invisible
  if (frac >= 5.5 && frac < 6.5) return 1 - (frac - 5.5)   // dawn fade-out
  if (frac >= 18.5 && frac < 19.5) return frac - 18.5       // dusk fade-in
  return 1                                                     // night: fully visible
}
