# How VendorHQ Works

A working prototype of a unified inbox for Nigerian vendors who sell on WhatsApp, Instagram, and Facebook. This document explains the parts, how they fit together, and what's real vs. mocked.

---

## What VendorHQ Is

A web app that consolidates a vendor's customer conversations from multiple chat channels into one screen, with automated workflows for order parsing, payment confirmation, and stock alerts. Powered by n8n on the backend (planned), pure React on the frontend (current).

**Live URL:** https://vendorhq.vercel.app

---

## Tech Stack

| Layer | Tool |
|-------|------|
| Build | Vite 7 |
| UI | React 19 |
| Styling | Tailwind CSS 4 (light theme, Geist font) |
| Routing | React Router 7 |
| Animation | framer-motion |
| Icons | lucide-react (+ custom SVG for brand logos) |
| Toasts | sonner |
| Tooltips | @radix-ui/react-tooltip |
| State | localStorage (no backend yet) |
| Deploy | Vercel |

---

## Page-by-Page Tour

### Marketing site (signed out)

- **`/`** — Landing page. Hero, animated automation flow preview, features grid, pricing, final CTA. Chat widget at bottom-right with FAQ matcher.
- **`/auth`** — Signup/signin. Mock — accepts any name + email, stores in `localStorage`.

### App (signed in)

- **`/dashboard`** — Stats (unread, pending orders, revenue), recent messages, active automations.
- **`/inbox`** — Conversation list + thread view. Three channels supported (WhatsApp, Instagram, Facebook) shown via colored badge dots.
- **`/orders`** — Table of parsed orders with status tabs (pending/paid/shipped/delivered) and channel filter.
- **`/customers`** — Auto-derived from conversations + orders. Tags: lead, customer, repeat. Side drawer shows full customer profile.
- **`/inventory`** — Product cards with stock-level badges. Alert banner when items are low/out.
- **`/automations`** — Toggleable workflow cards. Each expands to reveal a **webhook URL field** + **Test webhook** button.

---

## The Webhook + Automation System

The single feature that makes "n8n-powered" literally true today.

### The flow

```
VendorHQ Automations page
        │
        │  (you paste an n8n webhook URL into a flow)
        │
        ▼
[Test webhook] button
        │
        │  POST { event, channel, customer, ... }
        │  Content-Type: text/plain;charset=UTF-8
        │
        ▼
n8n / webhook.site / Zapier (any receiver)
```

### What gets sent

Each automation has its own sample JSON payload defined in `src/pages/Automations.jsx`. Examples:

```json
{
  "event": "conversation.new",
  "channel": "whatsapp",
  "customer": { "name": "Blessing Okoro", "phone": "+2348012345678" },
  "message": "Hi, do you sell Ankara joggers?",
  "timestamp": "2026-05-25T14:29:49.671Z"
}
```

### Why `text/plain` and not `application/json`?

Sending `Content-Type: application/json` triggers a CORS preflight (`OPTIONS` request before the actual `POST`). Many free webhook receivers (webhook.site, some test endpoints) don't return the right CORS response headers, causing the browser to block the response. Switching to `text/plain` makes it a "simple" CORS request — no preflight, request goes straight through. The body is still JSON; the receiver parses it regardless.

### Opaque response handling

If a receiver does return a response without `Access-Control-Allow-Origin`, the browser will hide it from JS even though the request fired. VendorHQ detects this case and shows **"Sent · response opaque · XXXms"** in amber — confirming the receiver got the data, with a note to check the receiver to see it. n8n returns proper CORS headers, so n8n will always show **"Success · 200 · XXXms"** in green.

---

## The Mock Data Layer

VendorHQ has **no backend**. Everything is mock data + localStorage:

- `src/data/vendor.js` — seed data: 6 conversations, 6 orders, 8 products, 6 automations
- `src/data/faq.js` — chat widget FAQ entries
- `src/lib/storage.js` — wraps localStorage with helpers like `getConversations()`, `getCustomers()`, `toggleAutomation()`, `setAutomationWebhook()`

