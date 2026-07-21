import { chromium } from 'playwright'
const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium', args:['--enable-unsafe-swiftshader'] })
const BASE='http://localhost:4173'
// 1) tiny tap targets on mobile /projects — list them
const p = await b.newContext({ viewport:{width:390,height:844}, hasTouch:true }).then(c=>c.newPage())
await p.goto(BASE+'/projects', { waitUntil:'domcontentloaded' })
await p.waitForTimeout(1500)
const tiny = await p.evaluate(() => {
  return [...document.querySelectorAll('a,button,[role=button]')].filter(e=>e.offsetParent!==null).map(e=>{
    const r=e.getBoundingClientRect(); return {tag:e.tagName, w:Math.round(r.width), h:Math.round(r.height), t:(e.textContent||e.getAttribute('aria-label')||'').trim().slice(0,26)}
  }).filter(x=>x.w>0 && (x.w<24||x.h<24))
})
console.log('MOBILE tiny targets ('+tiny.length+'):'); tiny.forEach(t=>console.log('  ',t.w+'x'+t.h, '['+t.tag+']', t.t))
await p.context().close()

// 2) confirm a LOCKED case study renders its gate (not blank) — /projects/paas
const p2 = await b.newContext({ viewport:{width:1440,height:900} }).then(c=>c.newPage())
const errs2=[]; p2.on('console',m=>{if(m.type()==='error')errs2.push(m.text().slice(0,100))})
await p2.goto(BASE+'/projects/paas', { waitUntil:'domcontentloaded' })
await p2.waitForTimeout(2500)
const gate = await p2.evaluate(()=>({
  hasLockForm: !!document.querySelector('input[type=password]'),
  h1: document.querySelector('h1')?.textContent?.trim()||null,
  protectedBadge: !!document.querySelector('*:not(script)')&&/Protected case study/.test(document.body.innerText),
  requestAccess: !!document.querySelector('a[href^="mailto"]'),
  bodyLen: document.body.innerText.length,
}))
console.log('\nLOCKED /projects/paas:', JSON.stringify(gate), 'errs:', errs2.slice(0,3))
await p2.context().close()
await b.close()
