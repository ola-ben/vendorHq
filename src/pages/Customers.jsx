import { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, Phone, MessageCircle, ShoppingBag, Wallet, X, ArrowRight } from 'lucide-react'
import { Instagram, Facebook } from '../components/BrandIcons'
import { getCustomers, getConversations, formatNaira, timeAgo } from '../lib/storage'
import { cn } from '../lib/cn'

const STATUS = {
  lead: { label: 'Lead', cls: 'bg-slate-100 text-slate-600 ring-slate-200' },
  customer: { label: 'Customer', cls: 'bg-emerald-50 text-emerald-700 ring-emerald-200' },
  repeat: { label: 'Repeat', cls: 'bg-violet-50 text-violet-700 ring-violet-200' },
}

export default function Customers() {
  const customers = getCustomers()
  const [query, setQuery] = useState('')
  const [tab, setTab] = useState('all')
  const [selected, setSelected] = useState(null)

  const filtered = useMemo(() => {
    return customers.filter((c) => {
      const matchesTab = tab === 'all' || c.status === tab
      const q = query.trim().toLowerCase()
      const matchesQuery =
        !q ||
        c.name.toLowerCase().includes(q) ||
        c.phone?.toLowerCase().includes(q) ||
        c.channel.toLowerCase().includes(q)
      return matchesTab && matchesQuery
    })
  }, [customers, tab, query])

  const counts = {
    all: customers.length,
    lead: customers.filter((c) => c.status === 'lead').length,
    customer: customers.filter((c) => c.status === 'customer').length,
    repeat: customers.filter((c) => c.status === 'repeat').length,
  }

  const totalSpent = customers.reduce((s, c) => s + c.spent, 0)
  const avgOrder = customers.filter((c) => c.orders > 0).length
    ? Math.round(totalSpent / customers.filter((c) => c.orders > 0).reduce((s, c) => s + c.orders, 0))
    : 0

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="mx-auto max-w-6xl px-6 py-8"
    >
      <header className="mb-6">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">Customers</h1>
        <p className="mt-1.5 text-sm text-slate-500">
          Every chat builds a profile. Every order grows the ledger.
        </p>
      </header>

      <div className="mb-6 grid grid-cols-2 gap-3 lg:grid-cols-4">
        <SmallStat label="Total customers" value={customers.length} color="emerald" />
        <SmallStat label="Repeat buyers" value={counts.repeat} color="violet" />
        <SmallStat label="Lifetime revenue" value={formatNaira(totalSpent)} color="amber" />
        <SmallStat label="Avg. order value" value={formatNaira(avgOrder)} color="blue" />
      </div>

      <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap gap-1 rounded-xl border border-slate-200 bg-white p-1 shadow-sm">
          {Object.entries(counts).map(([key, count]) => (
            <button
              key={key}
              onClick={() => setTab(key)}
              className={cn(
                'rounded-lg px-3 py-1.5 text-sm transition',
                tab === key
                  ? 'bg-slate-900 text-white shadow-sm'
                  : 'text-slate-600 hover:bg-slate-100',
              )}
            >
              {key === 'all' ? 'All' : STATUS[key]?.label}{' '}
              <span className={tab === key ? 'opacity-80' : 'text-slate-400'}>({count})</span>
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by name, phone…"
            className="w-full rounded-xl border border-slate-200 bg-white py-2 pl-10 pr-3 text-sm text-slate-900 placeholder:text-slate-400 transition focus:border-slate-900 focus:outline-none focus:ring-4 focus:ring-slate-900/5"
          />
        </div>
      </div>

      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        {filtered.length === 0 ? (
          <div className="p-16 text-center text-sm text-slate-500">No customers match.</div>
        ) : (
          <ul className="divide-y divide-slate-100">
            <AnimatePresence initial={false}>
              {filtered.map((c, i) => (
                <motion.li
                  key={c.name}
                  layout
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ delay: i * 0.025, duration: 0.25 }}
                >
                  <button
                    onClick={() => setSelected(c)}
                    className="flex w-full items-center gap-4 px-5 py-4 text-left transition hover:bg-slate-50"
                  >
                    <div className="relative shrink-0">
                      <img src={c.avatar} alt="" className="h-11 w-11 rounded-full object-cover ring-2 ring-white shadow-sm" />
                      <ChannelDot channel={c.channel} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="truncate font-medium text-slate-900">{c.name}</span>
                        <span className={cn('inline-block rounded-full px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider ring-1 ring-inset', STATUS[c.status].cls)}>
                          {STATUS[c.status].label}
                        </span>
                      </div>
                      <div className="mt-0.5 flex items-center gap-3 text-xs text-slate-500">
                        {c.phone && (
                          <span className="inline-flex items-center gap-1">
                            <Phone className="h-3 w-3" />
                            {c.phone}
                          </span>
                        )}
                        <span>Last seen {timeAgo(c.lastSeen)}</span>
                      </div>
                    </div>

                    <div className="hidden text-right sm:block">
                      <div className="text-sm font-semibold text-slate-900">{formatNaira(c.spent)}</div>
                      <div className="text-xs text-slate-500">
                        {c.orders} {c.orders === 1 ? 'order' : 'orders'} · {c.messages} msgs
                      </div>
                    </div>
                  </button>
                </motion.li>
              ))}
            </AnimatePresence>
          </ul>
        )}
      </div>

      <CustomerDrawer customer={selected} onClose={() => setSelected(null)} />
    </motion.div>
  )
}

