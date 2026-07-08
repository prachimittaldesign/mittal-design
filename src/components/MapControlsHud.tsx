import { HUD_ICON_BTN } from './hud'
import type { CameraCmd, ViewMode } from '../types'

interface MapControlsHudProps {
  view: ViewMode
  onSetView: (v: ViewMode) => void
  onCmd: (type: CameraCmd['type']) => void
}

// Skyline silhouette icon — buildings of different heights in a row.
// Street View "pegman" — the little figure that completes the walk-the-city
// metaphor for the skyline / presentation mode.
function PegmanIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-[19px] w-[19px]">
      <circle cx="12" cy="4.4" r="2.4" fill="currentColor" />
      <path
        d="M12 7.4c-2 0-3.2 1.1-3.5 2.9l-.8 4.2h2l.5-3v9h1.4v-5h.8v5h1.4v-9l.5 3h2l-.8-4.2C15.2 8.5 14 7.4 12 7.4z"
        fill="currentColor"
      />
    </svg>
  )
}

export function MapControlsHud({ view, onSetView, onCmd }: MapControlsHudProps) {
  const btn = HUD_ICON_BTN

  return (
    <div className="pointer-events-auto absolute bottom-[calc(1rem+env(safe-area-inset-bottom))] right-3 z-20 flex flex-col items-center gap-3 sm:bottom-4 sm:right-4">

      {/* Share / embed */}
      <button
        data-tip="Share or embed this city"
        data-tip-pos="left"
        onClick={() => window.dispatchEvent(new CustomEvent('pm:share-open'))}
        className={`${btn} hud-text`}
        aria-label="Share or embed this city"
      >
        <svg viewBox="0 0 24 24" fill="none" className="h-[18px] w-[18px]">
          <circle cx="18" cy="5" r="2.6" stroke="currentColor" strokeWidth="2" />
          <circle cx="6" cy="12" r="2.6" stroke="currentColor" strokeWidth="2" />
          <circle cx="18" cy="19" r="2.6" stroke="currentColor" strokeWidth="2" />
          <path d="M8.3 10.7l7.4-4.4M8.3 13.3l7.4 4.4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
      </button>

      {/* View mode: 3D → 2D → Street View (skyline presentation) */}
      <div className="hud flex flex-col overflow-hidden rounded-[12px] border shadow-[0_3px_14px_rgba(0,0,0,0.14)] backdrop-blur-md">
        <button
          data-tip="3D city view"
          data-tip-pos="left"
          onClick={() => onSetView('3d')}
          className={`flex h-[44px] w-[44px] items-center justify-center text-[11px] font-bold transition-colors ${view === '3d' ? 'hud-on' : 'hud-text hud-hover'}`}
          aria-label="3D city view"
        >
          3D
        </button>
        <div style={{ background: 'var(--hud-border)' }} className="h-px" />
        <button
          data-tip="2D map view"
          data-tip-pos="left"
          onClick={() => onSetView('iso')}
          className={`flex h-[44px] w-[44px] items-center justify-center text-[11px] font-bold transition-colors ${view === 'iso' ? 'hud-on' : 'hud-text hud-hover'}`}
          aria-label="2D map view"
        >
          2D
        </button>
        <div style={{ background: 'var(--hud-border)' }} className="h-px" />
        <button
          data-tip="Street view — walk the skyline"
          data-tip-pos="left"
          onClick={() => onSetView('skyline')}
          className={`flex h-[44px] w-[44px] items-center justify-center transition-colors ${view === 'skyline' ? 'hud-on' : 'hud-text hud-hover'}`}
          aria-label="Street view / skyline presentation"
          title="Street View — walk the skyline"
        >
          <PegmanIcon />
        </button>
      </div>

      {/* Recenter */}
      <button data-tip="Recenter the city" data-tip-pos="left" onClick={() => onCmd('recenter')} className={`${btn} hud-text`} aria-label="Recenter">
        <svg viewBox="0 0 24 24" fill="none" className="h-[19px] w-[19px]">
          <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="2" />
          <path d="M12 2v3M12 19v3M2 12h3M19 12h3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
      </button>

      {/* Zoom */}
      <div className="hud flex flex-col overflow-hidden rounded-[12px] border shadow-[0_3px_14px_rgba(0,0,0,0.14)] backdrop-blur-md">
        <button
          data-tip="Zoom in"
          data-tip-pos="left"
          onClick={() => onCmd('zoomIn')}
          className="hud-text hud-hover flex h-[44px] w-[44px] items-center justify-center transition-colors"
          aria-label="Zoom in"
        >
          <svg viewBox="0 0 24 24" fill="none" className="h-[18px] w-[18px]">
            <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </button>
        <div style={{ background: 'var(--hud-border)' }} className="h-px" />
        <button
          data-tip="Zoom out"
          data-tip-pos="left"
          onClick={() => onCmd('zoomOut')}
          className="hud-text hud-hover flex h-[44px] w-[44px] items-center justify-center transition-colors"
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
