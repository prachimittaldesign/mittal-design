import { chromium } from 'playwright'
const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium', args:['--enable-unsafe-swiftshader'] })
const p = await b.newContext({ viewport:{width:1280,height:1400} }).then(c=>c.newPage())
await p.goto('http://localhost:4173/projects/paas', { waitUntil:'domcontentloaded' })
await p.waitForSelector('input[type=password]', { timeout: 8000 }).catch(()=>{})
await p.waitForTimeout(1500)
const t = await p.evaluate(() => {
  const gate = document.querySelector('input[type=password]')?.closest('div[class*=max-w]') || document.body
  return (gate.innerText||'').replace(/\n{2,}/g,'\n').slice(0, 1600)
})
console.log(t)
await b.close()
