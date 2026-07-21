import { chromium } from 'playwright'
const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium', args:['--enable-unsafe-swiftshader'] })
const BASE='http://localhost:4173'
const p = await b.newContext({ viewport:{width:390,height:844}, hasTouch:true }).then(c=>c.newPage())
await p.goto(BASE+'/projects/index.html', { waitUntil:'domcontentloaded' })
await p.waitForTimeout(1800)
const info = await p.evaluate(() => {
  const inHidden = (el) => el.closest('.seo-mirror, [aria-hidden="true"]') !== null
  const truly = (el) => {
    if (inHidden(el)) return false
    const r = el.getBoundingClientRect()
    if (r.width<1||r.height<1) return false
    // sample center point actually hits this element or a child (not clipped away)
    const cx=r.left+r.width/2, cy=r.top+r.height/2
    if (cx<0||cy<0||cx>innerWidth||cy>innerHeight) return true // offscreen-but-real (scroll) — keep
    const hit = document.elementFromPoint(cx,cy)
    return hit ? (el.contains(hit)||hit.contains(el)) : false
  }
  const all=[...document.querySelectorAll('a,button,[role=button]')].filter(truly)
  const tiny=all.map(e=>{const r=e.getBoundingClientRect();return{w:Math.round(r.width),h:Math.round(r.height),t:(e.textContent||e.getAttribute('aria-label')||'').trim().slice(0,26),cls:(e.className||'').toString().slice(0,26)}}).filter(x=>x.h<24||x.w<24)
  return { totalReal: all.length, tinyCount: tiny.length, tiny }
})
console.log('REAL visible interactive:', info.totalReal, '| tiny(<24):', info.tinyCount)
info.tiny.forEach(t=>console.log('  ', t.w+'x'+t.h, '"'+t.t+'"', '·', t.cls))
await b.close()
