// Single source of truth for the "reach out" links used by the city (About
// menu) and the fast /projects page, so they never drift.

export const EMAIL = 'hello@mittal.design'
export const LINKEDIN = 'https://www.linkedin.com/in/prachi15mittal'

// WhatsApp: set to the full international number, DIGITS ONLY — country code +
// number, no '+', spaces or dashes (e.g. '919812345678' for +91 98123 45678).
// While this is empty the WhatsApp buttons are hidden everywhere, so the site
// never shows a broken "click to chat" link.
export const WHATSAPP_NUMBER = '918959202673'
export const WHATSAPP_URL = WHATSAPP_NUMBER
  ? `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent('Hi Prachi — I came from your portfolio site.')}`
  : ''

// Feedback modal submission. The modal tries these in order:
//   1. FEEDBACK_ENDPOINT — your own endpoint (e.g. a Cloudflare Worker/Pages
//      Function) that receives a JSON POST { name, email, message } and emails
//      hello@mittal.design. Paste its full URL here. Success = any 2xx.
//   2. WEB3FORMS_KEY — alternatively, a free Web3Forms access key.
//   3. Neither set → opens a pre-filled email, so the form is never a dead end.
export const FEEDBACK_ENDPOINT = ''
export const WEB3FORMS_KEY = '84dba759-8337-4ff8-9876-324475f5aa9d'

// Fallback used when nothing above is set (and as the modal's "email instead" link).
export const FEEDBACK_URL = `mailto:${EMAIL}?subject=${encodeURIComponent('Feedback on mittal.design')}`
