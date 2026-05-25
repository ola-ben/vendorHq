import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { toast } from 'sonner'
import {
  Zap,
  ArrowRight,
  ExternalLink,
  ChevronDown,
  Send,
  Check,
  AlertCircle,
  Loader2,
  Copy,
} from 'lucide-react'
import {
  getAutomations,
  toggleAutomation,
  setAutomationWebhook,
} from '../lib/storage'
import Tooltip from '../components/Tooltip'
import { cn } from '../lib/cn'

const fadeUp = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4 } },
}

const stagger = { hidden: {}, show: { transition: { staggerChildren: 0.06 } } }

export default function Automations() {
  const [items, setItems] = useState(getAutomations())
  const [openId, setOpenId] = useState(null)

  function refresh() {
    setItems(getAutomations())
  }

  function handleToggle(id, enabled) {
    toggleAutomation(id, enabled)
    refresh()
    const a = items.find((x) => x.id === id)
    toast.success(enabled ? `Enabled · ${a?.name}` : `Paused · ${a?.name}`)
  }

  function handleWebhookChange(id, url, opts = {}) {
    setAutomationWebhook(id, url)
    refresh()
    if (opts.silent) return
    if (url) toast.success('Webhook URL saved')
    else toast('Webhook URL cleared')
  }

  const activeCount = items.filter((a) => a.enabled).length

  return (
    <motion.div
      initial="hidden"
      animate="show"
      variants={stagger}
      className="mx-auto max-w-5xl px-6 py-8"
    >
      <motion.header
        variants={fadeUp}
        className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between"
      >
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">Automations</h1>
          <p className="mt-1.5 text-sm text-slate-500">
            Powered by n8n. Each flow runs when its trigger fires — paste your n8n webhook URL to wire it up.
          </p>
        </div>
        <div className="inline-flex items-center gap-2 self-start rounded-xl bg-amber-50 px-3.5 py-2 text-sm font-medium text-amber-800 ring-1 ring-inset ring-amber-100">
          <Zap className="h-4 w-4" />
          {activeCount} of {items.length} active
        </div>
      </motion.header>

      <motion.div
        variants={fadeUp}
        className="relative mb-6 overflow-hidden rounded-2xl border border-emerald-200 bg-linear-to-br from-emerald-50 to-white p-6"
      >
        <div className="absolute -right-12 -top-12 h-40 w-40 rounded-full bg-emerald-200/40 blur-2xl" />
        <div className="relative">
          <h3 className="font-semibold text-emerald-900">Want a custom automation?</h3>
          <p className="mt-1.5 max-w-xl text-sm text-emerald-900/70">
            Build any workflow in n8n and connect it here via webhook. Your inbox becomes the
            trigger, your CRM becomes the action.
          </p>
          <a
            href="https://n8n.io"
            target="_blank"
            rel="noreferrer"
            className="group mt-4 inline-flex items-center gap-1 text-sm font-medium text-emerald-700 hover:text-emerald-800"
          >
            Open n8n docs
            <ExternalLink className="h-3.5 w-3.5 transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </a>
        </div>
      </motion.div>

      <div className="space-y-3">
        {items.map((a) => (
          <AutomationRow
            key={a.id}
            automation={a}
            open={openId === a.id}
            onToggleOpen={() => setOpenId(openId === a.id ? null : a.id)}
            onToggle={(v) => handleToggle(a.id, v)}
            onWebhookChange={(url) => handleWebhookChange(a.id, url)}
          />
        ))}
      </div>
    </motion.div>
  )
}

