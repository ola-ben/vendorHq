import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  MessageCircle,
  ShoppingBag,
  TrendingUp,
  Wallet,
  ArrowRight,
  Zap,
} from 'lucide-react'
import {
  getUser,
  getConversations,
  getOrders,
  getAutomations,
  formatNaira,
  timeAgo,
} from '../lib/storage'
import { cn } from '../lib/cn'

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] } },
}

const stagger = { hidden: {}, show: { transition: { staggerChildren: 0.06 } } }

export default function Dashboard() {
  const user = getUser()
  const conversations = getConversations()
  const orders = getOrders()
  const automations = getAutomations()

  const unread = conversations.reduce((s, c) => s + c.unread, 0)
  const pending = orders.filter((o) => o.status === 'pending')
  const today = new Date().toISOString().slice(0, 10)
  const revenue = orders.filter((o) => o.status !== 'pending').reduce((s, o) => s + o.total, 0)
  const todayRevenue = orders.filter((o) => o.paidAt?.startsWith(today)).reduce((s, o) => s + o.total, 0)
  const activeAutomations = automations.filter((a) => a.enabled).length

  return (
    <motion.div
      initial="hidden"
      animate="show"
      variants={stagger}
      className="mx-auto max-w-6xl px-6 py-8"
    >
      <motion.header variants={fadeUp} className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">
          Welcome back, {user?.name?.split(' ')[0] || 'there'}
        </h1>
        <p className="mt-1.5 text-sm text-slate-500">
          Here's what's happening with {user?.businessName || 'your store'} today.
        </p>
      </motion.header>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <Stat color="emerald" icon={<MessageCircle className="h-5 w-5" />} label="Unread messages" value={unread} href="/inbox" />
        <Stat color="indigo" icon={<ShoppingBag className="h-5 w-5" />} label="Pending orders" value={pending.length} href="/orders" />
        <Stat color="amber" icon={<Wallet className="h-5 w-5" />} label="Today's revenue" value={formatNaira(todayRevenue)} />
        <Stat color="rose" icon={<TrendingUp className="h-5 w-5" />} label="Lifetime revenue" value={formatNaira(revenue)} />
      </div>

      <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-3">
        <motion.section variants={fadeUp} className="rounded-2xl border border-slate-200 bg-white p-6 lg:col-span-2">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-semibold text-slate-900">Recent messages</h2>
            <Link to="/inbox" className="group inline-flex items-center gap-1 text-sm font-medium text-emerald-600 hover:text-emerald-700">
              Open inbox <ArrowRight className="h-3.5 w-3.5 transition group-hover:translate-x-0.5" />
            </Link>
          </div>
          <motion.ul variants={stagger} className="divide-y divide-slate-100">
            {conversations.slice(0, 5).map((c) => (
              <motion.li key={c.id} variants={fadeUp}>
                <Link
                  to={`/inbox?c=${c.id}`}
                  className="-mx-2 flex items-center gap-3 rounded-lg px-2 py-3 transition hover:bg-slate-50"
                >
                  <img src={c.avatar} alt="" className="h-9 w-9 shrink-0 rounded-full object-cover ring-2 ring-white" />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-3">
                      <span className="truncate text-sm font-medium text-slate-900">{c.customerName}</span>
                      <span className="text-xs text-slate-400">{timeAgo(c.lastMessageAt)}</span>
                    </div>
                    <p className="truncate text-sm text-slate-500">{c.lastMessage}</p>
                  </div>
                  {c.unread > 0 && (
                    <span className="ml-2 inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-emerald-500 px-1.5 text-xs font-medium text-white shadow-sm">
                      {c.unread}
                    </span>
                  )}
                </Link>
              </motion.li>
            ))}
          </motion.ul>
        </motion.section>

        <motion.section variants={fadeUp} className="rounded-2xl border border-slate-200 bg-white p-6">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-semibold text-slate-900">Active automations</h2>
            <Link to="/automations" className="group inline-flex items-center gap-1 text-sm font-medium text-emerald-600 hover:text-emerald-700">
              Manage <ArrowRight className="h-3.5 w-3.5 transition group-hover:translate-x-0.5" />
            </Link>
          </div>
          <div className="mb-4 flex items-center gap-2 rounded-lg bg-amber-50 px-3 py-2 text-sm text-amber-800 ring-1 ring-inset ring-amber-100">
            <Zap className="h-4 w-4" /> {activeAutomations} running
          </div>
          <motion.ul variants={stagger} className="space-y-2">
            {automations.filter((a) => a.enabled).slice(0, 4).map((a) => (
              <motion.li
                key={a.id}
                variants={fadeUp}
                className="rounded-lg border border-slate-100 bg-slate-50 px-3 py-2.5"
              >
                <div className="text-sm font-medium text-slate-800">{a.name}</div>
                <div className="text-xs text-slate-500">{a.runs} runs this month</div>
              </motion.li>
            ))}
          </motion.ul>
        </motion.section>
      </div>
    </motion.div>
  )
}

const colorMap = {
  emerald: 'bg-emerald-50 text-emerald-600 ring-emerald-100',
  indigo: 'bg-indigo-50 text-indigo-600 ring-indigo-100',
  amber: 'bg-amber-50 text-amber-600 ring-amber-100',
  rose: 'bg-rose-50 text-rose-600 ring-rose-100',
}

function Stat({ icon, label, value, color, href }) {
  const inner = (
    <motion.div
      variants={fadeUp}
      whileHover={{ y: -2 }}
      transition={{ type: 'spring', stiffness: 300, damping: 22 }}
      className="rounded-2xl border border-slate-200 bg-white p-5 transition hover:border-slate-300 hover:shadow-md hover:shadow-slate-900/5"
    >
      <div className={cn('inline-flex h-10 w-10 items-center justify-center rounded-xl ring-1 ring-inset', colorMap[color])}>
        {icon}
      </div>
      <div className="mt-3 text-2xl font-bold tracking-tight text-slate-900">{value}</div>
      <div className="text-sm text-slate-500">{label}</div>
    </motion.div>
  )
  return href ? <Link to={href}>{inner}</Link> : inner
}
