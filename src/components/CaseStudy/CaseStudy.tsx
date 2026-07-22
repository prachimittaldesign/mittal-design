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
  const [failed, setFailed] = useState(false)
  const img = csImage(cs, id)
  if (!img) return null
  // 'planned' (no file yet) and a failed load (missing/corrupt file) both
  // degrade to the same clean placeholder — never the browser's broken-image
  // icon. `feature` names what the screenshot shows so the slot still reads.
  if (img.status === 'planned' || failed) {
    return <div className="shot--planned">Screenshot coming soon — {img.feature}</div>
  }
  return (
    <div className="shot">
      <img src={img.src} alt={img.alt} loading={eager ? 'eager' : 'lazy'} onError={() => setFailed(true)} />
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

// ---- trail band ---------------------------------------------------------------
// A Trailhead-style illustrated divider — rolling hills, pines, and a winding
// trail in the portfolio's soft palette — so the case study keeps the city's
// outdoorsy theme instead of sitting on a bare white page. Pure decoration:
// aria-hidden, no pointer events.
function TrailBand({ flip = false }: { flip?: boolean }) {
  return (
    <div className="trailband" aria-hidden style={flip ? { transform: 'scaleX(-1)' } : undefined}>
      <svg viewBox="0 0 1440 230" preserveAspectRatio="xMidYMax slice" role="presentation" focusable="false">
        {/* sky wash */}
        <defs>
          <linearGradient id="tb-sky" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#eaf2f0" stopOpacity="0" />
            <stop offset="1" stopColor="#e3efe9" stopOpacity="0.9" />
          </linearGradient>
        </defs>
        <rect x="0" y="0" width="1440" height="230" fill="url(#tb-sky)" />
        {/* far hills */}
        <path d="M0 158 Q 200 96 430 132 T 900 120 Q 1180 96 1440 148 V 230 H 0 Z" fill="#7fa77e" />
        <path d="M780 230 Q 1040 88 1440 128 V 230 Z" fill="#4d7a5a" />
        {/* warm field */}
        <path d="M0 230 V 176 Q 300 130 620 168 Q 900 200 1120 188 Q 1300 178 1440 196 V 230 Z" fill="#e3c56f" />
        {/* near meadow */}
        <path d="M0 230 V 196 Q 360 158 720 196 Q 1080 232 1440 208 V 230 Z" fill="#9dbf6e" />
        {/* winding trail */}
        <path
          d="M700 230 C 690 208 620 200 640 184 C 662 166 780 172 800 156 C 820 140 740 134 764 122 C 784 112 880 118 920 112"
          fill="none"
          stroke="#fbf7ee"
          strokeWidth="17"
          strokeLinecap="round"
        />
        <path
          d="M920 112 C 950 108 990 110 1020 106"
          fill="none"
          stroke="#fbf7ee"
          strokeWidth="9"
          strokeLinecap="round"
          opacity="0.85"
        />
        {/* pines — left cluster */}
        <g fill="#35604a">
          <path d="M120 148 l14 -34 14 34 Z" />
          <path d="M150 152 l11 -26 11 26 Z" />
          <path d="M88 154 l10 -22 10 22 Z" />
        </g>
        {/* pines — right hill */}
        <g fill="#2e5747">
          <path d="M1236 128 l13 -30 13 30 Z" />
          <path d="M1272 134 l10 -24 10 24 Z" />
          <path d="M1206 136 l9 -20 9 20 Z" />
        </g>
        {/* the cottage on the far hill — a nod to the city's architecture corner */}
        <g>
          <rect x="336" y="118" width="20" height="13" rx="1.5" fill="#fffdf7" />
          <path d="M333 119 L346 108 L359 119 Z" fill="#c96f4a" />
        </g>
        {/* soft cloud */}
        <g fill="#dfe9ec" opacity="0.8">
          <ellipse cx="1050" cy="52" rx="52" ry="17" />
          <ellipse cx="1092" cy="42" rx="34" ry="14" />
        </g>
      </svg>
    </div>
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

// Octalysis octagon — the eight core drives on a ring, `used` ones lit in the
// accent, `refused` ones dimmed and dashed. Drives are authored clockwise from
// the top, so vertex i sits at angle (-90 + 45·i)°. Labels anchor by side so
// they never collide with the ring; the detail lives in the lists below.
function Octagon({ drives }: { drives: { name: string; used: boolean }[] }) {
  const cx = 220
  const cy = 200
  const R = 132
  const pts = drives.slice(0, 8).map((d, i) => {
    const a = ((-90 + i * 45) * Math.PI) / 180
    return { ...d, x: cx + R * Math.cos(a), y: cy + R * Math.sin(a), i }
  })
  const anchor = (x: number) => (x > cx + 8 ? 'start' : x < cx - 8 ? 'end' : 'middle')
  const dx = (x: number) => (x > cx + 8 ? 20 : x < cx - 8 ? -20 : 0)
  const dy = (y: number) => (y > cy + 40 ? 26 : y < cy - 40 ? -18 : 5)
  return (
    <svg className="octa" viewBox="0 0 440 400" role="img"
      aria-label="Octalysis octagon: five core drives used (epic meaning, accomplishment, empowerment, ownership, social influence) and three refused (unpredictability, loss and avoidance, scarcity)">
      <polygon
        points={pts.map((p) => `${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(' ')}
        className="octa__ring"
      />
      {pts.map((p) => (
        <line key={`s${p.i}`} x1={cx} y1={cy} x2={p.x} y2={p.y} className="octa__spoke" />
      ))}
      <text x={cx} y={cy - 6} className="octa__center" textAnchor="middle">OCTALYSIS</text>
      <text x={cx} y={cy + 12} className="octa__center-sub" textAnchor="middle">8 core drives</text>
      {pts.map((p) => (
        <g key={p.i}>
          <circle cx={p.x} cy={p.y} r={13} className={p.used ? 'octa__node octa__node--on' : 'octa__node octa__node--off'} />
          {p.used ? (
            <path d={`M${p.x - 5} ${p.y} l3.4 3.6 L${p.x + 6} ${p.y - 4.5}`} className="octa__check" />
          ) : (
            <line x1={p.x - 5} y1={p.y} x2={p.x + 5} y2={p.y} className="octa__dash" />
          )}
          <text
            x={p.x + dx(p.x)}
            y={p.y + dy(p.y)}
            textAnchor={anchor(p.x)}
            className={p.used ? 'octa__label octa__label--on' : 'octa__label'}
          >
            {p.name}
          </text>
        </g>
      ))}
    </svg>
  )
}

// ---- conceptual diagrams (kind-selected SVG schematics) ---------------------
function FigBroadcast() {
  return (
    <svg className="fig" viewBox="0 0 440 210" role="img" aria-label="One broadcast tower sends one signal carrying twelve app services to every TV in range, with a broadband return path so the TV can answer back">
      <path d="M64 150 L52 60 M64 150 L76 60 M52 60 L76 60 M46 96 L82 96 M43 118 L85 118" className="fig__stroke" />
      <circle cx="64" cy="52" r="6" className="fig__accentFill" />
      <path d="M92 60 A70 70 0 0 1 92 140" className="fig__arc" />
      <path d="M108 44 A96 96 0 0 1 108 156" className="fig__arc" />
      <path d="M124 30 A122 122 0 0 1 124 170" className="fig__arc" />
      {[0, 1, 2].map((i) => (
        <g key={i} transform={`translate(330, ${44 + i * 52})`}>
          <rect x="0" y="0" width="56" height="34" rx="4" className="fig__panelStroke" />
          <rect x="22" y="34" width="12" height="5" rx="1" className="fig__mutedFill" />
        </g>
      ))}
      <path d="M330 168 C 230 210 130 200 96 150" className="fig__dash" markerEnd="url(#figArrow)" />
      <defs>
        <marker id="figArrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
          <path d="M0 0 L10 5 L0 10 z" className="fig__accentFill" />
        </marker>
      </defs>
      <text x="150" y="22" className="fig__cap">one signal · 12 app services</text>
      <text x="358" y="26" className="fig__cap" textAnchor="middle">every TV in range</text>
      <text x="210" y="205" className="fig__cap fig__cap--accent" textAnchor="middle">broadband return path — the TV answers back</text>
    </svg>
  )
}

function FigLeanback() {
  const Panel = ({ x, label, dist, input, who, far }: { x: number; label: string; dist: string; input: string; who: string; far: boolean }) => (
    <g transform={`translate(${x}, 0)`}>
      <rect x="0" y="0" width="188" height="200" rx="12" className="fig__panelSoft" />
      <text x="94" y="28" className="fig__figTitle" textAnchor="middle">{label}</text>
      {far ? (
        <>
          <rect x="112" y="52" width="60" height="38" rx="4" className="fig__panelStroke" />
          <circle cx="30" cy="74" r="9" className="fig__mutedFill" />
          <circle cx="52" cy="78" r="9" className="fig__mutedFill" />
          <path d="M84 71 L108 71" className="fig__dash" />
        </>
      ) : (
        <>
          <rect x="118" y="50" width="26" height="44" rx="4" className="fig__panelStroke" />
          <circle cx="96" cy="72" r="9" className="fig__mutedFill" />
          <path d="M110 72 L116 72" className="fig__dash" />
        </>
      )}
      <line x1="20" y1="112" x2="168" y2="112" className="fig__line" />
      {[['Distance', dist], ['Input', input], ['Audience', who]].map(([k, v], i) => (
        <g key={k} transform={`translate(0, ${128 + i * 22})`}>
          <text x="20" y="0" className="fig__kv-k">{k}</text>
          <text x="168" y="0" className="fig__kv-v" textAnchor="end">{v}</text>
        </g>
      ))}
    </g>
  )
  return (
    <svg className="fig" viewBox="0 0 440 210" role="img" aria-label="Phone versus television: 0.4 meters with a full keyboard for one person, versus 3 meters with a five-key remote for the whole household">
      <Panel x={6} label="Phone" dist="0.4 m" input="Full keyboard" who="One person" far={false} />
      <text x="220" y="108" className="fig__vs" textAnchor="middle">vs</text>
      <Panel x={246} label="Television" dist="3 m" input="5-key remote" who="The household" far={true} />
    </svg>
  )
}

function FigBesideNotOver() {
  return (
    <svg className="fig" viewBox="0 0 440 200" role="img" aria-label="Interruptive advertising covers the content; companion advertising keeps content full-screen with the ad beside it">
      <g transform="translate(20, 20)">
        <rect x="0" y="0" width="170" height="106" rx="8" className="fig__panelStroke" />
        <rect x="0" y="0" width="170" height="106" rx="8" className="fig__dimFill" />
        <rect x="34" y="26" width="102" height="54" rx="5" className="fig__accentFill" />
        <text x="85" y="57" className="fig__adLabel" textAnchor="middle">AD</text>
        <text x="85" y="128" className="fig__cap fig__cap--muted" textAnchor="middle">Interruptive — ad over content</text>
      </g>
      <path d="M206 73 L234 73" className="fig__dash" markerEnd="url(#figArrow2)" />
      <defs>
        <marker id="figArrow2" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
          <path d="M0 0 L10 5 L0 10 z" className="fig__accentFill" />
        </marker>
      </defs>
      <g transform="translate(250, 20)">
        <rect x="0" y="0" width="170" height="106" rx="8" className="fig__panelStroke" />
        <rect x="6" y="6" width="118" height="94" rx="5" className="fig__contentFill" />
        <path d="M52 40 L78 53 L52 66 Z" className="fig__playGlyph" />
        <rect x="130" y="6" width="34" height="94" rx="5" className="fig__accentSoft" />
        <text x="147" y="57" className="fig__adLabel fig__adLabel--sm" textAnchor="middle" transform="rotate(90 147 53)">AD</text>
        <text x="85" y="128" className="fig__cap fig__cap--accent" textAnchor="middle">Companion — content stays full-screen</text>
      </g>
    </svg>
  )
}

function FigExtendedPanel() {
  return (
    <svg className="fig" viewBox="0 0 440 190" role="img" aria-label="Without treatment an ad reads as a sticker on a clashing panel; the extended-panel approach pulls the creative's dominant colour into a full-width background so the ad integrates with the broadcast">
      <g transform="translate(20, 18)">
        <rect x="0" y="0" width="170" height="100" rx="8" className="fig__panelStroke" />
        <rect x="0" y="0" width="170" height="100" rx="8" className="fig__clashFill" />
        <rect x="55" y="30" width="60" height="40" rx="6" className="fig__accentFill" />
        <text x="85" y="120" className="fig__cap fig__cap--muted" textAnchor="middle">Sticker effect — creative floats</text>
      </g>
      <path d="M206 68 L234 68" className="fig__dash" markerEnd="url(#figArrow2)" />
      <g transform="translate(250, 18)">
        <rect x="0" y="0" width="170" height="100" rx="8" className="fig__accentSoft" />
        <rect x="0" y="0" width="170" height="100" rx="8" className="fig__panelStrokeOnly" />
        <rect x="55" y="30" width="60" height="40" rx="6" className="fig__accentFill" />
        <text x="85" y="120" className="fig__cap fig__cap--accent" textAnchor="middle">Extended panel — colour bleeds full-width</text>
      </g>
    </svg>
  )
}

function Figure({ kind }: { kind: string }) {
  switch (kind) {
    case 'broadcast': return <FigBroadcast />
    case 'leanback': return <FigLeanback />
    case 'besideNotOver': return <FigBesideNotOver />
    case 'extendedPanel': return <FigExtendedPanel />
    default: return null
  }
}

function FigureBlock({ item }: { item: { kind: string; title: string; body: string } }) {
  return (
    <div className="figblock">
      <div className="figblock__viz"><Figure kind={item.kind} /></div>
      <div className="figblock__txt">
        <h3>{item.title}</h3>
        <p>{item.body}</p>
      </div>
    </div>
  )
}

const COUNT_WORDS = ['zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten', 'eleven', 'twelve']

export function CaseStudy({ data, onNavigate }: CaseStudyProps) {
  const rootRef = useRef<HTMLDivElement>(null)
  const hlRef = useRef<HTMLDivElement>(null)
  const [hlAt, setHlAt] = useState<'start' | 'mid' | 'end'>('start')
  const lookRef = useRef<HTMLDivElement>(null)
  const [lookAt, setLookAt] = useState<'start' | 'mid' | 'end'>('start')
  const [lookIdx, setLookIdx] = useState(0)
  const [lookTheme, setLookTheme] = useState('light')
  const [modal, setModal] = useState<CSModal | null>(null)
  const [impactOn, setImpactOn] = useState(false)
  const [current, setCurrent] = useState('')

  // Scroll reveal + impact-bar trigger — deterministic geometry checks on
  // every scroll frame instead of IntersectionObserver. IO proved unreliable
  // inside the fullscreen takeover on real devices (its async callbacks never
  // fired for some sections, which left them stuck at opacity 0 — the "blank
  // black Impact section" bug). A capture-phase scroll listener on window sees
  // scrolls of the overlay's inner scroll container too (scroll events don't
  // bubble, but they do capture), and getBoundingClientRect can't lie.
  useEffect(() => {
    const root = rootRef.current
    if (!root) return
    const els = Array.from(root.querySelectorAll('.reveal'))
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduce) {
      els.forEach((el) => el.classList.add('in'))
      setImpactOn(true)
      return
    }
    const pending = new Set(els)
    const impactEl = data.impact ? root.querySelector('#cs-impact') : null
    let impactPending = !!impactEl
    let raf = 0

    const detach = () => {
      window.removeEventListener('scroll', schedule, true)
      window.removeEventListener('resize', schedule)
    }
    const check = () => {
      raf = 0
      const vh = window.innerHeight
      pending.forEach((el) => {
        const r = el.getBoundingClientRect()
        if (r.top < vh * 0.94 && r.bottom > 0) {
          el.classList.add('in')
          pending.delete(el)
        }
      })
      if (impactPending && impactEl) {
        const r = impactEl.getBoundingClientRect()
        if (r.top < vh * 0.72 && r.bottom > 0) {
          setImpactOn(true)
          impactPending = false
        }
      }
      if (pending.size === 0 && !impactPending) detach()
    }
    const schedule = () => {
      if (!raf) raf = requestAnimationFrame(check)
    }

    window.addEventListener('scroll', schedule, true)
    window.addEventListener('resize', schedule)
    check() // initial pass — covers direct anchor jumps and above-fold content
    return () => {
      detach()
      cancelAnimationFrame(raf)
    }
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

  // "Take a closer look" scroller — arrows + dots. Two independent signals
  // (not just a hint of the next card's edge) so the gallery reads as
  // swipeable on mobile, where a near-full-width item otherwise looks like a
  // single static image.
  const lookStep = (dir: 1 | -1) => {
    const el = lookRef.current
    if (!el) return
    const card = el.querySelector('.look__item') as HTMLElement | null
    el.scrollBy({ left: dir * ((card?.offsetWidth ?? 400) + 18), behavior: 'smooth' })
  }
  const syncLook = () => {
    const el = lookRef.current
    if (!el) return
    const atStart = el.scrollLeft < 8
    const atEnd = el.scrollLeft + el.clientWidth > el.scrollWidth - 8
    setLookAt(atStart ? 'start' : atEnd ? 'end' : 'mid')
    const card = el.querySelector('.look__item') as HTMLElement | null
    const step = (card?.offsetWidth ?? 400) + 18
    setLookIdx(Math.round(el.scrollLeft / step))
  }
  const lookGoTo = (i: number) => {
    const el = lookRef.current
    const card = el?.querySelector('.look__item') as HTMLElement | null
    if (!el) return
    const step = (card?.offsetWidth ?? 400) + 18
    el.scrollTo({ left: i * step, behavior: 'smooth' })
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

        <TrailBand />

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

        {/* ---- 2b · figures: conceptual diagrams (e.g. the TV context) ---- */}
        {data.figures && data.figures.items.length > 0 && (
          <section className="section section--gray" id="cs-figures" data-cs-section style={{ scrollMarginTop: 64 }}>
            <div className="wrap reveal">
              <p className="eyebrow center">{data.figures.eyebrow}</p>
              <h2 className="h-sect center" style={{ maxWidth: '20ch', margin: '0 auto 8px' }}>{data.figures.headline}</h2>
              {data.figures.lead && <p className="lead center" style={{ maxWidth: '64ch', margin: '0 auto' }}>{rich(data.figures.lead)}</p>}
              <div className="figstack">
                {data.figures.items.map((f) => (
                  <FigureBlock key={f.title} item={f} />
                ))}
              </div>
            </div>
          </section>
        )}

        {/* ---- 3 · closer look ---- */}
        {data.closerLook && data.closerLook.items.length > 0 && (
          <section className="section section--gray center" id="cs-look" style={{ scrollMarginTop: 64 }}>
            <div className="wrap reveal">
              <h2 className="h-sect">Take a closer look.</h2>
              <div className="look__controls">
                {data.closerLook.themes.length > 1 && (
                  <div className="toggle" role="group" aria-label="Theme">
                    {data.closerLook.themes.map((t) => (
                      <button key={t} aria-pressed={lookTheme === t} onClick={() => setLookTheme(t)}>
                        {t[0].toUpperCase() + t.slice(1)}
                      </button>
                    ))}
                  </div>
                )}
                {data.closerLook.items.length > 1 && (
                  <div className="look__arrows">
                    <button className="arrow" onClick={() => lookStep(-1)} disabled={lookAt === 'start'} aria-label="Previous screenshot">‹</button>
                    <button className="arrow" onClick={() => lookStep(1)} disabled={lookAt === 'end'} aria-label="Next screenshot">›</button>
                  </div>
                )}
              </div>
            </div>
            <div className="look__scroller" data-ui={lookTheme} ref={lookRef} onScroll={syncLook}>
              {data.closerLook.items.map((item) => (
                <figure className="look__item" key={item.image}>
                  <Shot cs={data} id={item.image} />
                  <figcaption className="look__cap">{item.caption}</figcaption>
                </figure>
              ))}
            </div>
            {data.closerLook.items.length > 1 && (
              <div className="look__dots" role="tablist" aria-label="Screenshot">
                {data.closerLook.items.map((_, i) => (
                  <button
                    key={i}
                    type="button"
                    className="look__dot"
                    aria-label={`Go to screenshot ${i + 1} of ${data.closerLook!.items.length}`}
                    aria-current={i === lookIdx}
                    onClick={() => lookGoTo(i)}
                  />
                ))}
              </div>
            )}
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
              {data.flagship.diagrams && data.flagship.diagrams.length > 0 && (
                <div className="figstack figstack--flag">
                  {data.flagship.diagrams.map((f) => (
                    <FigureBlock key={f.title} item={f} />
                  ))}
                </div>
              )}
            </div>
          </section>
        )}

        {/* ---- 5 · impact bars ---- */}
        {data.impact && (
          <section className="section section--dark" id="cs-impact" data-cs-section style={{ scrollMarginTop: 64 }}>
            {/* No .reveal here: this is the only dark section, so content that
                fails to un-hide reads as a solid black screen. The text is
                always visible; only the bar fills animate in. */}
            <div className={`wrap${impactOn ? ' is-animated' : ''}`}>
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

        {/* ---- 10b · gamification: Octalysis octagon + leaned-in / refused ---- */}
        {data.gamification && data.gamification.drives.length >= 8 && (
          <section className="section section--gray" id="cs-gamification" data-cs-section style={{ scrollMarginTop: 64 }}>
            <div className="wrap reveal">
              <p className="eyebrow center">{data.gamification.eyebrow}</p>
              <h2 className="h-sect center" style={{ maxWidth: '18ch', margin: '0 auto 8px' }}>{data.gamification.headline}</h2>
              <p className="lead center" style={{ maxWidth: '64ch', margin: '0 auto' }}>{rich(data.gamification.lead)}</p>
              {data.gamification.framework && <p className="octa__attr center">{data.gamification.framework}</p>}
              <div className="octa__grid">
                <div className="octa__viz">
                  <Octagon drives={data.gamification.drives} />
                  <div className="octa__legend">
                    <span className="octa__key"><i className="octa__swatch octa__swatch--on" />Leaned in</span>
                    <span className="octa__key"><i className="octa__swatch octa__swatch--off" />Refused</span>
                  </div>
                </div>
                <div className="octa__cols">
                  <div className="octa__col">
                    <h3 className="octa__col-h octa__col-h--on">Leaned into</h3>
                    <ul>
                      {data.gamification.drives.filter((d) => d.used).map((d) => (
                        <li key={d.name}><b>{d.name}</b><span>{d.note}</span></li>
                      ))}
                    </ul>
                  </div>
                  <div className="octa__col">
                    <h3 className="octa__col-h octa__col-h--off">Deliberately refused</h3>
                    <ul>
                      {data.gamification.drives.filter((d) => !d.used).map((d) => (
                        <li key={d.name}><b>{d.name}</b><span>{d.note}</span></li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
              {data.gamification.caption && <p className="octa__caption center">{rich(data.gamification.caption)}</p>}
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

      <TrailBand flip />

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
