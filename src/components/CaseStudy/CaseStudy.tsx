import { useEffect, useRef, useState, type ReactNode } from 'react'
import { createPortal } from 'react-dom'
import { csImage, type CSModal, type RichCaseStudy } from '../../data/caseStudyTypes'
import { PROJECTS } from '../../data/projects'
import './caseStudy.css'

/**
 * <CaseStudy> — the Apple-style case-study layout (case-study-template.html)
 * as a data-driven React component. Renders inside the existing fullscreen
 * takeover (TakeoverShell bare mode), one section per schema key; absent keys
 * are skipped. The visual design lives in caseStudy.css, a scoped port of the
 * template's stylesheet — the template remains the design reference.
 */

interface CaseStudyProps {
  data: RichCaseStudy
  /** Navigate to a related project (repo project id). */
  onNavigate?: (projectId: string) => void
}

// ---- rich text: **bold** → <strong>, *italic* → <em> -----------------------
function rich(text: string): ReactNode[] {
  const out: ReactNode[] = []
  const re = /(\*\*[^*]+\*\*|\*[^*]+\*)/g
  let last = 0
  let key = 0
  let m: RegExpExecArray | null
  while ((m = re.exec(text))) {
    if (m.index > last) out.push(text.slice(last, m.index))
    const tok = m[0]
    if (tok.startsWith('**')) out.push(<strong key={key++}>{tok.slice(2, -2)}</strong>)
    else out.push(<em key={key++}>{tok.slice(1, -1)}</em>)
    last = m.index + tok.length
  }
  if (last < text.length) out.push(text.slice(last))
  return out
}

// ---- screenshots ------------------------------------------------------------
function Shot({ cs, id, eager = false }: { cs: RichCaseStudy; id: string | null | undefined; eager?: boolean }) {
  const img = csImage(cs, id)
  if (!img) return null
  if (img.status === 'planned') {
    return <div className="shot--planned">Screenshot coming soon — {img.feature}</div>
  }
  return (
    <div className="shot">
      <img src={img.src} alt={img.alt} loading={eager ? 'eager' : 'lazy'} />
    </div>
  )
}

// ---- section modal ("Learn more" takeover) ----------------------------------
function SectionModal({ cs, modal, onClose }: { cs: RichCaseStudy; modal: CSModal; onClose: () => void }) {
  const closeRef = useRef<HTMLButtonElement>(null)
  useEffect(() => {
    closeRef.current?.focus()
    // Capture phase + stopPropagation: Escape closes THIS modal without also
    // closing the TakeoverShell underneath (whose listener is bubble-phase).
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.stopPropagation()
        onClose()
      }
    }
    window.addEventListener('keydown', onKey, true)
    return () => window.removeEventListener('keydown', onKey, true)
  }, [onClose])

  return createPortal(
    <div className="cs">
      <div className="modal" role="dialog" aria-modal="true" aria-label={modal.title}>
        <button ref={closeRef} className="modal__close" onClick={onClose} aria-label="Close">
          ✕
        </button>
        <div className="modal__body">
          <h2>{modal.title}</h2>
          {modal.image && (
            <div className="modal__fig">
              <Shot cs={cs} id={modal.image} />
            </div>
          )}
          {modal.sections.map((s) => (
            <div key={s.heading}>
              <h3>{s.heading}</h3>
              <p>{rich(s.body)}</p>
            </div>
          ))}
        </div>
      </div>
    </div>,
    document.body,
  )
}

// ---- comparison mark ---------------------------------------------------------
function Mark({ value }: { value: boolean | null }) {
  if (value === true) return <span className="mk mk-yes" role="img" aria-label="Yes">✓</span>
  if (value === null)
    return (
      <>
        <span className="mk mk-no" role="img" aria-label="Not documented">—</span>
        <sup className="ast">*</sup>
      </>
    )
  return <span className="mk mk-no" role="img" aria-label="No">—</span>
}

const COUNT_WORDS = ['zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten', 'eleven', 'twelve']

