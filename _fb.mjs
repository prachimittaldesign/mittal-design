import { chromium } from 'playwright'
const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium' })
const p = await b.newPage({ viewport: { width: 1280, height: 900 } })
await p.goto('http://localhost:4173/projects', { waitUntil: 'networkidle' })
await p.evaluate(() => window.dispatchEvent(new Event('pm:feedback-open')))
await p.waitForSelector('[role=dialog]', { timeout: 4000 })
await p.fill('input[autocomplete=name]', 'Browser test')
await p.fill('input[type=email]', 'prachimittaldesign@gmail.com')
await p.fill('textarea', 'Browser-side test of the feedback form wiring. If this lands at hello@mittal.design, Send works end-to-end.')
const respP = p.waitForResponse(r => r.url().includes('web3forms.com'), { timeout: 15000 }).catch(() => null)
await p.click('button[type=submit]')
const resp = await respP
if (resp) { const body = await resp.json().catch(()=>({})); console.log('web3forms status', resp.status(), JSON.stringify(body)) }
else console.log('no web3forms response captured')
// did it reach success UI?
const sent = await p.$('text=Thank you').then(Boolean).catch(()=>false)
console.log('success UI shown:', sent)
await b.close()
