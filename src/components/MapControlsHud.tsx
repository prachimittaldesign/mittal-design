import type { CameraCmd, ViewMode } from '../types'

interface MapControlsHudProps {
  view: ViewMode
  onSetView: (v: ViewMode) => void
  onCmd: (type: CameraCmd['type']) => void
}

// Skyline silhouette icon — buildings of different heights in a row.
function SkylineIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-[18px] w-[18px] text-ink">
      <rect x="2"  y="13" width="3" height="7" rx="0.5" stroke="currentColor" strokeWidth="1.6" fill="none" />
      <rect x="6"  y="9"  width="3" height="11" rx="0.5" stroke="currentColor" strokeWidth="1.6" fill="none" />
      <rect x="10" y="5"  width="4" height="15" rx="0.5" stroke="currentColor" strokeWidth="1.6" fill="none" />
      <rect x="15" y="8"  width="3" height="12" rx="0.5" stroke="currentColor" strokeWidth="1.6" fill="none" />
      <rect x="19" y="12" width="3" height="8"  rx="0.5" stroke="currentColor" strokeWidth="1.6" fill="none" />
    </svg>
  )
}

export function MapControlsHud({ view, onSetView, onCmd }: MapControlsHudProps) {
  const btn =
    'flex h-[44px] w-[44px] items-center justify-center rounded-[12px] border border-black/10 bg-white/90 shadow-[0_3px_14px_rgba(0,0,0,0.14)] backdrop-blur-md transition-colors hover:bg-white'

  return (
    <div className="pointer-events-auto absolute bottom-[calc(1rem+env(safe-area-inset-bottom))] right-3 z-20 flex flex-col items-center gap-3 sm:bottom-4 sm:right-4">

      {/* View mode: 3D → 2D → Skyline */}
      <div className="flex flex-col overflow-hidden rounded-[12px] border border-black/10 bg-white/90 shadow-[0_3px_14px_rgba(0,0,0,0.14)] backdrop-blur-md">
        <button
          onClick={() => onSetView('3d')}
          className={`flex h-[44px] w-[44px] items-center justify-center text-[11px] font-bold text-ink transition-colors hover:bg-black/[0.05] ${view === '3d' ? 'bg-ink text-paper hover:bg-ink' : ''}`}
          aria-label="3D city view"
        >
          3D
        </button>
        <div className="h-px bg-black/10" />
        <button
          onClick={() => onSetView('iso')}
          className={`flex h-[44px] w-[44px] items-center justify-center text-[11px] font-bold transition-colors hover:bg-black/[0.05] ${view === 'iso' ? 'bg-ink text-paper hover:bg-ink' : 'text-ink'}`}
          aria-label="2D map view"
        >
          2D
        </button>
        <div className="h-px bg-black/10" />
        <button
          onClick={() => onSetView('skyline')}
          className={`flex h-[44px] w-[44px] items-center justify-center transition-colors hover:bg-black/[0.05] ${view === 'skyline' ? 'bg-ink text-paper hover:bg-ink' : 'text-ink'}`}
          aria-label="Skyline view"
        >
          <SkylineIcon />
        </button>
      </div>

      {/* Recenter */}
      <button onClick={() => onCmd('recenter')} className={btn} aria-label="Recenter">
        <svg viewBox="0 0 24 24" fill="none" className="h-[19px] w-[19px] text-ink">
          <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="2" />
          <path d="M12 2v3M12 19v3M2 12h3M19 12h3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
      </button>

      {/* Zoom */}
      <div className="flex flex-col overflow-hidden rounded-[12px] border border-black/10 bg-white/90 shadow-[0_3px_14px_rgba(0,0,0,0.14)] backdrop-blur-md">
        <button
          onClick={() => onCmd('zoomIn')}
          className="flex h-[44px] w-[44px] items-center justify-center text-ink transition-colors hover:bg-black/[0.05]"
          aria-label="Zoom in"
        >
          <svg viewBox="0 0 24 24" fill="none" className="h-[18px] w-[18px]">
            <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </button>
        <div className="h-px bg-black/10" />
        <button
          onClick={() => onCmd('zoomOut')}
          className="flex h-[44px] w-[44px] items-center justify-center text-ink transition-colors hover:bg-black/[0.05]"
          aria-label="Zoom out"
        >
          <svg viewBox="0 0 24 24" fill="none" className="h-[18px] w-[18px]">
            <path d="M5 12h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </button>
      </div>
    </div>
  )
}
