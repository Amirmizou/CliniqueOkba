import { chromium } from 'playwright'
import fs from 'node:fs'

const OUT = process.argv[2] || './shots'
fs.mkdirSync(OUT, { recursive: true })
const BASE = 'http://localhost:3000'

const pages = [
  ['home', '/'],
  ['actualites', '/actualites'],
  ['evenements', '/evenements'],
  ['equipe', '/equipe'],
  ['faq', '/faq'],
  ['pole', '/poles/imagerie-medicale'],
]
const locales = ['fr', 'ar']
const viewports = [
  ['desktop', 1366, 900],
  ['mobile', 390, 844],
]

const browser = await chromium.launch()
for (const [vname, w, h] of viewports) {
  const ctx = await browser.newContext({ viewport: { width: w, height: h }, deviceScaleFactor: 1 })
  const page = await ctx.newPage()
  for (const loc of locales) {
    for (const [name, path] of pages) {
      const url = loc === 'ar' ? `${BASE}/ar${path === '/' ? '' : path}` : `${BASE}${path}`
      try {
        await page.goto(url, { waitUntil: 'networkidle', timeout: 45000 })
      } catch {
        try { await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 45000 }) } catch (e) { console.log('FAIL', url, e.message); continue }
      }
      await page.waitForTimeout(2500)
      const file = `${OUT}/${vname}-${loc}-${name}.png`
      try {
        await page.screenshot({ path: file, fullPage: true })
        console.log('OK', file)
      } catch (e) { console.log('SHOT-FAIL', file, e.message) }
    }
  }
  await ctx.close()
}
await browser.close()
console.log('DONE')
