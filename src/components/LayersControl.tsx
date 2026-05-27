import { useState } from 'react'
import type { LayerState } from '../types'

interface LayersControlProps {
  layers: LayerState
  onChange: (next: LayerState) => void
}

const ROWS: { key: keyof LayerState; label: string }[] = [
  { key: 'showLabels', label: 'Labels' },
  { key: 'showScenery', label: 'Scenery' },
  { key: 'showLandmarks', label: 'Landmarks' },
]

// Maps-style "Layers" button (bottom-left) with a small popover of toggles.
export function LayersControl({ layers, onChange }: LayersControlProps) {
  const [open, setOpen] = useState(false)

  return (
    <div className="pointer-events-auto absolute bottom-4 left-4 z-20">
      {open && (
        <div className="absolute bottom-0 left-[calc(100%+10px)] w-[188px] rounded-[14px] border border-black/10 bg-white/95 p-3 shadow-[0_10px_30px_rgba(0,0,0,0.16)] backdrop-blur-md">
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
          <div className="mt-2 border-t border-black/10 pt-2 font-mono text-[9px] uppercase tracking-[0.14em] text-ink-soft/40">
            Color by · soon
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
