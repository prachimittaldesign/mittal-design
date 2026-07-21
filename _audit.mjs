import { chromium } from 'playwright'
const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium', args:['--enable-unsafe-swiftshader'] })
const BASE = 'http://localhost:4173'
const report = {}

async function check(path, vw, vh, label) {
  const p = await b.newContext({ viewport:{width:vw,height:vh} }).then(c=>c.newPage())
  const errs = [], failed = []
  p.on('console', m => { if (m.type()==='error') errs.push(m.text().slice(0,140)) })
  p.on('requestfailed', r => { const u=r.url(); if(!/analytics|insights|_vercel/.test(u)) failed.push(u.replace(BASE,'')+' '+(r.failure()?.errorText||'')) })
  try {
    await p.goto(BASE+path, { waitUntil:'networkidle', timeout:20000 })
  } catch(e){ report[label]={ error:'goto '+e.message.slice(0,80) }; await p.context().close(); return }
  await p.waitForTimeout(1200)
  const m = await p.evaluate(() => {
    const de = document.documentElement
    const imgs = [...document.querySelectorAll('img')]
    const broken = imgs.filter(i => i.complete && i.naturalWidth===0).map(i=>i.currentSrc||i.src).slice(0,8)
    // tiny tap targets among interactive els
    const inter = [...document.querySelectorAll('a,button,[role=button]')].filter(e=>e.offsetParent!==null)
    const tiny = inter.filter(e=>{const r=e.getBoundingClientRect(); return r.width>0 && (r.width<24||r.height<24)}).length
    return {
      overflowX: de.scrollWidth > de.clientWidth ? (de.scrollWidth+'>'+de.clientWidth) : false,
      imgCount: imgs.length, broken,
      title: document.title,
      canonical: document.querySelector('link[rel=canonical]')?.href||null,
      metaDesc: !!document.querySelector('meta[name=description]'),
      interCount: inter.length, tinyTargets: tiny,
    }
  })
  report[label] = { errs: errs.slice(0,6), failed: failed.slice(0,6), ...m }
  await p.context().close()
}

await check('/projects', 1440, 900, 'projects-desktop')
await check('/projects', 390, 844, 'projects-mobile')
await check('/', 1440, 900, 'home-desktop')
await check('/projects/paas', 1440, 900, 'case-paas')   // gated? build had no unlock pw
await check('/projects/snaplogic', 390, 844, 'case-snaplogic-mobile')
console.log(JSON.stringify(report, null, 1))
await b.close()
