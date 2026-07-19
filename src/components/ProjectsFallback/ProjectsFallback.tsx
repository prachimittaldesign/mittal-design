import { useEffect, useRef, useState } from 'react'
import { EMAIL, LINKEDIN, WHATSAPP_URL } from '../../lib/contact'
import './projectsFallback.css'

// The fast, no-three.js landing/projects page — a ported version of
// index-fallback.html. Lives at the "/projects" route (see useCityBoot):
// it's what a slow/failed city load falls back to after 3 seconds, what a
// confirmed-laggy device gets instead of a struggling canvas, and what
// crawlers without a WebGL story can read directly. Everything here is
// plain DOM/Tailwind-adjacent CSS — no r3f, no lazy import, so it never
// waits on the three.js bundle.

// Small inline WhatsApp glyph (kept local so the page stays self-contained).
function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" className={className} fill="currentColor" aria-hidden focusable="false">
      <path d="M16 3C9.4 3 4 8.4 4 15c0 2.1.6 4.2 1.6 6L4 29l8.2-1.6c1.7.9 3.7 1.4 5.8 1.4 6.6 0 12-5.4 12-12S22.6 3 16 3zm0 21.8c-1.8 0-3.6-.5-5.1-1.4l-.4-.2-4.9.9.9-4.8-.2-.4c-1-1.6-1.5-3.4-1.5-5.3C4.7 9.2 9.2 4.7 16 4.7c6.8 0 11.3 4.5 11.3 10.3S22.8 24.8 16 24.8zm5.6-7.6c-.3-.2-1.8-.9-2.1-1s-.5-.2-.7.2c-.2.3-.8 1-1 1.2-.2.2-.4.2-.7.1-.3-.2-1.3-.5-2.5-1.5-.9-.8-1.5-1.8-1.7-2.1-.2-.3 0-.5.1-.6.1-.1.3-.4.5-.5.1-.2.2-.3.3-.5.1-.2 0-.4 0-.5s-.7-1.6-.9-2.2c-.2-.6-.5-.5-.7-.5h-.6c-.2 0-.5.1-.8.4-.3.3-1 1-1 2.5s1.1 2.9 1.2 3.1c.2.2 2.1 3.2 5.1 4.5.7.3 1.3.5 1.7.6.7.2 1.4.2 1.9.1.6-.1 1.8-.7 2-1.4.3-.7.3-1.3.2-1.4-.1-.1-.3-.2-.6-.3z" />
    </svg>
  )
}

interface ProjectsFallbackProps {
  /** Navigate to a case-study overlay (opens over the city backdrop). */
  onOpenProject: (id: string) => void
  /** "Enter the 3D city" / nav "City" — real navigation back to "/". */
  onEnterCity: () => void
}

const ROTATING_WORDS = ['enterprise AI tools', 'structured content', 'documentation IA', '10-foot TV']

