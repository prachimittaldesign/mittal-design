import { useEffect, useRef, useState } from 'react'
import './projectsFallback.css'

// The fast, no-three.js landing/projects page — a ported version of
// index-fallback.html. Lives at the "/projects" route (see useCityBoot):
// it's what a slow/failed city load falls back to after 3 seconds, what a
// confirmed-laggy device gets instead of a struggling canvas, and what
// crawlers without a WebGL story can read directly. Everything here is
// plain DOM/Tailwind-adjacent CSS — no r3f, no lazy import, so it never
// waits on the three.js bundle.

const EMAIL = 'hello@mittal.design'
const LINKEDIN = 'https://www.linkedin.com/in/prachi15mittal'

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

const MORE_WORK: Array<{ year: string; id: string; label: string; cat: string }> = [
  { year: '2024', id: 'impressio', label: 'Impressio', cat: 'Robotics · Humanoid casting' },
  { year: '2024', id: 'izak', label: 'iZak', cat: 'Spatial · 3D scanning research' },
  { year: '2025', id: 'voteiq', label: 'Vote IQ', cat: 'Civic · TV + web' },
  { year: '2023', id: 'arch', label: 'Studio', cat: 'Architecture · Residential' },
]

export function ProjectsFallback({ onOpenProject, onEnterCity }: ProjectsFallbackProps) {
  const rootRef = useRef<HTMLDivElement>(null)
  const rotRef = useRef<HTMLSpanElement>(null)
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
    window.addEventListener('scroll', onScrollThrottled, { passive: true })
    window.addEventListener('resize', onScroll)
    onScroll()
    return () => {
      window.removeEventListener('scroll', onScrollThrottled)
      window.removeEventListener('resize', onScroll)
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
                <img src="/IMAGES/city-og.png" alt="" loading="lazy" onError={(e) => e.currentTarget.remove()} />
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

        <PfTrailBand />

        {/* FEATURED */}
        <section className="pf-sec" id="pf-work">
          <div className="pf-wrap">
            <p className="pf-slabel pf-rv">Selected work</p>
            <div className="pf-float">
              <button
                className="pf-fcard pf-fcard--wide pf-rv"
                data-speed="-0.05"
                aria-label="SnapLogic Documentation case study"
                onClick={() => onOpenProject('snaplogic')}
              >
                <div className="pf-fcard__media">
                  <img src="/IMAGES/Snap/SNAP_home_01.png" alt="" loading="lazy" onError={(e) => e.currentTarget.remove()} />
                  <div className="pf-fcard__sig">
                    <div className="pf-big">40%</div>
                    <div className="pf-sm">Fewer clicks to target — validated across 5 scenarios</div>
                  </div>
                </div>
                <div className="pf-fcard__body">
                  <div className="pf-fcard__meta">
                    2025 · Enterprise documentation · <i>Sole designer</i>
                    <b>SnapLogic Docs</b>
                  </div>
                  <span className="pf-fcard__go">→</span>
                </div>
              </button>

              <button className="pf-fcard pf-rv" data-speed="0.045" aria-label="Ved case study" onClick={() => onOpenProject('paas')}>
                <div className="pf-fcard__media">
                  <img src="/IMAGES/Ved/VED_canvas_01.png" alt="" loading="lazy" onError={(e) => e.currentTarget.remove()} />
                  <div className="pf-fcard__sig pf-fcard__sig--line">
                    <div className="pf-sm">V2 shipped 2026 · in engineering build</div>
                  </div>
                </div>
                <div className="pf-fcard__body">
                  <div className="pf-fcard__meta">
                    2025 · Enterprise CMS · Agentic AI
                    <b>Ved — DITA Builder</b>
                  </div>
                  <span className="pf-fcard__go">→</span>
                </div>
              </button>

              <button
                className="pf-fcard pf-fcard--right pf-fcard--up pf-rv"
                data-speed="-0.03"
                aria-label="Revee and Mo case study"
                onClick={() => onOpenProject('revee')}
              >
                <div className="pf-fcard__media">
                  <img src="/IMAGES/Revee-Mo/REV_mohome_01.png" alt="" loading="lazy" onError={(e) => e.currentTarget.remove()} />
                  <div className="pf-fcard__sig pf-fcard__sig--line">
                    <div className="pf-sm">Showcased at CES 2024</div>
                  </div>
                </div>
                <div className="pf-fcard__body">
                  <div className="pf-fcard__meta">
                    2024 · Smart TV super-apps · End-to-end
                    <b>Revee &amp; Mo</b>
                  </div>
                  <span className="pf-fcard__go">→</span>
                </div>
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
              <a className="pf-btn pf-btn--ghost" href={LINKEDIN} target="_blank" rel="noopener noreferrer">
                LinkedIn ↗
              </a>
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
          </div>
        </div>
      </footer>
    </div>
  )
}
