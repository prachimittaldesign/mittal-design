import { useEffect, useRef, useState } from 'react'
import type { LockedPayload, Project } from '../types'
import { unlock, rememberPassword, getRememberedPassword, WrongPasswordError } from '../lib/lock'

/**
 * The public face of a password-gated case study: a real teaser (title,
 * positioning line, hero metric, a visual or two, disciplines) followed by a
 * password prompt. The full body only appears once `unlock()` decrypts the blob
 * — there is no hidden DOM to reveal. Session-scoped: if the password was
 * already entered this session, we auto-unlock without prompting.
 */
export function LockGate({
  project,
  accent,
  qLabel,
  onUnlock,
}: {
  project: Project
  accent: string
  qLabel: string
  onUnlock: (payload: LockedPayload) => void
}) {
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  // Auto-unlock if this session already holds the shared password.
  useEffect(() => {
    const saved = getRememberedPassword()
    if (!saved) return
    let cancelled = false
    unlock(project.id, saved)
      .then((payload) => {
        if (!cancelled) onUnlock(payload)
      })
      .catch(() => {
        /* stale/wrong stored password — fall through to the prompt */
      })
    return () => {
      cancelled = true
    }
  }, [project.id, onUnlock])

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (busy || !password) return
    setBusy(true)
    setError(null)
    try {
      const payload = await unlock(project.id, password)
      rememberPassword(password)
      onUnlock(payload)
    } catch (err) {
      setError(
        err instanceof WrongPasswordError
          ? 'That password isn’t right. Try again.'
          : 'Couldn’t load this case study. Check your connection and retry.',
      )
      setBusy(false)
      inputRef.current?.select()
    }
  }

  const previews = project.imageGroups?.[0]?.images.slice(0, 2) ?? []

  return (
    <div className="mx-auto w-full max-w-[820px] px-[min(8vw,64px)] pt-[calc(96px+env(safe-area-inset-top))] pb-[calc(80px+env(safe-area-inset-bottom))]">
      {/* Eyebrow */}
      <div className="mb-5 flex items-center gap-[10px] font-mono text-[11px] font-bold uppercase tracking-[0.18em] text-ink-soft">
        <span className="h-[3px] w-[28px] flex-shrink-0 rounded-[2px]" style={{ background: accent }} />
        {qLabel} · {project.sub}
      </div>

      {/* Title */}
      <div className="flex flex-wrap items-end gap-x-5 gap-y-3">
        <h1 className="text-[clamp(40px,7vw,72px)] font-extrabold leading-[0.95] tracking-[-0.03em] text-ink">
          {project.label}
        </h1>
        <span
          className="mb-[10px] inline-flex items-center gap-[7px] rounded-full px-[12px] py-[6px] text-[12px] font-semibold text-ink"
          style={{ background: `${accent}22` }}
        >
          <svg viewBox="0 0 24 24" className="h-[13px] w-[13px]" fill="none" aria-hidden>
            <rect x="5" y="11" width="14" height="9" rx="2" fill={accent} />
            <path d="M8 11V8a4 4 0 0 1 8 0v3" stroke={accent} strokeWidth="2" strokeLinecap="round" />
          </svg>
          Protected case study
        </span>
      </div>

      {/* Teaser summary + hero metric */}
      <div className="mt-8 grid grid-cols-[1fr_auto] items-start gap-10 max-[720px]:grid-cols-1 max-[720px]:gap-6">
        <p className="max-w-[60ch] text-[clamp(17px,2vw,22px)] leading-[1.6] text-[#2a2622]">
          {project.teaser?.summary ?? project.desc}
        </p>
        {project.teaser?.metric && (
          <div className="flex min-w-[150px] flex-col rounded-[14px] px-5 py-4" style={{ background: `${accent}1a` }}>
            <span className="text-[clamp(26px,3.4vw,40px)] font-extrabold leading-none tracking-[-0.02em] text-ink">
              {project.teaser.metric.value}
            </span>
            <span className="mt-[7px] text-[12px] font-medium leading-[1.35] text-ink-soft">
              {project.teaser.metric.label}
            </span>
          </div>
        )}
      </div>

      {/* A visual or two */}
      {previews.length > 0 && (
        <div className={`mt-8 grid gap-4 ${previews.length > 1 ? 'grid-cols-2 max-[560px]:grid-cols-1' : 'grid-cols-1'}`}>
          {previews.map((img, i) => (
            <div key={i} className="overflow-hidden rounded-[12px] bg-black/[0.04]" style={{ aspectRatio: '16 / 10' }}>
              <img
                src={img.src}
                alt={img.caption ?? `${project.label} preview ${i + 1}`}
                draggable={false}
                loading="lazy"
                decoding="async"
                className="h-full w-full object-cover"
              />
            </div>
          ))}
        </div>
      )}

      {/* Disciplines */}
      <div className="mt-7 flex flex-wrap gap-[7px]">
        {project.tags.map((t) => (
          <span
            key={t}
            className="rounded-full bg-black/[0.06] px-[12px] py-[6px] font-mono text-[10px] uppercase tracking-[0.08em] text-ink"
          >
            {t}
          </span>
        ))}
      </div>

      {/* The gate */}
      <form
        onSubmit={submit}
        className="mt-10 rounded-[16px] border border-black/[0.1] bg-black/[0.02] p-6 max-[560px]:p-5"
        aria-label={`Unlock the ${project.label} case study`}
      >
        <h2 className="text-[16px] font-bold tracking-[-0.01em] text-ink">Read the full case study</h2>
        <p className="mt-[6px] max-w-[52ch] text-[13.5px] leading-[1.55] text-ink-soft">
          The detailed write-up — problem, process, decisions, and outcomes — is private. Enter the password Prachi
          shared with you to continue.
        </p>
        <div className="mt-4 flex gap-[10px] max-[440px]:flex-col">
          <input
            ref={inputRef}
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value)
              if (error) setError(null)
            }}
            placeholder="Password"
            aria-label="Password"
            aria-invalid={error ? true : undefined}
            className="min-w-0 flex-1 rounded-[10px] border border-black/[0.14] bg-paper px-[14px] py-[11px] text-[15px] text-ink outline-none transition-colors focus:border-black/[0.35]"
          />
          <button
            type="submit"
            disabled={busy || !password}
            className="flex-shrink-0 rounded-[10px] px-[20px] py-[11px] text-[14px] font-bold text-white transition-opacity disabled:opacity-40"
            style={{ background: accent }}
          >
            {busy ? 'Unlocking…' : 'Unlock'}
          </button>
        </div>
        {error && (
          <p role="alert" className="mt-[10px] text-[13px] font-medium text-[#c0392b]">
            {error}
          </p>
        )}
        <p className="mt-[14px] text-[12px] leading-[1.5] text-ink-soft">
          Don’t have the password?{' '}
          <a href="mailto:hello@mittal.design" className="font-semibold underline" style={{ color: accent }}>
            Request access
          </a>
          .
        </p>
      </form>
    </div>
  )
}
