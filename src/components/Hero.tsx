import { useState } from 'react'
import { createPortal } from 'react-dom'
import { useIsMobile } from '../lib/useIsMobile'
import { useIsNight } from '../lib/useIsNight'
import { getHyderabadTime } from '../lib/sky'

const LINKS = [
  { label: 'hello@', href: 'mailto:hello@prachimittal.com', solid: true },
  { label: 'Resume', href: '#', solid: false },
  { label: 'LinkedIn', href: '#', solid: false },
  { label: 'Dribbble', href: '#', solid: false },
]

const BLURB =
  'Prachi designs digital products and physical spaces. Twelve shipped surfaces below — mapped by audience and complexity. The cottage in the far corner is her architecture practice.'

const linkClass = (solid: boolean) =>
  [
    'inline-block rounded-full px-[10px] py-[5px] text-[11px] font-semibold tracking-[0.04em]',
    'transition-transform duration-[180ms] hover:-translate-y-0.5',
    solid ? 'bg-ink text-paper' : 'border border-black/20 bg-transparent text-ink',
  ].join(' ')

function greeting(): string {
  const h = getHyderabadTime().hour
  if (h < 5) return 'Good night'
  if (h < 12) return 'Good morning'
  if (h < 17) return 'Good afternoon'
  if (h < 22) return 'Good evening'
  return 'Good night'
}

// The "Prachi [Mittal]" lockup — boxed surname à la Airbnb's 2021 release.
// Animates in centred (type scales fluidly so it always fits), then docks to
// the top-right (Maps account slot): a compact "PM" chip on phones, the scaled
// lockup on desktop. The docked brand is the entry point for the About menu.
export function Hero({ docked }: { docked: boolean }) {
  const isMobile = useIsMobile()
  const night = useIsNight()
  const [open, setOpen] = useState(false)
  const toggle = () => setOpen((o) => !o)
  const lockupTrigger = docked && !isMobile

  // Lockup sits directly on the canvas, so its colours must flip at night.
  const wordColor = night ? 'text-paper' : 'text-ink'
  const boxColor = night ? 'border-paper text-paper' : 'border-ink text-ink'
  const subColor = night ? 'text-paper/75' : 'text-ink-soft'

  return (
    <>
      {/* The lockup: the centred reveal on all sizes, and (on desktop) the
          docked brand that opens the menu. On mobile it fades out once docked. */}
      <div
        className={[
          'absolute z-20',
          lockupTrigger ? 'pointer-events-auto cursor-pointer' : 'pointer-events-none',
          'transition-all duration-[950ms] ease-[cubic-bezier(.6,.05,.2,1)]',
          docked && !isMobile
            ? 'top-4 right-4 scale-[0.46] origin-top-right'
            : 'top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2',
          docked && isMobile ? 'opacity-0' : 'opacity-100',
        ].join(' ')}
        onClick={lockupTrigger ? toggle : undefined}
        role={lockupTrigger ? 'button' : undefined}
        aria-label={lockupTrigger ? 'About Prachi Mittal' : undefined}
      >
        <div className="flex items-center gap-4">
          <div className={`text-[clamp(30px,9vw,90px)] font-extrabold tracking-[-0.04em] leading-[0.9] transition-colors duration-700 ${wordColor}`}>
            Prachi
          </div>
          <div className={`rounded-[clamp(10px,2vw,20px)] border-2 px-[clamp(10px,2.2vw,22px)] pt-[clamp(3px,0.6vw,6px)] pb-[clamp(4px,0.8vw,8px)] text-[clamp(27px,8.2vw,82px)] font-extrabold leading-none tracking-[-0.03em] transition-colors duration-700 sm:border-4 ${boxColor}`}>
            Mittal
          </div>
        </div>
        <div className={`mt-[10px] text-center text-[clamp(11px,2.2vw,21px)] font-medium tracking-[0.02em] transition-colors duration-700 ${subColor}`}>
          Product Designer · Architect
        </div>
      </div>

      {/* Compact monogram chip — the mobile docked brand + menu trigger. */}
      {isMobile && (
        <button
          type="button"
          onClick={toggle}
          aria-label="About Prachi Mittal"
          className={[
            'absolute right-3 top-[calc(0.75rem+env(safe-area-inset-top))] z-20',
            'transition-opacity duration-[600ms]',
            docked ? 'pointer-events-auto opacity-100' : 'pointer-events-none opacity-0',
          ].join(' ')}
        >
          <span className="flex h-9 w-9 items-center justify-center rounded-full border border-black/10 bg-white/85 text-[13px] font-extrabold tracking-[-0.02em] text-ink shadow-[0_2px_10px_rgba(0,0,0,0.1)] backdrop-blur-md">
            PM
          </span>
        </button>
      )}

      {/* The brand menu: a time-of-day greeting + the About blurb and links.
          Portaled to <body> so it clears the App-level HUD (Scene, where Hero
          lives, forms its own stacking context). */}
      {open &&
        createPortal(
          <>
            <div className="fixed inset-0 z-[50]" onClick={() => setOpen(false)} />
            <div className="fixed right-3 top-[calc(0.75rem+env(safe-area-inset-top)+44px)] z-[51] w-[min(320px,90vw)] rounded-[16px] border border-black/10 bg-white/90 p-[18px] shadow-[0_14px_44px_rgba(0,0,0,0.18)] backdrop-blur-md sm:right-4 sm:top-[64px]">
              <div className="mb-[10px] text-[19px] font-bold tracking-[-0.01em] text-ink">{greeting()}</div>
              <p className="mb-3 text-[13px] leading-[1.55] text-ink-soft">{BLURB}</p>
              <div className="flex flex-wrap gap-[6px]">
                {LINKS.map((link) => (
                  <a key={link.label} href={link.href} className={linkClass(link.solid)}>
                    {link.label}
                  </a>
                ))}
              </div>
            </div>
          </>,
          document.body,
        )}
    </>
  )
}
