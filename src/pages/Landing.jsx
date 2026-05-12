import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  ArrowRight,
  MessageCircle,
  Zap,
  ShoppingBag,
  Bell,
  CheckCircle2,
  Sparkles,
  Send,
} from 'lucide-react'
import { Instagram, Facebook } from '../components/BrandIcons'
import { cn } from '../lib/cn'

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } },
}

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08, delayChildren: 0.1 } },
}

export default function Landing() {
  return (
    <div className="overflow-hidden">
      <Hero />
      <Features />
      <AutomationSection />
      <Pricing />
      <FinalCTA />
    </div>
  )
}

function Hero() {
  return (
    <section className="relative">
      <div className="absolute inset-x-0 top-0 -z-10 h-[700px] bg-[radial-gradient(60%_60%_at_50%_0%,rgba(16,185,129,0.18),transparent_70%)]" />
      <div className="absolute inset-x-0 top-40 -z-10 h-[500px] bg-[radial-gradient(40%_40%_at_30%_60%,rgba(99,102,241,0.12),transparent_70%)]" />

      <div className="absolute inset-0 -z-10 opacity-[0.04]" style={{
        backgroundImage: `linear-gradient(rgba(0,0,0,1) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,1) 1px, transparent 1px)`,
        backgroundSize: '64px 64px',
      }} />

      <motion.div
        initial="hidden"
        animate="show"
        variants={stagger}
        className="relative mx-auto max-w-6xl px-6 pt-20 pb-24 text-center"
      >
        <motion.div variants={fadeUp} className="mb-6 inline-flex items-center gap-2 rounded-full border border-emerald-200/70 bg-white/80 px-4 py-1.5 text-sm text-emerald-700 shadow-sm backdrop-blur">
          <Sparkles className="h-3.5 w-3.5" />
          <span>Built for Nigerian vendors · 100% n8n-powered</span>
        </motion.div>

        <motion.h1
          variants={fadeUp}
          className="mx-auto max-w-3xl text-5xl font-bold leading-[1.05] tracking-tight text-slate-900 sm:text-7xl"
        >
          Run your whole business from{' '}
          <span className="relative inline-block">
            <span className="bg-linear-to-r from-emerald-500 via-emerald-400 to-indigo-500 bg-clip-text text-transparent">
              one inbox
            </span>
            <svg className="absolute -bottom-2 left-0 w-full" viewBox="0 0 300 12" fill="none">
              <motion.path
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ delay: 0.8, duration: 0.8, ease: 'easeOut' }}
                d="M3 9 Q150 0 297 9"
                stroke="url(#u)"
                strokeWidth="3"
                strokeLinecap="round"
                fill="none"
              />
              <defs>
                <linearGradient id="u" x1="0" x2="1">
                  <stop offset="0%" stopColor="#10b981" />
                  <stop offset="100%" stopColor="#6366f1" />
                </linearGradient>
              </defs>
            </svg>
          </span>
        </motion.h1>

        <motion.p variants={fadeUp} className="mx-auto mt-8 max-w-2xl text-lg text-slate-600">
          VendorHQ unifies your WhatsApp, Instagram, and Facebook messages — auto-parses orders,
          confirms payments, and chases stock. No more scattered chats. No more lost sales.
        </motion.p>

        <motion.div variants={fadeUp} className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Link
            to="/auth"
            className="group inline-flex items-center gap-2 rounded-xl bg-slate-900 px-6 py-3.5 font-medium text-white shadow-xl shadow-slate-900/20 transition hover:bg-slate-800"
          >
            Start free — no card needed
            <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
          </Link>
          <a
            href="#features"
            className="inline-flex items-center gap-2 rounded-xl border border-slate-300 bg-white/80 px-6 py-3.5 font-medium text-slate-700 backdrop-blur transition hover:border-slate-400 hover:bg-white"
          >
            See how it works
          </a>
        </motion.div>

        <motion.div variants={fadeUp} className="mt-8 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-slate-500">
          <span className="inline-flex items-center gap-1.5"><CheckCircle2 className="h-4 w-4 text-emerald-500" /> No setup fee</span>
          <span className="inline-flex items-center gap-1.5"><CheckCircle2 className="h-4 w-4 text-emerald-500" /> Free for first 100 messages/month</span>
          <span className="inline-flex items-center gap-1.5"><CheckCircle2 className="h-4 w-4 text-emerald-500" /> Cancel anytime</span>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 60, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ delay: 0.4, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="mx-auto mt-16 max-w-3xl"
        >
          <HeroPreview />
        </motion.div>

        <ChannelLogos />
      </motion.div>
    </section>
  )
}