function SmallStat({ label, value, color }) {
  const dot = {
    emerald: 'bg-emerald-500',
    violet: 'bg-violet-500',
    amber: 'bg-amber-500',
    blue: 'bg-blue-500',
  }[color]
  return (
    <motion.div
      whileHover={{ y: -2 }}
      transition={{ type: 'spring', stiffness: 300, damping: 22 }}
      className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:border-slate-300 hover:shadow"
    >
      <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-wider text-slate-500">
        <span className={cn('h-1.5 w-1.5 rounded-full', dot)} />
        {label}
      </div>
      <div className="mt-2 text-2xl font-bold tracking-tight text-slate-900">{value}</div>
    </motion.div>
  )
}

function ChannelDot({ channel }) {
  const map = {
    whatsapp: { cls: 'bg-emerald-500', Icon: MessageCircle },
    instagram: { cls: 'bg-pink-500', Icon: Instagram },
    facebook: { cls: 'bg-blue-500', Icon: Facebook },
  }
  const { cls, Icon } = map[channel]
  return (
    <span className={cn('absolute -bottom-0.5 -right-0.5 inline-flex h-4 w-4 items-center justify-center rounded-full border-2 border-white text-white', cls)}>
      <Icon className="h-2 w-2" />
    </span>
  )
}

function CustomerDrawer({ customer, onClose }) {
  return (
    <AnimatePresence>
      {customer && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-40 bg-slate-900/30 backdrop-blur-sm"
          />
          <motion.aside
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="fixed right-0 top-0 z-50 flex h-full w-full max-w-md flex-col bg-white shadow-2xl"
          >
            <header className="flex items-start justify-between border-b border-slate-200 p-6">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <img src={customer.avatar} alt="" className="h-14 w-14 rounded-full object-cover ring-2 ring-white shadow-sm" />
                  <ChannelDot channel={customer.channel} />
                </div>
                <div>
                  <div className="text-lg font-semibold text-slate-900">{customer.name}</div>
                  <div className="flex items-center gap-2 text-sm text-slate-500">
                    {customer.phone || 'No phone shared'}
                  </div>
                  <span className={cn('mt-1.5 inline-block rounded-full px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider ring-1 ring-inset', STATUS[customer.status].cls)}>
                    {STATUS[customer.status].label}
                  </span>
                </div>
              </div>
              <button onClick={onClose} aria-label="Close" className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700">
                <X className="h-4 w-4" />
              </button>
            </header>

            <div className="flex-1 overflow-y-auto p-6">
              <div className="grid grid-cols-3 gap-3">
                <DrawerStat icon={<Wallet className="h-4 w-4" />} label="Spent" value={formatNaira(customer.spent)} color="amber" />
                <DrawerStat icon={<ShoppingBag className="h-4 w-4" />} label="Orders" value={customer.orders} color="emerald" />
                <DrawerStat icon={<MessageCircle className="h-4 w-4" />} label="Msgs" value={customer.messages} color="blue" />
              </div>

              <div className="mt-8">
                <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Activity
                </h3>
                <div className="mt-4 space-y-3 border-l-2 border-slate-100 pl-4">
                  <ActivityItem label="Last seen" value={timeAgo(customer.lastSeen) + ' ago'} />
                  <ActivityItem label="Primary channel" value={customer.channel.charAt(0).toUpperCase() + customer.channel.slice(1)} />
                  <ActivityItem label="Status" value={STATUS[customer.status].label} />
                </div>
              </div>

              <div className="mt-8 rounded-xl border border-slate-200 bg-slate-50 p-4">
                <p className="text-xs text-slate-500">
                  Click into the inbox to view this customer's full conversation history.
                </p>
              </div>
            </div>

            <footer className="border-t border-slate-200 p-4">
              {(() => {
                const conv = getConversations().find((c) => c.customerName === customer.name)
                return (
                  <Link
                    to={conv ? `/inbox?c=${conv.id}` : '/inbox'}
                    className="group inline-flex w-full items-center justify-center gap-2 rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-medium text-white shadow-lg shadow-slate-900/15 transition hover:bg-slate-800"
                  >
                    {conv ? 'Open conversation' : 'Send first message'}
                    <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
                  </Link>
                )
              })()}
            </footer>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  )
}

function DrawerStat({ icon, label, value, color }) {
  const cls = {
    emerald: 'bg-emerald-50 text-emerald-600 ring-emerald-100',
    amber: 'bg-amber-50 text-amber-600 ring-amber-100',
    blue: 'bg-blue-50 text-blue-600 ring-blue-100',
  }[color]
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-3">
      <div className={cn('inline-flex h-7 w-7 items-center justify-center rounded-lg ring-1 ring-inset', cls)}>
        {icon}
      </div>
      <div className="mt-2 text-base font-bold tracking-tight text-slate-900">{value}</div>
      <div className="text-[10px] uppercase tracking-wider text-slate-500">{label}</div>
    </div>
  )
}

function ActivityItem({ label, value }) {
  return (
    <div className="text-sm">
      <span className="text-slate-500">{label}: </span>
      <span className="font-medium text-slate-900">{value}</span>
    </div>
  )
}
