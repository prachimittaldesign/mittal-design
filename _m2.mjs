import { chromium } from 'playwright'
const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium' })
const p = await b.newPage({ viewport: { width: 1440, height: 900 } })
await p.goto('http://localhost:4173/projects', { waitUntil: 'networkidle' })
await p.evaluate(() => document.querySelector('.pf-trailrow')?.scrollIntoView({ block: 'center' }))
await p.waitForTimeout(900)
const info = await p.evaluate(() => {
  const cards = document.querySelector('.pf-trailrow__cards')
  const cs = getComputedStyle(cards)
  const stops = [...document.querySelectorAll('.pf-trailrow__cards > .pf-stop')].map(s => {
    const sr = s.getBoundingClientRect()
    const card = s.querySelector('.pf-fcard'); const cr = card.getBoundingClientRect()
    const scs = getComputedStyle(s)
    return { stopW: Math.round(sr.width), cardW: Math.round(cr.width), justifySelf: scs.justifySelf, width: scs.width }
  })
  return { gridTemplateColumns: cs.gridTemplateColumns, containerW: Math.round(cards.getBoundingClientRect().width), stops }
})
console.log(JSON.stringify(info, null, 2))
await b.close()
