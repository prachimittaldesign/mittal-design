import { chromium } from 'playwright'
const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium', args:['--enable-unsafe-swiftshader'] })
const p = await b.newContext({ viewport:{width:1280,height:900} }).then(c=>c.newPage())
await p.goto('http://localhost:4173/projects/paas', { waitUntil:'domcontentloaded' })
await p.waitForSelector('input[type=password]', { timeout: 8000 }).catch(()=>{})
await p.waitForTimeout(1500)
const r = await p.evaluate(() => {
  const txt = document.body.innerText
  const covers = [...document.querySelectorAll('form span')].map(s=>s.textContent.trim())
  return {
    role: /Product Designer · lead on the authoring/.test(txt),
    highlightsCount: [...document.querySelectorAll('ul li')].filter(li=>li.querySelector('svg')).length,
    insideLabel: /Inside/.test(txt),
    resumeNote: /last page of my résumé/.test(txt),
    resumeLink: !!document.querySelector('a[href$="Resume-2026.pdf"]'),
    whatsappReq: /WhatsApp/.test(txt),
    coversSample: covers.filter(c=>/canvas|Prompt|governance|Monetization|XML/i.test(c)).slice(0,5),
  }
})
console.log(JSON.stringify(r, null, 1))
await b.close()
