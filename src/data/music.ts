export interface Track {
  /** File served from public/music/ — add the audio file then list it here. */
  file: string
  title: string
  artist: string
}

// A coastal waves ambience opens the set, followed by original
// neo-classical pieces — rolling piano in the post-minimalist
// register of Einaudi.
export const PLAYLIST: Track[] = [
  { file: 'shoreline-waves.wav',  title: 'Shoreline',      artist: 'City Sessions' },
  { file: 'spring-piano.wav',     title: 'Spring Morning', artist: 'City Sessions' },
  { file: 'experience-cycle.wav', title: 'Experience',     artist: 'City Sessions' },
]
