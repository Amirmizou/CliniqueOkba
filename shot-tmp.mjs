import { chromium } from 'playwright'

const browser = await chromium.launch()
const page = await browser.newPage({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true })

page.on('console', (m) => { if (m.type() === 'error') console.log('CONSOLE ERROR:', m.text().slice(0, 200)) })
page.on('pageerror', (e) => console.log('PAGE ERROR:', String(e).slice(0, 300)))

await page.goto('http://localhost:3199/', { waitUntil: 'domcontentloaded' })
await page.waitForTimeout(9000)

const info = await page.evaluate(() => ({
  headers: document.querySelectorAll('header').length,
  nav: document.querySelectorAll('nav').length,
  bodyChildren: document.body.children.length,
  html: document.body.innerHTML.length,
}))
console.log('DOM:', JSON.stringify(info))

await browser.close()