// Same trail artwork as the case studies (CaseStudy.tsx) — hills, a winding
// path, pines and the architecture-corner cottage — for outdoor-theme
// continuity between the fast page and the 3D city. `flip` mirrors it.
function PfTrailBand({ flip = false }: { flip?: boolean }) {
  return (
    <div className="pf-trailband" aria-hidden style={flip ? { transform: 'scaleX(-1)' } : undefined}>
      <svg viewBox="0 0 1440 230" preserveAspectRatio="xMidYMax slice" role="presentation" focusable="false">
        <defs>
          <linearGradient id="pf-tb-sky" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#eaf2f0" stopOpacity="0" />
            <stop offset="1" stopColor="#e3efe9" stopOpacity="0.9" />
          </linearGradient>
        </defs>
        <rect x="0" y="0" width="1440" height="230" fill="url(#pf-tb-sky)" />
        <path d="M0 158 Q 200 96 430 132 T 900 120 Q 1180 96 1440 148 V 230 H 0 Z" fill="#7fa77e" />
        <path d="M780 230 Q 1040 88 1440 128 V 230 Z" fill="#4d7a5a" />
        <path d="M0 230 V 176 Q 300 130 620 168 Q 900 200 1120 188 Q 1300 178 1440 196 V 230 Z" fill="#e3c56f" />
        <path d="M0 230 V 196 Q 360 158 720 196 Q 1080 232 1440 208 V 230 Z" fill="#9dbf6e" />
        <path d="M700 230 C 690 208 620 200 640 184 C 662 166 780 172 800 156 C 820 140 740 134 764 122 C 784 112 880 118 920 112" fill="none" stroke="#fbf7ee" strokeWidth="17" strokeLinecap="round" />
        <path d="M920 112 C 950 108 990 110 1020 106" fill="none" stroke="#fbf7ee" strokeWidth="9" strokeLinecap="round" opacity="0.85" />
        <g fill="#35604a">
          <path d="M120 148 l14 -34 14 34 Z" />
          <path d="M150 152 l11 -26 11 26 Z" />
          <path d="M88 154 l10 -22 10 22 Z" />
        </g>
        <g fill="#2e5747">
          <path d="M1236 128 l13 -30 13 30 Z" />
          <path d="M1272 134 l10 -24 10 24 Z" />
          <path d="M1206 136 l9 -20 9 20 Z" />
        </g>
        <g>
          <rect x="336" y="118" width="20" height="13" rx="1.5" fill="#fffdf7" />
          <path d="M333 119 L346 108 L359 119 Z" fill="#c96f4a" />
        </g>
        <g fill="#dfe9ec" opacity="0.8">
          <ellipse cx="1050" cy="52" rx="52" ry="17" />
          <ellipse cx="1092" cy="42" rx="34" ry="14" />
        </g>
      </svg>
    </div>
  )
}

