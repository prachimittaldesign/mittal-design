import { useEffect, useRef } from 'react'

const VIDEO_URL =
  'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260328_083109_283f3553-e28f-428b-a723-d639c617eb2b.mp4'

const FADE_SECS = 0.5 // seconds to fade in / out each loop
const MAX_OPACITY = 0.32 // keep it a subtle cinematic wash, never overpowering

export function VideoBackground() {
  const videoRef = useRef<HTMLVideoElement>(null)
  const rafRef = useRef<number>(0)

  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    // Each frame, set opacity from playback position so the clip eases in at
    // the start and out near the end — capped at MAX_OPACITY so it stays faint.
    function tick() {
      if (!video) return
      const dur = video.duration
      if (dur && dur > 0) {
        const t = video.currentTime
        let f = 1
        if (t < FADE_SECS) f = Math.min(1, t / FADE_SECS)
        else if (t > dur - FADE_SECS) f = Math.max(0, (dur - t) / FADE_SECS)
        video.style.opacity = String(f * MAX_OPACITY)
      }
      rafRef.current = requestAnimationFrame(tick)
    }

    // On end: fade to 0, brief pause, then restart from the top.
    function handleEnded() {
      if (!video) return
      video.style.opacity = '0'
      setTimeout(() => {
        if (!video) return
        video.currentTime = 0
        void video.play()
      }, 100)
    }

    video.addEventListener('ended', handleEnded)
    video.style.opacity = '0'
    void video.play().catch(() => {
      // Autoplay blocked — overlay simply stays hidden; the 3D scene is unaffected.
    })
    rafRef.current = requestAnimationFrame(tick)

    return () => {
      video.removeEventListener('ended', handleEnded)
      cancelAnimationFrame(rafRef.current)
    }
  }, [])

  // Sits above the 3D canvas (z-2) but below the HUD (z-20). pointer-events:none
  // so it never intercepts pan/zoom/click. soft-light blends the footage into
  // the rendered city; the mask fades the top + bottom edges so there are no
  // hard bars — it dissolves into the scene like atmosphere.
  return (
    <div
      className="pointer-events-none absolute inset-0 overflow-hidden"
      style={{ zIndex: 5 }}
    >
      <video
        ref={videoRef}
        src={VIDEO_URL}
        muted
        playsInline
        preload="auto"
        className="absolute inset-0 h-full w-full object-cover"
        style={{
          opacity: 0,
          mixBlendMode: 'soft-light',
          WebkitMaskImage:
            'linear-gradient(to bottom, transparent 0%, black 22%, black 78%, transparent 100%)',
          maskImage:
            'linear-gradient(to bottom, transparent 0%, black 22%, black 78%, transparent 100%)',
        }}
      />
    </div>
  )
}
