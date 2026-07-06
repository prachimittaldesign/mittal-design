import { useEffect, useRef } from 'react'
import { PROJECTS } from '../data/projects'
import { LANDMARKS } from '../data/landmarks'
import { quadrant, BIOME } from '../lib/iso'
import { markerPositions } from '../lib/markerStore'
import type { GlyphName, Landmark, LandmarkKind, Project } from '../types'

// Game-map POI markers for the 2D view. The buildings read tiny from straight
// above, so — like a game world map — every project gets a big, labelled,
// clickable pin (emoji glyph + name, quadrant-coloured ring, stem pointing at
// the building). The featured trio get a gold star + pulsing halo, and Ved
// (the newest work) carries a NEW badge and the largest pin. Landmarks are
// small round POIs with their name in a hover tooltip.
//
// Positions stream from MapMarkerProbe via the markerPositions store and are
// applied in a requestAnimationFrame loop straight to element transforms —
// panning/zooming the map never touches React state.

const GLYPH_EMOJI: Record<GlyphName, string> = {
  robot: '🤖',
  scanner: '🛰️',
  servers: '🗄️',
  connector: '🔗',
  book: '📖',
  tv: '📺',
  heart: '💚',
  bubble: '💬',
  ballot: '🗳️',
  sprout: '🌱',
  circles: '⭕',
  docs: '📑',
  cottage: '🏡',
  trees: '🌳',
  rocks: '🪨',
  sign: '📍',
}
const KIND_EMOJI: Record<LandmarkKind, string> = {
  cinema: '🎬',
  stadium: '🏟️',
  library: '📚',
  gallery: '🖼️',
  cafe: '☕',
  music: '🎵',
}

const NEWEST_ID = 'paas' // Ved — the most recent project gets the hero pin

interface MapMarkersProps {
  onSelectProject: (project: Project, rect: DOMRect) => void
  onSelectLandmark: (landmark: Landmark, rect: DOMRect) => void
}