function AutomationRow({ automation, open, onToggleOpen, onToggle, onWebhookChange }) {
  const a = automation
  return (
    <motion.div
      variants={fadeUp}
      className={cn(
        'rounded-2xl border transition',
        a.enabled
          ? 'border-slate-200 bg-white shadow-sm hover:border-slate-300'
          : 'border-slate-200 bg-slate-50/50',
      )}
    >
      <div className="flex items-start justify-between gap-4 p-6">
        <button
          onClick={onToggleOpen}
          className="flex min-w-0 flex-1 items-start gap-3 text-left"
        >
          <ChevronDown
            className={cn(
              'mt-1 h-4 w-4 shrink-0 text-slate-400 transition-transform',
              open && 'rotate-180',
            )}
          />
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <h3 className="font-semibold text-slate-900">{a.name}</h3>
              {a.webhookUrl && (
                <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider text-emerald-700 ring-1 ring-inset ring-emerald-200">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                  Wired
                </span>
              )}
            </div>
            <p className="mt-1 text-sm text-slate-600">{a.description}</p>
            <div className="mt-3 flex flex-wrap items-center gap-2 text-xs">
              <Pill color="rose">Trigger: {a.trigger}</Pill>
              <ArrowRight className="h-3 w-3 text-slate-400" />
              <Pill color="indigo">{a.action}</Pill>
            </div>
            {a.enabled && a.runs > 0 && (
              <p className="mt-3 text-xs text-slate-500">{a.runs} runs this month</p>
            )}
          </div>
        </button>

        <Toggle checked={a.enabled} onChange={onToggle} />
      </div>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden border-t border-slate-100"
          >
            <WebhookEditor
              automationId={a.id}
              url={a.webhookUrl}
              onChange={onWebhookChange}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

function WebhookEditor({ automationId, url, onChange }) {
  const [draft, setDraft] = useState(url)
  const [status, setStatus] = useState('idle')
  const [response, setResponse] = useState(null)
  const [copied, setCopied] = useState(false)

  function handleSave() {
    onChange(draft.trim())
  }

  async function handleTest() {
    if (!draft.trim()) return
    setStatus('loading')
    setResponse(null)
    onChange(draft.trim(), { silent: true })

    const payload = SAMPLE_PAYLOADS[automationId] || SAMPLE_PAYLOADS.default
    const startedAt = performance.now()

    try {
      const res = await fetch(draft.trim(), {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain;charset=UTF-8' },
        body: JSON.stringify(payload),
      })
      const ms = Math.round(performance.now() - startedAt)
      let body = ''
      try {
        body = await res.text()
      } catch {
        body = ''
      }
      setResponse({
        ok: res.ok,
        status: res.status,
        ms,
        body: body.slice(0, 800),
      })
      setStatus(res.ok ? 'ok' : 'error')
      if (res.ok) {
        toast.success('Webhook fired', { description: `${res.status} · ${ms}ms` })
      } else {
        toast.error('Webhook failed', { description: `${res.status} · ${ms}ms` })
      }
    } catch (e) {
      const ms = Math.round(performance.now() - startedAt)
      setResponse({
        ok: false,
        status: 0,
        ms,
        body: e.message || 'Network error — check the URL is reachable.',
      })
      setStatus('error')
      toast.error('Network error', { description: 'URL unreachable. Is n8n running?' })
    }
  }

  async function copyPayload() {
    const payload = SAMPLE_PAYLOADS[automationId] || SAMPLE_PAYLOADS.default
    try {
      await navigator.clipboard.writeText(JSON.stringify(payload, null, 2))
      setCopied(true)
      toast.success('Payload copied')
      setTimeout(() => setCopied(false), 1500)
    } catch {
      toast.error('Copy failed')
    }
  }

  return (
    <div className="space-y-5 p-6">
      <div>
        <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-slate-500">
          n8n webhook URL
        </label>
        <div className="flex flex-col gap-2 sm:flex-row">
          <input
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onBlur={handleSave}
            placeholder="https://your-n8n.example.com/webhook/abcdef"
            className="flex-1 rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 font-mono text-sm text-slate-900 placeholder:text-slate-400 transition focus:border-slate-900 focus:outline-none focus:ring-4 focus:ring-slate-900/5"
          />
          <motion.button
            type="button"
            onClick={handleTest}
            disabled={!draft.trim() || status === 'loading'}
            whileTap={{ scale: 0.97 }}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-medium text-white shadow-lg shadow-slate-900/15 transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-40"
          >
            {status === 'loading' ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Sending…
              </>
            ) : (
              <>
                <Send className="h-4 w-4" />
                Test webhook
              </>
            )}
          </motion.button>
        </div>
        <p className="mt-2 text-xs text-slate-500">
          Run <code className="rounded bg-slate-100 px-1.5 py-0.5 font-mono text-[11px] text-slate-700">npx n8n</code> on your laptop, paste the webhook URL from your flow, then hit Test.
        </p>
      </div>

      <div>
        <div className="mb-2 flex items-center justify-between">
          <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">
            Sample payload
          </label>
          <button
            onClick={copyPayload}
            className="inline-flex items-center gap-1 text-xs font-medium text-slate-500 hover:text-slate-700"
          >
            {copied ? (
              <>
                <Check className="h-3 w-3 text-emerald-500" /> Copied
              </>
            ) : (
              <>
                <Copy className="h-3 w-3" /> Copy JSON
              </>
            )}
          </button>
        </div>
        <pre className="overflow-x-auto rounded-xl border border-slate-200 bg-slate-50 p-4 font-mono text-xs leading-relaxed text-slate-700">
{JSON.stringify(SAMPLE_PAYLOADS[automationId] || SAMPLE_PAYLOADS.default, null, 2)}
        </pre>
      </div>

      <AnimatePresence>
        {response && (
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            className={cn(
              'rounded-xl border p-4',
              response.ok
                ? 'border-emerald-200 bg-emerald-50'
                : 'border-rose-200 bg-rose-50',
            )}
          >
            <div className="flex items-center gap-2">
              {response.ok ? (
                <Check className="h-4 w-4 text-emerald-600" />
              ) : (
                <AlertCircle className="h-4 w-4 text-rose-600" />
              )}
              <span
                className={cn(
                  'font-medium',
                  response.ok ? 'text-emerald-900' : 'text-rose-900',
                )}
              >
                {response.ok
                  ? `Success · ${response.status} · ${response.ms}ms`
                  : response.status
                    ? `Failed · ${response.status} · ${response.ms}ms`
                    : `Network error · ${response.ms}ms`}
              </span>
            </div>
            {response.body && (
              <pre className="mt-3 max-h-40 overflow-auto rounded-lg bg-white/70 p-3 font-mono text-xs text-slate-700">
                {response.body}
              </pre>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

const SAMPLE_PAYLOADS = {
  default: {
    event: 'automation.test',
    timestamp: new Date().toISOString(),
    vendor: 'Ada\'s Closet',
  },
  a1: {
    event: 'conversation.new',
    channel: 'whatsapp',
    customer: { name: 'Blessing Okoro', phone: '+2348012345678' },
    message: 'Hi, do you sell Ankara joggers?',
    timestamp: new Date().toISOString(),
  },
  a2: {
    event: 'order.confirmed',
    order: {
      id: 'ORD-109',
      customer: 'Tunde Akinola',
      items: [{ name: 'Ankara Hoodie', qty: 1, price: 18000 }],
      total: 18000,
    },
    bankDetails: { bank: 'GTB', account: '0123456789', name: 'Ada\'s Closet' },
  },
  a3: {
    event: 'payment.received',
    amount: 18000,
    reference: 'TR-77821',
    from: 'TUNDE AKINOLA',
    matchedOrderId: 'ORD-109',
  },
  a4: {
    event: 'inventory.low',
    product: { sku: 'ANK-HD-001', name: 'Ankara Hoodie - Black M', stock: 3 },
    threshold: 5,
  },
  a5: {
    event: 'cart.abandoned',
    customer: 'Yusuf B.',
    channel: 'facebook',
    inquiredAbout: 'Bucket Hat',
    hoursElapsed: 24,
  },
  a6: {
    event: 'daily.summary',
    date: new Date().toISOString().slice(0, 10),
    orders: 7,
    revenue: 84500,
    topProduct: 'Cold-Press Juice',
  },
}

const pillColor = {
  rose: 'bg-rose-50 text-rose-700 ring-rose-200',
  indigo: 'bg-indigo-50 text-indigo-700 ring-indigo-200',
}

function Pill({ color, children }) {
  return (
    <span
      className={cn(
        'inline-block rounded-md px-2 py-0.5 ring-1 ring-inset',
        pillColor[color],
      )}
    >
      {children}
    </span>
  )
}

function Toggle({ checked, onChange }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className={cn(
        'relative inline-flex h-7 w-12 shrink-0 cursor-pointer items-center rounded-full transition',
        checked
          ? 'bg-emerald-500 shadow-sm shadow-emerald-500/30'
          : 'bg-slate-300',
      )}
    >
      <motion.span
        layout
        transition={{ type: 'spring', stiffness: 700, damping: 30 }}
        className={cn(
          'inline-block h-5 w-5 rounded-full bg-white shadow-md',
          checked ? 'ml-auto mr-1' : 'ml-1',
        )}
      />
    </button>
  )
}
