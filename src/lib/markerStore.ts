// Screen positions for the 2D map's DOM markers. Written every frame by
// MapMarkerProbe (inside the Canvas), read via requestAnimationFrame by the
// MapMarkers DOM layer — a plain mutable store keeps 60fps updates out of
// React state entirely (same pattern as the coachmark anchor).
export interface MarkerPos {
  x: number
  y: number
  visible: boolean
}

export const markerPositions = new Map<string, MarkerPos>()
