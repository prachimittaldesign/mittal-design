/**
 * SEO / AI-crawlability plugin.
 *
 * The site is a client-rendered 3D canvas — invisible to crawlers and to
 * anyone whose device can't run it. This plugin makes every page fully
 * crawlable WITHOUT touching the visual experience:
 *
 *  1. transformIndexHtml — injects a visually-hidden (but crawler- and
 *     screen-reader-visible) semantic site index into the home page:
 *     <header>/<main>/<section> landmarks, heading hierarchy, and a link to
 *     every project's own URL. Plus Person + WebSite JSON-LD.
 *
 *  2. closeBundle — after `vite build`, prerenders a static HTML page for
 *     every project at dist/projects/<id>/index.html with unique title,
 *     meta description, canonical, Open Graph / Twitter tags, CreativeWork +
 *     BreadcrumbList JSON-LD, and a full crawlable article (Problem, Role,
 *     Process, Impact, Skills). Each page loads the same app bundle, so real
 *     visitors get the 3D city with that project's case study auto-opened.
 *     Also emits sitemap.xml, robots.txt (AI crawlers explicitly welcomed)
 *     and a 404 page that routes strays back home.
 *
 * Content is sourced from src/data/projects.ts at build time, so the
 * crawlable layer can never drift out of sync with the city.
 */
import { readFileSync, writeFileSync, mkdirSync, readdirSync } from 'node:fs'
import { resolve } from 'node:path'
import type { Plugin } from 'vite'
import { PROJECTS } from '../src/data/projects'
import type { Project } from '../src/types'

const ORIGIN = 'https://mittal.design'
const AUTHOR = 'Prachi Mittal'

const esc = (s: string) =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')

const projectUrl = (p: Project) => `${ORIGIN}/projects/${p.id}`
const projectTitle = (p: Project) => `${p.label} — ${titleCase(p.sub)} | ${AUTHOR}`
const projectDesc = (p: Project) => (p.caseStudy?.summary ?? p.desc).slice(0, 300)
const projectImage = (p: Project) => {
  const src = p.imageGroups?.[0]?.images[0]?.src
  return src ? `${ORIGIN}${encodeURI(src)}` : `${ORIGIN}/IMAGES/CMS-2025-DITA.png`
}

const ACRONYMS = new Set([
  'CMS', 'DITA', 'TV', 'AI', 'UX', 'UI', 'LMS', 'CES', 'RES.', '3D', 'LIDAR', 'B2B', 'AEON',
])
function titleCase(sub: string): string {
  return sub
    .split(' ')
    .map((w) =>
      ACRONYMS.has(w.toUpperCase())
        ? w === 'LIDAR' || w.toUpperCase() === 'LIDAR'
          ? 'LiDAR'
          : w.toUpperCase()
        : w.charAt(0).toUpperCase() + w.slice(1).toLowerCase(),
    )
    .join(' ')
}

// ── Structured summary (Problem · Role · Process · Impact · Skills) ─────────
// The exact shape AI search assistants want to quote from.
function articleFor(p: Project): string {
  const cs = p.caseStudy
  const section = (title: string, body: string) =>
    body ? `<section aria-labelledby="${p.id}-${title.toLowerCase()}"><h3 id="${p.id}-${title.toLowerCase()}">${title}</h3>${body}</section>` : ''

  const paras = (text?: string) =>
    text ? text.split('\n\n').map((t) => `<p>${esc(t)}</p>`).join('') : ''

  const problem = paras(cs?.problem) || `<p>${esc(p.desc)}</p>`
  const role = cs
    ? `<p>${esc(`${cs.role} · ${cs.timeline} · ${cs.platform}${cs.context ? ` · ${cs.context}` : ''}`)}</p>${cs.tldr ? `<p>${esc(cs.tldr.how)}</p>` : ''}`
    : ''
  const process = cs?.process
    ? `<ol>${cs.process.map((ph) => `<li><strong>${esc(ph.phase)}:</strong> ${esc(ph.body)}</li>`).join('')}</ol>`
    : ''
  const approach = cs?.approach
    ? `<ul>${cs.approach.map((a) => `<li><strong>${esc(a.title)}:</strong> ${esc(a.body)}</li>`).join('')}</ul>`
    : ''
  const impact = cs?.impact
    ? `<ul>${cs.impact.map((i) => `<li>${esc(i)}</li>`).join('')}</ul>`
    : ''
  const skills = `<ul>${p.tags.map((t) => `<li>${esc(t)}</li>`).join('')}</ul>`

  return `
<article aria-label="${esc(p.label)} case study (text version)">
  <header>
    <h1>${esc(p.label)} — ${esc(titleCase(p.sub))}</h1>
    <p>${esc(projectDesc(p))}</p>
  </header>
  ${section('Problem', problem)}
  ${section('Role', role)}
  ${section('Process', process)}
  ${cs?.approach ? `<section aria-labelledby="${p.id}-solution"><h3 id="${p.id}-solution">Solution</h3>${approach}</section>` : ''}
  ${section('Impact', impact)}
  ${section('Skills', skills)}
  <footer><a href="/">← Explore the interactive portfolio city</a></footer>
</article>`
}

