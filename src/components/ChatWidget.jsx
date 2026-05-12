import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { MessageCircle, X, Send, Sparkles } from 'lucide-react'
import { SUGGESTED, WELCOME, findAnswer } from '../data/faq'
import { cn } from '../lib/cn'

export default function ChatWidget() {
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState([
    { id: 'w', from: 'bot', text: WELCOME },
  ])
  const [draft, setDraft] = useState('')
  const [typing, setTyping] = useState(false)
  const [hasNew, setHasNew] = useState(true)
  const scrollRef = useRef(null)

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages, typing])

  function ask(text) {
    if (!text.trim()) return
    const userMsg = { id: 'u' + Date.now(), from: 'user', text: text.trim() }
    setMessages((m) => [...m, userMsg])
    setDraft('')
    setTyping(true)
    setTimeout(() => {
      setMessages((m) => [...m, { id: 'b' + Date.now(), from: 'bot', text: findAnswer(text) }])
      setTyping(false)
    }, 700 + Math.random() * 400)
  }

  function handleOpen() {
    setOpen(true)
    setHasNew(false)
  }

  const showSuggestions = messages.length <= 1 && !typing

  return (
    <>
      <AnimatePresence>
        {!open && (
          <motion.div
            key="launcher"
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            className="fixed bottom-5 right-5 z-40"
          >
            <motion.span
              aria-hidden="true"
              animate={{ scale: [1, 1.6], opacity: [0.55, 0] }}
              transition={{ duration: 2.2, repeat: Infinity, ease: 'easeOut' }}
              className="absolute inset-0 rounded-full bg-emerald-500"
            />
            <motion.span
              aria-hidden="true"
              animate={{ scale: [1, 1.6], opacity: [0.4, 0] }}
              transition={{ duration: 2.2, repeat: Infinity, ease: 'easeOut', delay: 1.1 }}
              className="absolute inset-0 rounded-full bg-emerald-500"
            />
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              animate={{
                boxShadow: [
                  '0 18px 36px -10px rgba(15,23,42,0.35), 0 0 0 0 rgba(16,185,129,0.6)',
                  '0 18px 36px -10px rgba(15,23,42,0.35), 0 0 0 14px rgba(16,185,129,0)',
                ],
              }}
              transition={{
                boxShadow: { duration: 2.2, repeat: Infinity, ease: 'easeOut' },
              }}
              onClick={handleOpen}
              aria-label="Open chat"
              className="relative inline-flex h-14 w-14 items-center justify-center rounded-full bg-slate-900 text-white transition hover:bg-slate-800"
            >
              <MessageCircle className="h-6 w-6" />
              {hasNew && (
                <span className="absolute -top-0.5 -right-0.5 h-3.5 w-3.5 rounded-full border-2 border-white bg-emerald-500" />
              )}
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {open && (
          <motion.div
            key="panel"
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ type: 'spring', stiffness: 320, damping: 28 }}
            className="fixed bottom-5 right-5 z-40 flex h-140 max-h-[calc(100vh-2.5rem)] w-95 max-w-[calc(100vw-2.5rem)] flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl shadow-slate-900/20"
          >
            <header className="relative flex items-center gap-3 border-b border-slate-100 bg-linear-to-br from-slate-900 to-slate-800 px-5 py-4 text-white">
              <div className="relative">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-500 font-semibold shadow-lg shadow-emerald-500/30">
                  A
                </div>
                <span className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-slate-900 bg-emerald-400" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="font-semibold">Ada from VendorHQ</div>
                <div className="text-xs text-slate-300">Typically replies in ~1 minute</div>
              </div>
              <button
                onClick={() => setOpen(false)}
                aria-label="Close chat"
                className="rounded-lg p-1.5 text-slate-300 transition hover:bg-white/10 hover:text-white"
              >
                <X className="h-4 w-4" />
              </button>
            </header>

            <div ref={scrollRef} className="flex-1 space-y-3 overflow-y-auto bg-slate-50 px-4 py-4">
              {messages.map((m) => (
                <Bubble key={m.id} from={m.from}>
                  {m.text}
                </Bubble>
              ))}
              {typing && <TypingBubble />}

              {showSuggestions && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="pt-2"
                >
                  <div className="mb-2 flex items-center gap-1.5 text-xs font-medium text-slate-500">
                    <Sparkles className="h-3 w-3" />
                    Suggested questions
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {SUGGESTED.map((q) => (
                      <button
                        key={q}
                        onClick={() => ask(q)}
                        className="rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs text-slate-700 transition hover:border-slate-900 hover:bg-slate-900 hover:text-white"
                      >
                        {q}
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}
            </div>

            <footer className="border-t border-slate-100 bg-white p-3">
              <form
                onSubmit={(e) => {
                  e.preventDefault()
                  ask(draft)
                }}
                className="flex items-end gap-2"
              >
                <input
                  value={draft}
                  onChange={(e) => setDraft(e.target.value)}
                  placeholder="Ask anything…"
                  className="flex-1 rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 transition focus:border-slate-900 focus:bg-white focus:outline-none focus:ring-4 focus:ring-slate-900/5"
                />
                <motion.button
                  type="submit"
                  disabled={!draft.trim()}
                  whileTap={{ scale: 0.95 }}
                  aria-label="Send"
                  className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-slate-900 text-white shadow-lg shadow-slate-900/20 transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  <Send className="h-4 w-4" />
                </motion.button>
              </form>
              <p className="mt-2 text-center text-[10px] text-slate-400">
                Powered by VendorHQ · Real humans available
              </p>
            </footer>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

function Bubble({ from, children }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 6, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
      className={cn('flex', from === 'user' ? 'justify-end' : 'justify-start')}
    >
      <div
        className={cn(
          'max-w-[85%] rounded-2xl px-3.5 py-2.5 text-sm shadow-sm',
          from === 'user'
            ? 'rounded-br-md bg-slate-900 text-white'
            : 'rounded-bl-md bg-white text-slate-800 ring-1 ring-slate-100',
        )}
      >
        {children}
      </div>
    </motion.div>
  )
}

function TypingBubble() {
  return (
    <div className="flex justify-start">
      <div className="rounded-2xl rounded-bl-md bg-white px-3.5 py-3 shadow-sm ring-1 ring-slate-100">
        <div className="flex items-center gap-1">
          {[0, 1, 2].map((i) => (
            <motion.span
              key={i}
              animate={{ y: [0, -4, 0] }}
              transition={{ duration: 0.8, repeat: Infinity, delay: i * 0.15 }}
              className="h-1.5 w-1.5 rounded-full bg-slate-400"
            />
          ))}
        </div>
      </div>
    </div>
  )
}
