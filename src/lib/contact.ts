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

// Feedback = a pre-addressed email. Works immediately, no backend.
export const FEEDBACK_URL = `mailto:${EMAIL}?subject=${encodeURIComponent('Feedback on mittal.design')}`