function HeroPreview() {
  return (
    <div className="relative rounded-2xl border border-slate-200 bg-white shadow-2xl shadow-slate-900/10">
      <div className="flex items-center gap-1.5 border-b border-slate-100 px-4 py-3">
        <span className="h-2.5 w-2.5 rounded-full bg-rose-400" />
        <span className="h-2.5 w-2.5 rounded-full bg-amber-400" />
        <span className="h-2.5 w-2.5 rounded-full bg-emerald-400" />
        <span className="ml-3 text-xs text-slate-400">vendorhq.app/inbox</span>
      </div>
      <div className="grid grid-cols-[200px,1fr] text-left">
        <div className="border-r border-slate-100 p-2">
          {[
            { name: 'Blessing O.', msg: 'Is the medium available?', t: '2m', unread: 2, color: 'emerald' },
            { name: 'Tunde A.', msg: 'I have sent the transfer', t: '15m', unread: 1, color: 'pink' },
            { name: 'Adaeze', msg: 'Thanks, received 🙏', t: '4h', unread: 0, color: 'emerald' },
          ].map((c, i) => (
            <motion.div
              key={c.name}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.8 + i * 0.1 }}
              className={cn(
                'flex items-start gap-2 rounded-md px-2 py-2',
                i === 0 && 'bg-emerald-50',
              )}
            >
              <div className={cn('h-7 w-7 shrink-0 rounded-full', c.color === 'emerald' ? 'bg-emerald-200' : 'bg-pink-200')} />
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between">
                  <span className="truncate text-xs font-medium text-slate-900">{c.name}</span>
                  <span className="text-[10px] text-slate-400">{c.t}</span>
                </div>
                <p className="truncate text-[11px] text-slate-500">{c.msg}</p>
              </div>
              {c.unread > 0 && (
                <span className="inline-flex h-4 w-4 items-center justify-center rounded-full bg-emerald-500 text-[10px] text-white">
                  {c.unread}
                </span>
              )}
            </motion.div>
          ))}
        </div>
        <div className="flex flex-col bg-slate-50 p-4">
          <div className="space-y-2">
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.1 }}
              className="max-w-[75%] rounded-2xl rounded-bl-md bg-white px-3 py-2 text-xs text-slate-900 shadow-sm"
            >
              Is the medium hoodie still available?
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.3 }}
              className="ml-auto max-w-[75%] rounded-2xl rounded-br-md bg-emerald-500 px-3 py-2 text-xs text-white shadow-sm"
            >
              Yes! ₦18,000. Send to GTB 0123456789 — Ada's Closet
            </motion.div>
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 1.6 }}
              className="ml-auto inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-2.5 py-1 text-[10px] font-medium text-amber-700"
            >
              <Zap className="h-3 w-3" /> Auto-sent by automation
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  )
}

function Features() {
  const items = [
    { icon: MessageCircle, color: 'emerald', title: 'Unified inbox', body: 'WhatsApp + Instagram + Facebook in one screen. Reply once, no app-switching.' },
    { icon: ShoppingBag, color: 'indigo', title: 'Auto-parsed orders', body: 'AI extracts product, quantity, and price from chats — order created without typing.' },
    { icon: Zap, color: 'amber', title: 'n8n automations', body: 'Payment instructions, transfer confirmations, abandoned-cart follow-ups — all automatic.' },
    { icon: Bell, color: 'rose', title: 'Smart alerts', body: 'Low stock, VIP unread, slow SKU — notified before it hurts revenue.' },
    { icon: CheckCircle2, color: 'emerald', title: 'Payment matching', body: 'Connect Paystack or your bank — alerts auto-match the right pending order.' },
    { icon: Send, color: 'pink', title: 'Customer ledger', body: 'Every chat builds a profile. See what they bought, when, and how much they\'ve spent.' },
  ]

  return (
    <section id="features" className="mx-auto max-w-6xl px-6 py-24">
      <motion.div
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: '-100px' }}
        variants={stagger}
        className="mx-auto max-w-2xl text-center"
      >
        <motion.span variants={fadeUp} className="inline-block rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-emerald-700">
          Features
        </motion.span>
        <motion.h2 variants={fadeUp} className="mt-4 text-3xl font-bold tracking-tight text-slate-900 sm:text-5xl">
          Everything your store needs, automated.
        </motion.h2>
        <motion.p variants={fadeUp} className="mt-4 text-lg text-slate-600">
          Stop copy-pasting account numbers. Stop forgetting customers. VendorHQ handles it.
        </motion.p>
      </motion.div>

      <motion.div
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: '-50px' }}
        variants={stagger}
        className="mt-16 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3"
      >
        {items.map((f) => <Feature key={f.title} {...f} />)}
      </motion.div>
    </section>
  )
}

