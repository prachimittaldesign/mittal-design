import type { HyderabadClock } from '../lib/sky'
import type { Weather } from '../lib/weather'

export function WeatherClock({ time, weather }: { time: HyderabadClock; weather: Weather | null }) {
  return (
    <>
      {/* Desktop: full labelled pill top-left below the search bar */}
      <div className="pointer-events-none absolute left-4 top-[64px] z-20 hidden sm:block">
        <div
          className="hud pointer-events-auto flex items-center gap-[8px] rounded-full border px-[13px] py-[7px] text-[12px] shadow-[0_3px_14px_rgba(0,0,0,0.12)] backdrop-blur-md"
          data-tip="Live time & weather in Hyderabad — the city's sky follows it"
          data-tip-pos="bottom"
        >
          <span className="hud-text font-semibold">Hyderabad</span>
          <span className="hud-soft tabular-nums">
            {time.label} {time.period}
          </span>
          {weather && (
            <>
              <span className="hud-soft">·</span>
              <span className="hud-soft tabular-nums">{weather.tempC}°</span>
              <span aria-hidden title={weather.label}>{weather.icon}</span>
            </>
          )}
        </div>
      </div>

      {/* Mobile: rendered as the leading pill in the filter-chip row instead —
          see TagPills. (Nothing here on mobile.) */}
    </>
  )
}
