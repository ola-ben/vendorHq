import { useState, useMemo } from 'react'
import { useSearchParams } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { toast } from 'sonner'
import { Search, Send, MessageCircle, Phone, ArrowLeft } from 'lucide-react'
import { Instagram, Facebook } from '../components/BrandIcons'
import { getConversations, timeAgo } from '../lib/storage'
import { CHANNELS } from '../data/vendor'
import Tooltip from '../components/Tooltip'
import { cn } from '../lib/cn'

export default function Inbox() {
  const conversations = getConversations()
  const [params, setParams] = useSearchParams()
  const selectedId = params.get('c') || conversations[0]?.id
  const [query, setQuery] = useState('')

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return conversations
    return conversations.filter(
      (c) =>
        c.customerName.toLowerCase().includes(q) ||
        c.lastMessage.toLowerCase().includes(q),
    )
  }, [conversations, query])

  const selected = conversations.find((c) => c.id === selectedId)

  return (
    <div className="grid h-[calc(100vh-65px)] grid-cols-1 md:h-screen md:grid-cols-[360px,1fr]">
      <aside className="flex min-h-0 flex-col border-r border-slate-200 bg-white">
        <div className="border-b border-slate-200 px-5 py-4">
          <h1 className="text-xl font-bold tracking-tight text-slate-900">Inbox</h1>
          <div className="relative mt-3">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search conversations…"
              className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-10 pr-3 text-sm text-slate-900 placeholder:text-slate-400 transition focus:border-slate-900 focus:bg-white focus:outline-none focus:ring-4 focus:ring-slate-900/5"
            />
          </div>
        </div>

        <ul className="flex-1 overflow-y-auto p-2">
          {filtered.map((c, i) => (
            <motion.li
              key={c.id}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.03, duration: 0.3 }}
            >
              <button
                onClick={() => setParams({ c: c.id })}
                className={cn(
                  'flex w-full items-start gap-3 rounded-xl px-3 py-3 text-left transition',
                  c.id === selectedId
                    ? 'bg-emerald-50 ring-1 ring-emerald-100'
                    : 'hover:bg-slate-50',
                )}
              >
                <div className="relative shrink-0">
                  <img src={c.avatar} alt="" className="h-10 w-10 rounded-full object-cover ring-2 ring-white" />
                  <ChannelBadge channel={c.channel} />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <span className="truncate text-sm font-medium text-slate-900">
                      {c.customerName}
                    </span>
                    <span className="shrink-0 text-xs text-slate-400">{timeAgo(c.lastMessageAt)}</span>
                  </div>
                  <p className="mt-0.5 truncate text-sm text-slate-500">{c.lastMessage}</p>
                </div>
                {c.unread > 0 && (
                  <span className="ml-1 mt-1 inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-emerald-500 px-1.5 text-xs font-medium text-white shadow-sm">
                    {c.unread}
                  </span>
                )}
              </button>
            </motion.li>
          ))}
        </ul>
      </aside>

      <section className="hidden min-w-0 flex-col bg-slate-50 md:flex">
        <AnimatePresence mode="wait">
          {selected ? <Thread key={selected.id} conversation={selected} /> : <EmptyThread key="empty" />}
        </AnimatePresence>
      </section>

      {selected && (
        <section className="flex min-w-0 flex-col bg-slate-50 md:hidden">
          <Thread conversation={selected} onBack={() => setParams({})} />
        </section>
      )}
    </div>
  )
}

function Thread({ conversation, onBack }) {
  const [draft, setDraft] = useState('')
  const channel = CHANNELS[conversation.channel]

  function send() {
    if (!draft.trim()) return
    setDraft('')
    toast.success('Reply sent', { description: `to ${conversation.customerName}` })
  }

  return (
    <motion.div
      key={conversation.id}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="flex h-full min-h-0 flex-col"
    >
      <header className="flex items-center gap-3 border-b border-slate-200 bg-white px-5 py-3.5">
        {onBack && (
          <Tooltip label="Back to inbox">
            <button
              onClick={onBack}
              aria-label="Back"
              className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-slate-500 transition hover:bg-slate-100 hover:text-slate-900"
            >
              <ArrowLeft className="h-4 w-4" />
            </button>
          </Tooltip>
        )}
        <img src={conversation.avatar} alt="" className="h-10 w-10 rounded-full object-cover ring-2 ring-white" />
        <div className="min-w-0 flex-1">
          <div className="truncate font-semibold text-slate-900">{conversation.customerName}</div>
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <ChannelIcon channel={conversation.channel} className="h-3 w-3" />
            <span>{channel.label}</span>
            {conversation.phone && (
              <>
                <span>·</span>
                <span className="inline-flex items-center gap-1">
                  <Phone className="h-3 w-3" /> {conversation.phone}
                </span>
              </>
            )}
          </div>
        </div>
      </header>

      <div className="flex-1 space-y-3 overflow-y-auto px-5 py-6">
        {conversation.messages.map((m, i) => (
          <motion.div
            key={m.id}
            initial={{ opacity: 0, y: 8, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ delay: i * 0.05, duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className={cn('flex', m.from === 'vendor' ? 'justify-end' : 'justify-start')}
          >
            <div
              className={cn(
                'max-w-[75%] rounded-2xl px-4 py-2.5 text-sm shadow-sm',
                m.from === 'vendor'
                  ? 'rounded-br-md bg-emerald-500 text-white'
                  : 'rounded-bl-md bg-white text-slate-900 ring-1 ring-slate-100',
              )}
            >
              {m.text}
            </div>
          </motion.div>
        ))}
      </div>

      <footer className="border-t border-slate-200 bg-white p-3">
        <div className="flex items-end gap-2">
          <textarea
            rows={1}
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault()
                send()
              }
            }}
            placeholder="Type a reply…"
            className="flex-1 resize-none rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 transition focus:border-slate-900 focus:bg-white focus:outline-none focus:ring-4 focus:ring-slate-900/5"
          />
          <Tooltip label="Send (Enter)">
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={send}
              disabled={!draft.trim()}
              aria-label="Send message"
              className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-slate-900 text-white shadow-lg shadow-slate-900/20 transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-40"
            >
              <Send className="h-4 w-4" />
            </motion.button>
          </Tooltip>
        </div>
      </footer>
    </motion.div>
  )
}

function EmptyThread() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="flex flex-1 items-center justify-center text-center text-slate-400"
    >
      <div>
        <MessageCircle className="mx-auto h-12 w-12" />
        <p className="mt-3 text-sm">Select a conversation to start replying</p>
      </div>
    </motion.div>
  )
}

function ChannelBadge({ channel }) {
  const map = {
    whatsapp: 'bg-emerald-500',
    instagram: 'bg-pink-500',
    facebook: 'bg-blue-500',
  }
  return (
    <span
      className={cn(
        'absolute -bottom-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full border-2 border-white text-white',
        map[channel],
      )}
    >
      <ChannelIcon channel={channel} className="h-2 w-2" />
    </span>
  )
}

function ChannelIcon({ channel, className }) {
  if (channel === 'whatsapp') return <MessageCircle className={className} />
  if (channel === 'instagram') return <Instagram className={className} />
  return <Facebook className={className} />
}
