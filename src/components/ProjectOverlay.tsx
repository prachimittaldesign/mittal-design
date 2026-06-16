import { useState } from 'react'
import { quadrant, BIOME } from '../lib/iso'
import type { CaseStudy, Project } from '../types'
import { TakeoverShell } from './TakeoverShell'

interface ProjectOverlayProps {
  project: Project
  tileRect: DOMRect
  onClose: () => void
}

export function ProjectOverlay({ project, tileRect, onClose }: ProjectOverlayProps) {
  const q = quadrant(project.gx, project.gy)
  const { fill: accent, label: qLabel } = BIOME[q]

  return (
    <TakeoverShell tileRect={tileRect} accent={accent} onClose={onClose}>
      {/* Eyebrow */}
      <div className="mb-5 flex items-center gap-[10px] font-mono text-[11px] font-bold uppercase tracking-[0.18em] text-ink-soft">
        <span className="h-[3px] w-[28px] flex-shrink-0 rounded-[2px]" style={{ background: accent }} />
        {qLabel} · {project.sub}
      </div>

      {/* Title + context badge */}
      <div className="flex flex-wrap items-end gap-x-5 gap-y-3">
        <h1 className="text-[clamp(40px,7vw,80px)] font-extrabold leading-[0.95] tracking-[-0.03em] text-ink">
          {project.label}
        </h1>
        {project.caseStudy?.context && (
          <span
            className="mb-[10px] inline-flex items-center gap-[7px] rounded-full px-[12px] py-[6px] text-[12px] font-semibold text-ink"
            style={{ background: `${accent}22` }}
          >
            <span className="h-[6px] w-[6px] rounded-full" style={{ background: accent }} />
            {project.caseStudy.context}
          </span>
        )}
      </div>

      {project.caseStudy ? (
        <CaseStudyBody cs={project.caseStudy} accent={accent} tags={project.tags} imageGroups={project.imageGroups} />
      ) : (
        <>
          <SimpleBody desc={project.desc} tags={project.tags} qLabel={qLabel} />
          <Carousels groups={project.imageGroups} accent={accent} />
        </>
      )}
    </TakeoverShell>
  )
}

