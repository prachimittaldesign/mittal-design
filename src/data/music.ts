export interface Track {
  /** File served from public/music/ — add the audio file then list it here. */
  file: string
  title: string
  artist: string
}

// Drop real audio files into public/music/ and update each entry.
// All currently point to the demo placeholder — replace `file` values one by one.
export const PLAYLIST: Track[] = [
  { file: 'demo-loop.wav', title: 'Ambient Sketch',   artist: 'City Sessions' },
  { file: 'demo-loop.wav', title: 'Blueprint Haze',   artist: 'City Sessions' },
  { file: 'demo-loop.wav', title: 'Signal Bloom',     artist: 'City Sessions' },
  { file: 'demo-loop.wav', title: 'Quarter Glass',    artist: 'City Sessions' },
  { file: 'demo-loop.wav', title: 'Late Horizon',     artist: 'City Sessions' },
]
