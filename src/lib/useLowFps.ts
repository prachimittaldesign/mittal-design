import { useEffect, useState } from 'react'

// Detects sustained low frame rates — a laggy device struggling with the 3D
// scene — so the app can offer the lightweight HTML gallery instead. Deliberately
// conservative: it waits out an initial warm-up (load + first paint are always
// janky), then only trips after several consecutive slow seconds, so it never
// nags a device that's merely mid-animation.
export function useLowFps(enabled: boolean): boolean {
  const [low, setLow] = useState(false)

  useEffect(() => {
    if (!enabled || low) return
    if (typeof performance === 'undefined' || typeof requestAnimationFrame === 'undefined') return

    let raf = 0
    let frames = 0
    let windowStart = performance.now()
    let slowSeconds = 0
    const warmupUntil = performance.now() + 6000 // ignore the loading period

    const tick = (now: number) => {
      frames++
      const elapsed = now - windowStart
      if (elapsed >= 1000) {
        const fps = (frames * 1000) / elapsed
        frames = 0
        windowStart = now
        if (now > warmupUntil) {
          // Count consecutive slow seconds; reset on any healthy second.
          slowSeconds = fps < 20 ? slowSeconds + 1 : 0
          if (slowSeconds >= 4) {
            setLow(true)
            return // stop measuring
          }
        }
      }
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [enabled, low])

  return low
}
