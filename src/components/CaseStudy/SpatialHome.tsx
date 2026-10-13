import { Fragment, useEffect, useMemo, useRef, useState, type ReactNode } from 'react'
import type { CSDeviceKind, CSSpatial } from '../../data/caseStudyTypes'

/**
 * <SpatialSection> — an interactive 3D model of a home, in the spirit of an
 * explorable property map. Drawn entirely in SVG (an isometric projection with
 * a rotating camera), never WebGL: the case study must stay smooth on every
 * phone, including the mobile-Chrome builds that flickered under WebGL.
 *
 *  - Rotate: drag across the model, use the arrow keys when it has focus, or
 *    the rotate buttons.
 *  - Floors: show all, one at a time, or explode them apart.
 *  - Rooms: tap one (or pick it from the list) to read its devices.
 *  - Modes tell the scanning story: Scan (a point cloud), Model (clean
 *    geometry), Live home (devices in place, events where they happen).
 *
 * Painter's-algorithm drawing: per floor, the slab, then the two walls facing
 * away from the camera (a cutaway, so the interior stays visible), then rooms
 * and devices sorted far-to-near. Rooms tile a rectangular footprint, so
 * centroid depth sorting is enough.
 */

type Mode = 'scan' | 'model' | 'live'
type Pt = [number, number, number]

const S = 34 // viewBox px per unit
const FLOOR_H = 2.6
const WALL_H = 1.15
const GAP = 5.2 // extra lift per floor when exploded — enough to clear the slab above
const C30 = Math.cos(Math.PI / 6)

// 24-unit stroke glyphs, matching the case study's illustration icon set.
const GLYPH: Record<CSDeviceKind, string> = {
  light: 'M9 17h6M10 20h4M12 3a6 6 0 0 0-3.6 10.8c.7.6 1.1 1.3 1.1 2.2h5c0-.9.4-1.6 1.1-2.2A6 6 0 0 0 12 3z',
  blind: 'M5 4h14v16H5zM5 8h14M5 12h14M5 16h14',
  thermo: 'M12 5a7 7 0 1 0 0 14a7 7 0 1 0 0-14M8 14a4.5 4.5 0 0 1 8 0',
  speaker: 'M7 3h10v18H7zM12 13a3 3 0 1 0 0 6a3 3 0 1 0 0-6M12 7.5v.01',
  camera: 'M3 7h12v10H3zM15 11l6-3.5v9L15 13',
  lock: 'M5 11h14v10H5zM8 11V8a4 4 0 0 1 8 0v3M12 15v2',
  tv: 'M3 5h18v12H3zM9 21h6',
  sensor: 'M12 10a2 2 0 1 0 0 4a2 2 0 1 0 0-4M7.5 7.5a6.4 6.4 0 0 0 0 9M16.5 7.5a6.4 6.4 0 0 1 0 9',
}

