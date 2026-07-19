import { chromium } from 'playwright'
const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium' })
const p = await b.newPage({ viewport: { width: 1280, height: 900 } })
await p.goto('http://localhost:4173/projects', { waitUntil: 'networkidle' })
await p.evaluate(() => window.dispatchEvent(new Event('pm:feedback-open')))
await p.waitForSelector('[role=dialog]')
await p.fill('[role=dialog] input[type=text]', 'Browser test')
await p.fill('[role=dialog] input[type=email]', 'prachimittaldesign@gmail.com')
await p.fill('[role=dialog] textarea', 'Browser-side test of the feedback form. If this reaches hello@mittal.design, Send works end-to-end.')
await p.waitForFunction(() => { const b = document.querySelector('[role=dialog] button[type=submit]'); return b && !b.disabled }, { timeout: 4000 })
const respP = p.waitForResponse(r => r.url().includes('web3forms'), { timeout: 20000 }).catch(() => null)
await p.click('[role=dialog] button[type=submit]')
const resp = await respP
if (resp) { const body = await resp.json().catch(()=>({})); console.log('web3forms', resp.status(), JSON.stringify(body)) }
else console.log('NO web3forms response')
await p.waitForTimeout(500)
const sent = await p.$('text=Thank you').then(Boolean).catch(()=>false)
console.log('success UI:', sent)
await b.close()
