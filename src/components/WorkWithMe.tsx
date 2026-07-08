import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'

/**
 * WorkWithMe — the panel behind the passport hall's "WORK WITH ME" sign.
 *
 * The in-canvas office (src/scene/FutureIsland.tsx) dispatches `pm:workwithme`;
 * this DOM overlay catches it and offers two paths: Hire me (direct contact) and
 * Schedule a meeting (Calendly). Kept in the HUD layer — not the WebGL canvas —
 * so the Calendly embed and links are ordinary, accessible DOM.
 *
 * TO GO LIVE: set CALENDLY_URL to your Calendly event link (e.g.
 * 'https://calendly.com/prachi-mittal/30min'). Connect Google Calendar inside
 * Calendly's own settings — that sync is configured there, not here. Until it's
 * set, the Schedule tab shows a graceful "email me to book" fallback.
 */
const CALENDLY_URL = '' // ← paste your Calendly event URL here

const EMAIL = 'hello@mittal.design'
const LINKEDIN = 'https://www.linkedin.com/in/prachi15mittal'
const RESUME = '/Prachi-Mittal-Resume-2026.pdf'

type Tab = 'hire' | 'schedule'

export function WorkWithMe() {
  const [open, setOpen] = useState(false)
  const [tab, setTab] = useState<Tab>('hire')

  useEffect(() => {
    const onOpen = () => {
      setTab('hire')
      setOpen(true)
    }
    window.addEventListener('pm:workwithme', onOpen)
    return () => window.removeEventListener('pm:workwithme', onOpen)
  }, [])

  // Close on Escape.
  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false)
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open])

  if (!open) return null

  return createPortal(
    <div className="fixed inset-0 z-[80] flex items-center justify-center p-4">
      {/* backdrop */}
      <div
        className="absolute inset-0 bg-black/45 backdrop-blur-sm"
        onClick={() => setOpen(false)}
      />

      <div className="hud-strong relative z-[81] w-[min(520px,94vw)] overflow-hidden rounded-[20px] border shadow-[0_24px_70px_rgba(0,0,0,0.32)]">
        {/* header */}
        <div className="flex items-start justify-between gap-4 px-6 pt-5">
          <div>
            <div className="font-mono text-[11px] font-bold uppercase tracking-[0.2em] text-ink-soft">
              Arrivals · The Future
            </div>
            <h2 className="mt-1 text-[26px] font-extrabold tracking-[-0.02em] text-ink">
              Let’s work together
            </h2>
          </div>
          <button
            type="button"
            aria-label="Close"
            onClick={() => setOpen(false)}
            className="mt-1 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-black/[0.06] text-ink transition-transform hover:scale-105 active:scale-95"
          >
            <svg viewBox="0 0 20 20" className="h-4 w-4" fill="none">
              <path d="M5 5l10 10M15 5L5 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        {/* tabs */}
        <div className="mt-4 flex gap-1 px-6">
          {(['hire', 'schedule'] as Tab[]).map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setTab(t)}
              className={[
                'rounded-full px-4 py-[7px] text-[13px] font-semibold transition-colors',
                tab === t ? 'bg-ink text-paper' : 'text-ink-soft hover:bg-black/[0.05]',
              ].join(' ')}
            >
              {t === 'hire' ? 'Hire me' : 'Schedule a meeting'}
            </button>
          ))}
        </div>

        <div className="px-6 pb-6 pt-4">
          {tab === 'hire' ? (
            <div>
              <p className="text-[14px] leading-[1.6] text-ink-soft">
                Open to product design roles and select freelance work. The fastest way to
                reach me is email — I reply to everything.
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                <a
                  href={`mailto:${EMAIL}?subject=Let%E2%80%99s%20work%20together`}
                  className="inline-flex items-center gap-2 rounded-full bg-ink px-4 py-[9px] text-[13px] font-semibold text-paper transition-transform hover:-translate-y-0.5"
                >
                  Email {EMAIL}
                </a>
                <a
                  href={LINKEDIN}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hud-bd-on hud-text inline-flex items-center gap-2 rounded-full border px-4 py-[9px] text-[13px] font-semibold transition-transform hover:-translate-y-0.5"
                >
                  LinkedIn
                </a>
                <a
                  href={RESUME}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hud-bd-on hud-text inline-flex items-center gap-2 rounded-full border px-4 py-[9px] text-[13px] font-semibold transition-transform hover:-translate-y-0.5"
                >
                  Résumé
                </a>
              </div>
            </div>
          ) : CALENDLY_URL ? (
            <div className="overflow-hidden rounded-[12px] border border-black/10">
              <iframe
                title="Schedule a meeting"
                src={CALENDLY_URL}
                className="h-[520px] w-full"
                style={{ border: 0 }}
              />
            </div>
          ) : (
            <div className="rounded-[12px] border border-dashed border-black/15 bg-black/[0.02] p-5">
              <p className="text-[14px] leading-[1.6] text-ink-soft">
                Live scheduling is being set up. In the meantime, email me a couple of times
                that suit you and I’ll confirm within a day.
              </p>
              <a
                href={`mailto:${EMAIL}?subject=Scheduling%20a%20meeting`}
                className="mt-4 inline-flex items-center gap-2 rounded-full bg-ink px-4 py-[9px] text-[13px] font-semibold text-paper transition-transform hover:-translate-y-0.5"
              >
                Email to book a time
              </a>
            </div>
          )}
        </div>
      </div>
    </div>,
    document.body,
  )
}