// A richer, taller landscape — the backdrop the "Selected work" cards sit on,
// tying the fast page to the 3D city's world (balloons, water, a lighthouse-ish
// beacon, cottages). Rendered as a full-section background; the sky fills the
// upper area so cards stay legible, with the detailed meadow along the bottom.
function PfTrailScene() {
  return (
    <div className="pf-trailscene" aria-hidden>
      <svg viewBox="0 0 1440 620" preserveAspectRatio="xMidYMax slice" role="presentation" focusable="false">
        <defs>
          <linearGradient id="pf-ts-sky" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#d3eaf1" />
            <stop offset="0.45" stopColor="#dcefe0" />
            <stop offset="1" stopColor="#c7e6b4" />
          </linearGradient>
          <linearGradient id="pf-ts-water" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#bfe2e6" />
            <stop offset="1" stopColor="#a9d6dc" />
          </linearGradient>
        </defs>
        <rect x="0" y="0" width="1440" height="620" fill="url(#pf-ts-sky)" />

        {/* sun + glow */}
        <circle cx="1180" cy="120" r="46" fill="#ffe7a8" />
        <circle cx="1180" cy="120" r="72" fill="#ffe7a8" opacity="0.28" />

        {/* clouds */}
        <g fill="#ffffff" opacity="0.9">
          <ellipse cx="300" cy="120" rx="70" ry="22" />
          <ellipse cx="352" cy="106" rx="46" ry="18" />
          <ellipse cx="900" cy="80" rx="58" ry="18" />
          <ellipse cx="946" cy="70" rx="36" ry="14" />
        </g>

        {/* birds */}
        <g stroke="#5b6b63" strokeWidth="3" fill="none" strokeLinecap="round">
          <path d="M560 150 q 12 -10 24 0 q 12 -10 24 0" />
          <path d="M640 176 q 9 -8 18 0 q 9 -8 18 0" />
        </g>

        {/* hot-air balloons — a nod to the city sky */}
        <g>
          <path d="M480 200 a 26 28 0 1 1 52 0 c 0 20 -16 34 -26 44 c -10 -10 -26 -24 -26 -44 Z" fill="#e88a6a" />
          <path d="M506 172 v72" stroke="#c96f4a" strokeWidth="1.5" />
          <rect x="500" y="246" width="12" height="9" rx="1.5" fill="#8a5a3c" />
        </g>
        <g>
          <path d="M756 232 a 20 22 0 1 1 40 0 c 0 15 -12 26 -20 34 c -8 -8 -20 -19 -20 -34 Z" fill="#7bb0c9" />
          <rect x="770" y="266" width="10" height="8" rx="1.5" fill="#8a5a3c" />
        </g>

        {/* far mountains */}
        <path d="M0 300 L 210 196 L 380 300 Z" fill="#9fc0a6" opacity="0.8" />
        <path d="M300 300 L 520 176 L 760 300 Z" fill="#8fb79a" opacity="0.85" />

        {/* rolling hills */}
        <path d="M0 340 Q 260 250 560 312 T 1120 300 Q 1300 268 1440 322 V 620 H 0 Z" fill="#8fbf8a" />
        <path d="M760 620 Q 1020 250 1440 300 V 620 Z" fill="#5f9463" />
        <path d="M0 620 V 380 Q 220 320 460 372 Q 720 430 980 398 Q 1220 368 1440 402 V 620 Z" fill="#6fae6a" />

        {/* a cove of water */}
        <path d="M0 620 V 486 Q 180 452 360 486 Q 300 560 150 566 Q 60 568 0 552 Z" fill="url(#pf-ts-water)" />
        <ellipse cx="150" cy="512" rx="60" ry="9" fill="#ffffff" opacity="0.35" />

        {/* meadow foreground */}
        <path d="M0 620 V 470 Q 360 424 720 470 Q 1080 516 1440 480 V 620 Z" fill="#9dcf74" />

        {/* pines — clusters */}
        <g fill="#35604a">
          <path d="M120 402 l20 -52 20 52 Z" />
          <path d="M150 410 l15 -40 15 40 Z" />
          <path d="M92 412 l13 -32 13 32 Z" />
        </g>
        <g fill="#2e5747">
          <path d="M1290 396 l19 -46 19 46 Z" />
          <path d="M1324 404 l14 -36 14 36 Z" />
        </g>

        {/* round trees */}
        <g>
          <rect x="1042" y="418" width="7" height="20" fill="#8a5a3c" />
          <circle cx="1045" cy="410" r="22" fill="#6fae6a" />
          <rect x="1108" y="432" width="6" height="16" fill="#8a5a3c" />
          <circle cx="1111" cy="426" r="17" fill="#7cbb76" />
        </g>

        {/* two cottages — echoing the architecture corner */}
        <g>
          <rect x="392" y="392" width="40" height="28" rx="2" fill="#fffdf7" />
          <path d="M386 394 L412 372 L438 394 Z" fill="#c96f4a" />
          <rect x="405" y="402" width="10" height="18" fill="#c9a06a" />
        </g>
        <g>
          <rect x="628" y="420" width="30" height="20" rx="2" fill="#fdf7ee" />
          <path d="M623 422 L643 406 L663 422 Z" fill="#b5623f" />
        </g>

        {/* a slender beacon — the lighthouse motif */}
        <g>
          <rect x="965" y="360" width="12" height="60" rx="2" fill="#fbfbfb" />
          <rect x="965" y="374" width="12" height="10" fill="#d9584f" />
          <path d="M963 360 L971 348 L979 360 Z" fill="#d9584f" />
        </g>

        {/* wildflowers */}
        <g>
          <circle cx="240" cy="556" r="4" fill="#e8738f" />
          <circle cx="268" cy="572" r="4" fill="#ffd27a" />
          <circle cx="520" cy="560" r="4" fill="#e8738f" />
          <circle cx="1180" cy="540" r="4" fill="#ffd27a" />
          <circle cx="1210" cy="560" r="4" fill="#e8738f" />
        </g>
      </svg>
    </div>
  )
}

