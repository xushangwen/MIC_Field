import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { initAnimations } from './animations/index'

import './styles/tokens.css'
import './styles/typography.css'
import './styles/layout.css'
import './styles/components.css'

gsap.registerPlugin(ScrollTrigger)

// ── Assemble slides ───────────────────────────────────────────────────────────
// Vite imports all *.html files in src/slides/ as raw strings, sorted by name.
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

// ── Boot animations after slides are in DOM ───────────────────────────────────
// Use rAF so slotchange has fired and _slides is populated before we animate.
requestAnimationFrame(() => {
  // Re-apply hash deep-link: deck's own _restoreIndex fires at slotchange
  // (sync), so by this rAF tick it already navigated. Only call goTo if it
  // didn't take effect (i.e. deck is still at 0 but hash says otherwise).
  const hashMatch = (location.hash || '').match(/^#(\d+)$/)
  if (hashMatch) {
    const targetIndex = parseInt(hashMatch[1], 10) - 1
    if (targetIndex > 0 && (deck as any).index === 0) {
      ;(deck as any).goTo(targetIndex)
    }
  }
  initAnimations(deck)
})
