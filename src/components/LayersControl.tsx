import { useState } from 'react'
import { HUD_ICON_BTN } from './hud'
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
    <div className="pointer-events-auto absolute bottom-[calc(1rem+env(safe-area-inset-bottom)+56px)] left-3 z-20 sm:bottom-[70px] sm:left-4">
      {open && (
        <div className="hud-strong absolute bottom-[calc(100%+10px)] left-0 w-[200px] rounded-[14px] border p-3 shadow-[0_10px_30px_rgba(0,0,0,0.16)] backdrop-blur-md sm:bottom-0 sm:left-[calc(100%+10px)]">
          <div className="hud-soft mb-2 font-mono text-[9px] font-bold uppercase tracking-[0.18em]">
            Layers
          </div>
          {ROWS.map((row) => (
            <button
              key={row.key}
              onClick={() => onChange({ ...layers, [row.key]: !layers[row.key] })}
              className="hud-text flex w-full items-center justify-between py-[6px] text-left text-[13px]"
            >
              {row.label}
              <Switch on={layers[row.key]} />
            </button>
          ))}
          <div className="mt-2 border-t pt-[10px]" style={{ borderColor: 'var(--hud-border)' }}>
            <div className="hud-soft mb-[7px] font-mono text-[9px] font-bold uppercase tracking-[0.18em]">
              Color by
            </div>
            <div className="flex gap-[5px]">
              {COLOR_BY.map((c) => (
                <button
                  key={c.label}
                  onClick={() => onLayerChange(c.value)}
                  className={[
                    'flex-1 rounded-full border px-[8px] py-[5px] text-[11px] font-medium transition-colors',
                    layer === c.value ? 'hud-on' : 'hud-text hud-bd-on bg-transparent',
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
        data-tip="Map layers & colour-by"
        data-tip-pos="right"
        onClick={() => setOpen((o) => !o)}
        className={[HUD_ICON_BTN, open ? 'hud-bd-on' : ''].join(' ')}
        aria-label="Map layers"
      >
        <svg viewBox="0 0 24 24" fill="none" className="hud-text h-[20px] w-[20px]">
          <path d="M12 4l8 4-8 4-8-4 8-4z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
          <path d="M4 12l8 4 8-4M4 16l8 4 8-4" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
        </svg>
      </button>
    </div>
  )
}

function Switch({ on }: { on: boolean }) {
  return (
    <span
      className={[
        'relative inline-block h-[16px] w-[28px] flex-shrink-0 rounded-full transition-colors',
        on ? 'hud-fill' : 'hud-chip-strong',
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
