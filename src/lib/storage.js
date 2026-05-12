import { CONVERSATIONS, ORDERS, AUTOMATIONS } from '../data/vendor'

const KEYS = {
  user: 'wv_user',
  automations: 'wv_automations',
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
  const raw = localStorage.getItem(KEYS.automations)
  const overrides = raw ? JSON.parse(raw) : {}
  return AUTOMATIONS.map((a) => ({
    ...a,
    enabled: overrides[a.id] !== undefined ? overrides[a.id] : a.enabled,
  }))
}

export function toggleAutomation(id, enabled) {
  const raw = localStorage.getItem(KEYS.automations)
  const overrides = raw ? JSON.parse(raw) : {}
  overrides[id] = enabled
  localStorage.setItem(KEYS.automations, JSON.stringify(overrides))
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
