import { useEffect, useState } from 'react'

const QUERY = '(max-width: 639px)'

// True on phone-width viewports (below Tailwind's `sm` breakpoint). Used only
// for the few structural HUD swaps that CSS breakpoints can't express on their
// own (the brand chip vs. lockup, and the About sheet vs. card).
export function useIsMobile(): boolean {
  const [isMobile, setIsMobile] = useState(
    () => typeof window !== 'undefined' && window.matchMedia(QUERY).matches,
  )

  useEffect(() => {
    const mq = window.matchMedia(QUERY)
    const onChange = () => setIsMobile(mq.matches)
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [])

  return isMobile
}
