import { chromium } from 'playwright'
const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium', args:['--enable-unsafe-swiftshader'] })
const p = await b.newContext({ viewport:{width:1280,height:900} }).then(c=>c.newPage())
await p.goto('http://localhost:4173/projects/paas', { waitUntil:'domcontentloaded' })
await p.waitForSelector('input[type=password]', { timeout: 8000 }).catch(()=>{})
await p.waitForTimeout(1200)
const r = await p.evaluate(() => {
  const hasRole = document.body.innerText.includes('lead on the authoring canvas')
  const insideExact = document.body.innerText.includes('Inside')
  // print the first ~600 chars of the gate region
  return { hasRole, insideExact }
})
console.log(JSON.stringify(r))
await b.close()
