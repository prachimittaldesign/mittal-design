export interface Track {
  /** File served from public/music/ — add the audio file then list it here. */
  file: string
  title: string
  artist: string
}

// Original neo-classical pieces — sustained strings and rolling piano,
// in the post-minimalist register of Richter / Einaudi.
export const PLAYLIST: Track[] = [
  { file: 'daylight-strings.wav',  title: 'Daylight',       artist: 'City Sessions' },
  { file: 'spring-piano.wav',      title: 'Spring Morning', artist: 'City Sessions' },
  { file: 'experience-cycle.wav',  title: 'Experience',     artist: 'City Sessions' },
]