export function MapMarkers({ onSelectProject, onSelectLandmark }: MapMarkersProps) {
  const wrapRef = useRef<HTMLDivElement>(null)

  // Position every marker from the store on each animation frame.
  useEffect(() => {
    let raf = 0
    const loop = () => {
      const wrap = wrapRef.current
      if (wrap) {
        for (const el of Array.from(wrap.children) as HTMLElement[]) {
          const id = el.dataset.mk
          if (!id) continue
          const pos = markerPositions.get(id)
          if (!pos || !pos.visible) {
            el.style.opacity = '0'
            el.style.pointerEvents = 'none'
          } else {
            el.style.opacity = '1'
            el.style.pointerEvents = 'auto'
            el.style.transform = `translate(${pos.x}px, ${pos.y}px)`
          }
        }
      }
      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(raf)
  }, [])

  // Render order controls stacking: landmarks under plain pins under featured
  // pins, with the NEW pin on top.
  const plain = PROJECTS.filter((p) => !p.featured)
  const featured = PROJECTS.filter((p) => p.featured && p.id !== NEWEST_ID)
  const newest = PROJECTS.find((p) => p.id === NEWEST_ID)

  return (
    <div
      ref={wrapRef}
      className="pointer-events-none absolute inset-0 z-[18]"
      style={{ animation: 'fade-rise 400ms ease-out both' }}
      aria-label="Project map markers"
    >
      {LANDMARKS.map((l) => (
        <LandmarkPoi key={l.id} landmark={l} onSelect={onSelectLandmark} />
      ))}
      {plain.map((p) => (
        <ProjectPin key={p.id} project={p} tier="plain" onSelect={onSelectProject} />
      ))}
      {featured.map((p) => (
        <ProjectPin key={p.id} project={p} tier="featured" onSelect={onSelectProject} />
      ))}
      {newest && <ProjectPin project={newest} tier="newest" onSelect={onSelectProject} />}
    </div>
  )
}

function ProjectPin({
  project,
  tier,
  onSelect,
}: {
  project: Project
  tier: 'plain' | 'featured' | 'newest'
  onSelect: (project: Project, rect: DOMRect) => void
}) {
  const accent = BIOME[quadrant(project.gx, project.gy)].fill
  const big = tier !== 'plain'
  // Stagger alternate pins onto a taller stem (deterministic by id) so
  // neighbouring buildings' labels sit at two heights instead of colliding —
  // the classic game-map label trick.
  const lifted = tier !== 'newest' && [...project.id].reduce((n, c) => n + c.charCodeAt(0), 0) % 2 === 0
  const stemColor = tier === 'newest' ? '#f5b912' : accent
  return (
    <button
      type="button"
      data-mk={project.id}
      data-tip={`${project.sub} — click to open`}
      data-tip-pos="bottom"
      onClick={(e) => onSelect(project, e.currentTarget.getBoundingClientRect())}
      className="absolute left-0 top-0 opacity-0 outline-none transition-opacity duration-200"
      style={{ zIndex: tier === 'newest' ? 40 : tier === 'featured' ? 30 : 20 }}
      aria-label={`${project.label} — open case study`}
    >
      {/* re-centre over the anchor point (transform on the outer sets x/y) */}
      <span className={`block -translate-x-1/2 -translate-y-full ${lifted ? 'pb-[48px]' : 'pb-[6px]'}`}>
        <span className="relative block">
          {/* pulsing halo behind featured pins — the game-map "go here" cue */}
          {big && (
            <span
              className="absolute left-1/2 top-1/2 h-full w-full rounded-full"
              style={{
                border: `3px solid ${tier === 'newest' ? '#f5b912' : accent}`,
                animation: 'markerPulse 2s ease-out infinite',
              }}
              aria-hidden
            />
          )}
          <span
            className={[
              'relative flex items-center whitespace-nowrap rounded-full bg-white/95 shadow-[0_6px_18px_rgba(0,0,0,0.28)]',
              'transition-transform duration-150 hover:scale-110',
              big ? 'gap-[7px] px-[13px] py-[7px]' : 'gap-[6px] px-[10px] py-[5px]',
            ].join(' ')}
            style={{ border: `3px solid ${tier === 'newest' ? '#f5b912' : accent}` }}
          >
            <span className={big ? 'text-[16px] leading-none' : 'text-[13px] leading-none'} aria-hidden>
              {GLYPH_EMOJI[project.glyph]}
            </span>
            <span className={`font-bold tracking-[-0.01em] text-ink ${tier === 'newest' ? 'text-[14px]' : big ? 'text-[13px]' : 'text-[11.5px]'}`}>
              {project.featured && <span aria-hidden>⭐ </span>}
              {project.label}
            </span>
            {tier === 'newest' && (
              <span className="rounded-full bg-[#f5b912] px-[7px] py-[2px] text-[9px] font-extrabold tracking-[0.08em] text-ink">
                NEW
              </span>
            )}
          </span>
          {/* stem pointing down at the building (lifted pins get a leader line) */}
          <span
            className="absolute left-1/2 top-full block h-0 w-0 -translate-x-1/2"
            style={{
              borderLeft: '7px solid transparent',
              borderRight: '7px solid transparent',
              borderTop: `9px solid ${stemColor}`,
            }}
            aria-hidden
          />
          {lifted && (
            <span
              className="absolute left-1/2 top-[calc(100%+8px)] block w-[2.5px] -translate-x-1/2 rounded-full"
              style={{ height: 41, background: stemColor, opacity: 0.85 }}
              aria-hidden
            />
          )}
        </span>
      </span>
    </button>
  )
}

function LandmarkPoi({
  landmark,
  onSelect,
}: {
  landmark: Landmark
  onSelect: (landmark: Landmark, rect: DOMRect) => void
}) {
  return (
    <button
      type="button"
      data-mk={landmark.id}
      data-tip={landmark.label}
      data-tip-pos="bottom"
      onClick={(e) => onSelect(landmark, e.currentTarget.getBoundingClientRect())}
      className="absolute left-0 top-0 z-[12] opacity-0 outline-none transition-opacity duration-200"
      aria-label={landmark.label}
    >
      <span className="block -translate-x-1/2 -translate-y-1/2">
        <span
          className="flex h-[30px] w-[30px] items-center justify-center rounded-full bg-white/95 text-[14px] shadow-[0_4px_12px_rgba(0,0,0,0.25)] transition-transform duration-150 hover:scale-110"
          style={{ border: `2.5px solid ${landmark.accent}` }}
        >
          <span aria-hidden>{KIND_EMOJI[landmark.kind]}</span>
        </span>
      </span>
    </button>
  )
}
