#!/usr/bin/env node
/**
 * split-slides.js
 * Reads proposal.html and splits each <section> into its own file in src/slides/.
 * Run: node scripts/split-slides.js
 *
 * Safe to re-run: existing files are overwritten.
 */

const fs   = require('fs')
const path = require('path')

const ROOT    = path.join(__dirname, '..')
const INPUT   = path.join(ROOT, 'proposal.html')
const OUT_DIR = path.join(ROOT, 'src', 'slides')

// ── Anim preset heuristic ────────────────────────────────────────────────────
function getAnim(label, idx) {
  const n = String(idx + 1).padStart(2, '0')
  if (n === '01') return 'cover'
  if (/Ch\d+/.test(label)) return 'chapter'
  if (/^(33|34|35|36)/.test(n) || /Finding/.test(label)) return 'finding'
  if (
    /^(04|08|09|38|41|61)/.test(n) ||
    /Sub —|Opportunity|Spirit|Closing|DNA|Concept|Proposition/.test(label)
  ) return 'statement'
  if (/^(16|17|21|25)/.test(n) || /Specialized|Trek|Rapha|Arc/.test(label)) return 'brandcard'
  if (/^(10)/.test(n) || /Tokyo/.test(label)) return 'brandcard'
  if (/^(44|46|48)/.test(n) || /Mood/.test(label)) return 'moodgrid'
  return 'default'
}

// ── Main ─────────────────────────────────────────────────────────────────────
const html = fs.readFileSync(INPUT, 'utf-8')

const deckMatch = html.match(/<deck-stage[^>]*>([\s\S]*?)<\/deck-stage>/)
if (!deckMatch) { console.error('❌  No <deck-stage> found in', INPUT); process.exit(1) }

const sectionRe = /(<section\b[\s\S]*?<\/section>)/g
const sections  = [...deckMatch[1].matchAll(sectionRe)].map(m => m[1])

if (!sections.length) { console.error('❌  No <section> elements found'); process.exit(1) }

fs.mkdirSync(OUT_DIR, { recursive: true })

sections.forEach((raw, i) => {
  const labelMatch = raw.match(/data-label="([^"]+)"/)
  const label      = labelMatch ? labelMatch[1] : `Slide ${i + 1}`
  const slug       = label.replace(/[^a-z0-9]+/gi, '-').toLowerCase().replace(/^-|-$/g, '')
  const n          = String(i + 1).padStart(2, '0')
  const filename   = `${n}-${slug}.html`

  // Inject data-anim unless already present
  const anim    = getAnim(label, i)
  const content = raw.includes('data-anim')
    ? raw
    : raw.replace(/^<section\b/, `<section data-anim="${anim}"`)

  fs.writeFileSync(path.join(OUT_DIR, filename), content.trim() + '\n')
  process.stdout.write(`  ✓ ${filename}\n`)
})

console.log(`\n✅  Split ${sections.length} slides → src/slides/`)
