import { chromium } from 'playwright'
const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium', args:['--enable-unsafe-swiftshader'] })
const BASE='http://localhost:4173'
const p = await b.newContext({ viewport:{width:390,height:844}, hasTouch:true }).then(c=>c.newPage())
await p.goto(BASE+'/projects/index.html', { waitUntil:'domcontentloaded' })
await p.waitForTimeout(1800)
const info = await p.evaluate(() => {
  const title = document.title
  // is a seo-mirror visible?
  const mirror = document.querySelector('.seo-mirror')
  const mirrorVisible = mirror ? (mirror.offsetParent!==null && getComputedStyle(mirror).display!=='none') : 'no-mirror'
  const tiny = [...document.querySelectorAll('a,button,[role=button]')].filter(e=>e.offsetParent!==null).map(e=>{
    const r=e.getBoundingClientRect(); return {w:Math.round(r.width),h:Math.round(r.height),t:(e.textContent||e.getAttribute('aria-label')||'').trim().slice(0,24),cls:e.className.toString().slice(0,30)}
  }).filter(x=>x.w>0 && x.h<24)
  return { title, mirrorVisible, tinyCount: tiny.length, tiny }
})
console.log('title:', info.title, '| mirrorVisible:', info.mirrorVisible)
console.log('tiny(<24h):', info.tinyCount)
info.tiny.forEach(t=>console.log('  ', t.h+'h', '"'+t.t+'"', '·', t.cls))
await b.close()