`getCustomers()` is interesting: there is no "customers" seed list. The function derives customers by walking conversations + orders and aggregating by name. So adding a new conversation or order automatically appears in the Customers page.

### What persists across reloads

- Logged-in user (`ns_user`)
- Automation on/off toggles (`wv_automations`)
- Webhook URLs you pasted (`wv_webhooks`)

### What doesn't persist

- New messages you send in Inbox (UI-only, no storage)
- New orders or products (no Create UI yet)

---

## Layouts

### `<Layout />` (marketing pages)

Top bar with logo + Sign in. Renders `<Outlet />` for child routes. Footer at bottom. Chat widget mounted globally.

### `<AppLayout />` (signed-in pages)

- **Desktop:** Sticky sidebar (256px) with brand, nav, user chip. Pure CSS, no overlay.
- **Mobile:** Top header with hamburger + page title + avatar. Tapping hamburger opens a drawer (framer-motion `drag` enabled — swipe left to close). Same `<NavList />` and `<UserChip />` components used in both, so mobile is identical to desktop.

---

## The Chat Widget

Bottom-right floating launcher with a breathing emerald pulse (two staggered animated rings). Click opens a 380px panel with:

- "Ada from VendorHQ" header with online dot
- Welcome message + 6 suggested question chips
- Free-text input
- Keyword-based FAQ matcher (`src/data/faq.js`)

Matching: loops through FAQ entries; first entry whose `keywords[]` includes a substring of the user's lowercased input wins. Falls back to a generic "I'll get a human" message if nothing matches.

---

## Routing

`src/App.jsx` uses React Router 7 with two layouts:

```jsx
<Route element={<Layout />}>          // marketing
  <Route path="/" element={<Landing />} />
  <Route path="/auth" element={<Auth />} />
</Route>

<Route element={<RequireAuth><AppLayout /></RequireAuth>}>  // app
  <Route path="/dashboard" element={<Dashboard />} />
  <Route path="/inbox" element={<Inbox />} />
  ...
</Route>
```

`RequireAuth` redirects to `/auth` if `localStorage.ns_user` is missing.

`<ScrollToTop />` mounted inside `<BrowserRouter>` resets scroll on route change (respects `#anchor` jumps for hash links).

---

## Deploy

`vercel.json` rewrites every URL to `/index.html` so React Router handles SPA routing:

```json
{
  "rewrites": [
    { "source": "/((?!api/).*)", "destination": "/index.html" }
  ]
}
```

Vercel auto-deploys on every push to `main`. ~30 seconds from `git push` to live.

---

## Local Development

```bash
npm install
npm run dev      # http://localhost:5173 (or 5174 if 5173 is busy)
npm run build    # production build
npm run preview  # serve the production build locally
```

---

## What's Real vs. Mocked

| Feature | State |
|---------|-------|
| Routing, layouts, theming | Real |
| Sign up / sign in | Mocked (localStorage) |
| Conversations + messages | Mocked (seed data) |
| Orders, customers, inventory | Mocked (seed + derived) |
| Automation toggles | Real (localStorage) |
| Webhook URLs per automation | Real (localStorage) |
| **Test webhook button** | **Real — actually fires HTTP POST** |
| Chat widget responses | Real keyword matcher (not LLM) |
| Receiving real WhatsApp messages | Not yet — needs Meta Cloud API + backend |
| Payments / Paystack | Not yet — UI claims only |

---

## What's Missing (Roadmap)

1. **Backend** (Supabase or similar) so multiple vendors can sign up and have isolated data
2. **WhatsApp Cloud API integration** via n8n so real messages land in the Inbox
3. **AI chat upgrade** — swap the FAQ matcher for Claude or Groq
4. **OG meta tags + favicon** for proper link previews
5. **Settings page** — profile, billing, notification preferences
6. **Payment matching** — Paystack webhook → auto-mark orders paid
7. **One real vendor using it** ← biggest gap, not a code task
