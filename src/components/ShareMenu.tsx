import { useEffect, useState, type ReactNode } from 'react'
import { createPortal } from 'react-dom'
import { encodeView, viewSnapshot, type ViewSnapshot } from '../lib/viewStore'

/**
 * ShareMenu — a clean, two-tab share sheet (the antidote to the cluttered
 * Google-Maps one). Opened via the `pm:share-open` window event dispatched by
 * the Share button in MapControlsHud.
 *
 *  • Send a link — copy the URL + one-tap to WhatsApp / X / LinkedIn / Email /
 *    Instagram.
 *  • Embed a map — an <iframe> snippet that reproduces the CURRENT camera angle
 *    and time of day (via src/lib/viewStore encodeView), with size presets.
 *
 * SHARE_LINK is an optional vanity short link (make a bit.ly by hand, in the
 * spirit of the Google-Maps short code) — falls back to the site root.
 */
const SHARE_LINK = '' // ← e.g. 'https://bit.ly/mittal-design'
const SHARE_TEXT = "Explore Prachi Mittal's portfolio — an explorable 3D city"

const siteUrl = () => SHARE_LINK || window.location.origin + '/'

type Tab = 'link' | 'embed'
const SIZES = {
  Small: [400, 320],
  Medium: [600, 450],
  Large: [800, 600],
} as const
type SizeKey = keyof typeof SIZES

