// Screen-space anchor for the coachmark that points at the Ved tower's gold
// star. Written every frame by CoachAnchorProbe (inside the Canvas) and read
// by Coachmarks via requestAnimationFrame — a plain mutable store keeps the
// 60fps updates out of React state entirely.
export const vedAnchor = { x: 0, y: 0, visible: false }