// ── Home-page crawlable site index ───────────────────────────────────────────
function siteIndex(): string {
  const items = PROJECTS.map(
    (p) => `
      <li>
        <h3><a href="/projects/${p.id}">${esc(p.label)}</a> <small>${esc(titleCase(p.sub))}</small></h3>
        <p>${esc(p.desc)}</p>
      </li>`,
  ).join('')
  return `
<!-- Crawlable, screen-reader-accessible mirror of the 3D portfolio.
     Visually hidden for sighted users (the canvas city IS the experience);
     revealed automatically when JavaScript is unavailable. -->
<div id="site-index" class="seo-mirror">
  <header>
    <h1>${AUTHOR} — Product Designer &amp; Architect</h1>
    <p>An explorable 3D portfolio city. Every building is a shipped project, mapped by audience and complexity. Featured case studies: Ved (enterprise DITA CMS with AI authoring), SnapLogic (documentation revamp, 40% fewer clicks-to-target), and Revee &amp; Mo (smart-TV super apps showcased at CES 2024).</p>
    <nav aria-label="Site">
      <a href="/about.html">About</a>
      <a href="/Prachi-Mittal-Resume-2026.pdf">Resume (PDF)</a>
      <a href="https://www.linkedin.com/in/prachi15mittal">LinkedIn</a>
      <a href="https://www.behance.net/prachimittal2">Behance</a>
    </nav>
  </header>
  <main>
    <section aria-labelledby="projects-h">
      <h2 id="projects-h">Projects</h2>
      <ul>${items}
      </ul>
    </section>
  </main>
</div>
<style>
  .seo-mirror{position:absolute;width:1px;height:1px;margin:-1px;padding:0;overflow:hidden;clip:rect(0 0 0 0);white-space:nowrap;border:0}
</style>
<noscript>
  <style>
    .seo-mirror{position:static;width:auto;height:auto;margin:24px auto;max-width:720px;overflow:visible;clip:auto;white-space:normal;font-family:system-ui,sans-serif;line-height:1.6;padding:0 20px}
    #root{display:none}
  </style>
</noscript>`
}

// ── JSON-LD ──────────────────────────────────────────────────────────────────
const personLd = {
  '@context': 'https://schema.org',
  '@type': 'Person',
  name: AUTHOR,
  jobTitle: 'Product Designer',
  description:
    'Product designer and architect. Enterprise CMS and documentation design, smart-TV apps showcased at CES 2024, robotics UX.',
  url: ORIGIN,
  sameAs: ['https://www.linkedin.com/in/prachi15mittal', 'https://www.behance.net/prachimittal2'],
  knowsAbout: [
    'Product Design', 'UX Design', 'Information Architecture', 'Design Systems',
    'Conversational UX', 'DITA', 'Smart TV Design', 'Architecture',
  ],
}
const websiteLd = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: `${AUTHOR} — Portfolio`,
  url: ORIGIN,
  description: 'An explorable 3D portfolio city — every building is a shipped design project.',
  author: { '@type': 'Person', name: AUTHOR, url: ORIGIN },
}
const creativeWorkLd = (p: Project) => ({
  '@context': 'https://schema.org',
  '@type': 'CreativeWork',
  name: p.label,
  headline: projectTitle(p),
  description: projectDesc(p),
  url: projectUrl(p),
  image: projectImage(p),
  author: { '@type': 'Person', name: AUTHOR, url: ORIGIN },
  keywords: p.tags.join(', '),
  ...(p.caseStudy ? { about: p.caseStudy.problem.split('\n\n')[0] } : {}),
})
const breadcrumbLd = (p: Project) => ({
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home', item: ORIGIN },
    { '@type': 'ListItem', position: 2, name: 'Projects', item: `${ORIGIN}/#projects-h` },
    { '@type': 'ListItem', position: 3, name: p.label, item: projectUrl(p) },
  ],
})
const ld = (obj: object) => `<script type="application/ld+json">${JSON.stringify(obj)}</script>`

