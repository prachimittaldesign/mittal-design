import { useEffect, useRef } from 'react'

const VIDEO_URL =
  'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260328_083109_283f3553-e28f-428b-a723-d639c617eb2b.mp4'

const FADE_SECS = 0.5 // seconds to fade in / out

export function VideoBackground() {
  const videoRef = useRef<HTMLVideoElement>(null)
  const rafRef = useRef<number>(0)

  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    // Tick — update opacity each animation frame based on playback position.
    function tick() {
      if (!video) return
      const dur = video.duration
      if (dur && dur > 0) {
        const t = video.currentTime
        if (t < FADE_SECS) {
          video.style.opacity = String(Math.min(1, t / FADE_SECS))
        } else if (t > dur - FADE_SECS) {
          video.style.opacity = String(Math.max(0, (dur - t) / FADE_SECS))
        } else {
          video.style.opacity = '1'
        }
      }
      rafRef.current = requestAnimationFrame(tick)
    }

    // When the video ends: hide → brief pause → restart
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
      // Autoplay blocked — the video stays hidden; no harm done.
    })

    rafRef.current = requestAnimationFrame(tick)

    return () => {
      video.removeEventListener('ended', handleEnded)
      cancelAnimationFrame(rafRef.current)
    }
  }, [])

  return (
    /* Sits underneath the 3D canvas but above the page background.
       pointer-events:none so it never steals click/drag from the city. */
    <div className="pointer-events-none absolute inset-0 overflow-hidden" style={{ zIndex: 1 }}>
      {/* Top gradient — fades the video into the sky */}
      <div
        className="absolute inset-x-0 top-0 z-10 h-[320px]"
        style={{
          background: 'linear-gradient(to bottom, var(--color-paper) 0%, transparent 100%)',
        }}
      />

      {/* The video itself — occupies from 300 px down to the bottom edge */}
      <video
        ref={videoRef}
        src={VIDEO_URL}
        muted
        playsInline
        preload="auto"
        className="absolute w-full object-cover"
        style={{
          top: '300px',
          inset: 'auto 0 0 0',
          height: 'calc(100% - 300px)',
          opacity: 0,
          // Blend into the 3D scene — overlay mixes luma of the video with
          // the rendered 3D pixels to create a seamless ground feel.
          mixBlendMode: 'soft-light',
        }}
      />

      {/* Bottom gradient — grounds the video into the scene edge */}
      <div
        className="absolute inset-x-0 bottom-0 z-10 h-[120px]"
        style={{
          background: 'linear-gradient(to top, var(--color-paper) 0%, transparent 100%)',
        }}
      />
    </div>
  )
}
