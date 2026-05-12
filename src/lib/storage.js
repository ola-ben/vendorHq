import { CONVERSATIONS, ORDERS, AUTOMATIONS, PRODUCTS } from '../data/vendor'

const KEYS = {
  user: 'wv_user',
  automations: 'wv_automations',
  webhooks: 'wv_webhooks',
}

export function getUser() {
  const raw = localStorage.getItem(KEYS.user)
  return raw ? JSON.parse(raw) : null
}

export function setUser(user) {
  localStorage.setItem(KEYS.user, JSON.stringify(user))
}

export function clearUser() {
  localStorage.removeItem(KEYS.user)
}

export function getConversations() {
  return CONVERSATIONS
}

export function getConversationById(id) {
  return CONVERSATIONS.find((c) => c.id === id)
}

export function getOrders() {
  return ORDERS
}

export function getAutomations() {
  const rawToggle = localStorage.getItem(KEYS.automations)
  const overrides = rawToggle ? JSON.parse(rawToggle) : {}
  const rawHooks = localStorage.getItem(KEYS.webhooks)
  const hooks = rawHooks ? JSON.parse(rawHooks) : {}
  return AUTOMATIONS.map((a) => ({
    ...a,
    enabled: overrides[a.id] !== undefined ? overrides[a.id] : a.enabled,
    webhookUrl: hooks[a.id] || '',
  }))
}

export function toggleAutomation(id, enabled) {
  const raw = localStorage.getItem(KEYS.automations)
  const overrides = raw ? JSON.parse(raw) : {}
  overrides[id] = enabled
  localStorage.setItem(KEYS.automations, JSON.stringify(overrides))
}

export function setAutomationWebhook(id, url) {
  const raw = localStorage.getItem(KEYS.webhooks)
  const hooks = raw ? JSON.parse(raw) : {}
  if (url) hooks[id] = url
  else delete hooks[id]
  localStorage.setItem(KEYS.webhooks, JSON.stringify(hooks))
}

export function getProducts() {
  return PRODUCTS
}

export function getCustomers() {
  const map = new Map()

  for (const c of CONVERSATIONS) {
    map.set(c.customerName, {
      name: c.customerName,
      avatar: c.avatar,
      channel: c.channel,
      phone: c.phone,
      lastSeen: c.lastMessageAt,
      messages: c.messages.length,
      orders: 0,
      spent: 0,
      status: 'lead',
    })
  }

  for (const o of ORDERS) {
    const existing = map.get(o.customerName) || {
      name: o.customerName,
      avatar: `https://i.pravatar.cc/150?u=${encodeURIComponent(o.customerName)}`,
      channel: o.channel,
      phone: null,
      lastSeen: o.placedAt,
      messages: 0,
      orders: 0,
      spent: 0,
      status: 'lead',
    }
    existing.orders += 1
    if (o.status !== 'pending') existing.spent += o.total
    if (new Date(o.placedAt) > new Date(existing.lastSeen || 0)) existing.lastSeen = o.placedAt
    existing.status = existing.spent > 0 ? (existing.orders >= 2 ? 'repeat' : 'customer') : 'lead'
    map.set(o.customerName, existing)
  }

  return Array.from(map.values()).sort((a, b) => new Date(b.lastSeen) - new Date(a.lastSeen))
}

export function formatNaira(n) {
  return '₦' + Number(n || 0).toLocaleString('en-NG')
}

export function timeAgo(iso) {
  const diff = Date.now() - new Date(iso).getTime()
  const m = Math.floor(diff / 60000)
  if (m < 1) return 'just now'
  if (m < 60) return `${m}m`
  const h = Math.floor(m / 60)
  if (h < 24) return `${h}h`
  const d = Math.floor(h / 24)
  return `${d}d`
}
