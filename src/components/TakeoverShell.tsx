import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'

interface TakeoverShellProps {
  /** Bounding rect of the clicked object, so the card can expand from it. */
  tileRect: DOMRect
  accent: string
  onClose: () => void
  children: React.ReactNode
  /** Accessible name announced when the dialog opens (e.g. the project name). */
  ariaLabel?: string
  /** Bare mode: no built-in padding — the child owns the full canvas (used by
      the rich Apple-style CaseStudy, whose sections are full-bleed bands). */
  bare?: boolean
  /** Identity of the content currently shown. ProjectOverlay reuses one
      TakeoverShell instance across project switches and lock→unlock swaps
      (no `key`, so React never remounts it), which otherwise leaves the
      scroll container wherever the previous content left it — e.g. opening
      a gated study lands mid-page instead of at the top once unlocked.
      Changing this value snaps scroll back to 0. */
  contentKey?: string
}

// The fullscreen "takeover" animation shell: expands a card from a screen rect
// to fullscreen and collapses back. Content-agnostic — used by both the project
// overlay and the landmark (place) overlay.
export function TakeoverShell({ tileRect, accent, onClose, children, ariaLabel, bare = false, contentKey }: TakeoverShellProps) {
  const [open, setOpen] = useState(false)
  const dialogRef = useRef<HTMLDivElement>(null)
  const restoreRef = useRef<HTMLElement | null>(null)
  const scrollRef = useRef<HTMLDivElement>(null)
  // Guards onClose against double-firing (Escape + backdrop click + close button
  // can all land during the 650ms collapse — that would pushState / clear the
  // overlay twice).
  const closingRef = useRef(false)

  useEffect(() => {
    // Two rAFs so the browser paints the collapsed start state first.
    let inner = 0
    const outer = requestAnimationFrame(() => {
      inner = requestAnimationFrame(() => setOpen(true))
    })
    return () => {
      cancelAnimationFrame(outer)
      cancelAnimationFrame(inner)
    }
  }, [])

  // A11y: this is a modal dialog. Move focus into it when it finishes expanding
  // (so keyboard + screen-reader users land inside, not on the now-hidden city),
  // and restore focus to the element that opened it when it unmounts.
  useEffect(() => {
    restoreRef.current = (document.activeElement as HTMLElement | null) ?? null
    return () => restoreRef.current?.focus?.()
  }, [])
  useEffect(() => {
    if (open) dialogRef.current?.focus()
  }, [open])

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = 0
  }, [contentKey])

  const handleClose = () => {
    if (closingRef.current) return
    closingRef.current = true
    setOpen(false)
    setTimeout(onClose, 650)
  }

  // Escape closes the dialog — standard keyboard affordance.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') handleClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const overlayStyle = open
    ? { top: 0, left: 0, width: '100%', height: '100%', borderRadius: 0 }
    : {
        top: tileRect.top,
        left: tileRect.left,
        width: Math.max(tileRect.width, 80),
        height: Math.max(tileRect.height, 60),
        borderRadius: 14,
      }

  return createPortal(
    <>
      {/* Frosted backdrop — click to close */}
      <div
        onClick={handleClose}
        className="fixed inset-0 z-[45] transition-all duration-[550ms]"
        style={{
          background: open ? 'rgba(251,247,238,0.55)' : 'rgba(251,247,238,0)',
          backdropFilter: open ? 'blur(4px)' : 'none',
          pointerEvents: open ? 'auto' : 'none',
        }}
      />

      {/* Expanding card */}
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-label={ariaLabel ?? 'Details'}
        tabIndex={-1}
        className="fixed z-[50] overflow-hidden bg-paper outline-none transition-all duration-[600ms] ease-[cubic-bezier(0.4,0,0.2,1)]"
        style={overlayStyle}
      >
        <div
          className="absolute inset-x-0 top-0 h-[5px] transition-opacity duration-[400ms] delay-[200ms]"
          style={{ background: accent, opacity: open ? 1 : 0 }}
        />
        <div
          ref={scrollRef}
          className={[
            'absolute inset-0 overflow-y-auto overflow-x-hidden',
            bare
              ? ''
              : 'px-[min(10vw,96px)] pt-[calc(88px+env(safe-area-inset-top))] pb-[calc(80px+env(safe-area-inset-bottom))]',
            'transition-opacity duration-[360ms] delay-[320ms]',
            open ? 'opacity-100' : 'opacity-0',
          ].join(' ')}
        >
          {children}
        </div>
      </div>

      {/* Close button */}
      <button
        data-tip="Close · Esc"
        data-tip-pos="left"
        onClick={handleClose}
        className={[
          'fixed right-[max(22px,env(safe-area-inset-right))] top-[max(22px,env(safe-area-inset-top))] z-[60] flex h-11 w-11 items-center justify-center',
          'rounded-[22px] border-none bg-ink/[0.09] text-[20px] leading-none text-ink',
          'transition-opacity duration-[360ms] delay-[320ms] hover:bg-ink/[0.16]',
          open ? 'opacity-100' : 'opacity-0',
        ].join(' ')}
        aria-label="Close"
      >
        ×
      </button>
    </>,
    document.body,
  )
}
