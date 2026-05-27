import { useState } from 'react'
import { useIsMobile } from '../lib/useIsMobile'

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

function Links() {
  return (
    <div className="flex flex-wrap gap-[6px]">
      {LINKS.map((link) => (
        <a key={link.label} href={link.href} className={linkClass(link.solid)}>
          {link.label}
        </a>
      ))}
    </div>
  )
}

export function AboutPanel() {
  const isMobile = useIsMobile()
  const [expanded, setExpanded] = useState(false)

  // Mobile: a bottom sheet that peeks by default and taps open to reveal the
  // blurb and links. Pinned to the bottom, clear of the home indicator.
  if (isMobile) {
    return (
      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-[15]">
        <div className="pointer-events-auto mx-auto w-full max-w-[640px] rounded-t-[18px] border border-b-0 border-black/[0.07] bg-white/85 pb-[env(safe-area-inset-bottom)] backdrop-blur-[12px]">
          <button
            onClick={() => setExpanded((e) => !e)}
            className="flex w-full flex-col items-stretch px-[18px] pb-[10px] pt-[8px]"
            aria-expanded={expanded}
          >
            <span className="mx-auto mb-[8px] h-[4px] w-[34px] rounded-full bg-black/15" />
            <span className="flex items-center justify-between">
              <span className="font-mono text-[10px] font-bold uppercase tracking-[0.18em] text-ink-soft">
                About
              </span>
              <Chevron up={expanded} />
            </span>
          </button>
          <div
            className={[
              'overflow-hidden px-[18px] transition-all duration-[320ms] ease-out',
              expanded ? 'max-h-[60vh] pb-[16px] opacity-100' : 'max-h-0 opacity-0',
            ].join(' ')}
          >
            <p className="mb-3 text-[13px] leading-[1.55] text-ink">{BLURB}</p>
            <Links />
          </div>
        </div>
      </div>
    )
  }

  // Desktop: the original bottom-left card.
  return (
    <div className="absolute bottom-[84px] left-4 z-[15] w-[260px] rounded-[14px] border border-black/[0.07] bg-white/70 p-[16px_18px] text-[12px] text-ink backdrop-blur-[12px]">
      <h4 className="mb-[7px] font-mono text-[10px] font-bold uppercase tracking-[0.18em] text-ink-soft">
        About
      </h4>
      <p className="mb-3 leading-[1.55]">{BLURB}</p>
      <Links />
    </div>
  )
}

function Chevron({ up }: { up: boolean }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className={`h-4 w-4 text-ink-soft transition-transform duration-[320ms] ${up ? 'rotate-180' : ''}`}
    >
      <path d="M6 14l6-6 6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}
