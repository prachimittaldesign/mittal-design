import { Color } from 'three'
import type { Weather } from './weather'

// --- Sky / lighting profile by time of day -----------------------------------
// This module owns everything that touches three.js `Color`. It is imported
// ONLY by the 3D scene (DayNight.tsx), which lives behind the lazy CityExperience
// boundary. Keeping it separate from sky.ts means the DOM shell — which only
// needs the pure clock helpers (getHyderabadTime / nightFactor) — never drags
// the entire three.js bundle onto its critical path.
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

// Keyframes across a 24h cycle (wraps at 24→0).
// Daytime palette: vivid Amalfi-coast Mediterranean azure — deep cerulean sky,
// warm sandy ground light, intense Mediterranean sun.
// Dawn/dusk: rich coral/amber that bleeds into orange.
// Night: deep indigo-navy with cool blue stars.
const KEYS: Key[] = [
  // midnight — deep indigo (lifted moonlight so the city stays legible)
  { h: 0,    bg: C('#0c1828'), hs: C('#22375a'), hg: C('#0e1826'), hi: 0.62, am: 0.36, di: 0.46, dc: C('#a8bcd8') },
  // pre-dawn — dark blue
  { h: 5,    bg: C('#16243a'), hs: C('#2e4466'), hg: C('#162232'), hi: 0.64, am: 0.38, di: 0.50, dc: C('#b4c6da') },
  // dawn — vibrant coral/amber sunrise
  { h: 6.8,  bg: C('#e8773a'), hs: C('#f4a060'), hg: C('#905838'), hi: 0.62, am: 0.32, di: 0.75, dc: C('#ffb04a') },
  // morning — bright Amalfi azure
  { h: 9,    bg: C('#38aede'), hs: C('#68caee'), hg: C('#c8b880'), hi: 0.48, am: 0.24, di: 0.88, dc: C('#fff6d8') },
  // noon — deep vivid Mediterranean cerulean
  { h: 13,   bg: C('#1696cc'), hs: C('#3ab6e4'), hg: C('#c0a878'), hi: 0.52, am: 0.26, di: 0.98, dc: C('#fff4cc') },
  // late afternoon — warm vivid azure
  { h: 16.5, bg: C('#26a0d8'), hs: C('#52bcea'), hg: C('#b8a068'), hi: 0.48, am: 0.24, di: 0.88, dc: C('#ffe4a8') },
  // golden hour — rich orange/coral sunset
  { h: 18.3, bg: C('#f07228'), hs: C('#f49a42'), hg: C('#885830'), hi: 0.65, am: 0.30, di: 0.82, dc: C('#ffa840') },
  // twilight — deep purple/rose
  { h: 19.6, bg: C('#7a3a68'), hs: C('#a85878'), hg: C('#582848'), hi: 0.48, am: 0.26, di: 0.40, dc: C('#e07848') },
  // evening — settling to night (kept a notch brighter than before so the
  // prime viewing hours never go murky)
  { h: 21,   bg: C('#0e1c30'), hs: C('#243a5e'), hg: C('#101a2a'), hi: 0.62, am: 0.36, di: 0.48, dc: C('#acbed4') },
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
// Overcast / rain sky — progressively darker grey families
const DAY_OVERCAST = new Color('#7a9aac')   // cloudy/fog: muted steel blue-grey
const DAY_RAIN     = new Color('#3e5060')   // rain: dark leaden grey
const DAY_STORM    = new Color('#222c34')   // storm: near-black anvil

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
  OUT.fogNear = 300
  OUT.fogFar = 620
  OUT.rain = false

  // Weather: clouds dim + grey the day; rain/fog pull the horizon in.
  if (weather) {
    let cloud  = 0
    let fogMul = 1
    let skyTarget: Color | null = null
    switch (weather.condition) {
      case 'clear':  break
      case 'partly': cloud = 0.22; break
      case 'cloudy': cloud = 0.55; fogMul = 0.80; skyTarget = DAY_OVERCAST; break
      case 'fog':    cloud = 0.50; fogMul = 0.45; skyTarget = DAY_OVERCAST; break
      case 'snow':   cloud = 0.65; fogMul = 0.68; skyTarget = DAY_OVERCAST; break
      case 'rain':
        cloud = 0.55; fogMul = 0.60
        skyTarget = DAY_RAIN
        OUT.rain = true
        break
      case 'storm':
        cloud = 0.72; fogMul = 0.45
        skyTarget = DAY_STORM
        OUT.rain = true
        break
    }
    if (cloud > 0) {
      OUT.dirIntensity  *= 1 - cloud * 0.60
      OUT.hemiIntensity *= 1 - cloud * 0.30
      OUT.ambient       *= 1 - cloud * 0.15
      const day = frac >= 6.8 && frac < 18.3
      if (day && skyTarget) {
        OUT.background.lerp(skyTarget, cloud * 0.45)
        OUT.fog.copy(OUT.background)
      }
      OUT.fogFar  *= fogMul
      OUT.fogNear *= Math.min(1, fogMul + 0.18)
    }
  }

  return OUT
}
