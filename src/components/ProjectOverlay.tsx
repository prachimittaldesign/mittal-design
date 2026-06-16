import { quadrant, BIOME } from '../lib/iso'
import type { CaseStudy, Project } from '../types'
import { TakeoverShell } from './TakeoverShell'

interface ProjectOverlayProps {
  project: Project
  tileRect: DOMRect
  onClose: () => void
}

// Full-screen "takeover" for a project: the clicked building expands into an
// immersive project page. Featured projects render a full case study; the rest
// fall back to a compact summary.
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
        <CaseStudyBody cs={project.caseStudy} accent={accent} tags={project.tags} label={project.label} />
      ) : (
        <SimpleBody desc={project.desc} tags={project.tags} qLabel={qLabel} />
      )}
    </TakeoverShell>
  )
}

function CaseStudyBody({ cs, accent, tags, label }: { cs: CaseStudy; accent: string; tags: string[]; label: string }) {
  return (
    <>
      {/* Metadata row */}
      <div className="mt-9 grid grid-cols-3 gap-6 border-y border-black/[0.08] py-5 max-[640px]:grid-cols-1 max-[640px]:gap-3">
        <Meta label="Role" value={cs.role} />
        <Meta label="Timeline" value={cs.timeline} />
        <Meta label="Platform" value={cs.platform} />
      </div>

      {/* Lead summary + hero metric */}
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

      {/* The problem */}
      <Section title="The problem">
        <p className="max-w-[72ch] text-[16px] leading-[1.75] text-[#2a2622]">{cs.problem}</p>
      </Section>

      {/* What I designed */}
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

      {/* Screens */}
      {cs.images && cs.images.length > 0 && (
        <Section title="Screens">
          <div className="space-y-10">
            {cs.images.map((img, i) => (
              <figure key={i}>
                <img
                  src={img.src}
                  alt={img.caption ?? `${label} screen ${i + 1}`}
                  className="w-full rounded-[12px] object-cover"
                />
                {img.caption && (
                  <figcaption className="mt-3 text-[13px] leading-[1.55] text-ink-soft">
                    {img.caption}
                  </figcaption>
                )}
              </figure>
            ))}
          </div>
        </Section>
      )}

      {/* Impact */}
      <Section title="Impact">
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

