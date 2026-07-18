import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { EMAIL, WEB3FORMS_KEY, FEEDBACK_ENDPOINT } from '../lib/contact'

/**
 * FeedbackModal — a name / email / message form anyone can submit.
 *
 * Opened from anywhere via the `pm:feedback-open` window event (the Feedback
 * buttons on the fast page and in the city's About menu dispatch it). Mounted
 * once at the App level so it works over both the 3D city and the /projects
 * page. Neutral light styling (not the theme-aware HUD classes) so it reads
 * cleanly on either surface, day or night.
 *
 * Submission needs no backend: with a Web3Forms key set (src/lib/contact.ts)
 * it POSTs in-page and shows a success state; without one it falls back to
 * opening a pre-filled email, so the form is never a dead end.
 */
type Status = 'idle' | 'sending' | 'sent' | 'error'

export function FeedbackModal() {
  const [open, setOpen] = useState(false)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')
  const [status, setStatus] = useState<Status>('idle')
  const [errorMsg, setErrorMsg] = useState('')
  const firstFieldRef = useRef<HTMLInputElement>(null)
  const restoreRef = useRef<HTMLElement | null>(null)

  useEffect(() => {
    const onOpen = () => {
      restoreRef.current = (document.activeElement as HTMLElement | null) ?? null
      setStatus('idle')
      setErrorMsg('')
      setOpen(true)
    }
    window.addEventListener('pm:feedback-open', onOpen)
    return () => window.removeEventListener('pm:feedback-open', onOpen)
  }, [])

  const close = () => {
    setOpen(false)
    restoreRef.current?.focus?.()
  }

  // Escape to close; focus the first field on open.
  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && close()
    window.addEventListener('keydown', onKey)
    const t = setTimeout(() => firstFieldRef.current?.focus(), 40)
    return () => {
      window.removeEventListener('keydown', onKey)
      clearTimeout(t)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open])

  const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())
  const canSubmit = name.trim() !== '' && emailValid && message.trim() !== '' && status !== 'sending'

  const mailtoFallback = () => {
    const body = `Name: ${name}\nEmail: ${email}\n\n${message}`
    window.location.href = `mailto:${EMAIL}?subject=${encodeURIComponent('Feedback on mittal.design')}&body=${encodeURIComponent(body)}`
    setStatus('sent')
  }

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!canSubmit) return
    // No endpoint configured → open a pre-filled email instead (never a dead end).
    if (!FEEDBACK_ENDPOINT && !WEB3FORMS_KEY) {
      mailtoFallback()
      return
    }
    setStatus('sending')
    setErrorMsg('')
    try {
      // Prefer a custom endpoint (e.g. a Cloudflare Worker) that takes a plain
      // { name, email, message } JSON POST; otherwise fall to Web3Forms' shape.
      const [url, payload] = FEEDBACK_ENDPOINT
        ? [FEEDBACK_ENDPOINT, { name, email, message }]
        : [
            'https://api.web3forms.com/submit',
            { access_key: WEB3FORMS_KEY, subject: 'New feedback from mittal.design', from_name: name, name, email, message },
          ]
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify(payload),
      })
      const data = await res.json().catch(() => ({}))
      // Web3Forms returns { success }; a custom endpoint just needs a 2xx.
      if (res.ok && (FEEDBACK_ENDPOINT ? true : data.success)) {
        setStatus('sent')
      } else {
        setStatus('error')
        setErrorMsg(data.message || 'Something went wrong. Please try again, or email me directly.')
      }
    } catch {
      setStatus('error')
      setErrorMsg('Network error. Please try again, or email me directly.')
    }
  }

  if (!open) return null

  return createPortal(
    <div className="fixed inset-0 z-[90] flex items-center justify-center p-4" role="dialog" aria-modal="true" aria-label="Send feedback">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={close} />

      <div className="relative z-[91] w-[min(460px,94vw)] overflow-hidden rounded-[18px] bg-white text-[#111113] shadow-[0_30px_80px_rgba(0,0,0,0.4)]">
        <div className="flex items-start justify-between gap-4 px-6 pt-5">
          <div>
            <div className="font-mono text-[11px] font-bold uppercase tracking-[0.18em] text-[#6e6e73]">Say hello</div>
            <h2 className="mt-1 text-[22px] font-bold tracking-[-0.02em]">Leave a message</h2>
          </div>
          <button
            type="button"
            aria-label="Close"
            onClick={close}
            className="mt-1 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-black/[0.06] text-[#111113] transition-transform hover:scale-105 active:scale-95"
          >
            <svg viewBox="0 0 20 20" className="h-4 w-4" fill="none">
              <path d="M5 5l10 10M15 5L5 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        {status === 'sent' ? (
          <div className="px-6 pb-7 pt-5 text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[#e7f7ee] text-[#1a7f37]">
              <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none">
                <path d="M5 12.5l4 4 10-10" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <h3 className="mt-4 text-[17px] font-bold">Thank you!</h3>
            <p className="mt-1 text-[13.5px] leading-[1.5] text-[#6e6e73]">
              {WEB3FORMS_KEY ? 'Your message is on its way — I read every one.' : 'Your email is ready to send in your mail app.'}
            </p>
            <button
              type="button"
              onClick={close}
              className="mt-5 rounded-full bg-[#111113] px-5 py-[10px] text-[13.5px] font-semibold text-white transition-transform hover:-translate-y-0.5"
            >
              Done
            </button>
          </div>
        ) : (
          <form onSubmit={submit} className="px-6 pb-6 pt-4">
            <p className="mb-4 text-[13.5px] leading-[1.55] text-[#6e6e73]">
              A note, a question, or a role you're hiring for — it all reaches me.
            </p>
            <label className="mb-3 block">
              <span className="mb-[5px] block text-[12px] font-semibold text-[#3a3a3d]">Name</span>
              <input
                ref={firstFieldRef}
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                autoComplete="name"
                className="w-full rounded-[10px] border border-black/[0.14] bg-white px-[13px] py-[10px] text-[14.5px] outline-none transition-colors focus:border-[#5b4bde]"
              />
            </label>
            <label className="mb-3 block">
              <span className="mb-[5px] block text-[12px] font-semibold text-[#3a3a3d]">Email</span>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
                className="w-full rounded-[10px] border border-black/[0.14] bg-white px-[13px] py-[10px] text-[14.5px] outline-none transition-colors focus:border-[#5b4bde]"
              />
            </label>
            <label className="mb-4 block">
              <span className="mb-[5px] block text-[12px] font-semibold text-[#3a3a3d]">Message</span>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                required
                rows={4}
                className="w-full resize-y rounded-[10px] border border-black/[0.14] bg-white px-[13px] py-[10px] text-[14.5px] leading-[1.5] outline-none transition-colors focus:border-[#5b4bde]"
              />
            </label>

            {status === 'error' && (
              <p role="alert" className="mb-3 text-[13px] font-medium text-[#c0392b]">{errorMsg}</p>
            )}

            <div className="flex items-center gap-3">
              <button
                type="submit"
                disabled={!canSubmit}
                className="rounded-full bg-[#111113] px-6 py-[11px] text-[14px] font-bold text-white transition-opacity disabled:cursor-not-allowed disabled:opacity-40"
              >
                {status === 'sending' ? 'Sending…' : 'Send message'}
              </button>
              <a href={`mailto:${EMAIL}`} className="text-[13px] font-semibold text-[#5b4bde] hover:underline">
                or email directly
              </a>
            </div>
          </form>
        )}
      </div>
    </div>,
    document.body,
  )
}
