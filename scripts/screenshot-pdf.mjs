// 逐页截图 → 合成无损 PDF。
// 用法：先启动本地服务（vite preview），再 node scripts/screenshot-pdf.mjs
//   DECK_URL  默认 http://localhost:4173/proposal.html
//   OUT_PDF   默认 MIC-Field-提案.pdf
import { chromium } from 'playwright'
import { PDFDocument } from 'pdf-lib'
import fs from 'node:fs'
import path from 'node:path'

const URL = process.env.DECK_URL || 'http://localhost:4173/proposal.html'
const OUT_DIR = 'screenshots'
const OUT_PDF = process.env.OUT_PDF || 'MIC-Field-提案.pdf'
const W = 1920, H = 1080

const browser = await chromium.launch()
const page = await browser.newPage({ viewport: { width: W, height: H }, deviceScaleFactor: 1 })

// 收集页面错误，便于排查空白页
page.on('console', (m) => { if (m.type() === 'error') console.log('  [console.error]', m.text()) })
page.on('pageerror', (e) => console.log('  [pageerror]', e.message))

await page.goto(URL, { waitUntil: 'networkidle', timeout: 60000 })

// 等 deck 就绪（自定义元素升级 + 幻灯片装配完成）
await page.waitForFunction(() => {
  const d = document.querySelector('deck-stage')
  return d && typeof d.goTo === 'function' && d.length > 0
}, { timeout: 30000 })

// 隐藏所有导航 UI：缩略图按钮/面板 + deck 自身的控制条/点按区
await page.addStyleTag({ content: '#sp-toggle,#sp-panel{display:none!important}' })
const hideDeckChrome = () => page.evaluate(() => {
  const sr = document.querySelector('deck-stage')?.shadowRoot
  sr?.querySelector('.overlay')?.style.setProperty('display', 'none', 'important')
  sr?.querySelector('.tapzones')?.style.setProperty('display', 'none', 'important')
})
await hideDeckChrome()
await page.evaluate(() => document.fonts.ready)

const total = await page.evaluate(() => document.querySelector('deck-stage').length)
fs.mkdirSync(OUT_DIR, { recursive: true })
console.log(`共 ${total} 页，开始截图（视口 ${W}×${H}）`)

const files = []
for (let i = 0; i < total; i++) {
  await page.evaluate((idx) => document.querySelector('deck-stage').goTo(idx), i)

  // 等当前页内所有 <img> 加载完成
  await page.waitForFunction(() => {
    const active = document.querySelector('deck-stage [data-deck-active]')
    if (!active) return false
    return [...active.querySelectorAll('img')].every((im) => im.complete && im.naturalWidth > 0)
  }, { timeout: 20000 }).catch(() => console.log(`  ⚠ P${i + 1} 图片等待超时，继续`))

  await hideDeckChrome() // goTo 会重新闪现控制条，再隐藏一次

  // 稳定检测：连续两帧像素完全一致＝入场动画结束（最稳妥，自适应动画时长）
  let prev = null, buf = null, settled = false
  const clip = { x: 0, y: 0, width: W, height: H }
  for (let t = 0; t < 18; t++) {       // 最多 ~7.2s 兜底（覆盖最长 topo 动画）
    await page.waitForTimeout(400)
    buf = await page.screenshot({ type: 'png', clip })
    if (prev && Buffer.compare(prev, buf) === 0) { settled = true; break }
    prev = buf
  }

  const fp = path.join(OUT_DIR, `slide-${String(i + 1).padStart(3, '0')}.png`)
  fs.writeFileSync(fp, buf)
  files.push(fp)
  console.log(`  ✓ P${String(i + 1).padStart(2, '0')}/${total} ${settled ? '已稳定' : '达兜底上限(可能含循环动画/视频)'}`)
}

await browser.close()

// 合成 PDF：PNG 无损嵌入，页面尺寸＝1920×1080 pt
console.log('合成 PDF…')
const pdf = await PDFDocument.create()
for (const fp of files) {
  const img = await pdf.embedPng(fs.readFileSync(fp))
  const pg = pdf.addPage([W, H])
  pg.drawImage(img, { x: 0, y: 0, width: W, height: H })
}
fs.writeFileSync(OUT_PDF, await pdf.save())
const mb = (fs.statSync(OUT_PDF).size / 1048576).toFixed(1)
console.log(`✅ 完成：${OUT_PDF}（${files.length} 页，${mb} MB）`)
