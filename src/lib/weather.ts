// Live weather for Hyderabad via Open-Meteo (free, keyless). Browser-side fetch;
// returns null on any failure so the scene falls back to time-only lighting.

export type Condition = 'clear' | 'partly' | 'cloudy' | 'fog' | 'rain' | 'snow' | 'storm'

export interface Weather {
  tempC: number
  code: number
  condition: Condition
  isDay: boolean
  rain: boolean
  icon: string
  label: string
}

const HYDERABAD = { lat: 17.385, lon: 78.4867 }

function iconFor(c: Condition, day: boolean): string {
  switch (c) {
    case 'clear':
      return day ? '☀️' : '🌙' // sun / moon
    case 'partly':
      return day ? '⛅' : '☁️'
    case 'cloudy':
      return '☁️'
    case 'fog':
      return '🌫️'
    case 'rain':
      return '🌧️'
    case 'snow':
      return '🌨️'
    case 'storm':
      return '⛈️'
  }
}

// WMO weather codes → a coarse condition + a human label.
function classify(code: number, tempC: number, isDay: boolean): Weather {
  let condition: Condition
  let label: string
  if (code <= 1) {
    condition = 'clear'
    label = code === 0 ? 'Clear sky' : 'Mainly clear'
  } else if (code === 2) {
    condition = 'partly'
    label = 'Partly cloudy'
  } else if (code === 3) {
    condition = 'cloudy'
    label = 'Overcast'
  } else if (code === 45 || code === 48) {
    condition = 'fog'
    label = 'Fog'
  } else if (code >= 51 && code <= 57) {
    condition = 'rain'
    label = 'Drizzle'
  } else if (code >= 61 && code <= 67) {
    condition = 'rain'
    label = 'Rain'
  } else if (code >= 71 && code <= 77) {
    condition = 'snow'
    label = 'Snow'
  } else if (code >= 80 && code <= 82) {
    condition = 'rain'
    label = 'Showers'
  } else if (code === 85 || code === 86) {
    condition = 'snow'
    label = 'Snow showers'
  } else if (code >= 95) {
    condition = 'storm'
    label = 'Thunderstorm'
  } else {
    condition = 'cloudy'
    label = 'Cloudy'
  }
  const rain = condition === 'rain' || condition === 'storm'
  return { tempC, code, condition, isDay, rain, icon: iconFor(condition, isDay), label }
}

// Dev/QA override: ?weather=rain|storm|cloudy|fog|snow|partly|clear forces a
// condition for screenshots. Ignored in normal use — real Open-Meteo data runs.
function forcedWeather(): Weather | null {
  if (typeof window === 'undefined') return null
  const p = new URLSearchParams(window.location.search).get('weather') as Condition | null
  if (!p || !['clear', 'partly', 'cloudy', 'fog', 'rain', 'snow', 'storm'].includes(p)) return null
  const code = { clear: 0, partly: 2, cloudy: 3, fog: 45, rain: 63, snow: 73, storm: 95 }[p]
  return classify(code, 25, true)
}

export async function fetchHyderabadWeather(signal?: AbortSignal): Promise<Weather | null> {
  const forced = forcedWeather()
  if (forced) return forced
  try {
    const url =
      `https://api.open-meteo.com/v1/forecast?latitude=${HYDERABAD.lat}&longitude=${HYDERABAD.lon}` +
      `&current=temperature_2m,weather_code,is_day`
    const res = await fetch(url, { signal })
    if (!res.ok) return null
    const data = (await res.json()) as {
      current?: { temperature_2m?: number; weather_code?: number; is_day?: number }
    }
    const c = data.current
    if (!c || c.weather_code == null) return null
    return classify(Number(c.weather_code), Math.round(Number(c.temperature_2m ?? 0)), Number(c.is_day) === 1)
  } catch {
    return null
  }
}