function ImageCarousel({
  images,
  label,
  accent,
  aspect,
}: {
  images: Array<{ src: string; caption?: string }>
  label: string
  accent: string
  aspect?: string
}) {
  const [idx, setIdx] = useState(0)
  const prev = () => setIdx((i) => (i - 1 + images.length) % images.length)
  const next = () => setIdx((i) => (i + 1) % images.length)
  const current = images[idx]
  const multi = images.length > 1

  return (
    <div>
      {/* Fixed-aspect viewport: the box height is set by the container's
          aspect-ratio, NOT by the current image, so switching slides (even
          between differently-proportioned screenshots) never changes the
          height — no vertical jump. All frames stay mounted and absolutely
          stacked; only opacity crossfades. object-contain keeps every
          screenshot fully visible (letterboxed rather than cropped). */}
      <div
        className="relative overflow-hidden rounded-[12px] bg-black/[0.04]"
        style={{ aspectRatio: aspect ?? '16 / 9' }}
      >
        {images.map((img, i) => (
          <img
            key={i}
            src={img.src}
            alt={img.caption ?? `${label} screen ${i + 1}`}
            draggable={false}
            className={[
              'absolute inset-0 h-full w-full object-contain transition-opacity duration-300 ease-out',
              i === idx ? 'opacity-100' : 'pointer-events-none opacity-0',
            ].join(' ')}
          />
        ))}

        {multi && (
          <>
            <button
              type="button"
              onClick={prev}
              aria-label="Previous screen"
              className="absolute left-3 top-1/2 z-10 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-white/80 shadow-[0_2px_8px_rgba(0,0,0,0.14)] backdrop-blur-sm transition-transform hover:scale-105 active:scale-95"
            >
              <svg viewBox="0 0 20 20" fill="none" className="h-4 w-4 text-ink">
                <path d="M13 4l-6 6 6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
            <button
              type="button"
              onClick={next}
              aria-label="Next screen"
              className="absolute right-3 top-1/2 z-10 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-white/80 shadow-[0_2px_8px_rgba(0,0,0,0.14)] backdrop-blur-sm transition-transform hover:scale-105 active:scale-95"
            >
              <svg viewBox="0 0 20 20" fill="none" className="h-4 w-4 text-ink">
                <path d="M7 4l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </>
        )}
      </div>

      {/* Caption + dots */}
      <div className="mt-3 flex items-start justify-between gap-4">
        <p className="text-[13px] leading-[1.55] text-ink-soft">
          {current.caption ?? ''}
        </p>
        {multi && (
          <div className="mt-[3px] flex flex-shrink-0 items-center gap-[6px]">
            {images.map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setIdx(i)}
                aria-label={`Go to screen ${i + 1}`}
                className="h-[6px] rounded-full transition-all duration-200"
                style={{
                  width: i === idx ? 20 : 6,
                  background: i === idx ? accent : 'rgba(0,0,0,0.18)',
                }}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

// The case study follows the narrative arc of the reference folio
// (adityasalunkhe.com): metadata → overview ("What") → "Why it needed a
// rethink" (the problem) → "Introducing" the solution → the screens woven
// in right after → the outcome → disciplines.
function CaseStudyBody({
  cs,
  accent,
  tags,
  imageGroups,
}: {
  cs: CaseStudy
  accent: string
  tags: string[]
  imageGroups?: Project['imageGroups']
}) {
  return (
    <>
      {/* Metadata row */}
      <div className="mt-9 grid grid-cols-3 gap-6 border-y border-black/[0.08] py-5 max-[640px]:grid-cols-1 max-[640px]:gap-3">
        <Meta label="Role" value={cs.role} />
        <Meta label="Timeline" value={cs.timeline} />
        <Meta label="Platform" value={cs.platform} />
      </div>

      {/* Overview — the "What" — lead summary + hero metric */}
      <div className="mt-10 grid grid-cols-[1fr_auto] items-start gap-12 max-[800px]:grid-cols-1 max-[800px]:gap-8">
        <p className="max-w-[62ch] text-[clamp(18px,2.1vw,23px)] leading-[1.6] text-[#2a2622]">{cs.summary}</p>
        {cs.metric && (
          <div className="flex min-w-[150px] flex-col rounded-[14px] px-5 py-4" style={{ background: `${accent}1a` }}>
            <span className="text-[clamp(30px,4vw,44px)] font-extrabold leading-none tracking-[-0.02em] text-ink">
              {cs.metric.value}
            </span>
            <span className="mt-[7px] text-[12px] font-medium leading-[1.35] text-ink-soft">{cs.metric.label}</span>
          </div>
        )}
      </div>

      {/* Why it needed a rethink — the problem */}
      <Section title="Why it needed a rethink">
        <p className="max-w-[72ch] text-[16px] leading-[1.75] text-[#2a2622]">{cs.problem}</p>
      </Section>

      {/* Introducing — the solution / what I designed */}
      <Section title="The solution">
        <div className="grid grid-cols-2 gap-x-12 gap-y-7 max-[760px]:grid-cols-1 max-[760px]:gap-y-6">
          {cs.approach.map((h, i) => (
            <div key={i} className="border-t border-black/[0.08] pt-4">
              <div className="mb-[6px] flex items-baseline gap-[10px]">
                <span className="font-mono text-[12px] font-bold tabular-nums" style={{ color: accent }}>
                  {String(i + 1).padStart(2, '0')}
                </span>
                <h3 className="text-[16px] font-bold tracking-[-0.01em] text-ink">{h.title}</h3>
              </div>
              <p className="text-[14px] leading-[1.6] text-[#3a352f]">{h.body}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* The screens — woven in right after the solution, like the reference */}
      <Carousels groups={imageGroups} accent={accent} />

      {/* Figma prototype embed */}
      {cs.figmaPrototype && <FigmaEmbed url={cs.figmaPrototype} accent={accent} />}

      {/* The outcome — impact */}
      <Section title="The outcome">
        <ul className="grid max-w-[80ch] grid-cols-1 gap-[14px]">
          {cs.impact.map((it, i) => (
            <li key={i} className="flex items-start gap-[12px] text-[15px] leading-[1.6] text-[#2a2622]">
              <span
                className="mt-[6px] flex h-[16px] w-[16px] flex-shrink-0 items-center justify-center rounded-full text-[10px] font-bold text-white"
                style={{ background: accent }}
                aria-hidden
              >
                ✓
              </span>
              {it}
            </li>
          ))}
        </ul>
      </Section>

      {/* Disciplines */}
      <Section title="Disciplines">
        <div className="flex flex-wrap gap-[7px]">
          {tags.map((t) => (
            <span
              key={t}
              className="rounded-full bg-black/[0.06] px-[12px] py-[6px] font-mono text-[10px] uppercase tracking-[0.08em] text-ink"
            >
              {t}
            </span>
          ))}
        </div>
      </Section>
    </>
  )
}

function FigmaEmbed({ url, accent }: { url: string; accent: string }) {
  const embedUrl = `https://www.figma.com/embed?embed_host=share&url=${encodeURIComponent(url)}`
  return (
    <Section title="Prototype">
      <div className="overflow-hidden rounded-[14px] border border-black/[0.08]" style={{ aspectRatio: '16 / 10' }}>
        <iframe
          src={embedUrl}
          allowFullScreen
          className="h-full w-full"
          title="Figma prototype"
        />
      </div>
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-3 inline-flex items-center gap-[7px] text-[13px] font-semibold"
        style={{ color: accent }}
      >
        <svg viewBox="0 0 38 57" fill="none" className="h-[14px] w-[10px] flex-shrink-0" aria-hidden>
          <path d="M19 28.5A9.5 9.5 0 1 1 28.5 19 9.5 9.5 0 0 1 19 28.5z" fill={accent} />
          <path d="M9.5 57A9.5 9.5 0 0 1 9.5 38H19v9.5A9.5 9.5 0 0 1 9.5 57z" fill="#0ACF83" />
          <path d="M0 47.5A9.5 9.5 0 0 1 9.5 38H19v-9.5H9.5a9.5 9.5 0 0 1 0-19H19V0H9.5a9.5 9.5 0 0 0 0 19H19v9.5H9.5A9.5 9.5 0 0 0 0 47.5z" fill="#F24E1E" />
          <path d="M19 0h9.5a9.5 9.5 0 0 1 0 19H19V0z" fill="#FF7262" />
          <path d="M38 28.5A9.5 9.5 0 1 1 28.5 19 9.5 9.5 0 0 1 38 28.5z" fill="#1ABCFE" />
        </svg>
        Open in Figma
      </a>
    </Section>
  )
}

// Renders one labelled carousel per image group (e.g. "Mo", then "Revee").
function Carousels({ groups, accent }: { groups?: Project['imageGroups']; accent: string }) {
  if (!groups || groups.length === 0) return null
  return (
    <>
      {groups.map((group) => (
        <Section key={group.title} title={group.title}>
          <ImageCarousel images={group.images} label={group.title} accent={accent} aspect={group.aspect} />
        </Section>
      ))}
    </>
  )
}

function SimpleBody({ desc, tags, qLabel }: { desc: string; tags: string[]; qLabel: string }) {
  return (
    <>
      <div className="mb-12 mt-12 h-px bg-black/[0.08]" />
      <div className="grid grid-cols-[1fr_1fr] items-start gap-16 max-[800px]:grid-cols-1">
        <div className="text-[17px] leading-[1.75] text-[#2a2622]">{desc}</div>
        <div className="flex flex-col gap-5">
          <div>
            <label className="mb-[6px] block font-mono text-[9px] font-bold uppercase tracking-[0.18em] text-ink-soft">
              Disciplines
            </label>
            <div className="flex flex-wrap gap-[6px]">
              {tags.map((t) => (
                <span
                  key={t}
                  className="rounded-full bg-black/[0.06] px-[10px] py-[5px] font-mono text-[10px] uppercase tracking-[0.08em] text-ink"
                >
                  {t}
                </span>
              ))}
            </div>
          </div>
          <div>
            <label className="mb-[6px] block font-mono text-[9px] font-bold uppercase tracking-[0.18em] text-ink-soft">
              Quadrant
            </label>
            <div className="text-[14px] leading-[1.5] text-[#2a2622]">{qLabel}</div>
          </div>
        </div>
      </div>
    </>
  )
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mt-14">
      <h2 className="mb-5 font-mono text-[11px] font-bold uppercase tracking-[0.18em] text-ink-soft">{title}</h2>
      {children}
    </section>
  )
}

function Meta({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="mb-[5px] font-mono text-[9px] font-bold uppercase tracking-[0.18em] text-ink-soft">{label}</div>
      <div className="text-[15px] font-semibold text-ink">{value}</div>
    </div>
  )
}