const colorMap = {
  emerald: 'bg-emerald-50 text-emerald-600 ring-emerald-100',
  indigo: 'bg-indigo-50 text-indigo-600 ring-indigo-100',
  amber: 'bg-amber-50 text-amber-600 ring-amber-100',
  rose: 'bg-rose-50 text-rose-600 ring-rose-100',
  pink: 'bg-pink-50 text-pink-600 ring-pink-100',
}

function Feature({ icon: Icon, color, title, body }) {
  return (
    <motion.div
      variants={fadeUp}
      whileHover={{ y: -4 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      className="group rounded-2xl border border-slate-200 bg-white p-6 transition hover:border-slate-300 hover:shadow-lg hover:shadow-slate-900/5"
    >
      <div className={cn('inline-flex h-11 w-11 items-center justify-center rounded-xl ring-1 ring-inset transition group-hover:scale-110', colorMap[color])}>
        <Icon className="h-5 w-5" />
      </div>
      <h3 className="mt-5 font-semibold text-slate-900">{title}</h3>
      <p className="mt-2 text-sm leading-relaxed text-slate-600">{body}</p>
    </motion.div>
  )
}

function AutomationSection() {
  return (
    <section className="relative border-y border-slate-100 bg-linear-to-b from-slate-50 to-white">
      <div className="mx-auto grid max-w-6xl grid-cols-1 gap-16 px-6 py-24 md:grid-cols-2 md:items-center">
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        >
          <span className="inline-block rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold tracking-wide text-amber-800 uppercase">
            Automation
          </span>
          <h2 className="mt-4 text-3xl font-bold tracking-tight text-slate-900 sm:text-5xl">
            Powered by n8n.<br />Built for vendors.
          </h2>
          <p className="mt-5 text-lg text-slate-600">
            Each automation is a no-code flow you can switch on in seconds. Need something
            specific? Wire it up in n8n and we'll plug it into your inbox.
          </p>
          <ul className="mt-8 space-y-3 text-slate-700">
            {[
              'Auto-reply to new customers with your catalog',
              'Send payment details the moment an order is confirmed',
              'Match bank-alert SMS to the right pending order',
              'Daily sales summary to your WhatsApp at 9pm',
              'Low stock alert when a product drops below 5',
            ].map((t, i) => (
              <motion.li
                key={t}
                initial={{ opacity: 0, x: -10 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 * i }}
                className="flex items-start gap-2"
              >
                <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-500" />
                <span>{t}</span>
              </motion.li>
            ))}
          </ul>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        >
          <AutomationPreview />
        </motion.div>
      </div>
    </section>
  )
}

const stepColor = {
  emerald: 'bg-emerald-50 text-emerald-600 ring-emerald-100',
  violet: 'bg-violet-50 text-violet-600 ring-violet-100',
  blue: 'bg-blue-50 text-blue-600 ring-blue-100',
  amber: 'bg-amber-50 text-amber-600 ring-amber-100',
}

function AutomationPreview() {
  const steps = [
    { id: 't', icon: MessageCircle, color: 'emerald', tag: 'Trigger', title: 'New WhatsApp message', sub: 'from any customer' },
    { id: 's1', icon: Sparkles, color: 'violet', tag: 'AI', title: 'Extract order details', sub: 'product · qty · price' },
    { id: 's2', icon: ShoppingBag, color: 'blue', tag: 'Action', title: 'Create order in VendorHQ', sub: 'tagged as pending' },
    { id: 's3', icon: Send, color: 'amber', tag: 'Action', title: 'Send payment instructions', sub: 'reply on the same channel' },
    { id: 'd', icon: CheckCircle2, color: 'emerald', tag: 'Done', title: 'Notify vendor & log to ledger', sub: 'customer profile updated' },
  ]

  return (
    <div className="relative">
      <div className="absolute -inset-6 -z-10 rounded-[2rem] bg-linear-to-br from-emerald-300/30 via-indigo-200/20 to-pink-300/20 blur-3xl" />
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl shadow-slate-900/5">
        <div className="flex items-center justify-between border-b border-slate-100 bg-linear-to-b from-slate-50 to-white px-5 py-3.5">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-900 shadow-md shadow-slate-900/20">
              <Zap className="h-4 w-4 text-emerald-400" />
            </div>
            <div className="leading-tight">
              <div className="text-sm font-semibold text-slate-900">Order intake</div>
              <div className="text-[10px] text-slate-500">5 steps · 1,247 runs this month</div>
            </div>
          </div>
          <div className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1 text-[10px] font-medium uppercase tracking-wider text-emerald-700 ring-1 ring-inset ring-emerald-200">
            <motion.span
              animate={{ scale: [1, 1.4, 1], opacity: [1, 0.5, 1] }}
              transition={{ duration: 1.6, repeat: Infinity }}
              className="h-1.5 w-1.5 rounded-full bg-emerald-500"
            />
            Live
          </div>
        </div>

        <div className="p-5">
          {steps.map((s, i) => (
            <div key={s.id}>
              <FlowStep step={s} index={i} />
              {i < steps.length - 1 && <FlowConnector index={i} />}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function FlowStep({ step, index }) {
  const { icon: Icon, color, tag, title, sub } = step
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white p-3 transition hover:border-slate-300 hover:shadow-sm"
    >
      <div className={cn('flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ring-1 ring-inset', stepColor[color])}>
        <Icon className="h-4 w-4" />
      </div>
      <div className="min-w-0 flex-1">
        <div className="truncate text-sm font-medium text-slate-900">{title}</div>
        <div className="truncate text-xs text-slate-500">{sub}</div>
      </div>
      <span className="ml-2 shrink-0 rounded-md bg-slate-100 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider text-slate-500">
        {tag}
      </span>
    </motion.div>
  )
}

function FlowConnector({ index }) {
  return (
    <div className="relative my-1 ml-[27px] h-7 w-0.5">
      <div className="absolute inset-0 border-l-2 border-dashed border-slate-200" />
      <motion.span
        aria-hidden
        initial={{ y: -6, opacity: 0 }}
        animate={{ y: [-6, 30], opacity: [0, 1, 1, 0] }}
        transition={{
          duration: 1.6,
          repeat: Infinity,
          ease: 'easeIn',
          delay: index * 0.35,
          times: [0, 0.15, 0.85, 1],
        }}
        className="absolute -left-[4px] h-2.5 w-2.5 rounded-full bg-emerald-500 shadow-lg shadow-emerald-500/40"
      />
    </div>
  )
}

function Pricing() {
  const tiers = [
    { name: 'Starter', price: 'Free', tagline: 'For new vendors', features: ['100 messages/month', '1 channel', 'Basic automations', 'Email support'] },
    { name: 'Growth', price: '₦5,000', period: '/month', tagline: 'Most popular', highlight: true, features: ['1,500 messages/month', 'All 3 channels', 'All automations', 'Payment matching', 'Priority support'] },
    { name: 'Scale', price: '₦15,000', period: '/month', tagline: 'Multi-store', features: ['Unlimited messages', 'Up to 3 stores', 'Custom n8n workflows', 'Dedicated AM'] },
  ]
  return (
    <section id="pricing" className="mx-auto max-w-6xl px-6 py-24">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="mx-auto max-w-2xl text-center"
      >
        <span className="inline-block rounded-full bg-indigo-100 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-indigo-700">
          Pricing
        </span>
        <h2 className="mt-4 text-3xl font-bold tracking-tight text-slate-900 sm:text-5xl">Simple pricing</h2>
        <p className="mt-4 text-lg text-slate-600">Start free. Upgrade when your business does.</p>
      </motion.div>

      <motion.div
        initial="hidden"
        whileInView="show"
        viewport={{ once: true }}
        variants={stagger}
        className="mt-16 grid grid-cols-1 gap-6 md:grid-cols-3"
      >
        {tiers.map((t) => <PricingCard key={t.name} {...t} />)}
      </motion.div>
    </section>
  )
}

function PricingCard({ name, price, period, tagline, features, highlight }) {
  return (
    <motion.div
      variants={fadeUp}
      whileHover={{ y: -6 }}
      transition={{ type: 'spring', stiffness: 300, damping: 22 }}
      className={cn(
        'relative rounded-2xl border p-7 transition',
        highlight
          ? 'border-slate-900 bg-slate-900 text-white shadow-2xl shadow-slate-900/20'
          : 'border-slate-200 bg-white hover:border-slate-300 hover:shadow-lg hover:shadow-slate-900/5',
      )}
    >
      {highlight && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-emerald-500 px-3 py-1 text-xs font-semibold text-white shadow-lg shadow-emerald-500/40">
          Most popular
        </div>
      )}
      <div className={cn('text-sm font-medium', highlight ? 'text-emerald-300' : 'text-slate-500')}>{tagline}</div>
      <div className={cn('mt-1 text-xl font-semibold', highlight ? 'text-white' : 'text-slate-900')}>{name}</div>
      <div className="mt-4 flex items-baseline gap-1">
        <span className={cn('text-4xl font-bold tracking-tight', highlight ? 'text-white' : 'text-slate-900')}>{price}</span>
        {period && <span className={cn(highlight ? 'text-slate-400' : 'text-slate-500')}>{period}</span>}
      </div>
      <ul className={cn('mt-6 space-y-2.5 text-sm', highlight ? 'text-slate-300' : 'text-slate-600')}>
        {features.map((f) => (
          <li key={f} className="flex items-start gap-2">
            <CheckCircle2 className={cn('mt-0.5 h-4 w-4 shrink-0', highlight ? 'text-emerald-400' : 'text-emerald-500')} />
            <span>{f}</span>
          </li>
        ))}
      </ul>
      <Link
        to="/auth"
        className={cn(
          'mt-7 block rounded-xl px-4 py-3 text-center text-sm font-medium transition',
          highlight
            ? 'bg-white text-slate-900 hover:bg-slate-100'
            : 'border border-slate-300 text-slate-700 hover:border-slate-400 hover:bg-slate-50',
        )}
      >
        Get started
      </Link>
    </motion.div>
  )
}

function FinalCTA() {
  return (
    <section className="mx-auto max-w-5xl px-6 pb-24">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="relative overflow-hidden rounded-3xl bg-slate-900 px-8 py-16 text-center shadow-2xl"
      >
        <div className="absolute inset-0 bg-[radial-gradient(60%_60%_at_50%_0%,rgba(16,185,129,0.3),transparent_60%)]" />
        <div className="absolute inset-0 opacity-[0.06]" style={{
          backgroundImage: `linear-gradient(white 1px, transparent 1px), linear-gradient(90deg, white 1px, transparent 1px)`,
          backgroundSize: '40px 40px',
        }} />
        <div className="relative">
          <h3 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Ready to stop losing orders?
          </h3>
          <p className="mt-3 text-slate-300">Set up VendorHQ in under 5 minutes.</p>
          <Link
            to="/auth"
            className="mt-8 inline-flex items-center gap-2 rounded-xl bg-emerald-500 px-6 py-3.5 font-medium text-white shadow-xl shadow-emerald-500/30 transition hover:bg-emerald-400"
          >
            Get started — it's free <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </motion.div>
    </section>
  )
}

function ChannelLogos() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 1, duration: 0.6 }}
      className="mt-14 flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-slate-400"
    >
      <span className="text-xs uppercase tracking-widest">Connects with</span>
      <span className="inline-flex items-center gap-1.5 font-medium text-slate-600">
        <MessageCircle className="h-4 w-4 text-emerald-500" /> WhatsApp
      </span>
      <span className="inline-flex items-center gap-1.5 font-medium text-slate-600">
        <Instagram className="h-4 w-4 text-pink-500" /> Instagram
      </span>
      <span className="inline-flex items-center gap-1.5 font-medium text-slate-600">
        <Facebook className="h-4 w-4 text-blue-500" /> Facebook
      </span>
      <span className="font-medium text-slate-600">Paystack</span>
      <span className="font-medium text-slate-600">n8n</span>
    </motion.div>
  )
}
