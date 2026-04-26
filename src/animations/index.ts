import gsap from 'gsap'

type Slide = Element

/**
 * Animate SVG topo paths on enter.
 * Free equivalent of GSAP DrawSVG — uses strokeDashoffset technique.
 */
function animateTopo(tl: gsap.core.Timeline, slide: Slide): void {
  const els = slide.querySelectorAll<SVGGeometryElement>(
    '.topo path, .topo ellipse, .topo circle, .topo line'
  )
  if (!els.length) return

  els.forEach(el => {
    try {
      const len = el.getTotalLength()
      gsap.set(el, { strokeDasharray: len, strokeDashoffset: len })
    } catch {
      /* some elements may not support getTotalLength */
    }
  })

  tl.to(els, {
    strokeDashoffset: 0,
    duration: 2,
    stagger: 0.18,
    ease: 'power2.inOut',
  }, 0)
}

/**
 * Stagger-animate elements from below with fade.
 */
function fromBelow(
  tl: gsap.core.Timeline,
  els: NodeListOf<Element> | Element[],
  timeOffset: string | number = '-=0.3',
  dist = 22,
  dur = 0.55,
): void {
  const arr = Array.from(els)
  if (!arr.length) return
  tl.from(arr, {
    opacity: 0,
    y: dist,
    duration: dur,
    stagger: 0.1,
    ease: 'power2.out',
  }, timeOffset)
}

// ── Animation Presets ─────────────────────────────────────────────────────────

const presets: Record<string, (tl: gsap.core.Timeline, slide: Slide) => void> = {

  cover(tl, slide) {
    animateTopo(tl, slide)
    const label  = slide.querySelector('.lbl')
    const title  = slide.querySelector('.dp, .jb')
    const rule   = slide.querySelector('.rule')
    const subs   = slide.querySelectorAll('.sb, .sm')
    const footer = slide.querySelector('.row.jsb')

    if (label)      tl.from(label,  { opacity: 0, y: 10, duration: 0.6, ease: 'power2.out' }, 0.2)
    if (title)      tl.from(title,  { opacity: 0, y: 32, duration: 0.9, ease: 'power3.out' }, 0.5)
    if (rule)       tl.from(rule,   { scaleX: 0, duration: 0.4, transformOrigin: 'left center' }, 0.85)
    if (subs.length) fromBelow(tl, subs, 0.9, 16, 0.5)
    if (footer)     tl.from(footer, { opacity: 0, duration: 0.5 }, '-=0.2')
  },

  chapter(tl, slide) {
    animateTopo(tl, slide)
    const num   = slide.querySelector('.ch-n')
    const label = slide.querySelector('.lbl')
    const title = slide.querySelector('.tt')
    const rule  = slide.querySelector('.rule')
    const sub   = slide.querySelector('.sb, .sm')

    if (num)   tl.from(num,   { opacity: 0, x: 60, duration: 1,   ease: 'power3.out' }, 0)
    if (label) tl.from(label, { opacity: 0, y: 10, duration: 0.5 }, 0.35)
    if (title) tl.from(title, { opacity: 0, y: 28, duration: 0.7, ease: 'power2.out' }, 0.55)
    if (rule)  tl.from(rule,  { scaleX: 0, duration: 0.4, transformOrigin: 'left' }, 0.85)
    if (sub)   tl.from(sub,   { opacity: 0, y: 14, duration: 0.5 }, 1.05)
  },

  finding(tl, slide) {
    const num     = slide.querySelector('.fn-n')
    const content = slide.querySelectorAll('.lbl, .dp, .bd, .sm')

    if (num) tl.from(num, { opacity: 0, scale: 0.75, duration: 1, ease: 'power3.out' }, 0)
    fromBelow(tl, content, 0.4, 24, 0.65)
  },

  statement(tl, slide) {
    animateTopo(tl, slide)
    const label    = slide.querySelector('.lbl')
    const headline = slide.querySelector('.jb, .dp')
    const rule     = slide.querySelector('.rule')
    const subs     = slide.querySelectorAll('.bd, .sm, .xs')

    if (label)      tl.from(label,    { opacity: 0, y: 10, duration: 0.5 }, 0.15)
    if (headline)   tl.from(headline, { opacity: 0, y: 36, duration: 0.9, ease: 'power3.out' }, 0.35)
    if (rule)       tl.from(rule,     { scaleX: 0, duration: 0.4, transformOrigin: 'center' }, 0.8)
    if (subs.length) fromBelow(tl, subs, 0.75, 16, 0.5)
  },

  brandcard(tl, slide) {
    const imgCol  = slide.querySelector('.b-img')
    const infoCol = slide.querySelector('.b-info')

    if (imgCol)  tl.from(imgCol, { opacity: 0, x: -24, duration: 0.8, ease: 'power2.out' }, 0)
    if (infoCol) {
      const kids = Array.from(infoCol.children)
      tl.from(kids, { opacity: 0, y: 20, duration: 0.55, stagger: 0.14, ease: 'power2.out' }, 0.3)
    }
  },

  moodgrid(tl, slide) {
    const wrapper = slide.querySelector(':scope > div[style*="grid"]')
    const cells   = wrapper
      ? Array.from(wrapper.children)
      : Array.from(slide.querySelectorAll(':scope > div > div[style*="background"]'))

    if (cells.length) {
      tl.from(cells, {
        opacity: 0,
        scale: 0.95,
        duration: 0.45,
        stagger: { each: 0.06, from: 'random' },
        ease: 'power2.out',
      }, 0)
    }
  },

  default(tl, slide) {
    const els = slide.querySelectorAll(
      '.lbl, .dp, .jb, .tt, .sb, .bd, .sm, .xs, .insight, .kw, .dot'
    )
    if (els.length) fromBelow(tl, els, 0, 18, 0.5)
  },
}

// ── Public API ────────────────────────────────────────────────────────────────

export function initAnimations(deckEl: Element): void {
  deckEl.addEventListener('slidechange', (e: Event) => {
    const { slide } = (e as CustomEvent).detail as { slide: HTMLElement | null }
    if (!slide || slide.dataset.animated) return

    const preset = slide.dataset.anim ?? 'default'
    const fn     = presets[preset] ?? presets.default

    const tl = gsap.timeline()
    fn(tl, slide)

    slide.dataset.animated = '1'
  })
}
