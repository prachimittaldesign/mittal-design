import { EFFORT_RAMP, OWNERSHIP_COLORS } from '../scene/lib/cityTheme'
import type { MapLayer } from '../types'

// Legend for the active map layer, shown bottom-center. Frosted glass: a very
// light translucent fill with a strong backdrop blur, so it reads clearly
// without the loud solid panel competing with the scene behind it.
export function Legend({ layer }: { layer: MapLayer }) {
  return (
    <div
      className="pointer-events-none absolute bottom-[calc(1rem+env(safe-area-inset-bottom))] left-1/2 z-20 max-w-[70vw] -translate-x-1/2 rounded-[18px] border px-[14px] py-[8px] backdrop-blur-xl sm:bottom-[58px] sm:max-w-none sm:rounded-full"
      style={{
        background: 'var(--legend-bg)',
        borderColor: 'var(--legend-border)',
        boxShadow: '0 4px 20px rgba(0,0,0,0.10), inset 0 1px 0 rgba(255,255,255,0.25)',
      }}
    >
      {layer === 'effort' ? <EffortLegend /> : <OwnershipLegend />}
    </div>
  )
}

function EffortLegend() {
  return (
    <div className="hud-soft flex flex-wrap items-center justify-center gap-x-[10px] gap-y-1 text-[9px] font-medium sm:text-[10px]">
      <span className="hud-text font-mono uppercase tracking-[0.14em]">Effort</span>
      <span>Light</span>
      <span className="flex overflow-hidden rounded-[3px]">
        {EFFORT_RAMP.map((c) => (
          <span key={c} className="h-[12px] w-[16px]" style={{ background: c }} />
        ))}
      </span>
      <span>Heavy</span>
    </div>
  )
}

const OWNERSHIP_LABELS: Record<string, string> = {
  solo: 'Solo',
  lead: 'Lead',
  collab: 'Collab',
  support: 'Support',
}

function OwnershipLegend() {
  return (
    <div className="hud-soft flex flex-wrap items-center justify-center gap-x-[12px] gap-y-1 text-[9px] font-medium sm:text-[10px]">
      <span className="hud-text font-mono uppercase tracking-[0.14em]">Ownership</span>
      {Object.entries(OWNERSHIP_COLORS).map(([key, color]) => (
        <span key={key} className="flex items-center gap-[5px]">
          <span className="h-[11px] w-[11px] rounded-[2px]" style={{ background: color }} />
          {OWNERSHIP_LABELS[key]}
        </span>
      ))}
    </div>
  )
}
