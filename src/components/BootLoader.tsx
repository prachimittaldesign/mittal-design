import './bootLoader.css'

// The on-brand, dependency-free "never a blank screen" loader. Shown from the
// very first paint (mirrored as static markup in index.html, before any JS
// runs) until the city proves it rendered a frame — or the 3s watchdog hands
// off to /projects. Deliberately styled with its own tiny stylesheet rather
// than Tailwind utilities, so it renders identically whether Tailwind's CSS
// has finished loading yet or not — no first-paint flash.
export function BootLoader() {
  return (
    <div className="boot-loader" role="status" aria-live="polite" aria-label="Loading the city">
      <div className="boot-loader__mark">
        <span>Prachi</span>
        <span className="boot-loader__box">Mittal</span>
      </div>
      <div className="boot-loader__dots" aria-hidden="true">
        <i />
        <i />
        <i />
      </div>
    </div>
  )
}