// ── Per-project page synthesis ───────────────────────────────────────────────
// Takes the BUILT index.html (hashed asset URLs intact → the 3D app boots and
// the router opens this project's overlay) and swaps in per-page metadata.
function projectPage(builtIndex: string, p: Project): string {
  let html = builtIndex
  const title = projectTitle(p)
  const desc = projectDesc(p)
  const url = projectUrl(p)
  const img = projectImage(p)

  html = html.replace(/<title>[^<]*<\/title>/, `<title>${esc(title)}</title>`)
  html = html.replace(
    /<meta name="description" content="[^"]*"/,
    `<meta name="description" content="${esc(desc)}"`,
  )
  html = html.replace(
    /<link rel="canonical" href="[^"]*"/,
    `<link rel="canonical" href="${url}"`,
  )
  html = html.replace(/<meta property="og:title" content="[^"]*"/, `<meta property="og:title" content="${esc(title)}"`)
  html = html.replace(/<meta property="og:description" content="[^"]*"/, `<meta property="og:description" content="${esc(desc)}"`)
  html = html.replace(/<meta property="og:url" content="[^"]*"/, `<meta property="og:url" content="${url}"`)
  html = html.replace(/<meta property="og:image" content="[^"]*"/, `<meta property="og:image" content="${esc(img)}"`)
  html = html.replace(/<meta property="og:type" content="[^"]*"/, `<meta property="og:type" content="article"`)
  html = html.replace(/<meta name="twitter:title" content="[^"]*"/, `<meta name="twitter:title" content="${esc(title)}"`)
  html = html.replace(/<meta name="twitter:description" content="[^"]*"/, `<meta name="twitter:description" content="${esc(desc)}"`)
  html = html.replace(/<meta name="twitter:image" content="[^"]*"/, `<meta name="twitter:image" content="${esc(img)}"`)
  html = html.replace(/<meta name="twitter:card" content="[^"]*"/, `<meta name="twitter:card" content="summary_large_image"`)

  // Page-specific JSON-LD + the crawlable article, ahead of </body>.
  const extras = `${ld(creativeWorkLd(p))}${ld(breadcrumbLd(p))}
<div class="seo-mirror" id="case-study-text">${articleFor(p)}</div>`
  html = html.replace('</body>', `${extras}\n</body>`)
  return html
}


// llms.txt — the emerging convention for AI assistants: a compact markdown
// digest of the site with canonical links, generated from the same data as
// the pages so it can never drift.
function llmsTxt(): string {
  const featured = PROJECTS.filter((p) => p.featured)
  const rest = PROJECTS.filter((p) => !p.featured)
  const line = (p: Project) => `- [${p.label}](${projectUrl(p)}): ${projectDesc(p)}`
  return `# ${AUTHOR} — Product Designer & Architect

> An explorable 3D portfolio city at ${ORIGIN}. Every building is a shipped design project, mapped by audience and complexity. Each project page carries a full case study structured as Problem / Role / Process / Solution / Impact / Skills.

## Featured case studies
${featured.map(line).join('\n')}

## All projects
${rest.map(line).join('\n')}

## About
- [About Prachi](${ORIGIN}/about.html): background, practice and approach
- [Resume (PDF)](${ORIGIN}/Prachi-Mittal-Resume-2026.pdf)
- [LinkedIn](https://www.linkedin.com/in/prachi15mittal)
- [Behance](https://www.behance.net/prachimittal2)
`
}

