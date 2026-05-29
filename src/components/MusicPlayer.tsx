import { useEffect, useRef, useState } from 'react'
import { PLAYLIST } from '../data/music'

export function MusicPlayer() {
  const [index, setIndex] = useState(0)
  const [playing, setPlaying] = useState(false)
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const has = PLAYLIST.length > 0

  useEffect(() => {
    const a = new Audio()
    a.preload = 'metadata'
    audioRef.current = a
    const onEnded = () => setIndex((n) => (n + 1) % PLAYLIST.length)
    a.addEventListener('ended', onEnded)
    return () => {
      a.pause()
      a.removeEventListener('ended', onEnded)
      audioRef.current = null
    }
  }, [])

  useEffect(() => {
    const a = audioRef.current
    if (!a || !has) return
    a.src = encodeURI(`/music/${PLAYLIST[index].file}`)
    a.load()
    if (playing) a.play().catch(() => setPlaying(false))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [index, has])

  if (!has) return null
  const track = PLAYLIST[index]

  // Mobile tap: skip to next track and start playing.
  const mobileNext = () => {
    const a = audioRef.current
    if (!a) return
    const next = (index + 1) % PLAYLIST.length
    setIndex(next)
    setPlaying(true)
    // Effect will reload src + play on next render; force play if already loaded.
    a.src = encodeURI(`/music/${PLAYLIST[next].file}`)
    a.load()
    a.play().catch(() => setPlaying(false))
  }

  const stop = () => {
    const a = audioRef.current
    if (!a) return
    a.pause()
    a.currentTime = 0
    setPlaying(false)
  }

  const toggleDesktop = () => {
    const a = audioRef.current
    if (!a) return
    if (playing) { a.pause(); setPlaying(false) }
    else { a.play().then(() => setPlaying(true)).catch(() => setPlaying(false)) }
  }

  const nextDesktop = () => setIndex((n) => (n + 1) % PLAYLIST.length)

  return (
    <>
      {/* ── Mobile: icon-only controls at the bottom-left.
           Tap the note icon → skip to next track and play.
           Stop button (×) appears only while playing. ── */}
      <div className="pointer-events-auto absolute bottom-[calc(1rem+env(safe-area-inset-bottom)+68px)] left-3 z-20 flex items-center gap-[6px] sm:hidden">
        <button
          onClick={mobileNext}
          aria-label="Next track"
          className={[
            'hud hud-hover flex h-9 w-9 items-center justify-center rounded-full border',
            'shadow-[0_3px_14px_rgba(0,0,0,0.12)] backdrop-blur-md transition-colors',
          ].join(' ')}
        >
          {playing ? <EqualizerIcon /> : <NoteIcon />}
        </button>

        {playing && (
          <button
            onClick={stop}
            aria-label="Stop music"
            className="hud hud-hover flex h-7 w-7 items-center justify-center rounded-full border shadow-[0_2px_8px_rgba(0,0,0,0.10)] backdrop-blur-md transition-colors"
          >
            <StopIcon />
          </button>
        )}
      </div>

      {/* ── Desktop: full pill with track info + stop + next ── */}
      <div className="pointer-events-auto absolute bottom-[80px] left-4 z-20 hidden sm:block">
        <div className="hud flex max-w-[260px] items-center gap-[8px] rounded-full border px-[10px] py-[7px] shadow-[0_3px_14px_rgba(0,0,0,0.12)] backdrop-blur-md">
          <button
            onClick={toggleDesktop}
            aria-label={playing ? 'Pause' : 'Play'}
            className="hud-fill hud-fill-text flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full transition-transform hover:scale-105"
          >
            {playing ? <PauseIcon /> : <PlayIcon />}
          </button>

          <div className="min-w-0 flex-1 leading-tight">
            <div className="hud-text truncate text-[12px] font-semibold">{track.title}</div>
            <div className="hud-soft truncate text-[10px]">{track.artist}</div>
          </div>

          {/* Next */}
          {PLAYLIST.length > 1 && (
            <button
              onClick={nextDesktop}
              aria-label="Next track"
              className="hud-soft flex h-6 w-6 flex-shrink-0 items-center justify-center transition-colors hover:hud-text"
            >
              <NextIcon />
            </button>
          )}

          {/* Stop */}
          {playing && (
            <button
              onClick={stop}
              aria-label="Stop"
              className="hud-soft flex h-6 w-6 flex-shrink-0 items-center justify-center transition-colors hover:hud-text"
            >
              <StopIcon />
            </button>
          )}
        </div>
      </div>
    </>
  )
}

// A small animated equalizer to show playback state on the mobile icon.
function EqualizerIcon() {
  return (
    <svg viewBox="0 0 18 18" className="h-[14px] w-[14px]" fill="currentColor">
      <rect x="2" y="6" width="2.5" height="10" rx="1" style={{ animation: 'eqBar1 0.8s ease-in-out infinite alternate' }} />
      <rect x="7" y="3" width="2.5" height="13" rx="1" style={{ animation: 'eqBar2 0.8s 0.2s ease-in-out infinite alternate' }} />
      <rect x="12" y="7" width="2.5" height="9"  rx="1" style={{ animation: 'eqBar3 0.8s 0.4s ease-in-out infinite alternate' }} />
    </svg>
  )
}
function NoteIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-[14px] w-[14px]" fill="currentColor">
      <path d="M9 18V5l12-2v13M9 18a3 3 0 1 1-6 0 3 3 0 0 1 6 0zm12 0a3 3 0 1 1-6 0 3 3 0 0 1 6 0z" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" fill="none" />
    </svg>
  )
}
function PlayIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-[13px] w-[13px] translate-x-[1px]" fill="currentColor">
      <path d="M7 5l12 7-12 7V5z" />
    </svg>
  )
}
function PauseIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-[13px] w-[13px]" fill="currentColor">
      <path d="M7 5h4v14H7zM13 5h4v14h-4z" />
    </svg>
  )
}
function StopIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-[10px] w-[10px]" fill="currentColor">
      <rect x="5" y="5" width="14" height="14" rx="1.5" />
    </svg>
  )
}
function NextIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-[15px] w-[15px]" fill="currentColor">
      <path d="M6 5l9 7-9 7V5zM16 5h2.5v14H16z" />
    </svg>
  )
}
