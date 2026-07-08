// Live camera snapshot for the Share → "Embed a map" feature. CameraRig writes
// the current pose here every frame (a plain mutable store, like markerStore, so
// there's no per-frame React state); ShareMenu reads it when the panel opens to
// build an embed URL that reproduces the exact angle. parseEmbed() runs at boot
// to restore that pose in embed mode.
import type { ViewMode } from '../types'
import { getHyderabadTime } from './sky'

export interface ViewSnapshot {
  cx: number
  cy: number
  cz: number
  tx: number
  ty: number
  tz: number
  view: ViewMode
}

// Seeded with the default 3D opening vantage (matches CameraRig DEFAULT_CAMERA).
export const viewSnapshot: ViewSnapshot = { cx: 0, cy: 72, cz: 292, tx: 0, ty: 0, tz: 0, view: '3d' }

const r2 = (n: number) => Math.round(n * 100) / 100

// Build the query string for an embed that reproduces the current view, and
// freezes time-of-day (and weather, if forced) so the postcard reads the same
// for every viewer. `hour`/`weather` reuse the existing global URL overrides
// (src/lib/sky.ts, src/lib/weather.ts).
export function encodeView(s: ViewSnapshot): string {
  const p = new URLSearchParams()
  p.set('embed', '1')
  p.set('c', [r2(s.cx), r2(s.cy), r2(s.cz)].join('_'))
  p.set('t', [r2(s.tx), r2(s.ty), r2(s.tz)].join('_'))
  p.set('v', s.view)
  p.set('hour', String(r2(getHyderabadTime().frac)))
  const forcedWeather = new URLSearchParams(window.location.search).get('weather')
  if (forcedWeather) p.set('weather', forcedWeather)
  return p.toString()
}

export interface EmbedConfig {
  initial: ViewSnapshot
}

// Parse an embed URL back into a pose. Missing/garbled fields fall back to the
// default vantage so a hand-edited URL never boots to a broken camera.
export function parseEmbed(search: string): EmbedConfig | null {
  const p = new URLSearchParams(search)
  if (!p.get('embed')) return null
  const c = (p.get('c') || '').split('_').map(Number)
  const t = (p.get('t') || '').split('_').map(Number)
  const v = p.get('v')
  const view: ViewMode = v === 'iso' || v === 'skyline' ? v : '3d'
  const d = viewSnapshot
  const n = (arr: number[], i: number, fallback: number) =>
    Number.isFinite(arr[i]) ? arr[i] : fallback
  return {
    initial: {
      cx: n(c, 0, d.cx),
      cy: n(c, 1, d.cy),
      cz: n(c, 2, d.cz),
      tx: n(t, 0, 0),
      ty: n(t, 1, 0),
      tz: n(t, 2, 0),
      view,
    },
  }
}
