import { useEffect, useRef, useState, type ReactNode } from 'react'
import { PROJECTS } from '../data/projects'
import { useIsMobile } from '../lib/useIsMobile'
import { vedAnchor } from '../lib/coachAnchor'

// First-visit onboarding tour — six compact glass coachmarks, each anchored
// next to the thing it explains: the Ved tower's gold star (live 3D-projected),
// the filter pills, the monogram menu (which it opens for real), the map
// controls, and the music player. Shown once (localStorage), skippable, and
// retired permanently the moment the visitor opens a building.
const SEEN_KEY = 'pm-coachmarks-v2'

const FEATURED = PROJECTS.filter((p) => p.featured).map((p) => p.label)

// ── Step icons ────────────────────────────────────────────────────────────────
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
function FilterIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-[19px] w-[19px]" aria-hidden>
      <path d="M4 6h16M7 12h10M10 18h4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  )
}
function MonogramIcon() {
  return <span className="text-[13px] font-extrabold tracking-[-0.02em]">PM</span>
}
function CubeIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-[19px] w-[19px]" aria-hidden>
      <path
        d="M12 3l8 4.5v9L12 21l-8-4.5v-9L12 3zM12 3v9m0 9v-9m8-4.5L12 12M4 7.5L12 12"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinejoin="round"
      />
    </svg>
  )
}
function NoteIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-[19px] w-[19px]" aria-hidden>
      <path d="M9 18V6l10-2v11" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="6.6" cy="18" r="2.4" stroke="currentColor" strokeWidth="2" />
      <circle cx="16.6" cy="15" r="2.4" stroke="currentColor" strokeWidth="2" />
    </svg>
  )
}

// ── Step spec ─────────────────────────────────────────────────────────────────
type CaretSide = 'top' | 'bottom' | 'right'
type CaretAlign = 'start' | 'center' | 'end'
interface Caret {
  side: CaretSide
  align: CaretAlign
}
interface Step {
  id: string
  eyebrow: string
  title: string
  body: ReactNode
  icon: ReactNode
  iconBg: string
  /** Positioning classes: mobile-first, sm: overrides for desktop. */
  wrapper: string
  caret?: Caret // desktop caret
  caretMobile?: Caret // mobile caret (omit to hide on phones)
}

const CENTER_BOTTOM =
  'bottom-[calc(1rem+env(safe-area-inset-bottom)+56px)] left-1/2 -translate-x-1/2 sm:bottom-[64px]'

