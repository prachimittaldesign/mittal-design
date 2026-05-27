import { useState } from 'react'
import type { LayerState, MapLayer } from '../types'

interface LayersControlProps {
  layers: LayerState
  onChange: (next: LayerState) => void
  layer: MapLayer | null
  onLayerChange: (layer: MapLayer | null) => void
}

const ROWS: { key: keyof LayerState; label: string }[] = [
  { key: 'showLabels', label: 'Labels' },
  { key: 'showScenery', label: 'Scenery' },
  { key: 'showLandmarks', label: 'Landmarks' },
]

const COLOR_BY: { value: MapLayer | null; label: string }[] = [
  { value: null, label: 'None' },
  { value: 'effort', label: 'Effort' },
  { value: 'ownership', label: 'Ownership' },
]

// Maps-style "Layers" button (bottom-left) with a small popover of toggles and
// a "Color by" metric picker.
export function LayersControl({ layers, onChange, layer, onLayerChange }: LayersControlProps) {
  const [open, setOpen] = useState(false)

  return (
    <div className="pointer-events-auto absolute bottom-[calc(72px+env(safe-area-inset-bottom))] left-3 z-20 sm:bottom-4 sm:left-4">
      {open && (
        <div className="absolute bottom-[calc(100%+10px)] left-0 w-[200px] rounded-[14px] border border-black/10 bg-white/95 p-3 shadow-[0_10px_30px_rgba(0,0,0,0.16)] backdrop-blur-md sm:bottom-0 sm:left-[calc(100%+10px)]">
          <div className="mb-2 font-mono text-[9px] font-bold uppercase tracking-[0.18em] text-ink-soft/70">
            Layers
          </div>
          {ROWS.map((row) => (
            <button
              key={row.key}
              onClick={() => onChange({ ...layers, [row.key]: !layers[row.key] })}
              className="flex w-full items-center justify-between py-[6px] text-left text-[13px] text-ink"
            >
              {row.label}
              <Switch on={layers[row.key]} />
            </button>
          ))}
          <div className="mt-2 border-t border-black/10 pt-[10px]">
            <div className="mb-[7px] font-mono text-[9px] font-bold uppercase tracking-[0.18em] text-ink-soft/70">
              Color by
            </div>
            <div className="flex gap-[5px]">
              {COLOR_BY.map((c) => (
                <button
                  key={c.label}
                  onClick={() => onLayerChange(c.value)}
                  className={[
                    'flex-1 rounded-full border px-[8px] py-[5px] text-[11px] font-medium transition-colors',
                    layer === c.value
                      ? 'border-ink bg-ink text-paper'
                      : 'border-black/15 bg-transparent text-ink hover:bg-black/[0.05]',
                  ].join(' ')}
                >
                  {c.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      <button
        onClick={() => setOpen((o) => !o)}
        className={[
          'flex h-[52px] w-[52px] flex-col items-center justify-center gap-[3px] rounded-[12px] border',
          'bg-white/90 shadow-[0_3px_14px_rgba(0,0,0,0.14)] backdrop-blur-md transition-colors hover:bg-white',
          open ? 'border-ink' : 'border-black/10',
        ].join(' ')}
        aria-label="Map layers"
      >
        <svg viewBox="0 0 24 24" fill="none" className="h-[18px] w-[18px] text-ink">
          <path d="M12 4l8 4-8 4-8-4 8-4z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
          <path d="M4 12l8 4 8-4M4 16l8 4 8-4" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
        </svg>
        <span className="text-[8px] font-semibold uppercase tracking-[0.12em] text-ink-soft">Layers</span>
      </button>
    </div>
  )
}

function Switch({ on }: { on: boolean }) {
  return (
    <span
      className={[
        'relative inline-block h-[16px] w-[28px] flex-shrink-0 rounded-full transition-colors',
        on ? 'bg-ink' : 'bg-black/15',
      ].join(' ')}
    >
      <span
        className={[
          'absolute top-[2px] h-[12px] w-[12px] rounded-full bg-white transition-all',
          on ? 'left-[14px]' : 'left-[2px]',
        ].join(' ')}
      />
    </span>
  )
}
