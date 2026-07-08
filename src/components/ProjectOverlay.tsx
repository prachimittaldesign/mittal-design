import { Fragment, useState } from 'react'
import { quadrant, BIOME } from '../lib/iso'
import type { CaseStudy, LockedPayload, Project } from '../types'
import { TakeoverShell } from './TakeoverShell'
import { CaseStudy as RichCaseStudyView } from './CaseStudy/CaseStudy'
import { LockGate } from './LockGate'

interface ProjectOverlayProps {
  project: Project
  tileRect: DOMRect
  onClose: () => void
}

// An <img> that degrades to a labelled placeholder if the source fails to load
// (e.g. a dropped connection mid-download) instead of a broken-image icon.
function SafeImage({
  src,
  alt,
  className,
}: {
  src: string
  alt: string
  className?: string
}) {
  const [failed, setFailed] = useState(false)
  if (failed) {
    return (
      <div className={`flex items-center justify-center bg-black/[0.04] text-[12px] font-medium text-ink-soft ${className ?? ''}`}>
        <span className="px-4 text-center">Image unavailable — {alt}</span>
      </div>
    )
  }
  return (
    <img
      src={src}
      alt={alt}
      draggable={false}
      loading="lazy"
      decoding="async"
      onError={() => setFailed(true)}
      className={className}
    />
  )
}