// The featured projects, as stops along the trail (alternating sides).
type Stop = {
  id: string
  side: 'left' | 'right'
  img: string
  meta: React.ReactNode
  label: string
  sig: { big?: string; sm: string }
}
const TRAIL_STOPS: Stop[] = [
  {
    id: 'snaplogic',
    side: 'left',
    img: '/IMAGES/Snap/SNAP_home_01.png',
    meta: (<>2025 · Enterprise documentation · <i>Sole designer</i></>),
    label: 'SnapLogic Docs',
    sig: { sm: '40% fewer clicks to target' },
  },
  {
    id: 'paas',
    side: 'right',
    img: '/IMAGES/Ved/VED_canvas_01.png',
    meta: '2025 · Enterprise CMS · Agentic AI',
    label: 'Ved — DITA Builder',
    sig: { sm: 'V2 shipped 2026 · in engineering build' },
  },
  {
    id: 'revee',
    side: 'left',
    img: '/IMAGES/Revee-Mo/REV_mohome_01.png',
    meta: '2024 · Smart TV super-apps · End-to-end',
    label: 'Revee & Mo',
    sig: { sm: 'Showcased at CES 2024' },
  },
]

const MORE_WORK: Array<{ year: string; id: string; label: string; cat: string }> = [
  { year: '2024', id: 'impressio', label: 'Impressio', cat: 'Robotics · Humanoid casting' },
  { year: '2024', id: 'izak', label: 'iZak', cat: 'Spatial · 3D scanning research' },
  { year: '2025', id: 'voteiq', label: 'Vote IQ', cat: 'Civic · TV + web' },
  { year: '2023', id: 'arch', label: 'Studio', cat: 'Architecture · Residential' },
]