/** Small deterministic PRNG so the scan cloud is identical on every render. */
function rng(seed: number) {
  let a = seed >>> 0
  return () => {
    a = (a + 0x6d2b79f5) >>> 0
    let t = a
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

export function SpatialSection({
  sp,
  lead,
  footnote,
}: {
  sp: CSSpatial
  lead?: ReactNode
  footnote?: ReactNode
}) {
  const [mode, setMode] = useState<Mode>('live')
  const [angle, setAngle] = useState(-32)
  const [floor, setFloor] = useState<string>('all')
  const [explode, setExplode] = useState(true)
  const firstRoom = sp.floors[0]?.rooms[0]?.id ?? ''
  const [sel, setSel] = useState<string>(firstRoom)
  const [ev, setEv] = useState(0)
  const svgRef = useRef<SVGSVGElement>(null)
  const drag = useRef<{ x: number; a: number } | null>(null)
  // True once a pointer has moved far enough to count as a rotate, so the
  // release doesn't also select the room under the finger.
  const dragged = useRef(false)
  const tween = useRef(0)
  const reduce = useRef(false)

  useEffect(() => {
    reduce.current = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  }, [])

  // Cycle the live events (paused for reduced motion; the first stays shown).
  useEffect(() => {
    if (mode !== 'live' || !sp.events?.length || reduce.current) return
    const t = window.setInterval(() => setEv((e) => (e + 1) % sp.events!.length), 3400)
    return () => window.clearInterval(t)
  }, [mode, sp.events])

  useEffect(() => () => cancelAnimationFrame(tween.current), [])

  const rotateTo = (target: number) => {
    cancelAnimationFrame(tween.current)
    if (reduce.current) {
      setAngle(target)
      return
    }
    const from = angle
    const t0 = performance.now()
    const step = (now: number) => {
      const k = Math.min(1, (now - t0) / 380)
      const e = 1 - Math.pow(1 - k, 3)
      setAngle(from + (target - from) * e)
      if (k < 1) tween.current = requestAnimationFrame(step)
    }
    tween.current = requestAnimationFrame(step)
  }

  const { w, d } = sp.footprint
  const cx = w / 2
  const cy = d / 2
  const visibleFloors = floor === 'all' ? sp.floors : sp.floors.filter((f) => f.id === floor)
  const rad = (angle * Math.PI) / 180
  const cos = Math.cos(rad)
  const sin = Math.sin(rad)

  // Fixed viewBox sized for any rotation, so the model never jumps.
  const R = Math.hypot(w, d) / 2
  const reach = R * Math.SQRT2
  const maxLift = (sp.floors.length - 1) * (FLOOR_H + GAP) + WALL_H
  const vb = {
    x: -reach * C30 * S - 24,
    y: -reach * 0.5 * S - maxLift * S - 30,
    w: 2 * (reach * C30 * S + 24),
    h: reach * S + maxLift * S + 60,
  }

  const project = (p: Pt) => {
    const dx = p[0] - cx
    const dy = p[1] - cy
    const rx = dx * cos - dy * sin
    const ry = dx * sin + dy * cos
    return { x: (rx - ry) * C30 * S, y: (rx + ry) * 0.5 * S - p[2] * S, depth: rx + ry }
  }
  const poly = (pts: Pt[]) =>
    pts
      .map((p) => {
        const q = project(p)
        return `${q.x.toFixed(1)},${q.y.toFixed(1)}`
      })
      .join(' ')

  const baseOf = (floorId: string) => {
    if (floor !== 'all') return 0
    const i = sp.floors.findIndex((f) => f.id === floorId)
    return i * (FLOOR_H + (explode ? GAP : 0))
  }

  // Scan cloud: dense along walls and room edges, faint across floors.
  const cloud = useMemo(() => {
    const out: Record<string, Pt[]> = {}
    sp.floors.forEach((f, fi) => {
      const r = rng(11 + fi * 97)
      const pts: Pt[] = []
      const edge = (a: [number, number], b: [number, number], n: number, zMax: number) => {
        for (let i = 0; i < n; i++) {
          const t = r()
          pts.push([a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, r() * zMax])
        }
      }
      edge([0, 0], [w, 0], 90, WALL_H)
      edge([0, 0], [0, d], 70, WALL_H)
      edge([w, 0], [w, d], 70, WALL_H)
      edge([0, d], [w, d], 90, WALL_H)
      f.rooms.forEach((rm) => {
        const k = Math.round((rm.w + rm.d) * 6)
        edge([rm.x, rm.y], [rm.x + rm.w, rm.y], k, 0.05)
        edge([rm.x, rm.y], [rm.x, rm.y + rm.d], k, 0.05)
        for (let i = 0; i < rm.w * rm.d * 1.4; i++) pts.push([rm.x + r() * rm.w, rm.y + r() * rm.d, 0])
      })
      out[f.id] = pts
    })
    return out
  }, [sp, w, d])

  const allRooms = sp.floors.flatMap((f) => f.rooms.map((rm) => ({ ...rm, floor: f })))
  const selRoom = allRooms.find((r) => r.id === sel) ?? allRooms[0]
  const event = mode === 'live' && sp.events?.length ? sp.events[ev % sp.events.length] : null
  const eventRoom = event ? allRooms.find((r) => r.id === event.room) : undefined

  // Walls facing away from the camera: outward normal · view direction (1,1) < 0.
  const backWalls = (base: number) => {
    const walls: Array<{ pts: Pt[]; depth: number }> = []
    const sides: Array<{ a: [number, number]; b: [number, number]; n: [number, number] }> = [
      { a: [0, 0], b: [w, 0], n: [0, -1] },
      { a: [w, 0], b: [w, d], n: [1, 0] },
      { a: [w, d], b: [0, d], n: [0, 1] },
      { a: [0, d], b: [0, 0], n: [-1, 0] },
    ]
    for (const s of sides) {
      const rnx = s.n[0] * cos - s.n[1] * sin
      const rny = s.n[0] * sin + s.n[1] * cos
      if (rnx + rny < 0) {
        walls.push({
          pts: [
            [s.a[0], s.a[1], base],
            [s.b[0], s.b[1], base],
            [s.b[0], s.b[1], base + WALL_H],
            [s.a[0], s.a[1], base + WALL_H],
          ],
          depth: 0,
        })
      }
    }
    return walls
  }

  // Slab edge faces toward the camera, for a little thickness.
  const slabEdges = (base: number) => {
    const t = 0.22
    const sides: Array<{ a: [number, number]; b: [number, number]; n: [number, number] }> = [
      { a: [0, 0], b: [w, 0], n: [0, -1] },
      { a: [w, 0], b: [w, d], n: [1, 0] },
      { a: [w, d], b: [0, d], n: [0, 1] },
      { a: [0, d], b: [0, 0], n: [-1, 0] },
    ]
    return sides
      .filter((s) => {
        const rnx = s.n[0] * cos - s.n[1] * sin
        const rny = s.n[0] * sin + s.n[1] * cos
        return rnx + rny > 0
      })
      .map((s) => [
        [s.a[0], s.a[1], base] as Pt,
        [s.b[0], s.b[1], base] as Pt,
        [s.b[0], s.b[1], base - t] as Pt,
        [s.a[0], s.a[1], base - t] as Pt,
      ])
  }

  const onPointerDown = (e: React.PointerEvent<SVGSVGElement>) => {
    cancelAnimationFrame(tween.current)
    drag.current = { x: e.clientX, a: angle }
    dragged.current = false
    ;(e.target as Element).setPointerCapture?.(e.pointerId)
  }
  const onPointerMove = (e: React.PointerEvent<SVGSVGElement>) => {
    if (!drag.current) return
    const dx = e.clientX - drag.current.x
    if (Math.abs(dx) > 4) dragged.current = true
    setAngle(drag.current.a + dx * 0.45)
  }
  const endDrag = () => {
    drag.current = null
  }
  const onKey = (e: React.KeyboardEvent<SVGSVGElement>) => {
    if (e.key === 'ArrowLeft') {
      e.preventDefault()
      rotateTo(angle - 20)
    } else if (e.key === 'ArrowRight') {
      e.preventDefault()
      rotateTo(angle + 20)
    }
  }

  // Overlay label positions as % of the viewBox, so HTML text keeps real size.
  const pct = (p: Pt) => {
    const q = project(p)
    return { left: `${((q.x - vb.x) / vb.w) * 100}%`, top: `${((q.y - vb.y) / vb.h) * 100}%` }
  }

  const modes: Array<{ id: Mode; label: string }> = [
    { id: 'scan', label: 'Scan' },
    { id: 'model', label: 'Model' },
    { id: 'live', label: 'Live home' },
  ]

  return (
    <div className="sp" data-mode={mode}>
      {lead && <p className="lead">{lead}</p>}
      <div className="sp__grid">
        <div className="sp__stage" style={{ aspectRatio: `${vb.w} / ${vb.h}` }}>
          <svg
            ref={svgRef}
            className="sp__svg"
            viewBox={`${vb.x} ${vb.y} ${vb.w} ${vb.h}`}
            role="img"
            aria-label={`Interactive 3D model of the home, ${mode === 'scan' ? 'as a point cloud' : mode === 'model' ? 'as clean geometry' : 'with devices in place'}. Use the left and right arrow keys to rotate.`}
            tabIndex={0}
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={endDrag}
            onPointerCancel={endDrag}
            onKeyDown={onKey}
          >
            {visibleFloors.map((f) => {
              const base = baseOf(f.id)
              const corners: Pt[] = [
                [0, 0, base],
                [w, 0, base],
                [w, d, base],
                [0, d, base],
              ]
              const rooms = [...f.rooms]
                .map((rm) => ({ rm, depth: project([rm.x + rm.w / 2, rm.y + rm.d / 2, base]).depth }))
                .sort((a, b) => a.depth - b.depth)
              const devices =
                mode === 'live'
                  ? f.rooms
                      .flatMap((rm) => (rm.devices ?? []).map((dv) => ({ dv, rm })))
                      .map((o) => ({ ...o, p: project([o.dv.x, o.dv.y, base]) }))
                      .sort((a, b) => a.p.depth - b.p.depth)
                  : []
              return (
                <g key={f.id} className="sp__floor">
                  {slabEdges(base).map((q, i) => (
                    <polygon key={i} points={poly(q)} className="sp__slab-edge" />
                  ))}
                  <polygon points={poly(corners)} className="sp__slab" />
                  {backWalls(base).map((wl, i) => (
                    <polygon key={i} points={poly(wl.pts)} className="sp__wall" />
                  ))}
                  {mode === 'scan'
                    ? (cloud[f.id] ?? []).map((p, i) => {
                        const q = project([p[0], p[1], base + p[2]])
                        return <circle key={i} cx={q.x.toFixed(1)} cy={q.y.toFixed(1)} r={1.7} className="sp__pt" />
                      })
                    : rooms.map(({ rm }) => {
                        const inset = 0.07
                        const isSel = selRoom?.id === rm.id
                        const isEv = eventRoom?.id === rm.id
                        return (
                          <polygon
                            key={rm.id}
                            points={poly([
                              [rm.x + inset, rm.y + inset, base + 0.01],
                              [rm.x + rm.w - inset, rm.y + inset, base + 0.01],
                              [rm.x + rm.w - inset, rm.y + rm.d - inset, base + 0.01],
                              [rm.x + inset, rm.y + rm.d - inset, base + 0.01],
                            ])}
                            className={`sp__room${isSel ? ' is-sel' : ''}${isEv ? ' is-ev' : ''}`}
                            onClick={() => !dragged.current && setSel(rm.id)}
                          >
                            <title>{rm.label}</title>
                          </polygon>
                        )
                      })}
                  {devices.map(({ dv, rm, p }) => {
                    const top = project([dv.x, dv.y, base + 0.95])
                    return (
                      <g
                        key={rm.id + dv.label}
                        className={`sp__dev${dv.on === false ? ' is-off' : ''}${selRoom?.id === rm.id ? ' is-sel' : ''}`}
                        onClick={() => !dragged.current && setSel(rm.id)}
                      >
                        <line x1={p.x} y1={p.y} x2={top.x} y2={top.y} className="sp__stem" />
                        <circle cx={top.x} cy={top.y} r={12.5} className="sp__pin" />
                        <path
                          d={GLYPH[dv.kind]}
                          transform={`translate(${top.x - 8.4} ${top.y - 8.4}) scale(0.7)`}
                          className="sp__glyph"
                        />
                        <title>{`${dv.label} · ${dv.state}`}</title>
                      </g>
                    )
                  })}
                </g>
              )
            })}
          </svg>

          {/* Labels as HTML so they stay legible at any size. */}
          <div className="sp__labels" aria-hidden="true">
            {mode !== 'scan' &&
              visibleFloors.flatMap((f) =>
                f.rooms.map((rm) => (
                  <span
                    key={rm.id}
                    className={`sp__lab${selRoom?.id === rm.id ? ' is-sel' : ''}`}
                    style={pct([rm.x + rm.w / 2, rm.y + rm.d / 2, baseOf(f.id)])}
                  >
                    {rm.label}
                  </span>
                )),
              )}
            {event && eventRoom && visibleFloors.some((f) => f.id === eventRoom.floor.id) && (
              <span
                key={ev}
                className="sp__callout"
                style={pct([eventRoom.x + eventRoom.w / 2, eventRoom.y + eventRoom.d / 2, baseOf(eventRoom.floor.id) + 1.5])}
              >
                <i aria-hidden="true" />
                {event.text}
              </span>
            )}
          </div>
          <p className="sp__hint" aria-hidden="true">Drag to rotate</p>
        </div>

        <div className="sp__panel">
          <div className="sp__modes" role="group" aria-label="View">
            {modes.map((m, i) => (
              <button key={m.id} type="button" className="sp__btn" aria-pressed={mode === m.id} onClick={() => setMode(m.id)}>
                <span className="sp__btn-no">{i + 1}</span>
                {m.label}
              </button>
            ))}
          </div>
          <p className="sp__caption" aria-live="polite">
            {renderCaption(sp.modes[mode])}
          </p>

          <div className="sp__row">
            <div className="sp__seg" role="group" aria-label="Floors">
              <button type="button" className="sp__chip" aria-pressed={floor === 'all'} onClick={() => setFloor('all')}>
                All floors
              </button>
              {sp.floors.map((f) => (
                <button key={f.id} type="button" className="sp__chip" aria-pressed={floor === f.id} onClick={() => setFloor(f.id)}>
                  {f.label}
                </button>
              ))}
            </div>
            <button
              type="button"
              className="sp__chip"
              aria-pressed={explode}
              disabled={floor !== 'all'}
              onClick={() => setExplode((x) => !x)}
            >
              Explode floors
            </button>
          </div>
          <div className="sp__row">
            <button type="button" className="sp__icon" aria-label="Rotate left" onClick={() => rotateTo(angle - 45)}>
              ⟲
            </button>
            <button type="button" className="sp__icon" aria-label="Rotate right" onClick={() => rotateTo(angle + 45)}>
              ⟳
            </button>
            <button type="button" className="sp__chip" onClick={() => rotateTo(-32)}>
              Reset view
            </button>
          </div>

          {selRoom && (
            <div className="sp__room-card" aria-live="polite">
              <p className="sp__room-floor">{selRoom.floor.label}</p>
              <h3>{selRoom.label}</h3>
              {mode === 'scan' && <p className="sp__meta">Captured as depth points and photos</p>}
              {mode === 'model' && (
                <p className="sp__meta">
                  {selRoom.w.toFixed(1)} × {selRoom.d.toFixed(1)} m · {(selRoom.w * selRoom.d).toFixed(0)} m²
                </p>
              )}
              {mode === 'live' && (
                <ul className="sp__devs">
                  {(selRoom.devices ?? []).map((dv) => (
                    <li key={dv.label} className={dv.on === false ? 'is-off' : undefined}>
                      <svg viewBox="0 0 24 24" aria-hidden="true">
                        <path d={GLYPH[dv.kind]} />
                      </svg>
                      <span className="sp__dev-l">{dv.label}</span>
                      <span className="sp__dev-s">{dv.state}</span>
                    </li>
                  ))}
                  {(selRoom.devices ?? []).length === 0 && <li>No devices yet</li>}
                </ul>
              )}
            </div>
          )}

          <div className="sp__rooms" role="group" aria-label="Rooms">
            {sp.floors.map((f) => (
              <Fragment key={f.id}>
                {f.rooms.map((rm) => (
                  <button
                    key={rm.id}
                    type="button"
                    className="sp__room-btn"
                    aria-pressed={selRoom?.id === rm.id}
                    onClick={() => {
                      setSel(rm.id)
                      if (floor !== 'all' && floor !== f.id) setFloor(f.id)
                    }}
                  >
                    {rm.label}
                    {mode === 'live' && rm.devices?.length ? <span>{rm.devices.length}</span> : null}
                  </button>
                ))}
              </Fragment>
            ))}
          </div>
        </div>
      </div>
      {footnote && <p className="cmp__note">{footnote}</p>}
    </div>
  )
}

/** **bold** support for the short mode captions. */
function renderCaption(text: string): ReactNode[] {
  return text.split(/(\*\*[^*]+\*\*)/g).map((part, i) =>
    part.startsWith('**') ? <strong key={i}>{part.slice(2, -2)}</strong> : <Fragment key={i}>{part}</Fragment>,
  )
}
