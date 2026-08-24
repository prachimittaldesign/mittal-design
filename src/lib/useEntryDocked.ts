import { useEffect, useState } from 'react'

// The centred "Prachi Mittal" lockup plays for this long before docking to the
// corner (see Hero.tsx's own 2400ms timer, which this mirrors exactly so any
// HUD chrome gated on `docked` appears in sync with it, never during or before
// the reveal). A shared constant/hook so nothing drifts out of sync with Hero.
export const ENTRY_DOCK_MS = 2400

/** True once the entry lockup animation has finished its centred reveal. */
export function useEntryDocked(): boolean {
  const [docked, setDocked] = useState(false)
  useEffect(() => {
    const t = setTimeout(() => setDocked(true), ENTRY_DOCK_MS)
    return () => clearTimeout(t)
  }, [])
  return docked
}
