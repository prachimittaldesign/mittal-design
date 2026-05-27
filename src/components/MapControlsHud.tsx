import type { CameraCmd, ViewMode } from '../types'

interface MapControlsHudProps {
  view: ViewMode
  onToggleView: () => void
  onCmd: (type: CameraCmd['type']) => void
}

// Maps-style controls bottom-right: a 2D/3D toggle, recenter, and zoom. They
// drive the r3f camera via CameraCmd / view (consumed in CameraRig).
export function MapControlsHud({ view, onToggleView, onCmd }: MapControlsHudProps) {
  const btn =
    'flex h-[44px] w-[44px] items-center justify-center rounded-[12px] border border-black/10 bg-white/90 shadow-[0_3px_14px_rgba(0,0,0,0.14)] backdrop-blur-md transition-colors hover:bg-white'

  return (
    <div className="pointer-events-auto absolute bottom-[calc(72px+env(safe-area-inset-bottom))] right-3 z-20 flex flex-col items-center gap-3 sm:bottom-4 sm:right-4">
      <button onClick={onToggleView} className={`${btn} text-[12px] font-bold text-ink`} aria-label="Toggle 2D / 3D view">
        {view === '3d' ? '2D' : '3D'}
      </button>

      <button onClick={() => onCmd('recenter')} className={btn} aria-label="Recenter">
        <svg viewBox="0 0 24 24" fill="none" className="h-[19px] w-[19px] text-ink">
          <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="2" />
          <path d="M12 2v3M12 19v3M2 12h3M19 12h3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
      </button>

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