export function ShareMenu() {
  const [open, setOpen] = useState(false)
  const [tab, setTab] = useState<Tab>('link')
  const [snap, setSnap] = useState<ViewSnapshot>(viewSnapshot)
  const [size, setSize] = useState<SizeKey>('Medium')
  const [toast, setToast] = useState('')

  useEffect(() => {
    const onOpen = () => {
      // Freeze the current pose the instant the sheet opens.
      setSnap({ ...viewSnapshot })
      setTab('link')
      setOpen(true)
    }
    window.addEventListener('pm:share-open', onOpen)
    return () => window.removeEventListener('pm:share-open', onOpen)
  }, [])

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false)
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open])

  const flash = (msg: string) => {
    setToast(msg)
    window.setTimeout(() => setToast(''), 2000)
  }
  const copy = async (text: string, msg: string) => {
    try {
      await navigator.clipboard.writeText(text)
      flash(msg)
    } catch {
      flash('Copy failed — long-press to copy')
    }
  }
  const openShare = (url: string) => window.open(url, '_blank', 'noopener,noreferrer')

  if (!open) return null

  const link = siteUrl()
  const [w, h] = SIZES[size]
  const embedUrl = `${window.location.origin}/?${encodeView(snap)}`
  const snippet = `<iframe src="${embedUrl}" width="${w}" height="${h}" style="border:0;border-radius:12px" loading="lazy" title="Prachi Mittal — 3D portfolio"></iframe>`

  const shares: Array<{ id: string; label: string; bg: string; grad?: string; onClick: () => void; icon: ReactNode }> = [
    {
      id: 'wa',
      label: 'WhatsApp',
      bg: '#25D366',
      onClick: () => openShare(`https://wa.me/?text=${encodeURIComponent(`${SHARE_TEXT} ${link}`)}`),
      icon: (<path d="M12 2a10 10 0 00-8.6 15l-1.3 4.8 4.9-1.3A10 10 0 1012 2zm5.3 14.1c-.2.6-1.3 1.2-1.8 1.2-.5.1-1 .3-3.3-.7-2.8-1.2-4.5-4-4.7-4.2-.1-.2-1.1-1.4-1.1-2.7s.7-1.9.9-2.2c.2-.2.5-.3.7-.3h.5c.2 0 .4 0 .6.5l.8 2c.1.2.1.4 0 .5l-.4.6c-.2.2-.3.4-.1.7.2.3.8 1.3 1.7 2.1 1.2 1 2.1 1.4 2.4 1.5.2.1.4.1.6-.1l.7-.9c.2-.2.4-.2.6-.1l1.9.9c.3.1.5.2.5.3.1.2.1.7-.1 1.4z" fill="#fff" />),
    },
    {
      id: 'x',
      label: 'X',
      bg: '#000000',
      onClick: () => openShare(`https://twitter.com/intent/tweet?url=${encodeURIComponent(link)}&text=${encodeURIComponent(SHARE_TEXT)}`),
      icon: <path d="M17.5 3h2.9l-6.4 7.3L21.6 21h-5.9l-4.6-6-5.3 6H2.9l6.8-7.8L2.2 3h6l4.2 5.5L17.5 3zm-1 16.2h1.6L8 4.7H6.3l10.2 14.5z" fill="#fff" />,
    },
    {
      id: 'li',
      label: 'LinkedIn',
      bg: '#0A66C2',
      onClick: () => openShare(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(link)}`),
      icon: <path d="M6.9 8.8H3.6V21h3.3V8.8zM5.2 3.3A1.9 1.9 0 105.2 7a1.9 1.9 0 000-3.8zM20.4 21v-6.7c0-3.2-.7-5.7-4.4-5.7-1.8 0-3 1-3.5 1.9h-.1V8.8H9.2V21h3.3v-6c0-1.6.3-3.1 2.3-3.1s2 1.8 2 3.2V21h3.6z" fill="#fff" />,
    },
    {
      id: 'mail',
      label: 'Email',
      bg: '#6b6660',
      onClick: () => openShare(`mailto:?subject=${encodeURIComponent('Prachi Mittal — 3D portfolio')}&body=${encodeURIComponent(`${SHARE_TEXT}\n\n${link}`)}`),
      icon: <path d="M3 5h18a1 1 0 011 1v12a1 1 0 01-1 1H3a1 1 0 01-1-1V6a1 1 0 011-1zm9 7.2L4.5 7h15L12 12.2zM4 8.4V17h16V8.4l-8 5.4-8-5.4z" fill="#fff" />,
    },
    {
      id: 'ig',
      label: 'Instagram',
      bg: '#C13584',
      grad: 'linear-gradient(45deg,#feda75,#fa7e1e,#d62976,#962fbf,#4f5bd5)',
      onClick: () => {
        copy(link, 'Link copied — paste it in your Instagram bio or DM')
        openShare('https://www.instagram.com/')
      },
      icon: (
        <>
          <rect x="4" y="4" width="16" height="16" rx="4.5" stroke="#fff" strokeWidth="1.8" fill="none" />
          <circle cx="12" cy="12" r="3.5" stroke="#fff" strokeWidth="1.8" fill="none" />
          <circle cx="16.4" cy="7.6" r="1.1" fill="#fff" />
        </>
      ),
    },
  ]

  return createPortal(
    <div className="fixed inset-0 z-[80] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/45 backdrop-blur-sm" onClick={() => setOpen(false)} />

      <div className="hud-strong relative z-[81] w-[min(480px,94vw)] overflow-hidden rounded-[20px] border shadow-[0_24px_70px_rgba(0,0,0,0.32)]">
        {/* header */}
        <div className="flex items-center justify-between px-6 pt-5">
          <h2 className="text-[22px] font-extrabold tracking-[-0.02em] text-ink">Share this city</h2>
          <button
            type="button"
            aria-label="Close"
            onClick={() => setOpen(false)}
            className="flex h-8 w-8 items-center justify-center rounded-full bg-black/[0.06] text-ink transition-transform hover:scale-105 active:scale-95"
          >
            <svg viewBox="0 0 20 20" className="h-4 w-4" fill="none">
              <path d="M5 5l10 10M15 5L5 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        {/* tabs */}
        <div className="mt-4 flex gap-1 px-6">
          {(['link', 'embed'] as Tab[]).map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setTab(t)}
              className={[
                'rounded-full px-4 py-[7px] text-[13px] font-semibold transition-colors',
                tab === t ? 'bg-ink text-paper' : 'text-ink-soft hover:bg-black/[0.05]',
              ].join(' ')}
            >
              {t === 'link' ? 'Send a link' : 'Embed a map'}
            </button>
          ))}
        </div>

        <div className="px-6 pb-6 pt-4">
          {tab === 'link' ? (
            <>
              {/* copy row */}
              <div className="flex items-center gap-2 rounded-[12px] border border-black/10 bg-black/[0.03] p-1.5 pl-4">
                <span className="min-w-0 flex-1 truncate text-[13px] text-ink-soft">{link}</span>
                <button
                  type="button"
                  onClick={() => copy(link, 'Link copied')}
                  className="flex-shrink-0 rounded-[9px] bg-ink px-4 py-2 text-[12px] font-bold text-paper transition-transform hover:-translate-y-0.5"
                >
                  Copy link
                </button>
              </div>

              {/* destinations */}
              <div className="mt-5 flex justify-between gap-2">
                {shares.map((s) => (
                  <button
                    key={s.id}
                    type="button"
                    onClick={s.onClick}
                    className="group flex flex-1 flex-col items-center gap-2"
                    aria-label={`Share to ${s.label}`}
                  >
                    <span
                      className="flex h-12 w-12 items-center justify-center rounded-full transition-transform group-hover:-translate-y-0.5 group-active:scale-95"
                      style={{ background: s.grad ?? s.bg }}
                    >
                      <svg viewBox="0 0 24 24" className="h-[22px] w-[22px]">{s.icon}</svg>
                    </span>
                    <span className="text-[11px] font-medium text-ink-soft">{s.label}</span>
                  </button>
                ))}
              </div>
            </>
          ) : (
            <>
              <div className="flex items-center gap-2">
                <span className="text-[12px] font-semibold text-ink-soft">Size</span>
                <div className="flex gap-1">
                  {(Object.keys(SIZES) as SizeKey[]).map((k) => (
                    <button
                      key={k}
                      type="button"
                      onClick={() => setSize(k)}
                      className={[
                        'rounded-full px-3 py-[5px] text-[12px] font-semibold transition-colors',
                        size === k ? 'bg-ink text-paper' : 'text-ink-soft hover:bg-black/[0.05]',
                      ].join(' ')}
                    >
                      {k}
                    </button>
                  ))}
                </div>
              </div>

              <textarea
                readOnly
                value={snippet}
                onFocus={(e) => e.currentTarget.select()}
                className="mt-3 h-[92px] w-full resize-none rounded-[12px] border border-black/10 bg-black/[0.03] p-3 font-mono text-[11.5px] leading-[1.5] text-ink-soft"
              />
              <div className="mt-3 flex items-center justify-between gap-3">
                <p className="text-[11.5px] leading-[1.5] text-ink-soft">
                  Captures the current camera angle and time of day.
                </p>
                <button
                  type="button"
                  onClick={() => copy(snippet, 'Embed HTML copied')}
                  className="flex-shrink-0 rounded-[9px] bg-ink px-4 py-2 text-[12px] font-bold text-paper transition-transform hover:-translate-y-0.5"
                >
                  Copy HTML
                </button>
              </div>
            </>
          )}
        </div>

        {/* toast */}
        {toast && (
          <div className="pointer-events-none absolute bottom-3 left-1/2 -translate-x-1/2 rounded-full bg-ink px-4 py-2 text-[12px] font-semibold text-paper shadow-lg">
            {toast}
          </div>
        )}
      </div>
    </div>,
    document.body,
  )
}
