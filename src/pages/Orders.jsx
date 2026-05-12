import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, MessageCircle } from 'lucide-react'
import { Instagram, Facebook } from '../components/BrandIcons'
import { getOrders, formatNaira, timeAgo } from '../lib/storage'
import { cn } from '../lib/cn'

const STATUS = {
  pending: { label: 'Pending', cls: 'bg-amber-50 text-amber-700 ring-amber-200' },
  paid: { label: 'Paid', cls: 'bg-emerald-50 text-emerald-700 ring-emerald-200' },
  shipped: { label: 'Shipped', cls: 'bg-indigo-50 text-indigo-700 ring-indigo-200' },
  delivered: { label: 'Delivered', cls: 'bg-slate-100 text-slate-700 ring-slate-200' },
}

export default function Orders() {
  const orders = getOrders()
  const [tab, setTab] = useState('all')
  const [query, setQuery] = useState('')

  const filtered = useMemo(() => {
    return orders.filter((o) => {
      const matchesTab = tab === 'all' || o.status === tab
      const q = query.trim().toLowerCase()
      const matchesQuery =
        !q ||
        o.id.toLowerCase().includes(q) ||
        o.customerName.toLowerCase().includes(q) ||
        o.items.some((i) => i.name.toLowerCase().includes(q))
      return matchesTab && matchesQuery
    })
  }, [orders, tab, query])

  const counts = {
    all: orders.length,
    pending: orders.filter((o) => o.status === 'pending').length,
    paid: orders.filter((o) => o.status === 'paid').length,
    shipped: orders.filter((o) => o.status === 'shipped').length,
    delivered: orders.filter((o) => o.status === 'delivered').length,
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="mx-auto max-w-6xl px-6 py-8"
    >
      <header className="mb-6">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">Orders</h1>
        <p className="mt-1.5 text-sm text-slate-500">
          Automatically parsed from your customer conversations.
        </p>
      </header>

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
            placeholder="Search orders…"
            className="w-full rounded-xl border border-slate-200 bg-white py-2 pl-10 pr-3 text-sm text-slate-900 placeholder:text-slate-400 transition focus:border-slate-900 focus:outline-none focus:ring-4 focus:ring-slate-900/5"
          />
        </div>
      </div>

      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        {filtered.length === 0 ? (
          <div className="p-16 text-center text-sm text-slate-500">No orders match these filters.</div>
        ) : (
          <table className="w-full text-sm">
            <thead className="border-b border-slate-200 bg-slate-50 text-left text-xs uppercase tracking-wider text-slate-500">
              <tr>
                <th className="px-5 py-3 font-semibold">Order</th>
                <th className="px-5 py-3 font-semibold">Customer</th>
                <th className="px-5 py-3 font-semibold">Channel</th>
                <th className="px-5 py-3 font-semibold">Total</th>
                <th className="px-5 py-3 font-semibold">Status</th>
                <th className="px-5 py-3 font-semibold">When</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              <AnimatePresence initial={false}>
                {filtered.map((o, i) => (
                  <motion.tr
                    key={o.id}
                    layout
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ delay: i * 0.03, duration: 0.25 }}
                    className="transition hover:bg-slate-50"
                  >
                    <td className="px-5 py-4">
                      <div className="font-semibold text-slate-900">{o.id}</div>
                      <div className="text-xs text-slate-500">
                        {o.items.map((i) => `${i.qty}× ${i.name}`).join(', ')}
                      </div>
                    </td>
                    <td className="px-5 py-4 text-slate-700">{o.customerName}</td>
                    <td className="px-5 py-4"><ChannelTag channel={o.channel} /></td>
                    <td className="px-5 py-4 font-semibold text-slate-900">{formatNaira(o.total)}</td>
                    <td className="px-5 py-4">
                      <span className={cn('inline-block rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset', STATUS[o.status].cls)}>
                        {STATUS[o.status].label}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-slate-500">{timeAgo(o.placedAt)}</td>
                  </motion.tr>
                ))}
              </AnimatePresence>
            </tbody>
          </table>
        )}
      </div>
    </motion.div>
  )
}

function ChannelTag({ channel }) {
  const map = {
    whatsapp: { Icon: MessageCircle, cls: 'text-emerald-600 bg-emerald-50 ring-emerald-200', label: 'WhatsApp' },
    instagram: { Icon: Instagram, cls: 'text-pink-600 bg-pink-50 ring-pink-200', label: 'Instagram' },
    facebook: { Icon: Facebook, cls: 'text-blue-600 bg-blue-50 ring-blue-200', label: 'Facebook' },
  }
  const { Icon, cls, label } = map[channel]
  return (
    <span className={cn('inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-xs ring-1 ring-inset', cls)}>
      <Icon className="h-3 w-3" />
      {label}
    </span>
  )
}
