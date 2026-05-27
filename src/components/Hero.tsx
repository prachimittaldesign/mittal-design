import { useIsMobile } from '../lib/useIsMobile'

// The "Prachi [Mittal]" lockup — boxed surname à la Airbnb's 2021 release.
// Animates in centred (type scales fluidly so it always fits), then docks to
// the top-right (Maps account slot). On phones the docked form is a compact
// "PM" monogram chip so it doesn't crowd the search row or the tag pills.
export function Hero({ docked }: { docked: boolean }) {
  const isMobile = useIsMobile()

  return (
    <>
      {/* The lockup: the centred reveal on all sizes, and the docked brand on
          desktop. On mobile it fades out once docked — the chip takes over. */}
      <div
        className={[
          'absolute z-20 pointer-events-none',
          'transition-all duration-[950ms] ease-[cubic-bezier(.6,.05,.2,1)]',
          docked && !isMobile
            ? 'top-4 right-4 scale-[0.46] origin-top-right'
            : 'top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2',
          docked && isMobile ? 'opacity-0' : 'opacity-100',
        ].join(' ')}
      >
        <div className="flex items-center gap-4">
          <div className="text-[clamp(30px,9vw,90px)] font-extrabold tracking-[-0.04em] leading-[0.9] text-ink">
            Prachi
          </div>
          <div className="rounded-[clamp(10px,2vw,20px)] border-2 border-ink px-[clamp(10px,2.2vw,22px)] pt-[clamp(3px,0.6vw,6px)] pb-[clamp(4px,0.8vw,8px)] text-[clamp(27px,8.2vw,82px)] font-extrabold leading-none tracking-[-0.03em] text-ink sm:border-4">
            Mittal
          </div>
        </div>
        <div className="mt-[10px] text-center text-[clamp(11px,2.2vw,21px)] font-medium tracking-[0.02em] text-ink-soft">
          Product Designer · Architect
        </div>
      </div>

      {/* Compact monogram chip — the mobile docked brand (Maps account slot). */}
      {isMobile && (
        <div
          className={[
            'pointer-events-none absolute right-3 top-[calc(0.75rem+env(safe-area-inset-top))] z-20',
            'transition-opacity duration-[600ms]',
            docked ? 'opacity-100' : 'opacity-0',
          ].join(' ')}
        >
          <span className="flex h-9 w-9 items-center justify-center rounded-full border border-black/10 bg-white/85 text-[13px] font-extrabold tracking-[-0.02em] text-ink shadow-[0_2px_10px_rgba(0,0,0,0.1)] backdrop-blur-md">
            PM
          </span>
        </div>
      )}
    </>
  )
}
