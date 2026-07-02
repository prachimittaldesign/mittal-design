import { useEffect, useState } from 'react'
import { PROJECTS } from '../data/projects'
import { useIsMobile } from '../lib/useIsMobile'

// First-visit coachmarks — a compact three-step glass card that teaches the
// city metaphor, points newcomers at the gold-star case studies, and hands
// over the HUD. Shown once (localStorage), and dismissed for good the moment
// the visitor opens a building — at that point the tour has done its job.
const SEEN_KEY = 'pm-coachmarks-v1'

const FEATURED = PROJECTS.filter((p) => p.featured).map((p) => p.label)

function GoldStar() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-[20px] w-[20px]"
      style={{ filter: 'drop-shadow(0 0 5px rgba(255,179,0,0.6))' }}
      aria-hidden
    >
      <path
        d="M12 2.5l2.85 5.9 6.4.85-4.7 4.5 1.2 6.35L12 17.05 6.25 20.1l1.2-6.35-4.7-4.5 6.4-.85L12 2.5z"
        fill="#ffcf4d"
        stroke="#e6a500"
        strokeWidth="1"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function PanIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-[19px] w-[19px]" aria-hidden>
      <path
        d="M12 3v18M3 12h18M12 3l-2.5 2.5M12 3l2.5 2.5M12 21l-2.5-2.5M12 21l2.5-2.5M3 12l2.5-2.5M3 12l2.5 2.5M21 12l-2.5-2.5M21 12l-2.5 2.5"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function CompassIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-[19px] w-[19px]" aria-hidden>
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.8" />
      <path d="M15.5 8.5l-2 5-5 2 2-5 5-2z" fill="currentColor" />
    </svg>
  )
}

export function Coachmarks({ suppressed }: { suppressed: boolean }) {
  const isMobile = useIsMobile()
  const [visible, setVisible] = useState(false)
  const [step, setStep] = useState(0)

  // First visit only — wait for the hero lockup to dock (2.4s) before appearing.
  useEffect(() => {
    if (localStorage.getItem(SEEN_KEY)) return
    const t = setTimeout(() => setVisible(true), 3000)
    return () => clearTimeout(t)
  }, [])

  const dismiss = () => {
    localStorage.setItem(SEEN_KEY, '1')
    setVisible(false)
  }

  // Opening a case study proves the tour landed — retire it permanently.
  useEffect(() => {
    if (suppressed && visible) dismiss()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [suppressed])

  if (!visible || suppressed) return null

  const featuredNames =
    FEATURED.length > 1
      ? `${FEATURED.slice(0, -1).join(', ')} and ${FEATURED[FEATURED.length - 1]}`
      : FEATURED.join('')

  const steps = [
    {
      eyebrow: 'Welcome',
      icon: <PanIcon />,
      iconBg: 'var(--hud-border)',
      title: 'This portfolio is a city',
      body: (
        <>
          Every building is a shipped project — mapped by audience and complexity.{' '}
          {isMobile
            ? 'One finger to pan, pinch to zoom.'
            : 'Drag to pan, scroll to zoom, right-drag to orbit.'}
        </>
      ),
    },
    {
      eyebrow: 'Start here',
      icon: <GoldStar />,
      iconBg: 'rgba(255, 207, 77, 0.18)',
      title: 'Follow the gold stars',
      body: (
        <>
          Towers with a floating star hold the newest, deepest case studies —{' '}
          <strong className="hud-text font-semibold">{featuredNames}</strong>.{' '}
          {isMobile ? 'Tap' : 'Click'} one to open the full story.
        </>
      ),
    },
    {
      eyebrow: 'Explore',
      icon: <CompassIcon />,
      iconBg: 'var(--hud-border)',
      title: 'Make the city yours',
      body: (
        <>
          Search places, filter by discipline, or switch 3D · 2D · street view. The sky runs
          on Hyderabad&rsquo;s real time and weather.
        </>
      ),
    },
  ]

  const last = step === steps.length - 1
  const s = steps[step]

  return (
    <div
      className="pointer-events-auto absolute bottom-[calc(1rem+env(safe-area-inset-bottom)+56px)] left-1/2 z-30 w-[min(360px,calc(100vw-24px))] -translate-x-1/2 sm:bottom-[64px]"
      style={{ animation: 'fade-rise 500ms cubic-bezier(0.2, 0.7, 0.3, 1) both' }}
      role="dialog"
      aria-label="Quick tour"
    >
      <div className="hud-strong rounded-[18px] border p-[16px] shadow-[0_14px_44px_rgba(0,0,0,0.18)] backdrop-blur-md">
        <div className="flex items-start gap-[12px]">
          <span
            className="hud-text flex h-[38px] w-[38px] flex-shrink-0 items-center justify-center rounded-full"
            style={{ background: s.iconBg }}
          >
            {s.icon}
          </span>
          <div className="min-w-0">
            <div className="hud-soft font-mono text-[9px] font-bold uppercase tracking-[0.18em]">
              {String(step + 1).padStart(2, '0')} · {s.eyebrow}
            </div>
            <div className="hud-text mt-[3px] text-[14.5px] font-bold tracking-[-0.01em]">
              {s.title}
            </div>
            <p className="hud-soft mt-[5px] text-[12.5px] leading-[1.55]">{s.body}</p>
          </div>
        </div>

        <div className="mt-[14px] flex items-center justify-between border-t pt-[12px]" style={{ borderColor: 'var(--hud-border)' }}>
          {/* Progress dots */}
          <div className="flex items-center gap-[5px]">
            {steps.map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setStep(i)}
                aria-label={`Step ${i + 1}`}
                className="h-[5px] rounded-full transition-all duration-200"
                style={{
                  width: i === step ? 16 : 5,
                  background: i === step ? 'var(--hud-text)' : 'var(--hud-border)',
                }}
              />
            ))}
          </div>

          <div className="flex items-center gap-[10px]">
            {!last && (
              <button
                type="button"
                onClick={dismiss}
                className="hud-soft text-[11.5px] font-semibold transition-opacity hover:opacity-70"
              >
                Skip
              </button>
            )}
            <button
              type="button"
              onClick={() => (last ? dismiss() : setStep((v) => v + 1))}
              className="hud-on rounded-full px-[14px] py-[6px] text-[11.5px] font-bold transition-transform hover:-translate-y-[1px] active:translate-y-0"
            >
              {last ? 'Start exploring' : 'Next'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
