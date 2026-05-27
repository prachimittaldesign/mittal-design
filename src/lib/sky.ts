import { Color } from 'three'
import type { Weather } from './weather'

// --- Hyderabad local time ----------------------------------------------------
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

export function getHyderabadTime(date = new Date()): HyderabadClock {
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

// --- Sky / lighting profile by time of day -----------------------------------
const C = (hex: string) => new Color(hex)

interface Key {
  h: number
  bg: Color
  hs: Color // hemisphere sky
  hg: Color // hemisphere ground
  hi: number // hemisphere intensity
  am: number // ambient intensity
  di: number // directional intensity
  dc: Color // directional color
}

// Keyframes across a 24h cycle (wraps at 24→0). Warm "paper" daytime that sinks
// into a cool deep-blue night, with peach dawn / amber dusk in between.
const KEYS: Key[] = [
  { h: 0, bg: C('#1a2436'), hs: C('#3a4763'), hg: C('#1e2735'), hi: 0.58, am: 0.32, di: 0.45, dc: C('#b7c8e4') },
  { h: 5, bg: C('#232d3f'), hs: C('#48526a'), hg: C('#2a2f3e'), hi: 0.62, am: 0.34, di: 0.5, dc: C('#c3cfe2') },
  { h: 6.8, bg: C('#e6c2b2'), hs: C('#f0ccb8'), hg: C('#ad9784'), hi: 0.6, am: 0.3, di: 0.62, dc: C('#ffcf9c') },
  { h: 9, bg: C('#f7efe2'), hs: C('#fbf7ee'), hg: C('#cdbfa6'), hi: 0.82, am: 0.34, di: 1.05, dc: C('#fff3df') },
  { h: 13, bg: C('#fbf7ee'), hs: C('#fbf7ee'), hg: C('#cdbfa6'), hi: 0.88, am: 0.36, di: 1.22, dc: C('#fff6e6') },
  { h: 16.5, bg: C('#f6ecdb'), hs: C('#fbf2e2'), hg: C('#c9ba9f'), hi: 0.82, am: 0.34, di: 1.05, dc: C('#ffe9cb') },
  { h: 18.3, bg: C('#f0c79e'), hs: C('#f6cda2'), hg: C('#b39577'), hi: 0.62, am: 0.3, di: 0.82, dc: C('#ffb877') },
  { h: 19.6, bg: C('#c79aa3'), hs: C('#d9a9a8'), hg: C('#8f7785'), hi: 0.48, am: 0.26, di: 0.45, dc: C('#e8967a') },
  { h: 21, bg: C('#222d40'), hs: C('#42506e'), hg: C('#252d3c'), hi: 0.6, am: 0.33, di: 0.46, dc: C('#bccbe2') },
]

export interface SkyProfile {
  background: Color
  hemiSky: Color
  hemiGround: Color
  hemiIntensity: number
  ambient: number
  dirColor: Color
  dirIntensity: number
  fog: Color
  fogNear: number
  fogFar: number
  rain: boolean
}

// Reused across frames so per-frame sampling allocates nothing.
const OUT: SkyProfile = {
  background: new Color(),
  hemiSky: new Color(),
  hemiGround: new Color(),
  hemiIntensity: 0,
  ambient: 0,
  dirColor: new Color(),
  dirIntensity: 0,
  fog: new Color(),
  fogNear: 200,
  fogFar: 460,
  rain: false,
}
const DAY_GREY = new Color('#c6c4bd')

const lerpN = (a: number, b: number, t: number) => a + (b - a) * t

export function skyProfile(frac: number, weather: Weather | null): SkyProfile {
  let i = KEYS.length - 1
  for (let k = 0; k < KEYS.length; k++) {
    if (frac >= KEYS[k].h) i = k
    else break
  }
  const a = KEYS[i]
  const next = (i + 1) % KEYS.length
  const b = KEYS[next]
  const bH = next === 0 ? b.h + 24 : b.h
  const t = Math.max(0, Math.min(1, (frac - a.h) / (bH - a.h)))

  OUT.background.copy(a.bg).lerp(b.bg, t)
  OUT.hemiSky.copy(a.hs).lerp(b.hs, t)
  OUT.hemiGround.copy(a.hg).lerp(b.hg, t)
  OUT.dirColor.copy(a.dc).lerp(b.dc, t)
  OUT.hemiIntensity = lerpN(a.hi, b.hi, t)
  OUT.ambient = lerpN(a.am, b.am, t)
  OUT.dirIntensity = lerpN(a.di, b.di, t)
  OUT.fog.copy(OUT.background)
  OUT.fogNear = 200
  OUT.fogFar = 460
  OUT.rain = false

  // Weather: clouds dim + grey the day; rain/fog pull the horizon in.
  if (weather) {
    let cloud = 0
    let fogMul = 1
    switch (weather.condition) {
      case 'clear':
        break
      case 'partly':
        cloud = 0.22
        break
      case 'cloudy':
        cloud = 0.5
        fogMul = 0.84
        break
      case 'fog':
        cloud = 0.45
        fogMul = 0.5
        break
      case 'snow':
        cloud = 0.6
        fogMul = 0.72
        break
      case 'rain':
        cloud = 0.72
        fogMul = 0.64
        OUT.rain = true
        break
      case 'storm':
        cloud = 0.86
        fogMul = 0.56
        OUT.rain = true
        break
    }
    if (cloud > 0) {
      OUT.dirIntensity *= 1 - cloud * 0.7
      OUT.hemiIntensity *= 1 - cloud * 0.32
      OUT.ambient *= 1 - cloud * 0.14
      const day = frac >= 6.8 && frac < 18.3
      if (day) {
        OUT.background.lerp(DAY_GREY, cloud * 0.42)
        OUT.fog.copy(OUT.background)
      }
      OUT.fogFar *= fogMul
      OUT.fogNear *= Math.min(1, fogMul + 0.25)
    }
  }

  return OUT
}
