// The "Prachi [Mittal]" lockup — boxed surname à la Airbnb's 2021 release.
// Animates in centred, then docks to the top-right corner (Maps account slot).
export function Hero({ docked }: { docked: boolean }) {
  return (
    <div
      className={[
        'absolute z-20 pointer-events-none',
        'transition-all duration-[950ms] ease-[cubic-bezier(.6,.05,.2,1)]',
        docked
          ? 'top-4 right-4 scale-[0.46] origin-top-right'
          : 'top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2',
      ].join(' ')}
    >
      <div className="flex items-center gap-4">
        <div className="text-[90px] font-extrabold tracking-[-0.04em] leading-[0.9] text-ink">
          Prachi
        </div>
        <div className="rounded-[20px] border-4 border-ink px-[22px] pt-[6px] pb-[8px] text-[82px] font-extrabold leading-none tracking-[-0.03em] text-ink">
          Mittal
        </div>
      </div>
      <div className="mt-[10px] text-center text-[21px] font-medium tracking-[0.02em] text-ink-soft">
        Product Designer · Architect
      </div>
    </div>
  )
}
