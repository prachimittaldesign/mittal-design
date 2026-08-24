import { useCallback, useRef } from 'react'

// Some mobile Chrome / GPU-driver combinations intermittently composite a fully
// cleared (black) frame while WebGL itself reports a perfectly healthy context
// — no error, no context-loss event, and nothing useLowFps' frame-rate average
// reliably catches (the loop can still average a plausible fps while every few
// frames come out blank). Confirmed on a real device: consecutive frame samples
// swinging ~37 -> ~5 -> ~66 brightness while the page's own fps counter never
// dipped low enough to trip the sustained-low-fps guard.
//
// This is a second, independent safety net: periodically draw the live canvas
// into a tiny offscreen canvas and read its average luminance. The key to not
// misfiring is that this fault OSCILLATES — bright, black, bright, black — where
// legitimate scene changes DRIFT one direction (a camera pan from sky to ground,
// a slow day/night crossfade). So we only count luminance swings whose direction
// REVERSES from the previous swing; a monotonic change never accumulates, and a
// single stable sample resets the run. Genuine night darkness is stable, so it
// is never mistaken for a fault either.
const SAMPLE_MS = 300
const SWING_THRESHOLD = 30 // 0-255 luminance delta between consecutive samples
const OSCILLATIONS_TO_TRIP = 4 // consecutive direction-reversing swings
const WARMUP_MS = 1600 // let the entry fade-in settle before sampling

export function useFlickerGuard(onUnstable: () => void) {
  const warmupRef = useRef<number | null>(null)
  const intervalRef = useRef<number | null>(null)
  const oscillations = useRef(0)
  const lastLuma = useRef<number | null>(null)
  const lastSwingSign = useRef(0) // -1 / +1 direction of the previous big swing
  const tripped = useRef(false)

  const stop = useCallback(() => {
    if (warmupRef.current !== null) {
      window.clearTimeout(warmupRef.current)
      warmupRef.current = null
    }
    if (intervalRef.current !== null) {
      window.clearInterval(intervalRef.current)
      intervalRef.current = null
    }
  }, [])

  // Call once, from the Canvas's onCreated, with the real WebGL <canvas>.
  const watch = useCallback(
    (sourceCanvas: HTMLCanvasElement) => {
      const probe = document.createElement('canvas')
      probe.width = 8
      probe.height = 8
      const ctx = probe.getContext('2d', { willReadFrequently: true })
      if (!ctx) return

      const sample = () => {
        if (tripped.current) return
        try {
          ctx.drawImage(sourceCanvas, 0, 0, 8, 8)
          const { data } = ctx.getImageData(0, 0, 8, 8)
          let sum = 0
          for (let i = 0; i < data.length; i += 4) sum += (data[i] + data[i + 1] + data[i + 2]) / 3
          const luma = sum / (data.length / 4)

          if (lastLuma.current !== null) {
            const delta = luma - lastLuma.current
            if (Math.abs(delta) > SWING_THRESHOLD) {
              const sign = delta > 0 ? 1 : -1
              // Count only a REVERSAL of direction — that's oscillation (flicker),
              // not a pan or crossfade, which keep going the same way.
              if (lastSwingSign.current !== 0 && sign !== lastSwingSign.current) {
                oscillations.current += 1
                if (oscillations.current >= OSCILLATIONS_TO_TRIP) {
                  tripped.current = true
                  stop()
                  onUnstable()
                  return
                }
              } else {
                oscillations.current = 1 // first big swing of a potential run
              }
              lastSwingSign.current = sign
            } else {
              // A stable sample breaks any run — real flicker is relentless.
              oscillations.current = 0
              lastSwingSign.current = 0
            }
          }
          lastLuma.current = luma
        } catch {
          // A tainted/unreadable canvas can't be sampled — fail open, not closed.
        }
      }

      warmupRef.current = window.setTimeout(() => {
        intervalRef.current = window.setInterval(sample, SAMPLE_MS)
      }, WARMUP_MS)
    },
    [onUnstable, stop],
  )

  return { watch, stop }
}
