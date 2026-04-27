import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { initAnimations } from './animations/index'

import 'remixicon/fonts/remixicon.css'
import './styles/tokens.css'
import './styles/typography.css'
import './styles/layout.css'
import './styles/components.css'

gsap.registerPlugin(ScrollTrigger)

// ── Assemble slides ───────────────────────────────────────────────────────────
const slideModules = import.meta.glob<string>('./slides/*.html', {
  query: '?raw',
  import: 'default',
  eager: true,
})

const slides = Object.entries(slideModules)
  .sort(([a], [b]) => a.localeCompare(b))
  .map(([, html]) => html)

const deck = document.querySelector('deck-stage')
if (!deck) throw new Error('<deck-stage> element not found in DOM')

deck.innerHTML = slides.join('\n')

// ── Inject page numbers ───────────────────────────────────────────────────────
deck.querySelectorAll('section').forEach((section, i) => {
  if (i === 0) return
  const pn = document.createElement('div')
  pn.className = 'pg-n'
  pn.textContent = String(i + 1).padStart(2, '0')
  section.appendChild(pn)
})

// ── Thumbnail panel ───────────────────────────────────────────────────────────
function buildThumbnailPanel(deckEl: Element) {
  const sections = Array.from(deckEl.querySelectorAll('section')) as HTMLElement[]
  if (!sections.length) return

  const BG_COLOR: Record<string, string> = {
    'bg-dk': '#0B0C10',
    'bg-md': '#171A1F',
    'bg-wm': '#F4F0E8',
    'bg-am': '#C8683A',
    'bg-tl': '#1E7085',
    'bg-st': '#E2DDD4',
  }
  const TEXT_COLOR: Record<string, string> = {
    'bg-dk': 'rgba(244,240,232,.72)',
    'bg-md': 'rgba(244,240,232,.72)',
    'bg-wm': 'rgba(26,24,21,.72)',
    'bg-am': 'rgba(255,255,255,.9)',
    'bg-tl': 'rgba(255,255,255,.9)',
    'bg-st': 'rgba(26,24,21,.72)',
  }

  const style = document.createElement('style')
  style.textContent = `
    #sp-toggle {
      position: fixed;
      bottom: 22px;
      right: 20px;
      z-index: 9100;
      display: flex;
      align-items: center;
      gap: 6px;
      height: 28px;
      padding: 0 12px;
      background: rgba(0,0,0,.82);
      color: rgba(255,255,255,.7);
      border: none;
      border-radius: 999px;
      font-size: 12px;
      font-weight: 500;
      letter-spacing: .04em;
      font-family: -apple-system, BlinkMacSystemFont, "Helvetica Neue", sans-serif;
      cursor: pointer;
      backdrop-filter: blur(8px);
      -webkit-backdrop-filter: blur(8px);
      transition: background 140ms, color 140ms;
      user-select: none;
    }
    #sp-toggle:hover { background: rgba(0,0,0,.95); color: #fff; }
    #sp-toggle[data-open] { color: #C8683A; }
    #sp-toggle svg { flex-shrink: 0; }

    #sp-panel {
      position: fixed;
      top: 0;
      right: 0;
      bottom: 0;
      width: 268px;
      background: rgba(7,8,11,.96);
      backdrop-filter: blur(20px);
      -webkit-backdrop-filter: blur(20px);
      border-left: 1px solid rgba(255,255,255,.07);
      z-index: 9000;
      overflow-y: auto;
      padding: 24px 14px 72px;
      transform: translateX(100%);
      transition: transform 280ms cubic-bezier(.22,.8,.22,1);
      overscroll-behavior: contain;
      scrollbar-width: thin;
      scrollbar-color: rgba(255,255,255,.1) transparent;
    }
    #sp-panel[data-open] { transform: translateX(0); }
    #sp-panel::-webkit-scrollbar { width: 3px; }
    #sp-panel::-webkit-scrollbar-thumb { background: rgba(255,255,255,.12); border-radius: 2px; }

    .sp-hdr {
      font-family: -apple-system, BlinkMacSystemFont, sans-serif;
      font-size: 10px;
      font-weight: 700;
      letter-spacing: .12em;
      text-transform: uppercase;
      color: rgba(255,255,255,.24);
      margin-bottom: 16px;
      padding: 0 3px;
    }

    .sp-item {
      display: flex;
      gap: 8px;
      align-items: flex-start;
      padding: 5px;
      border-radius: 7px;
      cursor: pointer;
      transition: background 100ms;
      margin-bottom: 3px;
      user-select: none;
    }
    .sp-item:hover { background: rgba(255,255,255,.06); }
    .sp-item.sp-active { background: rgba(200,104,58,.1); }

    .sp-n {
      font-family: 'Space Grotesk', ui-monospace, monospace;
      font-size: 10px;
      font-weight: 500;
      color: rgba(255,255,255,.28);
      min-width: 20px;
      padding-top: 3px;
      letter-spacing: .04em;
      flex-shrink: 0;
    }
    .sp-item.sp-active .sp-n { color: #C8683A; }

    .sp-thumb {
      flex: 1;
      aspect-ratio: 16 / 9;
      border-radius: 4px;
      position: relative;
      overflow: hidden;
      border: 1.5px solid rgba(255,255,255,.07);
      transition: border-color 100ms;
    }
    .sp-item.sp-active .sp-thumb { border-color: #C8683A; }

    .sp-lbl {
      position: absolute;
      inset: 0;
      display: flex;
      align-items: center;
      justify-content: center;
      text-align: center;
      padding: 4px 6px;
      font-family: -apple-system, BlinkMacSystemFont, sans-serif;
      font-size: 8.5px;
      font-weight: 500;
      line-height: 1.4;
      letter-spacing: .01em;
    }
  `
  document.head.appendChild(style)

  // Toggle button
  const toggle = document.createElement('button')
  toggle.id = 'sp-toggle'
  toggle.type = 'button'
  toggle.setAttribute('aria-label', '幻灯片缩略图面板 (G)')
  toggle.innerHTML = `
    <svg width="11" height="11" viewBox="0 0 11 11" fill="currentColor" aria-hidden="true">
      <rect x="0"   y="0" width="4.5" height="3"   rx=".6"/>
      <rect x="6.5" y="0" width="4.5" height="3"   rx=".6"/>
      <rect x="0"   y="4" width="4.5" height="3"   rx=".6"/>
      <rect x="6.5" y="4" width="4.5" height="3"   rx=".6"/>
      <rect x="0"   y="8" width="4.5" height="2.6" rx=".6"/>
      <rect x="6.5" y="8" width="4.5" height="2.6" rx=".6"/>
    </svg>
    幻灯片
  `
  document.body.appendChild(toggle)

  // Panel
  const panel = document.createElement('div')
  panel.id = 'sp-panel'
  panel.setAttribute('role', 'navigation')
  panel.setAttribute('aria-label', '幻灯片列表')

  const hdr = document.createElement('div')
  hdr.className = 'sp-hdr'
  hdr.textContent = `所有幻灯片 · ${sections.length}`
  panel.appendChild(hdr)

  sections.forEach((section, i) => {
    const bg = [...section.classList].find(c => c.startsWith('bg-')) ?? 'bg-dk'
    const bgColor = BG_COLOR[bg] ?? '#0B0C10'
    const textColor = TEXT_COLOR[bg] ?? 'rgba(244,240,232,.7)'
    const rawLabel = section.getAttribute('data-screen-label') ?? `Slide ${i + 1}`
    const label = rawLabel.replace(/^\d+\s*/, '').trim()

    const item = document.createElement('div')
    item.className = 'sp-item'
    item.dataset.idx = String(i)

    const num = document.createElement('div')
    num.className = 'sp-n'
    num.textContent = String(i + 1).padStart(2, '0')

    const thumb = document.createElement('div')
    thumb.className = 'sp-thumb'
    thumb.style.background = bgColor

    const lbl = document.createElement('div')
    lbl.className = 'sp-lbl'
    lbl.style.color = textColor
    lbl.textContent = label

    thumb.appendChild(lbl)
    item.append(num, thumb)
    item.addEventListener('click', () => { ;(deckEl as any).goTo(i) })
    panel.appendChild(item)
  })

  document.body.appendChild(panel)

  // State & behavior
  let open = false

  function setOpen(val: boolean) {
    open = val
    panel.toggleAttribute('data-open', open)
    toggle.toggleAttribute('data-open', open)
    if (open) syncScroll((deckEl as any).index ?? 0)
  }

  function syncActive(idx: number) {
    panel.querySelectorAll<HTMLElement>('.sp-item').forEach((el, i) => {
      el.classList.toggle('sp-active', i === idx)
    })
  }

  function syncScroll(idx: number) {
    const active = panel.querySelector<HTMLElement>('.sp-item.sp-active')
    active?.scrollIntoView({ block: 'nearest', behavior: 'smooth' })
  }

  toggle.addEventListener('click', () => setOpen(!open))

  window.addEventListener('keydown', (e) => {
    if (e.metaKey || e.ctrlKey || e.altKey) return
    const t = e.target as HTMLElement
    if (t?.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(t?.tagName ?? '')) return
    if (e.key === 'g' || e.key === 'G') { e.preventDefault(); setOpen(!open) }
    if (e.key === 'Escape' && open) { e.preventDefault(); setOpen(false) }
  })

  deckEl.addEventListener('slidechange', (e: Event) => {
    const idx = (e as CustomEvent).detail.index
    syncActive(idx)
    if (open) syncScroll(idx)
  })

  syncActive((deckEl as any).index ?? 0)
}

// ── Boot ──────────────────────────────────────────────────────────────────────
requestAnimationFrame(() => {
  const hashMatch = (location.hash || '').match(/^#(\d+)$/)
  if (hashMatch) {
    const targetIndex = parseInt(hashMatch[1], 10) - 1
    if (targetIndex > 0 && (deck as any).index === 0) {
      ;(deck as any).goTo(targetIndex)
    }
  }
  initAnimations(deck)
  buildThumbnailPanel(deck)
})
