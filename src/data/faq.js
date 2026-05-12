export const SUGGESTED = [
  'How much does it cost?',
  'How do you connect to WhatsApp?',
  'Is my data safe?',
  'How long does setup take?',
  'What is n8n?',
  'Can I cancel anytime?',
]

export const FAQ = [
  {
    id: 'pricing',
    keywords: ['price', 'pricing', 'cost', 'fee', 'how much', 'expensive', 'free'],
    answer:
      "Three plans — Starter is free (100 messages/month, 1 channel), Growth is ₦5,000/month (1,500 messages, all 3 channels, all automations), and Scale is ₦15,000/month (unlimited, 3 stores, custom n8n flows). You can scroll to the Pricing section above for the full breakdown.",
  },
  {
    id: 'whatsapp',
    keywords: ['whatsapp', 'wa', 'connect whatsapp', 'whatsapp business'],
    answer:
      "Two ways: 1) Connect WhatsApp Business API via Meta Cloud (production-grade, ~₦8 per conversation after the free tier), or 2) use our forwarder mode where you forward your WhatsApp messages to a VendorHQ number — works on day 1 with zero setup. Most vendors start with option 2.",
  },
  {
    id: 'security',
    keywords: ['safe', 'security', 'data', 'private', 'privacy', 'encrypt', 'ndpr'],
    answer:
      "Yes — all messages are encrypted in transit and at rest. We follow Nigeria's NDPR rules, never share your customer data, and you can export or delete everything at any time. Your customers' phone numbers stay yours.",
  },
  {
    id: 'setup',
    keywords: ['setup', 'install', 'how long', 'get started', 'onboard', 'time to'],
    answer:
      "About 5 minutes. Sign up → choose your channels → connect Paystack (optional) → flip on the automations you want. You'll start getting messages in your unified inbox immediately.",
  },
  {
    id: 'n8n',
    keywords: ['n8n', 'automation', 'workflow', 'integration'],
    answer:
      "n8n is a no-code automation tool (think Zapier, but you can self-host). VendorHQ ships with pre-built n8n flows for common vendor tasks — auto-replies, payment matching, daily summaries. Want a custom flow? Build it in n8n and connect it via webhook.",
  },
  {
    id: 'cancel',
    keywords: ['cancel', 'refund', 'commit', 'contract', 'lock-in', 'lockin'],
    answer:
      "No contracts. Cancel any time from your dashboard — you keep access until the end of your current billing cycle. We do not offer prorated refunds, but you can also pause your subscription for up to 3 months.",
  },
  {
    id: 'paystack',
    keywords: ['paystack', 'payment', 'bank', 'transfer', 'paid', 'monnify', 'flutterwave'],
    answer:
      "Yes! We integrate with Paystack natively — when a customer pays for an order, VendorHQ matches the alert to the right order and marks it paid automatically. We also support Flutterwave and Monnify. Bank-alert SMS forwarding is on the roadmap.",
  },
  {
    id: 'channels',
    keywords: ['instagram', 'facebook', 'channel', 'platform', 'tiktok'],
    answer:
      "Right now: WhatsApp, Instagram DMs, and Facebook Messenger. TikTok DMs and Telegram are on the roadmap. If you need a specific channel, let us know — we add the most-requested ones first.",
  },
  {
    id: 'support',
    keywords: ['support', 'help', 'contact', 'reach', 'email', 'phone'],
    answer:
      "We respond by email within 24 hours on the free plan, within 2 hours on Growth, and within 30 minutes on Scale. Reach us at hi@vendorhq.app or via this chat.",
  },
  {
    id: 'humans',
    keywords: ['human', 'real person', 'speak to someone', 'agent', 'talk to'],
    answer:
      "I'm an automated assistant, but a real person reads everything that comes through. Drop your question and an email and someone from the team will reply — usually within a few hours.",
  },
]

export const FALLBACK =
  "I'm not sure about that one yet — but a teammate will see your message and get back to you. You can also email hi@vendorhq.app and we'll usually reply within a few hours."

export const WELCOME =
  "Hi! I'm Ada from VendorHQ 👋 Ask me anything about how it works, pricing, or setup."

export function findAnswer(text) {
  const t = text.toLowerCase()
  for (const item of FAQ) {
    if (item.keywords.some((k) => t.includes(k))) return item.answer
  }
  return FALLBACK
}
