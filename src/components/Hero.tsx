// The "Prachi [Mittal]" lockup — animates in centred, then docks to the
// top-right corner. Light treatment with a soft glow so it reads against the
// rich sunset cityscape behind it.
export function Hero({ docked }: { docked: boolean }) {
  return (
    <div
      className={[
        'absolute z-20 pointer-events-none select-none',
        'transition-all duration-[1100ms] ease-[cubic-bezier(.6,.05,.2,1)]',
        docked
          ? 'top-4 right-4 scale-[0.46] origin-top-right'
          : 'top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2',
      ].join(' ')}
      style={{ filter: 'drop-shadow(0 4px 24px rgba(0,0,0,0.55))' }}
    >
      <div className="flex items-center gap-4">
        <div className="text-[90px] font-extrabold tracking-[-0.04em] leading-[0.9] text-white">
          Prachi
        </div>
        <div className="rounded-[20px] border-4 border-white px-[22px] pt-[6px] pb-[8px] text-[82px] font-extrabold leading-none tracking-[-0.03em] text-white">
          Mittal
        </div>
      </div>
      <div className="mt-[10px] text-center text-[21px] font-medium tracking-[0.06em] text-white/90">
        Product Designer · 3 Years Crafting Digital Worlds
      </div>
    </div>
  )
}
