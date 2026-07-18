// Single source of truth for the "reach out" links used by the city (About
// menu) and the fast /projects page, so they never drift.

export const EMAIL = 'hello@mittal.design'
export const LINKEDIN = 'https://www.linkedin.com/in/prachi15mittal'

// WhatsApp: set to the full international number, DIGITS ONLY — country code +
// number, no '+', spaces or dashes (e.g. '919812345678' for +91 98123 45678).
// While this is empty the WhatsApp buttons are hidden everywhere, so the site
// never shows a broken "click to chat" link.
export const WHATSAPP_NUMBER = ''
export const WHATSAPP_URL = WHATSAPP_NUMBER
  ? `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent('Hi Prachi — I came from your portfolio site.')}`
  : ''

// Feedback modal submission — no backend needed. Paste a free Web3Forms access
// key (https://web3forms.com — "Create Access Key", takes ~30s, delivers each
// submission to your inbox). While empty, the modal still works: it falls back
// to opening a pre-filled email with the name/email/message, so it's never dead.
export const WEB3FORMS_KEY = ''

// Fallback used when no form key is set (and as the modal's "email instead" link).
export const FEEDBACK_URL = `mailto:${EMAIL}?subject=${encodeURIComponent('Feedback on mittal.design')}`