export function Coachmarks({ suppressed }: { suppressed: boolean }) {
  const isMobile = useIsMobile()
  const [visible, setVisible] = useState(false)
  const [step, setStep] = useState(0)
  const wrapRef = useRef<HTMLDivElement>(null)
  const caretRef = useRef<HTMLSpanElement>(null)

  // First visit only. The About-card peek plays first on a fresh visit; the
  // tour begins a beat after it closes, so the two never share the screen.
  // If the peek already ran on an earlier visit, fall back to a plain delay.
  useEffect(() => {
    if (localStorage.getItem(SEEN_KEY)) return
    const timers: number[] = []
    if (localStorage.getItem('pm-about-peek-v1')) {
      timers.push(window.setTimeout(() => setVisible(true), 3000))
      return () => timers.forEach(clearTimeout)
    }
    const begin = () => timers.push(window.setTimeout(() => setVisible(true), 700))
    window.addEventListener('pm:peek-done', begin, { once: true })
    timers.push(window.setTimeout(begin, 12000)) // safety net if the peek never fires
    return () => {
      window.removeEventListener('pm:peek-done', begin)
      timers.forEach(clearTimeout)
    }
  }, [])

  const dismiss = () => {
    localStorage.setItem(SEEN_KEY, '1')
    setVisible(false)
    window.dispatchEvent(new Event('pm:about-close'))
  }

  // Opening a case study proves the tour landed — retire it permanently.
  useEffect(() => {
    if (suppressed && visible) dismiss()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [suppressed])

  const featuredNames =
    FEATURED.length > 1
      ? `${FEATURED.slice(0, -1).join(', ')} and ${FEATURED[FEATURED.length - 1]}`
      : FEATURED.join('')

  const verb = isMobile ? 'Tap' : 'Click'

  const steps: Step[] = [
    {
      id: 'welcome',
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
      wrapper: CENTER_BOTTOM,
    },
    {
      id: 'stars',
      eyebrow: 'Start here',
      icon: <GoldStar />,
      iconBg: 'rgba(255, 207, 77, 0.18)',
      title: 'Follow the gold stars',
      body: (
        <>
          That&rsquo;s <strong className="hud-text font-semibold">Ved</strong> right above — the
          tallest tower in the city. The starred towers ({featuredNames}) hold the newest,
          deepest case studies. {verb} one for the full story.
        </>
      ),
      wrapper: '', // positioned live against the 3D anchor
      caret: { side: 'top', align: 'center' },
      caretMobile: { side: 'top', align: 'center' },
    },
    {
      id: 'filters',
      eyebrow: 'Filters & search',
      icon: <FilterIcon />,
      iconBg: 'var(--hud-border)',
      title: 'Light up a discipline',
      body: (
        <>
          {verb} a pill — Enterprise, AI, TV… — and matching towers stay lit while the rest dim.
          The search box finds any building or place in the city.
        </>
      ),
      wrapper:
        'top-[calc(0.75rem+env(safe-area-inset-top)+92px)] left-1/2 -translate-x-1/2 sm:left-[420px] sm:top-[60px] sm:translate-x-0',
      caret: { side: 'top', align: 'start' },
      caretMobile: { side: 'top', align: 'center' },
    },
    {
      id: 'logo',
      eyebrow: 'The monogram',
      icon: <MonogramIcon />,
      iconBg: 'var(--hud-border)',
      title: 'Meet Prachi',
      body: (
        <>
          The logo in the top-right opens her card — a time-of-day hello, the story behind the
          city, resume, LinkedIn and Behance. It&rsquo;s open right now — have a look.
        </>
      ),
      wrapper: `${CENTER_BOTTOM} sm:bottom-auto sm:left-auto sm:-translate-x-0 sm:right-[368px] sm:top-[64px]`,
      caret: { side: 'right', align: 'start' },
    },
    {
      id: 'controls',
      eyebrow: 'Your viewpoint',
      icon: <CubeIcon />,
      iconBg: 'var(--hud-border)',
      title: 'Change how you see it',
      body: (
        <>
          3D city, flat 2D map, or a street-level skyline walk. Below them: recenter when
          you&rsquo;re lost, and zoom.
        </>
      ),
      wrapper:
        'bottom-[calc(1rem+env(safe-area-inset-bottom))] right-[64px] sm:bottom-4 sm:right-[68px]',
      caret: { side: 'right', align: 'center' },
      caretMobile: { side: 'right', align: 'center' },
    },
    {
      id: 'music',
      eyebrow: 'Set the mood',
      icon: <NoteIcon />,
      iconBg: 'var(--hud-border)',
      title: 'The city has a soundtrack',
      body: (
        <>
          Lo-fi piano while you wander — play, skip, stop. The layers button just above it
          toggles labels, scenery and landmarks.
        </>
      ),
      wrapper:
        'bottom-[calc(1rem+env(safe-area-inset-bottom)+56px)] left-3 sm:bottom-[64px] sm:left-4',
      caret: { side: 'bottom', align: 'start' },
      caretMobile: { side: 'bottom', align: 'start' },
    },
  ]

  const s = steps[step]
  const last = step === steps.length - 1

  // The monogram step opens the real About menu so "what's inside" is visible;
  // leaving the step (or ending the tour) closes it again.
  useEffect(() => {
    if (!visible) return
    if (s.id === 'logo') {
      window.dispatchEvent(new Event('pm:about-open'))
      return () => {
        window.dispatchEvent(new Event('pm:about-close'))
      }
    }
  }, [s.id, visible])

  // Live placement for the star step: follow the projected Ved anchor, clamped
  // to the viewport, caret sliding to keep pointing at the tower.
  useEffect(() => {
    if (!visible || s.id !== 'stars') return
    let raf = 0
    const loop = () => {
      const el = wrapRef.current
      if (el) {
        const W = el.offsetWidth || 320
        const H = el.offsetHeight || 170
        const vw = window.innerWidth
        const vh = window.innerHeight
        if (vedAnchor.visible) {
          const x = Math.min(Math.max(vedAnchor.x - W / 2, 12), vw - W - 12)
          const y = Math.min(Math.max(vedAnchor.y + 16, 12), vh - H - 12)
          el.style.left = `${x}px`
          el.style.top = `${y}px`
          el.style.transform = 'none'
          const caret = caretRef.current
          if (caret) {
            const cx = Math.min(Math.max(vedAnchor.x - x, 22), W - 22)
            caret.style.left = `${cx}px`
            caret.style.marginLeft = '-6px'
          }
        } else {
          el.style.left = '50%'
          el.style.top = `${vh - H - 120}px`
          el.style.transform = 'translateX(-50%)'
        }
      }
      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(raf)
  }, [visible, s.id])

  if (!visible || suppressed) return null

  const caretClass = (c: Caret) => {
    const base = 'hud-strong absolute h-[12px] w-[12px] rotate-45 border'
    if (c.side === 'right') {
      const v = c.align === 'start' ? 'top-[26px]' : c.align === 'end' ? 'bottom-[26px]' : 'top-1/2 -translate-y-1/2'
      return `${base} -right-[6px] ${v}`
    }
    const edge = c.side === 'top' ? '-top-[6px]' : '-bottom-[6px]'
    const h = c.align === 'start' ? 'left-7' : c.align === 'end' ? 'right-7' : 'left-1/2 -translate-x-1/2'
    return `${base} ${edge} ${h}`
  }

  return (
    <div
      key={step}
      ref={wrapRef}
      // z-[60] keeps the card clickable above the About menu's backdrop (z-50)
      // during the monogram step; project overlays never coexist with the tour.
      className={`pointer-events-auto absolute z-[60] w-[min(330px,calc(100vw-24px))] ${s.id === 'stars' ? '' : s.wrapper}`}
      style={{
        animation: 'fade-rise 450ms cubic-bezier(0.2, 0.7, 0.3, 1) both',
        // The star step is placed by the rAF loop; start it near the anchor's
        // last known spot so the card doesn't flash in at the origin.
        ...(s.id === 'stars'
          ? vedAnchor.visible
            ? { left: vedAnchor.x - 165, top: vedAnchor.y + 16 }
            : { left: '50%', top: '60%', transform: 'translateX(-50%)' }
          : {}),
      }}
      role="dialog"
      aria-label="Quick tour"
    >
      <div className="relative">
        {/* caret — desktop and mobile variants (dynamic for the star step) */}
        {s.id === 'stars' ? (
          <span ref={caretRef} className="hud-strong absolute -top-[6px] h-[12px] w-[12px] rotate-45 border" />
        ) : (
          <>
            {s.caret && <span className={`hidden sm:block ${caretClass(s.caret)}`} />}
            {s.caretMobile && <span className={`sm:hidden ${caretClass(s.caretMobile)}`} />}
          </>
        )}

        <div className="hud-strong relative rounded-[18px] border p-[16px] shadow-[0_14px_44px_rgba(0,0,0,0.18)] backdrop-blur-md">
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
              <div className="hud-text mt-[3px] text-[14.5px] font-bold tracking-[-0.01em]">{s.title}</div>
              <p className="hud-soft mt-[5px] text-[12.5px] leading-[1.55]">{s.body}</p>
            </div>
          </div>

          <div
            className="mt-[14px] flex items-center justify-between border-t pt-[12px]"
            style={{ borderColor: 'var(--hud-border)' }}
          >
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
    </div>
  )
}
