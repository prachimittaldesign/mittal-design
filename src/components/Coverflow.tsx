import { useEffect, useRef, useState } from 'react'
import { PROJECTS } from '../data/projects'
import { quadrant, BIOME } from '../lib/iso'
import type { Project } from '../types'

export type CoverflowMode = 'loading' | 'error' | 'nowebgl' | 'gallery'

interface CoverflowProps {
  mode: CoverflowMode
  onOpen: (project: Project) => void
  /** 'error' mode: retry loading the 3D experience. */
  onRetry?: () => void
  /** 'gallery' mode (opened from the lag prompt): close and return to the city. */
  onClose?: () => void
}

const thumb = (p: Project) => p.imageGroups?.[0]?.images[0]?.src
const accentOf = (p: Project) => BIOME[quadrant(p.gx, p.gy)].fill

// A lightweight HTML "cover flow" gallery of every project — the resilient
// fallback for slow networks, load failures, laggy devices and browsers
// without WebGL. Pure DOM + CSS + a small scroll transform, so it ships in the
// tiny initial bundle and is usable instantly while (or instead of) the 3D
// city. Selecting a card opens the same case-study overlay 3D visitors get.
export function Coverflow({ mode, onOpen, onRetry, onClose }: CoverflowProps) {
  const scrollRef = useRef<HTMLDivElement>(null)
  // In loading mode, hold a plain screen briefly so fast connections (which
  // resolve the 3D chunk in well under this) never flash the gallery.
  const [reveal, setReveal] = useState(mode !== 'loading')

  useEffect(() => {
    if (mode !== 'loading') {
      setReveal(true)
      return
    }
    const t = window.setTimeout(() => setReveal(true), 1600)
    return () => clearTimeout(t)
  }, [mode])

  // Cover-flow transform: tilt + shrink + fade each card by its distance from
  // the viewport centre. Runs on scroll via rAF; cheap and universal.
  useEffect(() => {
    if (!reveal) return
    const el = scrollRef.current
    if (!el) return
    let raf = 0
    const update = () => {
      const mid = el.scrollLeft + el.clientWidth / 2
      for (const card of Array.from(el.children) as HTMLElement[]) {
        if (!card.dataset.card) continue
        const c = card.offsetLeft + card.offsetWidth / 2
        const d = Math.max(-1.5, Math.min(1.5, (c - mid) / (el.clientWidth * 0.62)))
        const a = Math.min(Math.abs(d), 1)
        card.style.transform = `perspective(1200px) rotateY(${d * -40}deg) scale(${1 - a * 0.26})`
        card.style.opacity = String(1 - a * 0.4)
        card.style.zIndex = String(100 - Math.round(a * 60))
      }
    }
    const onScroll = () => {
      cancelAnimationFrame(raf)
      raf = requestAnimationFrame(update)
    }
    el.addEventListener('scroll', onScroll, { passive: true })
    // Start centred on the first featured project (Ved), so the strongest work
    // leads. Two rAFs so layout is settled before we measure/scroll.
    requestAnimationFrame(() =>
      requestAnimationFrame(() => {
        const cards = Array.from(el.children).filter((c) => (c as HTMLElement).dataset.card) as HTMLElement[]
        const lead = cards.findIndex((c) => c.dataset.featured === '1')
        const target = cards[lead > 0 ? lead : 0]
        if (target) el.scrollLeft = target.offsetLeft + target.offsetWidth / 2 - el.clientWidth / 2
        update()
      }),
    )
    return () => {
      el.removeEventListener('scroll', onScroll)
      cancelAnimationFrame(raf)
    }
  }, [reveal])

  const scrollBy = (dir: 1 | -1) => {
    const el = scrollRef.current
    if (!el) return
    el.scrollBy({ left: dir * el.clientWidth * 0.55, behavior: 'smooth' })
  }

  // Blank paper for the brief pre-reveal window, so fast connections (whose 3D
  // chunk resolves before the reveal delay) look exactly as they did before —
  // paper background → 3D city, no gallery flash.
  if (!reveal) {
    return <div className="h-full w-full bg-paper" aria-hidden />
  }

  const banner =
    mode === 'error'
      ? {
          tone: '#c2564a',
          title: 'The 3D city couldn’t load',
          body: 'Your connection may have dropped. Browse every project below, or try again.',
        }
      : mode === 'nowebgl'
        ? {
            tone: '#6b7280',
            title: 'Your browser can’t display the 3D city',
            body: 'No problem — here’s every project. Select one to read the full case study.',
          }
        : mode === 'loading'
          ? {
              tone: BIOME.q1.fill,
              title: 'Loading the 3D city…',
              body: 'On a slow connection? Browse the projects here — they open instantly.',
            }
          : null // gallery

  return (
    <div className="isolate relative flex h-full w-full flex-col overflow-hidden bg-paper">
      {/* Header */}
      <header className="flex flex-shrink-0 items-center justify-between gap-4 px-[clamp(16px,5vw,44px)] pt-[calc(20px+env(safe-area-inset-top))]">
        <div>
          <div className="flex items-center gap-[10px]">
            <span className="text-[clamp(22px,4vw,30px)] font-extrabold tracking-[-0.04em] text-ink">Prachi</span>
            <span className="rounded-[9px] border-2 border-ink px-[9px] pb-[3px] pt-[1px] text-[clamp(20px,3.6vw,27px)] font-extrabold leading-none tracking-[-0.03em] text-ink">
              Mittal
            </span>
          </div>
          <p className="mt-1 text-[12px] font-medium text-ink-soft">Product Designer · Architect</p>
        </div>
        {onClose && (
          <button
            type="button"
            onClick={onClose}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-ink/[0.08] text-[20px] leading-none text-ink transition-colors hover:bg-ink/[0.16]"
            aria-label="Close gallery and return to the 3D city"
          >
            ×
          </button>
        )}
      </header>

      {/* Status banner (loading / error / no-webgl) */}
      {banner && (
        <div className="mx-[clamp(16px,5vw,44px)] mt-4 flex flex-shrink-0 flex-wrap items-center gap-x-3 gap-y-2 rounded-[14px] border border-black/[0.07] bg-white/60 px-4 py-3">
          <span className="h-[9px] w-[9px] flex-shrink-0 rounded-full" style={{ background: banner.tone }} />
          <span className="text-[14px] font-bold text-ink">{banner.title}</span>
          <span className="text-[13px] text-ink-soft">{banner.body}</span>
          {mode === 'error' && onRetry && (
            <button
              type="button"
              onClick={onRetry}
              className="ml-auto rounded-full bg-ink px-[14px] py-[6px] text-[12px] font-bold text-paper transition-transform hover:-translate-y-[1px]"
            >
              Try again
            </button>
          )}
        </div>
      )}

      {/* Cover-flow rail */}
      <div className="relative flex min-h-0 flex-1 items-center">
        <NavArrow dir={-1} onClick={() => scrollBy(-1)} />
        <div
          ref={scrollRef}
          className="flex h-full items-center gap-[clamp(14px,3vw,30px)] overflow-x-auto px-[max(16px,calc(50%-170px))] py-6 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          style={{ scrollSnapType: 'x mandatory' }}
          role="list"
          aria-label="Projects"
        >
          {PROJECTS.map((p) => (
            <CoverCard key={p.id} project={p} onOpen={onOpen} />
          ))}
        </div>
        <NavArrow dir={1} onClick={() => scrollBy(1)} />
      </div>

      <p className="flex-shrink-0 pb-[calc(16px+env(safe-area-inset-bottom))] text-center text-[11px] text-ink-soft">
        {PROJECTS.length} projects · swipe or use the arrows · select a card to read the case study
      </p>
    </div>
  )
}

