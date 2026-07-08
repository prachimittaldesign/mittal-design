// Client-side unlock for the password-gated case studies.
//
// The full case-study bodies are AES-256-GCM encrypted at build time (see
// scripts/seoPlugin.ts) with a key derived from the site password via PBKDF2.
// The plaintext is never bundled or prerendered — the only way to read a locked
// study is to enter the password, derive the key here, and decrypt the blob
// fetched from /locked/<id>.json. A wrong password fails the GCM auth check, so
// there is nothing to "reveal" by editing the DOM or CSS.
//
// Unlock is session-scoped: the password is held in sessionStorage so the three
// featured studies open seamlessly within a tab, and everything re-locks when
// the tab closes.
import type { EncryptedBlob, LockedPayload } from '../types'

const SESSION_KEY = 'md.unlock.v1'

// Backed by an explicit ArrayBuffer so `.buffer` is a plain ArrayBuffer (not
// ArrayBufferLike) — required to satisfy WebCrypto's BufferSource typing.
function b64ToBytes(b64: string): Uint8Array<ArrayBuffer> {
  const bin = atob(b64)
  const buf = new ArrayBuffer(bin.length)
  const out = new Uint8Array(buf)
  for (let i = 0; i < bin.length; i++) out[i] = bin.charCodeAt(i)
  return out
}

async function deriveKey(password: string, blob: EncryptedBlob): Promise<CryptoKey> {
  const enc = new TextEncoder()
  const material = await crypto.subtle.importKey('raw', enc.encode(password), 'PBKDF2', false, ['deriveKey'])
  return crypto.subtle.deriveKey(
    { name: 'PBKDF2', salt: b64ToBytes(blob.kdf.salt), iterations: blob.kdf.iterations, hash: blob.kdf.hash },
    material,
    { name: 'AES-GCM', length: 256 },
    false,
    ['decrypt'],
  )
}

// In-memory memo so re-opening a study in the same session skips the network +
// crypto round-trip. Keyed by project id.
const decrypted = new Map<string, LockedPayload>()

async function fetchBlob(id: string): Promise<EncryptedBlob> {
  const res = await fetch(`/locked/${id}.json`, { cache: 'no-store' })
  if (!res.ok) throw new Error(`locked content unavailable (${res.status})`)
  return res.json()
}

/** Attempt to decrypt `id`'s case study with `password`. Throws on wrong password. */
export async function unlock(id: string, password: string): Promise<LockedPayload> {
  const cached = decrypted.get(id)
  if (cached) return cached
  const blob = await fetchBlob(id)
  const key = await deriveKey(password, blob)
  let plainBuf: ArrayBuffer
  try {
    plainBuf = await crypto.subtle.decrypt({ name: 'AES-GCM', iv: b64ToBytes(blob.iv) }, key, b64ToBytes(blob.data))
  } catch {
    throw new WrongPasswordError()
  }
  const payload = JSON.parse(new TextDecoder().decode(plainBuf)) as LockedPayload
  decrypted.set(id, payload)
  return payload
}

export class WrongPasswordError extends Error {
  constructor() {
    super('Incorrect password')
    this.name = 'WrongPasswordError'
  }
}

export function rememberPassword(password: string): void {
  try {
    sessionStorage.setItem(SESSION_KEY, password)
  } catch {
    /* private mode / storage disabled — unlock simply won't persist */
  }
}

export function getRememberedPassword(): string | null {
  try {
    return sessionStorage.getItem(SESSION_KEY)
  } catch {
    return null
  }
}