export function ProjectOverlay({ project, tileRect, onClose }: ProjectOverlayProps) {
  const q = quadrant(project.gx, project.gy)
  const { fill: accent, label: qLabel } = BIOME[q]
  // Decrypted body for password-gated studies, tagged with the id it belongs to.
  // Related-tile navigation reuses this component instance, so a stale payload
  // from the previous project must read as locked until the new one decrypts.
  const [payload, setPayload] = useState<{ id: string; data: LockedPayload } | null>(null)
  const unlocked = payload && payload.id === project.id ? payload.data : null

  // Password-gated featured studies: only the teaser ships publicly. Until the
  // encrypted blob is fetched + decrypted (LockGate), there is no body in the
  // DOM to reveal. Once unlocked, render the real content — rich or standard —
  // in place, inside the same takeover.
  if (project.locked) {
    const navigate = (id: string) => {
      history.pushState({ project: id }, '', `/projects/${id}`)
      window.dispatchEvent(new PopStateEvent('popstate'))
    }
    return (
      <TakeoverShell bare tileRect={tileRect} accent={accent} onClose={onClose} ariaLabel={`${project.label} case study`}>
        {!unlocked ? (
          <LockGate
            project={project}
            accent={accent}
            qLabel={qLabel}
            onUnlock={(data) => setPayload({ id: project.id, data })}
          />
        ) : unlocked.kind === 'rich' ? (
          <RichCaseStudyView data={unlocked.data} onNavigate={navigate} />
        ) : (
          <div className="px-[min(10vw,96px)] pt-[calc(88px+env(safe-area-inset-top))] pb-[calc(80px+env(safe-area-inset-bottom))]">
            <StandardHeader project={project} cs={unlocked.data} accent={accent} qLabel={qLabel} />
            <CaseStudyBody cs={unlocked.data} accent={accent} tags={project.tags} imageGroups={project.imageGroups} />
          </div>
        )}
      </TakeoverShell>
    )
  }

  return (
    <TakeoverShell tileRect={tileRect} accent={accent} onClose={onClose} ariaLabel={`${project.label} case study`}>
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
          <SafeImage
            key={i}
            src={img.src}
            alt={img.caption ?? `${label} screen ${i + 1}`}
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
              data-tip="Previous screen"
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
              data-tip="Next screen"
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

// Eyebrow + title + context badge for a standard (unlocked) case study — mirrors
// the inline header used by the non-locked overlay path.
function StandardHeader({
  project,
  cs,
  accent,
  qLabel,
}: {
  project: Project
  cs: CaseStudy
  accent: string
  qLabel: string
}) {
  return (
    <>
      <div className="mb-5 flex items-center gap-[10px] font-mono text-[11px] font-bold uppercase tracking-[0.18em] text-ink-soft">
        <span className="h-[3px] w-[28px] flex-shrink-0 rounded-[2px]" style={{ background: accent }} />
        {qLabel} · {project.sub}
      </div>
      <div className="flex flex-wrap items-end gap-x-5 gap-y-3">
        <h1 className="text-[clamp(40px,7vw,80px)] font-extrabold leading-[0.95] tracking-[-0.03em] text-ink">
          {project.label}
        </h1>
        {cs.context && (
          <span
            className="mb-[10px] inline-flex items-center gap-[7px] rounded-full px-[12px] py-[6px] text-[12px] font-semibold text-ink"
            style={{ background: `${accent}22` }}
          >
            <span className="h-[6px] w-[6px] rounded-full" style={{ background: accent }} />
            {cs.context}
          </span>
        )}
      </div>
    </>
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

      {/* What / Who / How — scannable overview */}
      {cs.tldr && (
        <div className="mt-8 grid grid-cols-3 gap-4 max-[760px]:grid-cols-1">
          {([['What', cs.tldr.what], ['Who', cs.tldr.who], ['How', cs.tldr.how]] as const).map(([k, v]) => (
            <div key={k} className="rounded-[12px] border border-black/[0.07] p-[18px]">
              <div className="mb-[9px] font-mono text-[10px] font-bold uppercase tracking-[0.16em]" style={{ color: accent }}>
                {k}
              </div>
              <p className="text-[13.5px] leading-[1.55] text-[#2a2622]">{v}</p>
            </div>
          ))}
        </div>
      )}

      {/* Stat band */}
      {cs.stats && cs.stats.length > 0 && <StatBand stats={cs.stats} accent={accent} />}

      {/* Why it needed a rethink — the problem */}
      <Section title="Why it needed a rethink">
        {cs.problem.split('\n\n').map((para, i) => (
          <p key={i} className="mt-4 max-w-[72ch] text-[16px] leading-[1.75] text-[#2a2622] first:mt-0">{para}</p>
        ))}
      </Section>

      {/* The screens — surfaced early so the product is visible without a long scroll */}
      <Carousels groups={imageGroups} accent={accent} />

      {/* Competitive matrix — the differentiation infographic */}
      {cs.comparison && <ComparisonMatrix data={cs.comparison} accent={accent} />}

      {/* Discovery & Research */}
      {cs.research && cs.research.length > 0 && (
        <Section title="Discovery & Research">
          <div className="grid grid-cols-2 gap-5 max-[760px]:grid-cols-1">
            {cs.research.map((r, i) => (
              <div key={i} className="rounded-[10px] p-5" style={{ background: `${accent}10` }}>
                <h3 className="mb-[8px] text-[13px] font-bold tracking-[-0.01em] text-ink">{r.label}</h3>
                <p className="text-[13px] leading-[1.65] text-[#3a352f]">{r.body}</p>
              </div>
            ))}
          </div>
        </Section>
      )}

      {/* Who it's for — personas */}
      {cs.users && cs.users.length > 0 && (
        <Section title="Who it's for">
          <div className="grid grid-cols-3 gap-8 max-[760px]:grid-cols-1">
            {cs.users.map((u, i) => (
              <div key={i} className="flex flex-col gap-3 border-t-2 pt-5" style={{ borderColor: accent }}>
                <h3 className="text-[15px] font-bold tracking-[-0.01em] text-ink">{u.role}</h3>
                <p className="flex-1 text-[13px] leading-[1.6] text-[#3a352f]">{u.description}</p>
                <div>
                  <div className="mb-[5px] font-mono text-[9px] font-bold uppercase tracking-[0.16em] text-ink-soft">
                    Primary need
                  </div>
                  <p className="text-[13px] font-medium leading-[1.5] text-ink">{u.needs}</p>
                </div>
              </div>
            ))}
          </div>
        </Section>
      )}

      {/* Design process — phases between problem and solution */}
      {cs.process && cs.process.length > 0 && (
        <Section title="Process">
          {/* Horizontal phase arc */}
          <div className="mb-8 flex items-center overflow-x-auto pb-1">
            {cs.process.map((p, i) => (
              <Fragment key={i}>
                <div className="flex flex-shrink-0 flex-col items-center gap-[6px]">
                  <div
                    className="flex h-8 w-8 items-center justify-center rounded-full text-[10px] font-bold text-white shadow-sm"
                    style={{ background: accent }}
                  >
                    {String(i + 1).padStart(2, '0')}
                  </div>
                  <span className="font-mono text-[9px] font-bold uppercase tracking-[0.14em] text-ink">
                    {p.phase}
                  </span>
                </div>
                {i < cs.process!.length - 1 && (
                  <div
                    className="mx-2 h-[2px] min-w-[24px] flex-1 rounded-full"
                    style={{ background: `${accent}35` }}
                  />
                )}
              </Fragment>
            ))}
          </div>
          {/* Phase detail cards */}
          <div className="grid grid-cols-2 gap-x-12 gap-y-7 max-[760px]:grid-cols-1 max-[760px]:gap-y-6">
            {cs.process.map((p, i) => (
              <div key={i} className="border-t border-black/[0.08] pt-4">
                <div className="mb-[6px] flex items-baseline gap-[10px]">
                  <span className="font-mono text-[12px] font-bold tabular-nums" style={{ color: accent }}>
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <h3 className="text-[15px] font-bold tracking-[-0.01em] text-ink">{p.phase}</h3>
                </div>
                <p className="text-[14px] leading-[1.6] text-[#3a352f]">{p.body}</p>
              </div>
            ))}
          </div>
        </Section>
      )}

      {/* Canvas anatomy — labeled breakdown that explains the core surface */}
      {cs.anatomy && <CanvasAnatomy data={cs.anatomy} accent={accent} />}

      {/* Introducing — the solution / what I designed */}
      <Section title="What I designed">
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

      {/* Signature interaction flow diagram */}
      {cs.flow && <FlowDiagram flow={cs.flow} accent={accent} />}

      {/* Before/after concept diagram */}
      {cs.beforeAfter && <BeforeAfter data={cs.beforeAfter} accent={accent} />}

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

      {/* Reflection */}
      {cs.reflection && (
        <Section title="Reflection">
          <p className="max-w-[68ch] text-[15px] italic leading-[1.8] text-[#3a352f]">{cs.reflection}</p>
        </Section>
      )}
    </>
  )
}

// ---- Infographic primitives ------------------------------------------------

function CheckMark({ color }: { color: string }) {
  return (
    <svg viewBox="0 0 20 20" className="inline-block h-[17px] w-[17px] flex-shrink-0 align-middle" fill="none" aria-label="yes">
      <circle cx="10" cy="10" r="9" fill={color} />
      <path d="M6 10.5l2.5 2.5L14 7.5" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}
function DashMark() {
  return (
    <svg viewBox="0 0 20 20" className="inline-block h-[17px] w-[17px] align-middle" fill="none" aria-label="no">
      <circle cx="10" cy="10" r="9" fill="rgba(0,0,0,0.06)" />
      <path d="M6.5 10h7" stroke="rgba(0,0,0,0.32)" strokeWidth="2" strokeLinecap="round" />
    </svg>
  )
}

// Big-number callout row. Equal columns, hairline dividers between cells.
function StatBand({ stats, accent }: { stats: NonNullable<CaseStudy['stats']>; accent: string }) {
  return (
    <div
      className="mt-8 grid gap-3 max-[760px]:grid-cols-2"
      style={{ gridTemplateColumns: `repeat(${stats.length}, minmax(0, 1fr))` }}
    >
      {stats.map((s, i) => (
        <div key={i} className="rounded-[12px] px-4 py-[18px]" style={{ background: `${accent}12` }}>
          <div className="text-[clamp(22px,2.6vw,30px)] font-extrabold leading-none tracking-[-0.02em] text-ink">
            {s.value}
          </div>
          <div className="mt-[8px] text-[12px] leading-[1.4] text-ink-soft">{s.label}</div>
        </div>
      ))}
    </div>
  )
}

// Capability comparison matrix — the differentiation infographic.
function ComparisonMatrix({ data, accent }: { data: NonNullable<CaseStudy['comparison']>; accent: string }) {
  return (
    <Section title={data.title ?? "Why it's different"}>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[560px] border-collapse">
          <thead>
            <tr>
              <th className="w-[40%] p-[10px]" />
              {data.columns.map((c, i) => (
                <th key={c} className="p-[10px] align-bottom">
                  {i === 0 ? (
                    <span
                      className="inline-block rounded-full px-[12px] py-[5px] text-[12px] font-bold text-white"
                      style={{ background: accent }}
                    >
                      {c}
                    </span>
                  ) : (
                    <span className="text-[12px] font-semibold text-ink-soft">{c}</span>
                  )}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.rows.map((r) => (
              <tr key={r.label} className="border-t border-black/[0.08]">
                <td className="py-[12px] pr-3 text-[13.5px] font-semibold leading-[1.4] text-ink">{r.label}</td>
                {r.cells.map((on, i) => (
                  <td
                    key={i}
                    className="py-[12px] text-center"
                    style={i === 0 ? { background: `${accent}0d` } : undefined}
                  >
                    {on ? <CheckMark color={i === 0 ? accent : '#9a948c'} /> : <DashMark />}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {data.caption && <p className="mt-4 max-w-[80ch] text-[13px] leading-[1.6] text-ink-soft">{data.caption}</p>}
    </Section>
  )
}

// Labeled anatomy diagram — breaks a core surface into named panels.
function CanvasAnatomy({ data, accent }: { data: NonNullable<CaseStudy['anatomy']>; accent: string }) {
  return (
    <Section title={data.title}>
      {data.toggles && data.toggles.length > 0 && (
        <div className="mb-4 inline-flex rounded-[10px] border border-black/[0.1] p-[3px]">
          {data.toggles.map((t, i) => (
            <span
              key={t}
              className={[
                'rounded-[7px] px-[14px] py-[6px] text-[12px] font-semibold',
                i === 0 ? 'text-white' : 'text-ink-soft',
              ].join(' ')}
              style={i === 0 ? { background: accent } : undefined}
            >
              {t}
            </span>
          ))}
        </div>
      )}
      <div className="grid grid-cols-3 gap-3 max-[760px]:grid-cols-1">
        {data.panels.map((p, i) => (
          <div key={i} className="rounded-[12px] border border-black/[0.1] bg-black/[0.015] p-[18px]">
            <div className="mb-[3px] text-[15px] font-bold tracking-[-0.01em] text-ink">{p.label}</div>
            <div className="mb-[14px] font-mono text-[10px] font-bold uppercase tracking-[0.14em]" style={{ color: accent }}>
              {p.role}
            </div>
            <ul className="flex flex-col gap-[8px]">
              {p.items?.map((it, j) => (
                <li key={j} className="flex items-center gap-[9px] text-[13px] text-[#3a352f]">
                  <span className="h-[5px] w-[5px] flex-shrink-0 rounded-full" style={{ background: accent }} />
                  {it}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      {data.caption && <p className="mt-4 max-w-[80ch] text-[13px] leading-[1.6] text-ink-soft">{data.caption}</p>}
    </Section>
  )
}

// Numbered horizontal step-flow diagram with connecting arrows.
function FlowDiagram({ flow, accent }: { flow: NonNullable<CaseStudy['flow']>; accent: string }) {
  return (
    <Section title={flow.title}>
      <div className="flex items-stretch overflow-x-auto pb-2">
        {flow.steps.map((s, i) => (
          <Fragment key={i}>
            <div className="flex min-w-[150px] flex-1 flex-col rounded-[12px] border border-black/[0.1] p-[16px]">
              <div
                className="mb-[10px] flex h-7 w-7 items-center justify-center rounded-full text-[12px] font-bold text-white"
                style={{ background: accent }}
              >
                {i + 1}
              </div>
              <h4 className="mb-[5px] text-[13.5px] font-bold leading-[1.3] tracking-[-0.01em] text-ink">{s.title}</h4>
              {s.detail && <p className="text-[12px] leading-[1.5] text-ink-soft">{s.detail}</p>}
            </div>
            {i < flow.steps.length - 1 && (
              <div className="flex flex-shrink-0 items-center px-[6px]" aria-hidden>
                <svg viewBox="0 0 16 16" className="h-4 w-4" fill="none">
                  <path d="M3 8h9M9 4l4 4-4 4" stroke={accent} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
            )}
          </Fragment>
        ))}
      </div>
      {flow.caption && <p className="mt-3 max-w-[80ch] text-[13px] leading-[1.6] text-ink-soft">{flow.caption}</p>}
    </Section>
  )
}

// Before/after concept diagram — two columns with an arrow between.
function BeforeAfter({ data, accent }: { data: NonNullable<CaseStudy['beforeAfter']>; accent: string }) {
  const Col = ({ col, after }: { col: { label: string; points: string[] }; after: boolean }) => (
    <div
      className="flex-1 rounded-[14px] border p-5"
      style={after ? { borderColor: accent, background: `${accent}0d` } : { borderColor: 'rgba(0,0,0,0.1)' }}
    >
      <div
        className="mb-[14px] font-mono text-[10px] font-bold uppercase tracking-[0.16em]"
        style={{ color: after ? accent : '#9a948c' }}
      >
        {after ? 'After' : 'Before'}
      </div>
      <div className="mb-[12px] text-[15px] font-bold tracking-[-0.01em] text-ink">{col.label}</div>
      <ul className="flex flex-col gap-[8px]">
        {col.points.map((p, i) => (
          <li key={i} className="flex items-center gap-[9px] text-[13px] text-[#3a352f]">
            {after ? (
              <CheckMark color={accent} />
            ) : (
              <span className="h-[5px] w-[5px] flex-shrink-0 rounded-full bg-black/25" />
            )}
            {p}
          </li>
        ))}
      </ul>
    </div>
  )
  return (
    <Section title={data.title}>
      <div className="flex items-center gap-3 max-[760px]:flex-col max-[760px]:items-stretch">
        <Col col={data.before} after={false} />
        <svg viewBox="0 0 24 24" className="h-6 w-6 flex-shrink-0 max-[760px]:rotate-90" fill="none" aria-hidden>
          <path d="M4 12h14M13 6l6 6-6 6" stroke={accent} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        <Col col={data.after} after={true} />
      </div>
      {data.caption && <p className="mt-4 max-w-[80ch] text-[13px] leading-[1.6] text-ink-soft">{data.caption}</p>}
    </Section>
  )
}

function FigmaEmbed({ url, accent }: { url: string; accent: string }) {
  return (
    <Section title="Prototype">
      <div className="overflow-hidden rounded-[14px] border border-black/[0.08]" style={{ aspectRatio: '16 / 10' }}>
        <iframe
          src={url}
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
      {groups.map((group) =>
        group.layout === 'stack' ? (
          <Section key={group.title} title={group.title}>
            <div className="flex flex-col gap-8">
              {group.images.map((img, i) => (
                <div key={i}>
                  <SafeImage
                    src={img.src}
                    alt={img.caption ?? `${group.title} screen ${i + 1}`}
                    className="w-full rounded-[12px] object-contain"
                  />
                  {img.caption && (
                    <p className="mt-3 text-[13px] leading-[1.55] text-ink-soft">{img.caption}</p>
                  )}
                </div>
              ))}
            </div>
          </Section>
        ) : (
          <Section key={group.title} title={group.title}>
            <ImageCarousel images={group.images} label={group.title} accent={accent} aspect={group.aspect} />
          </Section>
        )
      )}
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