export function ProjectsFallback({ onOpenProject, onEnterCity }: ProjectsFallbackProps) {
  const rootRef = useRef<HTMLDivElement>(null)
  const rotRef = useRef<HTMLSpanElement>(null)
  const trailRef = useRef<HTMLDivElement>(null)
  const [rotWord, setRotWord] = useState(ROTATING_WORDS[0])
  const [rotClass, setRotClass] = useState('')

  // Reveal-on-scroll (IntersectionObserver — a plain page, no overlay
  // scroll-container quirks here, unlike the case-study takeover).
  useEffect(() => {
    const root = rootRef.current
    if (!root) return
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const els = Array.from(root.querySelectorAll('.pf-rv'))
    if (reduce || !('IntersectionObserver' in window)) {
      els.forEach((el) => el.classList.add('pf-in'))
      return
    }
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add('pf-in')
            io.unobserve(e.target)
          }
        })
      },
      { rootMargin: '0px 0px -10% 0px', threshold: 0.06 },
    )
    els.forEach((el) => io.observe(el))
    return () => io.disconnect()
  }, [])

  // Rotating hero focus word.
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    let i = 0
    const id = setInterval(() => {
      setRotClass('pf-rot--switching')
      setTimeout(() => {
        i = (i + 1) % ROTATING_WORDS.length
        setRotWord(ROTATING_WORDS[i])
        setRotClass('pf-rot--entering')
        setTimeout(() => setRotClass(''), 380)
      }, 280)
    }, 2600)
    return () => clearInterval(id)
  }, [])

  // Floating-card parallax + sticky "stacking" card settle, combined into one
  // scroll listener exactly as the source file does.
  useEffect(() => {
    const root = rootRef.current
    if (!root) return
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const cards = Array.from(root.querySelectorAll<HTMLElement>('.pf-fcard[data-speed]'))
    const stack = Array.from(root.querySelectorAll<HTMLElement>('.pf-stack__card'))
    if (reduce || (!cards.length && !stack.length)) return

    let ticking = false
    const onScroll = () => {
      ticking = false
      const vh = window.innerHeight
      const mobile = window.innerWidth < 761
      cards.forEach((c) => {
        if (mobile) {
          c.style.transform = ''
          return
        }
        const r = c.getBoundingClientRect()
        const p = r.top + r.height / 2 - vh / 2
        const speed = parseFloat(c.dataset.speed ?? '0')
        c.style.transform = `translateY(${(p * speed).toFixed(1)}px)`
      })
      stack.forEach((c, idx) => {
        const next = stack[idx + 1]
        if (!next) {
          c.style.transform = ''
          c.style.opacity = ''
          return
        }
        const cr = c.getBoundingClientRect()
        const nr = next.getBoundingClientRect()
        const overlap = Math.min(1, Math.max(0, (cr.bottom - nr.top) / cr.height))
        c.style.transform = `scale(${(1 - overlap * 0.06).toFixed(3)})`
        c.style.opacity = (1 - overlap * 0.28).toFixed(3)
      })
    }
    const onScrollThrottled = () => {
      if (!ticking) {
        ticking = true
        requestAnimationFrame(onScroll)
      }
    }
    // Capture phase (true): on the /projects route this page scrolls inside an
    // overflow-y-auto wrapper, not the window — scroll events don't bubble, but
    // they DO fire on window during capture, so a capture listener catches the
    // inner container's scroll and the parallax + stacking-card settle run.
    window.addEventListener('scroll', onScrollThrottled, { passive: true, capture: true })
    window.addEventListener('resize', onScroll)
    onScroll()
    return () => {
      window.removeEventListener('scroll', onScrollThrottled, true)
      window.removeEventListener('resize', onScroll)
    }
  }, [])

  // The horizontal trail: the winding path beneath the cards draws left→right
  // as the section scrolls into view, each numbered marker lights as the path
  // reaches it, and the cards rise in sequence — the featured projects read as
  // waypoints on a walk.
  useEffect(() => {
    const trail = trailRef.current
    if (!trail) return
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const drawPath = trail.querySelector<SVGPathElement>('.pf-trailrow__draw')
    const markers = Array.from(trail.querySelectorAll<HTMLElement>('.pf-stop__marker'))
    const len = drawPath?.getTotalLength() ?? 0
    if (drawPath) drawPath.style.strokeDasharray = `${len}`

    if (reduce) {
      trail.classList.add('pf-in')
      if (drawPath) drawPath.style.strokeDashoffset = '0'
      markers.forEach((m) => m.classList.add('on'))
      return
    }
    if (drawPath) drawPath.style.strokeDashoffset = `${len}`

    let raf = 0
    const update = () => {
      raf = 0
      const r = trail.getBoundingClientRect()
      const vh = window.innerHeight
      // 0 as the row enters from the bottom → 1 once it's comfortably in view.
      const p = Math.min(1, Math.max(0, (vh * 0.86 - r.top) / (r.height + vh * 0.22)))
      if (p > 0.02) trail.classList.add('pf-in')
      if (drawPath) drawPath.style.strokeDashoffset = `${len * (1 - p)}`
      markers.forEach((m, i) => m.classList.toggle('on', p > (i + 0.4) / markers.length))
    }
    const schedule = () => {
      if (!raf) raf = requestAnimationFrame(update)
    }
    window.addEventListener('scroll', schedule, { passive: true, capture: true })
    window.addEventListener('resize', schedule)
    update()
    return () => {
      window.removeEventListener('scroll', schedule, true)
      window.removeEventListener('resize', schedule)
      cancelAnimationFrame(raf)
    }
  }, [])

  const goTop = () => window.scrollTo({ top: 0, behavior: 'smooth' })
  const goTo = (id: string) => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })

  return (
    <div className="pf" ref={rootRef}>
      <a className="pf-skip" href="#pf-work">
        Skip to work
      </a>

      <nav className="pf-nav">
        <div className="pf-wrap pf-nav__in">
          <button className="pf-nav__logo" onClick={goTop}>
            Prachi Mittal
          </button>
          <div className="pf-nav__links">
            <button onClick={() => goTo('pf-work')}>Work</button>
            <button onClick={() => goTo('pf-about')}>About</button>
            <button onClick={onEnterCity}>City</button>
            <button onClick={() => goTo('pf-say')}>Contact</button>
          </div>
          <a className="pf-nav__cta" href={`mailto:${EMAIL}`}>
            Say hello
          </a>
        </div>
      </nav>

      <main id="pf-top">
        {/* HERO */}
        <header className="pf-hero">
          <div className="pf-wrap">
            <div className="pf-hero__hello pf-rv">
              <span>Hi, I'm Prachi Mittal.</span>
              <span className="pf-badge">
                <i /> Open to senior roles · Remote / hybrid
              </span>
            </div>
            <h1 className="pf-rv">
              A product designer shaping{' '}
              <span className={`pf-rot ${rotClass}`} ref={rotRef}>
                <span>{rotWord}</span>
              </span>
              .
            </h1>
            <div className="pf-hero__cta pf-rv">
              <button className="pf-btn pf-btn--solid" onClick={onEnterCity}>
                Enter the 3D city →
              </button>
              <button className="pf-btn pf-btn--ghost" onClick={() => goTo('pf-work')}>
                See selected work
              </button>
            </div>
            <div className="pf-hero__meta pf-rv">
              <span>
                <b>3+ years</b> · Enterprise SaaS &amp; agentic AI
              </span>
              <span>Hyderabad, India</span>
              <a href={`mailto:${EMAIL}`}>{EMAIL}</a>
              <a href={LINKEDIN} target="_blank" rel="noopener noreferrer">
                LinkedIn ↗
              </a>
            </div>

            {/* Prominent, appealing entry to the 3D city — a live snapshot of
                the cityscape with a clear call. This is the star action; the
                text button above is the low-key alternative. */}
            <div className="pf-city pf-rv">
              <button className="pf-citycard" onClick={onEnterCity} aria-label="Enter the interactive 3D portfolio city">
                <img src="/IMAGES/Cityview.png" alt="" loading="lazy" onError={(e) => e.currentTarget.remove()} />
                <span className="pf-citycard__scrim" />
                <span className="pf-citycard__body">
                  <span className="pf-citycard__eyebrow"><i />The full experience</span>
                  <h3>Explore the portfolio as a 3D city.</h3>
                  <p>Every building is a shipped project. Walk the streets, click a tower, read the story.</p>
                  <span className="pf-citycard__go">
                    <svg viewBox="0 0 20 20" fill="none" aria-hidden>
                      <path d="M6 4l9 6-9 6V4z" fill="currentColor" />
                    </svg>
                    Enter the 3D city
                  </span>
                </span>
              </button>
            </div>
          </div>
        </header>

        {/* FEATURED — three flagship projects as waypoints on a trail. The cards
            sit in a clean row over the landscape; a winding path draws left→
            right beneath them and each numbered marker lights as you reach it. */}
        <section className="pf-sec pf-work" id="pf-work">
          <PfTrailScene />
          <div className="pf-wrap">
            <p className="pf-slabel pf-rv">Selected work</p>
            <p className="pf-trail-lead pf-rv">Three flagship projects — follow the trail.</p>

            <div className="pf-trailrow" ref={trailRef}>
              <div className="pf-trailrow__cards">
                {TRAIL_STOPS.map((s, i) => (
                  <article className="pf-stop" style={{ '--i': i } as React.CSSProperties} key={s.id}>
                    <button className="pf-fcard" aria-label={`${s.label} case study`} onClick={() => onOpenProject(s.id)}>
                      <div className="pf-fcard__media">
                        <img src={s.img} alt="" loading="lazy" onError={(e) => e.currentTarget.remove()} />
                        <div className={`pf-fcard__sig${s.sig.big ? '' : ' pf-fcard__sig--line'}`}>
                          {s.sig.big && <div className="pf-big">{s.sig.big}</div>}
                          <div className="pf-sm">{s.sig.sm}</div>
                        </div>
                      </div>
                      <div className="pf-fcard__body">
                        <div className="pf-fcard__meta">
                          {s.meta}
                          <b>{s.label}</b>
                        </div>
                        <span className="pf-fcard__go">→</span>
                      </div>
                    </button>
                  </article>
                ))}
              </div>

              {/* winding trail beneath the cards — draws with scroll */}
              <div className="pf-trailrow__track" aria-hidden>
                <svg className="pf-trailrow__svg" viewBox="0 0 1200 90" preserveAspectRatio="none" focusable="false">
                  <path
                    className="pf-trailrow__base"
                    d="M0 58 C 90 30 150 30 200 48 C 280 74 520 74 600 48 C 690 26 910 26 1000 48 C 1060 62 1150 66 1200 52"
                  />
                  <path
                    className="pf-trailrow__draw"
                    d="M0 58 C 90 30 150 30 200 48 C 280 74 520 74 600 48 C 690 26 910 26 1000 48 C 1060 62 1150 66 1200 52"
                  />
                </svg>
                {TRAIL_STOPS.map((s, i) => (
                  <span className="pf-stop__marker" key={s.id} style={{ left: `${((i * 2 + 1) / 6) * 100}%` }}>
                    {String(i + 1).padStart(2, '0')}
                  </span>
                ))}
              </div>

              <button className="pf-trailrow__end" onClick={onEnterCity} aria-label="Enter the 3D city">
                <span className="pf-trailrow__flag" aria-hidden>⛳</span>
                See them all in the 3D city →
              </button>
            </div>
          </div>
        </section>

        {/* WHAT I BRING — stacking cards */}
        <section className="pf-sec">
          <div className="pf-wrap">
            <p className="pf-slabel pf-rv">What I bring</p>
            <div className="pf-stack">
              <article className="pf-stack__card" style={{ '--i': 0 } as React.CSSProperties}>
                <span className="pf-stack__k">Evidence</span>
                <span className="pf-stack__num">01</span>
                <div className="pf-stack__b">
                  <h3>Design that's proven, not just pretty.</h3>
                  <p>
                    I ship with evidence. SnapLogic's redesign was validated with automated tests —{' '}
                    <strong>40% fewer clicks to target</strong> across five real tasks — reported honestly as floor
                    numbers, not inflated.
                  </p>
                </div>
              </article>
              <article className="pf-stack__card" style={{ '--i': 1 } as React.CSSProperties}>
                <span className="pf-stack__k">Applied AI</span>
                <span className="pf-stack__num">02</span>
                <div className="pf-stack__b">
                  <h3>AI that behaves like a governed product.</h3>
                  <p>
                    Ask Kya, Prompt-as-a-Service, DocGPT — <strong>conversational and agentic layers</strong> designed
                    with versioning, quality scoring, and cited answers, not a bolted-on chatbot.
                  </p>
                </div>
              </article>
              <article className="pf-stack__card" style={{ '--i': 2 } as React.CSSProperties}>
                <span className="pf-stack__k">Structure</span>
                <span className="pf-stack__num">03</span>
                <div className="pf-stack__b">
                  <h3>At home in the deep end of enterprise.</h3>
                  <p>
                    DITA authoring, dual-navigation IA, single-source content — <strong>the structured, high-stakes
                    surfaces</strong> most designers avoid.
                  </p>
                </div>
              </article>
              <article className="pf-stack__card" style={{ '--i': 3 } as React.CSSProperties}>
                <span className="pf-stack__k">Systems</span>
                <span className="pf-stack__num">04</span>
                <div className="pf-stack__b">
                  <h3>An architect's eye for systems.</h3>
                  <p>
                    Trained in architecture, I design software the way you design buildings:{' '}
                    <strong>as systems people live inside</strong> — coherent from the first sketch to handoff.
                  </p>
                </div>
              </article>
            </div>
          </div>
        </section>

        {/* MORE WORK */}
        <section className="pf-sec">
          <div className="pf-wrap">
            <p className="pf-slabel pf-rv">More work</p>
            <div className="pf-rows pf-rv">
              {MORE_WORK.map((row) => (
                <button key={row.id} className="pf-row" onClick={() => onOpenProject(row.id)}>
                  <span>{row.year}</span>
                  <b>{row.label}</b>
                  <span className="pf-cat">{row.cat}</span>
                </button>
              ))}
            </div>
            <div className="pf-rows__foot">
              <span>Plus KYA, Holacracy, Amplyfund, Clink and more —</span>
              <button onClick={onEnterCity}>Explore everything in the 3D city →</button>
            </div>
          </div>
        </section>

        {/* ABOUT */}
        <section className="pf-sec" id="pf-about">
          <div className="pf-wrap">
            <p className="pf-slabel pf-rv">About</p>
            <div className="pf-about">
              <div className="pf-rv">
                <h2>
                  I trained as an architect, so I design software the way you design buildings —{' '}
                  <em>as systems people live inside</em>. My work sits where structure meets intelligence: DITA
                  authoring, documentation IA, and AI layers that behave like governed products, not party tricks.
                </h2>
                <a className="pf-more" href="/about.html">
                  About me →
                </a>
              </div>
              <figure className="pf-about__photo pf-rv">
                <img src="/IMAGES/Prachi.jpeg" alt="Prachi Mittal" loading="lazy" onError={(e) => e.currentTarget.remove()} />
                <figcaption>Prachi · Hyderabad</figcaption>
              </figure>
            </div>
          </div>
        </section>

        {/* MARQUEE + CONTACT */}
        <div className="pf-marq" aria-hidden="true">
          <div className="pf-marq__track">
            <span>
              Open to <em>senior product design</em> roles <i>·</i> Remote / hybrid <i>·</i> Enterprise <em>AI</em>{' '}
              <i>·</i>
            </span>
            <span>
              Open to <em>senior product design</em> roles <i>·</i> Remote / hybrid <i>·</i> Enterprise <em>AI</em>{' '}
              <i>·</i>
            </span>
          </div>
        </div>

        <section className="pf-say pf-sec" id="pf-say">
          <div className="pf-wrap pf-rv">
            <p className="pf-slabel">Say hello</p>
            <h2>Hiring for a team that builds complex, high-stakes software? Let's talk.</h2>
            <div className="pf-btns">
              <a className="pf-btn pf-btn--solid" href={`mailto:${EMAIL}`}>
                Email me
              </a>
              {WHATSAPP_URL && (
                <a className="pf-btn pf-btn--wa" href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer">
                  <WhatsAppIcon className="pf-btn__ico" /> WhatsApp
                </a>
              )}
              <a className="pf-btn pf-btn--ghost" href={LINKEDIN} target="_blank" rel="noopener noreferrer">
                LinkedIn ↗
              </a>
              <button
                type="button"
                className="pf-btn pf-btn--ghost"
                onClick={() => window.dispatchEvent(new Event('pm:feedback-open'))}
              >
                Leave feedback
              </button>
            </div>
          </div>
        </section>
      </main>

      <PfTrailBand flip />

      <footer>
        <div className="pf-wrap pf-foot">
          <span>© Prachi Mittal · mittal.design</span>
          <div className="pf-foot__links">
            <button onClick={() => goTo('pf-work')}>Work</button>
            <button onClick={() => goTo('pf-about')}>About</button>
            <button onClick={onEnterCity}>City</button>
            <a href={`mailto:${EMAIL}`}>Email</a>
            {WHATSAPP_URL && (
              <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer">WhatsApp</a>
            )}
            <button onClick={() => window.dispatchEvent(new Event('pm:feedback-open'))}>Feedback</button>
          </div>
        </div>
      </footer>
    </div>
  )
}
