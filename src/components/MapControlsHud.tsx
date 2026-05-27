import type { CameraCmd } from '../types'

interface MapControlsHudProps {
  onCmd: (type: CameraCmd['type']) => void
}

// Maps-style zoom + recenter buttons, bottom-right. They drive the r3f camera
// via CameraCmd (consumed in CameraRig).
export function MapControlsHud({ onCmd }: MapControlsHudProps) {
  return (
    <div className="pointer-events-auto absolute bottom-4 right-4 z-20 flex flex-col items-center gap-3">
      <button
        onClick={() => onCmd('recenter')}
        className="flex h-[44px] w-[44px] items-center justify-center rounded-[12px] border border-black/10 bg-white/90 shadow-[0_3px_14px_rgba(0,0,0,0.14)] backdrop-blur-md transition-colors hover:bg-white"
        aria-label="Recenter"
      >
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
