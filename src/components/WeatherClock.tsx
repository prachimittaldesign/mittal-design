import type { HyderabadClock } from '../lib/sky'
import type { Weather } from '../lib/weather'

// Small frosted readout of Hyderabad's local time + live weather. Degrades to
// time-only when the weather fetch is unavailable. Sits under the search box
// (desktop) / under the tag pills (mobile).
export function WeatherClock({ time, weather }: { time: HyderabadClock; weather: Weather | null }) {
  return (
    <div className="pointer-events-none absolute left-3 top-[calc(0.75rem+env(safe-area-inset-top)+96px)] z-20 sm:left-4 sm:top-[64px]">
      <div className="hud flex items-center gap-[8px] rounded-full border px-[13px] py-[7px] text-[12px] shadow-[0_3px_14px_rgba(0,0,0,0.12)] backdrop-blur-md">
        <span className="hud-text font-semibold">Hyderabad</span>
        <span className="hud-soft tabular-nums">
          {time.label} {time.period}
        </span>
        {weather && (
          <>
            <span className="hud-soft">·</span>
            <span className="hud-soft tabular-nums">{weather.tempC}°</span>
            <span aria-hidden title={weather.label}>
              {weather.icon}
            </span>
          </>
        )}
      </div>
    </div>
  )
}
