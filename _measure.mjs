import { chromium } from 'playwright'
const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium' })
const p = await b.newPage({ viewport: { width: 1440, height: 900 } })
await p.goto('http://localhost:4173/projects', { waitUntil: 'networkidle' })
// scroll to trailrow to trigger reveal
await p.evaluate(() => document.querySelector('.pf-trailrow')?.scrollIntoView({ block: 'center' }))
await p.waitForTimeout(900)
const dims = await p.$$eval('.pf-work .pf-fcard', els => els.map(e => {
  const r = e.getBoundingClientRect(); return { w: Math.round(r.width), h: Math.round(r.height) }
}))
console.log(JSON.stringify(dims))
const badges = await p.$$eval('.pf-stop .pf-fcard__body', els => els.map(e => e.querySelector('.pf-fcard__sig, [class*=sig], [class*=badge]')?.textContent || null))
console.log('badges', JSON.stringify(badges))
await b.close()
