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

      {/* Mobile: compact chip paired with the music icon at the bottom-left.
          Shows time + temp only — "Hyderabad" is implicit on her portfolio.
          left-[68px] clears the 44px music button (12px + 44px + 12px gap). */}
      <div className="pointer-events-none absolute bottom-[calc(1rem+env(safe-area-inset-bottom))] left-[68px] z-20 sm:hidden">
        <div className="hud flex items-center gap-[5px] rounded-full border px-[11px] py-[6px] text-[11px] shadow-[0_3px_14px_rgba(0,0,0,0.12)] backdrop-blur-md">
          <span className="hud-text tabular-nums">{time.label} {time.period}</span>
          {weather && (
            <>
              <span className="hud-soft">·</span>
              <span className="hud-soft tabular-nums">{weather.tempC}°</span>
              <span aria-hidden title={weather.label}>{weather.icon}</span>
            </>
          )}
        </div>
      </div>
    </>
  )
}
