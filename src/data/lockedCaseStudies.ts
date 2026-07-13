import type { LockedPayload } from '../types'
import { VED_CASE_STUDY } from './projects/ved'
import { SNAPLOGIC_CASE_STUDY } from './projects/snaplogic'
import { REVEE_CASE_STUDY } from './projects/revee'

// NODE-ONLY. This module is imported solely by scripts/seoPlugin.ts at build
// time to produce the encrypted blobs in dist/locked/. It is NEVER imported by
// any client module, so this plaintext never enters the browser bundle.

export const LOCKED_CASE_STUDIES: Record<string, LockedPayload> = {
  paas: { kind: 'rich', data: VED_CASE_STUDY },
  snaplogic: { kind: 'rich', data: SNAPLOGIC_CASE_STUDY },
  revee: { kind: 'rich', data: REVEE_CASE_STUDY },
}
