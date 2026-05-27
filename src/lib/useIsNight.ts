import { useEffect, useState } from 'react'
import { getHyderabadTime } from './sky'

// True when Hyderabad is dark enough that the 3D background reads as night, so
// DOM overlay text sitting directly on the canvas must flip to a light colour.
// Matches the sky keyframes: dark before dawn (~6.8) and after dusk (~19.3).
function computeNight(): boolean {
  const { frac } = getHyderabadTime()
  return frac < 6.8 || frac >= 19.3
}

export function useIsNight(): boolean {
  const [night, setNight] = useState(computeNight)
  useEffect(() => {
    const id = setInterval(() => setNight(computeNight()), 30_000)
    return () => clearInterval(id)
  }, [])
  return night
}