function CoverCard({ project, onOpen }: { project: Project; onOpen: (p: Project) => void }) {
  const accent = accentOf(project)
  const src = thumb(project)
  const [imgFailed, setImgFailed] = useState(false)
  const showImg = src && !imgFailed

  return (
    <button
      type="button"
      data-card="1"
      data-featured={project.featured ? '1' : '0'}
      onClick={() => onOpen(project)}
      role="listitem"
      className="group flex w-[clamp(220px,72vw,320px)] flex-shrink-0 flex-col overflow-hidden rounded-[18px] border border-black/[0.08] bg-white text-left shadow-[0_10px_30px_rgba(0,0,0,0.12)] transition-shadow will-change-transform hover:shadow-[0_16px_44px_rgba(0,0,0,0.18)]"
      style={{ scrollSnapAlign: 'center' }}
      aria-label={`${project.label} — ${project.sub}. Open case study.`}
    >
      {/* Thumbnail (image, or a branded gradient placeholder / error state) */}
      <div
        className="relative aspect-[16/10] w-full overflow-hidden"
        style={{ background: `linear-gradient(135deg, ${accent}, ${accent}88)` }}
      >
        {showImg ? (
          <img
            src={src}
            alt={`${project.label} — preview`}
            loading="lazy"
            decoding="async"
            onError={() => setImgFailed(true)}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center px-6 text-center">
            <span className="text-[clamp(20px,3.4vw,26px)] font-extrabold leading-tight tracking-[-0.02em] text-white/95">
              {project.label}
            </span>
          </div>
        )}
        {project.featured && (
          <span className="absolute right-3 top-3 rounded-full bg-white/85 px-[9px] py-[3px] text-[10px] font-bold text-ink shadow-sm">
            ★ Featured
          </span>
        )}
      </div>

      {/* Meta */}
      <div className="flex flex-1 flex-col p-[18px]">
        <div className="flex items-baseline gap-2">
          <h3 className="text-[17px] font-bold tracking-[-0.01em] text-ink">{project.label}</h3>
          <span className="font-mono text-[9px] uppercase tracking-[0.12em] text-ink-soft">{project.sub}</span>
        </div>
        <p className="mt-2 line-clamp-4 text-[13px] leading-[1.55] text-ink-soft">{project.desc}</p>
        <span className="mt-3 inline-flex items-center gap-1 text-[12px] font-bold" style={{ color: accent }}>
          Read case study
          <svg viewBox="0 0 16 16" className="h-[13px] w-[13px] transition-transform group-hover:translate-x-[2px]" fill="none">
            <path d="M3 8h9M9 4l4 4-4 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </span>
      </div>
    </button>
  )
}

function NavArrow({ dir, onClick }: { dir: 1 | -1; onClick: () => void }) {
  return (
    <button
      type="button"
      data-tip={dir === 1 ? 'Next projects' : 'Previous projects'}
      data-tip-pos={dir === 1 ? 'left' : 'right'}
      onClick={onClick}
      aria-label={dir === 1 ? 'Next projects' : 'Previous projects'}
      className={[
        'absolute top-1/2 z-[110] hidden h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full',
        'border border-black/10 bg-white/85 text-ink shadow-[0_3px_14px_rgba(0,0,0,0.14)] backdrop-blur-md',
        'transition-transform hover:scale-105 active:scale-95 sm:flex',
        dir === 1 ? 'right-3' : 'left-3',
      ].join(' ')}
    >
      <svg viewBox="0 0 20 20" fill="none" className="h-5 w-5">
        <path
          d={dir === 1 ? 'M7 4l6 6-6 6' : 'M13 4l-6 6 6 6'}
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </button>
  )
}
