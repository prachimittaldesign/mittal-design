import { useCallback, useEffect, useRef, useState } from 'react'

// Entry-architecture state machine: which backdrop the shell shows — the 3D
// `city`, or the instant, no-three.js `projects` fallback page — and whether
// the city keeps loading in the background while the fallback is on screen.
//
// The rule that drives it (see App.tsx for the full wiring):
//   - Landing on "/": mount the city immediately AND start a 3s watchdog.
//     First frame within 3s → stay on the city. 3s elapses first → show
//     /projects, but leave the city mounted (keepWarm) so it keeps loading
//     silently; if it finishes later, the user is never yanked into it.
//   - Landing on "/projects" directly: show the fallback with nothing else
//     loading — the city only mounts once the visitor asks for it.
//   - A confirmed-laggy device (real sustained low FPS) or a hard scene
//     crash unmounts the city outright (keepWarm: false) to actually free
//     the GPU/CPU, instead of leaving a struggling instance running hidden.
export type CityRoute = 'city' | 'projects'

const WATCHDOG_MS = 3000

// Phones land on the fast Projects page and NEVER auto-mount the 3D city — the
// heavy WebGL scene (and its flicker on some mobile GPU/driver combos) is opt-in
// on mobile, reached only when the visitor taps "Enter the 3D city". Desktop is
// unchanged: it still boots straight into the city.
function isPhone(): boolean {
  return typeof window !== 'undefined' && window.matchMedia('(max-width: 820px)').matches
}

function initialRoute(): CityRoute {
  if (typeof window === 'undefined') return 'city'
  if (window.location.pathname === '/projects') return 'projects'
  if (isPhone()) return 'projects'
  return 'city'
}

export function useCityBoot(hasWebGL: boolean) {
  const [route, setRoute] = useState<CityRoute>(() => (hasWebGL ? initialRoute() : 'projects'))
  const [cityReady, setCityReady] = useState(false)
  // Whether the city stays mounted (loading/rendering) while route === 'projects'.
  const [keepWarm, setKeepWarm] = useState(false)
  const timerRef = useRef<number | null>(null)
  // Set once the visitor *asks* for the city ("Enter the 3D city"). From then on
  // the watchdog is off: they chose this, so a slow load must show the boot
  // loader and finish — never bounce them back to the page they just left.
  const userAskedForCity = useRef(false)

  const clearWatchdog = useCallback(() => {
    if (timerRef.current !== null) {
      window.clearTimeout(timerRef.current)
      timerRef.current = null
    }
  }, [])

  // The watchdog: only runs while we're on the city route and it hasn't
  // proven itself ready yet. Slow network/render → auto-fallback at 3s,
  // silently keeping the city warm in the background (no yank on completion).
  useEffect(() => {
    if (!hasWebGL || route !== 'city' || cityReady || userAskedForCity.current) return
    timerRef.current = window.setTimeout(() => {
      setKeepWarm(true)
      setRoute('projects')
      history.replaceState(history.state, '', '/projects')
    }, WATCHDOG_MS)
    return clearWatchdog
  }, [hasWebGL, route, cityReady, clearWatchdog])

  // Back/forward between "/" and "/projects".
  useEffect(() => {
    const onPop = () => {
      if (!hasWebGL) return
      setRoute(window.location.pathname === '/projects' ? 'projects' : 'city')
    }
    window.addEventListener('popstate', onPop)
    return () => window.removeEventListener('popstate', onPop)
  }, [hasWebGL])

  const handleFirstFrame = useCallback(() => {
    clearWatchdog()
    setCityReady(true)
  }, [clearWatchdog])

  // User-initiated: "Enter the 3D city" — real, back-button-able navigation.
  const enterCity = useCallback(() => {
    clearWatchdog()
    userAskedForCity.current = true
    setKeepWarm(true)
    setRoute('city')
    history.pushState(history.state, '', '/')
  }, [clearWatchdog])

  // User- or system-initiated move to the fallback page. `keepWarm: true`
  // only for the "still probably fine, just slow" watchdog path; leave it
  // false (the default) for a confirmed-laggy device or a scene crash, so
  // the heavy canvas actually unmounts and frees the GPU.
  const showProjects = useCallback(
    (opts?: { keepWarm?: boolean; push?: boolean }) => {
      clearWatchdog()
      setKeepWarm(opts?.keepWarm ?? false)
      setRoute('projects')
      if (opts?.push ?? true) history.pushState(history.state, '', '/projects')
    },
    [clearWatchdog],
  )

  const mountCity = hasWebGL && (route === 'city' || keepWarm)

  return { route, cityReady, mountCity, handleFirstFrame, enterCity, showProjects }
}
