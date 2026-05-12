import { useState } from 'react'
import { motion } from 'framer-motion'
import { Zap, ArrowRight, ExternalLink } from 'lucide-react'
import { getAutomations, toggleAutomation } from '../lib/storage'
import { cn } from '../lib/cn'

const fadeUp = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4 } },
}

const stagger = { hidden: {}, show: { transition: { staggerChildren: 0.06 } } }

export default function Automations() {
  const [items, setItems] = useState(getAutomations())

  function handleToggle(id, enabled) {
    toggleAutomation(id, enabled)
    setItems(getAutomations())
  }

  const activeCount = items.filter((a) => a.enabled).length

  return (
    <motion.div
      initial="hidden"
      animate="show"
      variants={stagger}
      className="mx-auto max-w-5xl px-6 py-8"
    >
      <motion.header variants={fadeUp} className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">Automations</h1>
          <p className="mt-1.5 text-sm text-slate-500">
            Powered by n8n. Each flow runs when its trigger fires — no babysitting required.
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
            Build any workflow in n8n and connect it to VendorHQ via webhook. Your inbox becomes
            a trigger, your CRM becomes an action.
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
          <motion.div
            key={a.id}
            variants={fadeUp}
            whileHover={{ y: -1 }}
            transition={{ type: 'spring', stiffness: 300, damping: 22 }}
            className={cn(
              'rounded-2xl border p-6 transition',
              a.enabled
                ? 'border-slate-200 bg-white shadow-sm hover:border-slate-300 hover:shadow-md hover:shadow-slate-900/5'
                : 'border-slate-200 bg-slate-50/50 hover:bg-white',
            )}
          >
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0 flex-1">
                <h3 className="font-semibold text-slate-900">{a.name}</h3>
                <p className="mt-1 text-sm text-slate-600">{a.description}</p>

                <div className="mt-3 flex flex-wrap items-center gap-2 text-xs">
                  <Pill color="rose">Trigger: {a.trigger}</Pill>
                  <ArrowRight className="h-3 w-3 text-slate-400" />
                  <Pill color="indigo">{a.action}</Pill>
                </div>

                {a.enabled && a.runs > 0 && (
                  <p className="mt-3 text-xs text-slate-500">
                    {a.runs} runs this month
                  </p>
                )}
              </div>

              <Toggle checked={a.enabled} onChange={(v) => handleToggle(a.id, v)} />
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  )
}

const pillColor = {
  rose: 'bg-rose-50 text-rose-700 ring-rose-200',
  indigo: 'bg-indigo-50 text-indigo-700 ring-indigo-200',
}

function Pill({ color, children }) {
  return (
    <span className={cn('inline-block rounded-md px-2 py-0.5 ring-1 ring-inset', pillColor[color])}>
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
        checked ? 'bg-emerald-500 shadow-sm shadow-emerald-500/30' : 'bg-slate-300',
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
