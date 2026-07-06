import { useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'

/**
 * Singleton tooltip layer for every HUD micro-frontend.
 *
 * Any element may declare `data-tip="Label"` (+ optional
 * `data-tip-pos="top|bottom|left|right"`, default top). One fixed chip is
 * portaled to <body> and repositioned next to whatever is hovered/focused, so
 * tooltips are never clipped by overflow-hidden HUD containers and every
 * control shares identical timing and styling.
 *
 * Smoothness rules:
 *  - 350ms intent delay before the first show (no flicker while the cursor
 *    sweeps across the HUD)…
 *  - …but "warm switching": moving between adjacent controls while (or just
 *    after) a tip is visible swaps in ~60ms, like native toolbars.
 *  - Hidden instantly on click / scroll / leave.
 *  - Keyboard: :focus-visible shows the tip immediately, blur hides it.
 *  - Touch devices (no hover) never see it — long-press ≠ hover.
 */
export function TooltipLayer() {
  const chipRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return
    const chip = chipRef.current
    if (!chip) return

    let showTimer = 0
    let current: HTMLElement | null = null
    let warmUntil = 0

    const clamp = (v: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, v))

    const place = (el: HTMLElement) => {
      const text = el.getAttribute('data-tip')
      if (!text) return
      chip.textContent = text
      // Measure invisibly, then position.
      chip.style.visibility = 'hidden'
      chip.classList.add('tt-show')
      const cw = chip.offsetWidth
      const ch = chip.offsetHeight
      const r = el.getBoundingClientRect()
      const GAP = 9
      const pos = el.getAttribute('data-tip-pos') ?? 'top'
      let x: number
      let y: number
      switch (pos) {
        case 'left':
          x = r.left - cw - GAP
          y = r.top + r.height / 2 - ch / 2
          break
        case 'right':
          x = r.right + GAP
          y = r.top + r.height / 2 - ch / 2
          break
        case 'bottom':
          x = r.left + r.width / 2 - cw / 2
          y = r.bottom + GAP
          break
        default: // top
          x = r.left + r.width / 2 - cw / 2
          y = r.top - ch - GAP
      }
      chip.style.left = `${clamp(x, 8, window.innerWidth - cw - 8)}px`
      chip.style.top = `${clamp(y, 8, window.innerHeight - ch - 8)}px`
      chip.style.visibility = 'visible'
    }

    const hide = () => {
      window.clearTimeout(showTimer)
      if (chip.classList.contains('tt-show')) warmUntil = performance.now() + 350
      current = null
      chip.classList.remove('tt-show')
    }

    const onOver = (e: Event) => {
      const el = (e.target as Element).closest?.('[data-tip]') as HTMLElement | null
      if (!el || el === current) return
      window.clearTimeout(showTimer)
      current = el
      const warm = chip.classList.contains('tt-show') || performance.now() < warmUntil
      showTimer = window.setTimeout(
        () => {
          if (current === el && el.isConnected) place(el)
        },
        warm ? 60 : 350,
      )
    }

    const onOut = (e: PointerEvent) => {
      const el = (e.target as Element).closest?.('[data-tip]')
      if (el && el === current && !el.contains(e.relatedTarget as Node)) hide()
    }

    const onFocus = (e: FocusEvent) => {
      const el = (e.target as Element).closest?.('[data-tip]') as HTMLElement | null
      if (el && el.matches(':focus-visible')) {
        current = el
        place(el)
      }
    }

    document.addEventListener('pointerover', onOver, true)
    document.addEventListener('pointerout', onOut, true)
    document.addEventListener('pointerdown', hide, true)
    document.addEventListener('focusin', onFocus)
    document.addEventListener('focusout', hide)
    window.addEventListener('scroll', hide, true)
    window.addEventListener('resize', hide)
    return () => {
      window.clearTimeout(showTimer)
      document.removeEventListener('pointerover', onOver, true)
      document.removeEventListener('pointerout', onOut, true)
      document.removeEventListener('pointerdown', hide, true)
      document.removeEventListener('focusin', onFocus)
      document.removeEventListener('focusout', hide)
      window.removeEventListener('scroll', hide, true)
      window.removeEventListener('resize', hide)
    }
  }, [])

  return createPortal(<div ref={chipRef} className="tt-chip" role="tooltip" aria-hidden />, document.body)
}
