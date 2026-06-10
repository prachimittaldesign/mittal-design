export interface Track {
  /** File served from public/music/ — add the audio file then list it here. */
  file: string
  title: string
  artist: string
}

// Track 1 is a real recording: Debussy's "Clair de Lune" performed by
// Laurens Goedhart (CC-BY 3.0, via Wikimedia Commons — attribution lives
// in the artist field shown in the player). Tracks 2–3 are original
// neo-classical piano in the post-minimalist register of Einaudi.
export const PLAYLIST: Track[] = [
  { file: 'clair-de-lune.mp3',    title: 'Clair de Lune — Debussy', artist: 'Laurens Goedhart (CC-BY)' },
  { file: 'spring-piano.wav',     title: 'Spring Morning',          artist: 'City Sessions' },
  { file: 'experience-cycle.wav', title: 'Experience',              artist: 'City Sessions' },
]