const HUMANS = `/* TEAM */
Designer & Owner: Prachi Mittal
Role: Product Designer · Architect
Location: Hyderabad, India
Contact: hello [at] prachimittal.com

/* THANKS */
Everyone who wandered the city and wrote back.

/* SITE */
Standards: HTML5, CSS3, ES2022, WebGL2
Components: React, three.js, react-three-fiber, Tailwind CSS, Vite
The sky follows Hyderabad's real time and weather.
`

function sitemap(): string {
  const today = new Date().toISOString().slice(0, 10)
  const urls = [
    { loc: `${ORIGIN}/`, priority: '1.0' },
    { loc: `${ORIGIN}/about.html`, priority: '0.8' },
    ...PROJECTS.map((p) => ({ loc: projectUrl(p), priority: p.featured ? '0.9' : '0.6' })),
  ]
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map((u) => `  <url><loc>${u.loc}</loc><lastmod>${today}</lastmod><priority>${u.priority}</priority></url>`).join('\n')}
</urlset>
`
}

const ROBOTS = `# mittal.design — everyone is welcome, including AI assistants.
User-agent: *
Allow: /

# Explicit welcome for AI/LLM crawlers
User-agent: GPTBot
Allow: /
User-agent: ClaudeBot
Allow: /
User-agent: Claude-Web
Allow: /
User-agent: PerplexityBot
Allow: /
User-agent: Google-Extended
Allow: /
User-agent: Applebot-Extended
Allow: /
User-agent: CCBot
Allow: /

Sitemap: ${ORIGIN}/sitemap.xml
`

const NOT_FOUND = `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><title>Not found — ${AUTHOR}</title>
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="robots" content="noindex">
<script>location.replace('/')</script>
<meta http-equiv="refresh" content="0;url=/">
</head><body><p>Page not found — <a href="/">back to the portfolio</a>.</p></body></html>
`

export function seoPlugin(): Plugin {
  let outDir = 'dist'
  return {
    name: 'seo-prerender',
    transformIndexHtml(html) {
      // Crawlable mirror + site-wide JSON-LD on every page that uses index.html.
      // The mirror sits AFTER #root so keyboard users tab through the real app
      // controls first and the hidden text index last.
      return html.replace('<div id="root"></div>', `<div id="root"></div>\n    ${siteIndex()}`)
        .replace('</head>', `${ld(personLd)}${ld(websiteLd)}</head>`)
    },
    configResolved(config) {
      outDir = resolve(config.root, config.build.outDir)
    },
    closeBundle() {
      const builtIndex = readFileSync(resolve(outDir, 'index.html'), 'utf8')
      for (const p of PROJECTS) {
        const dir = resolve(outDir, 'projects', p.id)
        mkdirSync(dir, { recursive: true })
        writeFileSync(resolve(dir, 'index.html'), projectPage(builtIndex, p))
      }
      writeFileSync(resolve(outDir, 'sitemap.xml'), sitemap())
      writeFileSync(resolve(outDir, 'robots.txt'), ROBOTS)
      writeFileSync(resolve(outDir, 'llms.txt'), llmsTxt())
      writeFileSync(resolve(outDir, 'humans.txt'), HUMANS)
      writeFileSync(resolve(outDir, '404.html'), NOT_FOUND)

      // Smooth loading: the 3D stack is lazy-imported, so by default it only
      // starts downloading after React boots. Preload hints let the browser
      // fetch those chunks in parallel with shell execution — fast networks
      // reach the city sooner (and never flash the gallery), slow networks
      // still get the instant gallery fallback.
      const heavy = readdirSync(resolve(outDir, 'assets')).filter((f) =>
        /^(three|r3f|CityExperience)-.*\.js$/.test(f),
      )
      const preloads = heavy.map((f) => `<link rel="modulepreload" href="/assets/${f}">`).join('')
      for (const page of ['index.html', ...PROJECTS.map((pr) => `projects/${pr.id}/index.html`)]) {
        const fp = resolve(outDir, page)
        writeFileSync(fp, readFileSync(fp, 'utf8').replace('</head>', `${preloads}</head>`))
      }
      console.log(`[seo] prerendered ${PROJECTS.length} project pages + sitemap + robots + 404`)
    },
  }
}