export function CaseStudy({ data, onNavigate }: CaseStudyProps) {
  const rootRef = useRef<HTMLDivElement>(null)
  const hlRef = useRef<HTMLDivElement>(null)
  const [hlAt, setHlAt] = useState<'start' | 'mid' | 'end'>('start')
  const [lookTheme, setLookTheme] = useState('light')
  const [modal, setModal] = useState<CSModal | null>(null)
  const [impactOn, setImpactOn] = useState(false)
  const [current, setCurrent] = useState('')

  // Scroll reveal — same IO recipe as the template.
  useEffect(() => {
    const root = rootRef.current
    if (!root) return
    const els = Array.from(root.querySelectorAll('.reveal'))
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduce || !('IntersectionObserver' in window)) {
      els.forEach((el) => el.classList.add('in'))
      return
    }
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add('in')
            io.unobserve(e.target)
          }
        })
      },
      { rootMargin: '0px 0px -12% 0px', threshold: 0.08 },
    )
    els.forEach((el) => io.observe(el))
    return () => io.disconnect()
  }, [data])

  // Impact bars animate when scrolled into view.
  useEffect(() => {
    const root = rootRef.current
    if (!root || !data.impact) return
    const el = root.querySelector('#cs-impact')
    if (!el) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches || !('IntersectionObserver' in window)) {
      setImpactOn(true)
      return
    }
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && (setImpactOn(true), io.unobserve(e.target))),
      { threshold: 0.35 },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [data])

  // Nav: current-section highlight.
  useEffect(() => {
    const root = rootRef.current
    if (!root || !('IntersectionObserver' in window)) return
    const sections = Array.from(root.querySelectorAll('[data-cs-section]'))
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && setCurrent(e.target.id)),
      { rootMargin: '-45% 0px -50% 0px' },
    )
    sections.forEach((s) => io.observe(s))
    return () => io.disconnect()
  }, [data])

  // Highlights scroller arrows.
  const hlStep = (dir: 1 | -1) => {
    const el = hlRef.current
    if (!el) return
    const card = el.querySelector('.hl__card') as HTMLElement | null
    el.scrollBy({ left: dir * ((card?.offsetWidth ?? 400) + 18), behavior: 'smooth' })
  }
  const syncHl = () => {
    const el = hlRef.current
    if (!el) return
    const atStart = el.scrollLeft < 8
    const atEnd = el.scrollLeft + el.clientWidth > el.scrollWidth - 8
    setHlAt(atStart ? 'start' : atEnd ? 'end' : 'mid')
  }

  const goTo = (id: string) => {
    rootRef.current?.querySelector(`#${id}`)?.scrollIntoView({
      behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth',
    })
  }

  const { meta, hero } = data
  const navItems = [
    { id: 'cs-highlights', label: 'Overview' },
    ...(data.impact ? [{ id: 'cs-impact', label: 'Impact' }] : []),
    ...(data.designSystem ? [{ id: 'cs-system', label: 'System' }] : []),
    ...(data.process ? [{ id: 'cs-process', label: 'Process' }] : []),
    ...(data.role ? [{ id: 'cs-role', label: 'Role' }] : []),
  ]
  const related = (data.related ?? [])
    .map((slug) => PROJECTS.find((p) => p.id === slug))
    .filter((p): p is NonNullable<typeof p> => !!p)

  return (
    <div className="cs" ref={rootRef}>
      <span id="cs-top" />

      {/* ---- local nav ---- */}
      <nav className="localnav" aria-label="Case study">
        <div className="localnav__in">
          <a
            className="localnav__brand"
            href="#cs-top"
            onClick={(e) => {
              e.preventDefault()
              goTo('cs-top')
            }}
          >
            {meta.name}
          </a>
          <div className="localnav__links">
            {navItems.map((n) => (
              <a
                key={n.id}
                href={`#${n.id}`}
                aria-current={current === n.id ? 'true' : 'false'}
                onClick={(e) => {
                  e.preventDefault()
                  goTo(n.id)
                }}
              >
                {n.label}
              </a>
            ))}
          </div>
          {meta.liveUrl && (
            <a className="localnav__cta" href={meta.liveUrl} target="_blank" rel="noopener noreferrer">
              View live&nbsp;↗
            </a>
          )}
        </div>
      </nav>

      <main>
        {/* ---- 1 · hero ---- */}
        <header className="hero">
          <p className="eyebrow reveal">{hero.eyebrow}</p>
          <h1 className="h-hero reveal">{hero.title}</h1>
          <p className="hero__tag reveal">{hero.tagline}</p>
          {hero.cta.url && (
            <div className="reveal" style={{ display: 'flex', gap: 26, justifyContent: 'center', flexWrap: 'wrap' }}>
              <a className="btn" href={hero.cta.url} target="_blank" rel="noopener noreferrer">
                {hero.cta.label}&nbsp;↗
              </a>
            </div>
          )}
          <div className="hero__visual reveal">
            <Shot cs={data} id={hero.image} eager />
          </div>
        </header>

        {/* ---- 2 · highlights ---- */}
        <section className="section" id="cs-highlights" data-cs-section style={{ paddingBottom: 'calc(var(--pad) - 30px)', scrollMarginTop: 64 }}>
          <div className="hl__head reveal">
            <h2 className="h-sect">Get the highlights.</h2>
            <div className="hl__arrows">
              <button className="arrow" onClick={() => hlStep(-1)} disabled={hlAt === 'start'} aria-label="Previous">‹</button>
              <button className="arrow" onClick={() => hlStep(1)} disabled={hlAt === 'end'} aria-label="Next">›</button>
            </div>
          </div>
          <div className="hl__scroller" ref={hlRef} onScroll={syncHl}>
            {data.highlights.map((h) => (
              <article className="hl__card" key={h.title}>
                <span className="k">{h.kicker}</span>
                <h3>{h.title}</h3>
                <p>{rich(h.body)}</p>
              </article>
            ))}
          </div>
        </section>

        {/* ---- 3 · closer look ---- */}
        {data.closerLook && data.closerLook.items.length > 0 && (
          <section className="section section--gray center" id="cs-look" style={{ scrollMarginTop: 64 }}>
            <div className="wrap reveal">
              <h2 className="h-sect">Take a closer look.</h2>
              {data.closerLook.themes.length > 1 && (
                <div className="toggle" role="group" aria-label="Theme">
                  {data.closerLook.themes.map((t) => (
                    <button key={t} aria-pressed={lookTheme === t} onClick={() => setLookTheme(t)}>
                      {t[0].toUpperCase() + t.slice(1)}
                    </button>
                  ))}
                </div>
              )}
            </div>
            <div className="look__scroller" data-ui={lookTheme}>
              {data.closerLook.items.map((item) => (
                <figure className="look__item" key={item.image}>
                  <Shot cs={data} id={item.image} />
                  <figcaption className="look__cap">{item.caption}</figcaption>
                </figure>
              ))}
            </div>
          </section>
        )}

        {/* ---- 4 · flagship feature ---- */}
        {data.flagship && (
          <section className="section" id="cs-feature" data-cs-section style={{ scrollMarginTop: 64 }}>
            <div className="wrap--wide reveal" style={{ margin: '0 auto' }}>
              <div className="feat">
                <div>
                  <p className="eyebrow">{data.flagship.eyebrow}</p>
                  <h2 className="h-sub" style={{ marginBottom: 22 }}>{data.flagship.headline}</h2>
                  <p className="lead">{rich(data.flagship.lead)}</p>
                  <div className="stats-row">
                    {data.flagship.stats.map((s) => (
                      <div className="stat" key={s.label}>
                        <div className="num">{s.num}</div>
                        <div className="lbl">{s.label}</div>
                      </div>
                    ))}
                  </div>
                  {data.flagship.modal && (
                    <div className="row-cta">
                      <button className="tlink" onClick={() => setModal(data.flagship!.modal!)}>
                        See how it works
                      </button>
                    </div>
                  )}
                </div>
                <div className="feat__media">
                  <Shot cs={data} id={data.flagship.image} />
                </div>
              </div>
            </div>
          </section>
        )}

        {/* ---- 5 · impact bars ---- */}
        {data.impact && (
          <section className="section section--dark" id="cs-impact" data-cs-section style={{ scrollMarginTop: 64 }}>
            <div className={`wrap reveal${impactOn ? ' is-animated' : ''}`}>
              <p className="eyebrow">{data.impact.eyebrow}</p>
              <h2 className="h-sect" style={{ maxWidth: '16ch' }}>{data.impact.headline}</h2>
              {data.impact.note && <p className="lead" style={{ maxWidth: '68ch' }}>{rich(data.impact.note)}</p>}
              <div className="bars">
                {data.impact.bars.map((b) => (
                  <div className="bar" key={b.label}>
                    <div className="bar__top">
                      <b>{b.label}</b>
                      <span>
                        <span style={{ color: '#a1a1a6' }}>{b.before}&nbsp;→&nbsp;</span>
                        <span className="delta">{b.after}</span>
                      </span>
                    </div>
                    <div className="bar__track">
                      <div className="bar__before" style={{ '--b': `${b.beforePct}%` } as React.CSSProperties} />
                      <div className="bar__after" style={{ '--a': `${b.afterPct}%` } as React.CSSProperties} />
                    </div>
                  </div>
                ))}
                <div className="bar__legend">
                  <span><i className="dot dot--b" />Before</span>
                  <span><i className="dot dot--a" />After</span>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* ---- 6 · metrics band ---- */}
        {data.metrics && data.metrics.length > 0 && (
          <section className="section" id="cs-metrics" style={{ scrollMarginTop: 64 }}>
            <div className="wrap--wide reveal" style={{ margin: '0 auto' }}>
              <h2 className="h-sect center" style={{ maxWidth: '18ch', margin: '0 auto' }}>
                A project in {COUNT_WORDS[data.metrics.length] ?? data.metrics.length} numbers.
              </h2>
              <div className="metrics">
                {data.metrics.map((m) => (
                  <div className="metric" key={m.label}>
                    <div className="m-num">{m.num}</div>
                    <div className="m-lbl">{m.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* ---- 7 · design system ---- */}
        {data.designSystem && (
          <section className="section section--gray" id="cs-system" data-cs-section style={{ scrollMarginTop: 64 }}>
            <div className="wrap reveal">
              <p className="eyebrow">{data.designSystem.eyebrow}</p>
              <h2 className="h-sub" style={{ marginBottom: 22 }}>{data.designSystem.headline}</h2>
              {data.designSystem.lead && <p className="lead">{rich(data.designSystem.lead)}</p>}
              <div className="trio">
                {data.designSystem.cards.map((c) => (
                  <div className="trio__card" key={c.title}>
                    {c.image && (
                      <div className="fig">
                        <Shot cs={data} id={c.image} />
                      </div>
                    )}
                    <h3>{c.title}</h3>
                    <p>{rich(c.body)}</p>
                  </div>
                ))}
              </div>
              {data.designSystem.modal && (
                <div className="row-cta">
                  <button className="tlink" onClick={() => setModal(data.designSystem!.modal!)}>
                    Explore the system
                  </button>
                </div>
              )}
            </div>
          </section>
        )}

        {/* ---- 8 · AI / intelligence layer ---- */}
        {data.aiLayer && (
          <section className="section section--dark" id="cs-ai" style={{ scrollMarginTop: 64 }}>
            <div className="wrap reveal">
              <p className="eyebrow">{data.aiLayer.eyebrow}</p>
              <h2 className="h-sub" style={{ marginBottom: 22 }}>{data.aiLayer.headline}</h2>
              {data.aiLayer.lead && <p className="lead">{rich(data.aiLayer.lead)}</p>}
              <div className="cards3">
                {data.aiLayer.cards.map((c) => (
                  <article className="icard" key={c.title}>
                    {c.image && (
                      <div className="fig">
                        <Shot cs={data} id={c.image} />
                      </div>
                    )}
                    <div className="icard__txt">
                      <h3>{c.title}</h3>
                      <p>{rich(c.body)}</p>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* ---- 9 · process ---- */}
        {data.process && (
          <section className="section section--gray" id="cs-process" data-cs-section style={{ scrollMarginTop: 64 }}>
            <div className="wrap reveal">
              <p className="eyebrow">{data.process.eyebrow}</p>
              <h2 className="h-sub" style={{ marginBottom: 20 }}>{data.process.headline}</h2>
              <p className="lead">{rich(data.process.lead)}</p>
              <div className="steps">
                {data.process.steps.map((s) => (
                  <div className="step" key={s.no}>
                    <div className="no">{s.no}</div>
                    <div>
                      <h3>{s.title}</h3>
                      <p>{rich(s.body)}</p>
                    </div>
                  </div>
                ))}
              </div>
              {data.process.modal && (
                <div className="row-cta">
                  <button className="tlink" onClick={() => setModal(data.process!.modal!)}>
                    See the process in detail
                  </button>
                </div>
              )}
            </div>
          </section>
        )}

        {/* ---- 10 · key interactions ---- */}
        {data.interactions && (
          <section className="section" id="cs-interactions" style={{ scrollMarginTop: 64 }}>
            <div className="wrap--wide reveal" style={{ margin: '0 auto' }}>
              <p className="eyebrow center">{data.interactions.eyebrow}</p>
              <h2 className="h-sect center" style={{ maxWidth: '20ch', margin: '0 auto 8px' }}>{data.interactions.headline}</h2>
              <div className="cards3">
                {data.interactions.cards.map((c) => (
                  <article className="icard" key={c.title}>
                    {c.image && (
                      <div className="fig">
                        <Shot cs={data} id={c.image} />
                      </div>
                    )}
                    <div className="icard__txt">
                      <h3>{c.title}</h3>
                      <p>{rich(c.body)}</p>
                    </div>
                  </article>
                ))}
              </div>
              {data.interactions.signatureFlow && data.interactions.signatureFlow.length > 0 && (
                <div className="sigflow reveal" aria-label="Signature interaction, step by step">
                  {data.interactions.signatureFlow.map((step, i) => (
                    <span key={step} style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
                      <span className="sigflow__step">
                        <span className="sigflow__no">{i + 1}</span>
                        {step}
                      </span>
                      {i < data.interactions!.signatureFlow!.length - 1 && <span className="sigflow__arrow">›</span>}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </section>
        )}

        {/* ---- 11 · capabilities: comparison matrix or icon grid ---- */}
        {data.capabilities?.type === 'comparison' && (
          <section className="section section--gray" id="cs-capabilities" style={{ scrollMarginTop: 64 }}>
            <div className="wrap reveal">
              <p className="eyebrow center">How it compares</p>
              <h2 className="h-sect center" style={{ maxWidth: '15ch', margin: '0 auto 10px' }}>{data.capabilities.headline}</h2>
              <div className="cmp" role="region" aria-label="Feature comparison" tabIndex={0}>
                <table className="cmp__table">
                  <caption className="visually-hidden">
                    Feature comparison: {data.capabilities.competitors[0]} versus {data.capabilities.competitors.slice(1).join(', ')}
                  </caption>
                  <thead>
                    <tr>
                      <th scope="col" className="cmp__feat-h"><span className="visually-hidden">Capability</span></th>
                      {data.capabilities.competitors.map((c, i) => (
                        <th scope="col" key={c} className={i === 0 ? 'cmp__col cmp__col--us' : 'cmp__col'}>{c}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {data.capabilities.rows.map((row) => (
                      <tr key={row.feature}>
                        <th scope="row" className="cmp__feat">{row.feature}</th>
                        {row.values.map((v, i) => (
                          <td key={i} className={i === 0 ? 'cmp__cell cmp__cell--us' : undefined}>
                            <Mark value={v} />
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {data.capabilities.note && <p className="cmp__note">{data.capabilities.note}</p>}
            </div>
          </section>
        )}
        {data.capabilities?.type === 'grid' && (
          <section className="section section--gray" id="cs-capabilities" style={{ scrollMarginTop: 64 }}>
            <div className="wrap reveal">
              {data.capabilities.headline && (
                <h2 className="h-sect center" style={{ maxWidth: '18ch', margin: '0 auto' }}>{data.capabilities.headline}</h2>
              )}
              <div className="caps">
                {data.capabilities.items.map((item) => (
                  <div className="cap" key={item.title}>
                    <h3>{item.title}</h3>
                    <p>{rich(item.body)}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* ---- 12 · tech & handoff ---- */}
        {data.techHandoff && (
          <section className="section" id="cs-tech" style={{ scrollMarginTop: 64 }}>
            <div className="wrap reveal">
              <div className="feat">
                <div>
                  <p className="eyebrow">{data.techHandoff.eyebrow}</p>
                  <h2 className="h-sub" style={{ marginBottom: 20 }}>{data.techHandoff.headline}</h2>
                  <p className="body" style={{ maxWidth: '52ch' }}>{rich(data.techHandoff.body)}</p>
                  {data.techHandoff.compliance && data.techHandoff.compliance.length > 0 && (
                    <div className="role__chips">
                      {data.techHandoff.compliance.map((c) => (
                        <span className="role__chip" key={c}>{c}</span>
                      ))}
                    </div>
                  )}
                  {data.techHandoff.modal && (
                    <div className="row-cta">
                      <button className="tlink" onClick={() => setModal(data.techHandoff!.modal!)}>
                        DRM &amp; compliance, in detail
                      </button>
                    </div>
                  )}
                </div>
                <div className="feat__media">
                  <div className="trio" style={{ gridTemplateColumns: '1fr 1fr', marginTop: 0, gap: 16 }}>
                    {data.techHandoff.items.map((item) => (
                      <div className="trio__card" style={{ padding: 22 }} key={item.title}>
                        <h3 style={{ fontSize: 18 }}>{item.title}</h3>
                        <p>{rich(item.body)}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* ---- 13 · my role ---- */}
        {data.role && (
          <section className="section section--gray" id="cs-role" data-cs-section style={{ scrollMarginTop: 64 }}>
            <div className="wrap reveal">
              <h2 className="h-sect" style={{ marginBottom: 8 }}>My role.</h2>
              <div className="role">
                <div className="role__card">
                  <div className="k">Role</div>
                  <p>{data.role.role}<span className="sub">{data.role.ownership}</span></p>
                </div>
                <div className="role__card">
                  <div className="k">Timeline</div>
                  <p>{data.role.timeline}<span className="sub">{data.meta.status}</span></p>
                </div>
                <div className="role__card">
                  <div className="k">Team</div>
                  <p style={{ fontSize: 'clamp(16px,2vw,19px)' }}>{data.role.team}</p>
                </div>
                <div className="role__card">
                  <div className="k">Tools</div>
                  <p>{data.role.tools.join(' · ')}</p>
                </div>
              </div>
              {data.role.responsibilities.length > 0 && (
                <div className="role__chips">
                  {data.role.responsibilities.map((r) => (
                    <span className="role__chip" key={r} style={{ background: '#fff' }}>{r}</span>
                  ))}
                </div>
              )}
            </div>
          </section>
        )}

        {/* ---- 14 · keep exploring ---- */}
        {related.length > 0 && (
          <section className="section" id="cs-more" style={{ scrollMarginTop: 64 }}>
            <div className="wrap--wide reveal" style={{ margin: '0 auto' }}>
              <h2 className="h-sect" style={{ marginBottom: 8 }}>Keep exploring.</h2>
              <div className="work">
                {related.map((p) => (
                  <button className="tile" key={p.id} onClick={() => onNavigate?.(p.id)}>
                    <span className="k">{p.sub}</span>
                    <h3>{p.label}</h3>
                    <p>{p.desc}</p>
                    <span className="go">View case study ›</span>
                  </button>
                ))}
              </div>
            </div>
          </section>
        )}
      </main>

      {/* ---- footer ---- */}
      <footer className="footer">
        <div className="footer__in">
          <div>Designed by <a href="mailto:hello@mittal.design">Prachi Mittal</a> · Built with care.</div>
          <div className="footer__links">
            <a href="mailto:hello@mittal.design">Email</a>
            <a href="https://www.linkedin.com/in/prachi15mittal" target="_blank" rel="noopener noreferrer">LinkedIn</a>
            <button className="totop" onClick={() => goTo('cs-top')}>Back to top ↑</button>
          </div>
        </div>
      </footer>

      {modal && <SectionModal cs={data} modal={modal} onClose={() => setModal(null)} />}
    </div>
  )
}
