export interface Track {
  /** File served from public/music/ — add the audio file then list it here. */
  file: string
  title: string
  artist: string
}

// Looping ambient tracks — warm pads, soft ocean texture, and gentle chimes.
export const PLAYLIST: Track[] = [
  { file: 'ambient-coastal-morning.wav', title: 'Coastal Morning', artist: 'City Sessions' },
  { file: 'ambient-evening-tide.wav',    title: 'Evening Tide',    artist: 'City Sessions' },
  { file: 'ambient-open-sky.wav',        title: 'Open Sky',        artist: 'City Sessions' },
]
