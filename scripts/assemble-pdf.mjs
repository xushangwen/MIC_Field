// 用已有的 screenshots/*.png 合成 PDF。
// QUALITY=0 → PNG 无损嵌入；QUALITY=1..100 → 转高质量 JPEG 嵌入（更小，视觉等同）。
//   node scripts/assemble-pdf.mjs            # 默认 q90 JPEG（轻量）
//   QUALITY=0 node scripts/assemble-pdf.mjs  # 无损 PNG
import { PDFDocument } from 'pdf-lib'
import { execFileSync } from 'node:child_process'
import fs from 'node:fs'
import path from 'node:path'

const DIR = 'screenshots'
const Q = process.env.QUALITY === undefined ? 90 : Number(process.env.QUALITY)
const OUT = process.env.OUT_PDF || (Q === 0 ? 'MIC-Field-提案-无损.pdf' : 'MIC-Field-提案.pdf')
const W = 1920, H = 1080

const files = fs.readdirSync(DIR).filter((f) => f.endsWith('.png')).sort()
if (!files.length) { console.error('没有找到 screenshots/*.png'); process.exit(1) }

const pdf = await PDFDocument.create()
for (const f of files) {
  const png = fs.readFileSync(path.join(DIR, f))
  let img
  if (Q === 0) {
    img = await pdf.embedPng(png)
  } else {
    // 用 ImageMagick 转 JPEG：q90 + 4:4:4 无色度二次采样，保文字/彩色边缘锐利
    const jpg = execFileSync(
      'magick',
      ['png:-', '-quality', String(Q), '-sampling-factor', '4:4:4', 'jpg:-'],
      { input: png, maxBuffer: 64 * 1024 * 1024 },
    )
    img = await pdf.embedJpg(jpg)
  }
  const pg = pdf.addPage([W, H])
  pg.drawImage(img, { x: 0, y: 0, width: W, height: H })
}
fs.writeFileSync(OUT, await pdf.save())
const mb = (fs.statSync(OUT).size / 1048576).toFixed(1)
console.log(`✅ ${OUT}（${files.length} 页, ${Q === 0 ? 'PNG 无损' : 'JPEG q' + Q}, ${mb} MB）`)
