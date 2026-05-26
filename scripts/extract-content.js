// 一次性内容提取脚本：把 src/slides/*.html 解析成 Markdown 内容大纲，供对照参考。
// 运行：node scripts/extract-content.js > 提案内容文档.md
const fs = require('fs')
const path = require('path')

const SLIDES_DIR = path.join(__dirname, '..', 'src', 'slides')
const BG_NAME = {
  'bg-dk': '深底 #0B0C10',
  'bg-md': '中灰 #171A1F',
  'bg-wm': '暖白 #F4F0E8',
  'bg-am': '琥珀 #C8683A',
  'bg-tl': '蓝绿 #1E7085',
  'bg-st': '石色 #E2DDD4',
}

const decode = (s) =>
  s
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&mdash;/g, '—')
    .replace(/&ndash;/g, '–')
    .replace(/&middot;/g, '·')
    .replace(/&hellip;/g, '…')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;|&apos;/g, "'")
    .replace(/&[a-z]+;/gi, ' ')

// 把一段 section HTML 拆成有序的可见文本行（丢弃 style/script/svg/图片）。
function extractLines(html) {
  let s = html
    .replace(/<style[\s\S]*?<\/style>/gi, '')
    .replace(/<script[\s\S]*?<\/script>/gi, '')
    .replace(/<svg[\s\S]*?<\/svg>/gi, '')
    .replace(/<!--[\s\S]*?-->/g, '')
  // 块级元素边界转换行
  s = s.replace(/<\/(h1|h2|h3|h4|p|div|li|section|figcaption|td|th|tr)>/gi, '\n')
  s = s.replace(/<br\s*\/?>/gi, '\n')
  // 去掉剩余标签
  s = s.replace(/<[^>]+>/g, '')
  s = decode(s)
  const lines = []
  for (let raw of s.split('\n')) {
    const line = raw.replace(/\s+/g, ' ').trim()
    if (!line) continue
    if (lines[lines.length - 1] === line) continue // 折叠相邻重复
    lines.push(line)
  }
  return lines
}

const files = fs
  .readdirSync(SLIDES_DIR)
  .filter((f) => f.endsWith('.html'))
  .sort()

const out = []
out.push('# MIC Field 品牌方向提案 — 内容文档')
out.push('')
out.push(`> 自动从 \`src/slides/*.html\` 提取，共 **${files.length}** 页。播放顺序＝文件名顺序。`)
out.push('> 每页列出：页码 · 标题 · 背景色 · 正文要点。供对照参考，非逐字稿。')
out.push('')

files.forEach((file, idx) => {
  const html = fs.readFileSync(path.join(SLIDES_DIR, file), 'utf8')
  const labelRaw = (html.match(/data-label="([^"]*)"/) || [])[1] || file
  const title = labelRaw.replace(/^\d+[a-z]?\d*\s+/i, '').trim() || labelRaw
  const bgClass = (html.match(/class="[^"]*\b(bg-[a-z]{2})\b[^"]*"/) || [])[1] || 'bg-dk'
  const bg = BG_NAME[bgClass] || bgClass
  const pageNo = String(idx + 1).padStart(2, '0')

  // 章节分隔：data-label 含 "Ch0X"
  const chapter = title.match(/^Ch0?\d+\s*—\s*(.+)$/i)
  if (chapter) {
    out.push('')
    out.push(`---`)
    out.push('')
    out.push(`## ${title}`)
    out.push('')
  }

  out.push(`### P${pageNo} · ${title}`)
  out.push(`*背景：${bg}*`)
  out.push('')

  const lines = extractLines(html).filter((l) => l !== title && l !== labelRaw)
  if (lines.length === 0) {
    out.push('（视觉为主，无正文文本）')
  } else {
    for (const l of lines) out.push(`- ${l}`)
  }
  out.push('')
})

process.stdout.write(out.join('\n'))
