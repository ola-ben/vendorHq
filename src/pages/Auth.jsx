import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { MessageCircle, ArrowRight } from 'lucide-react'
import { setUser } from '../lib/storage'

export default function Auth() {
  const navigate = useNavigate()
  const [mode, setMode] = useState('signup')
  const [name, setName] = useState('')
  const [businessName, setBusinessName] = useState('')
  const [email, setEmail] = useState('')

  function handleSubmit(e) {
    e.preventDefault()
    if (!email || (mode === 'signup' && !name)) return
    setUser({
      name: name || email.split('@')[0],
      businessName: businessName || 'My Store',
      email,
    })
    navigate('/dashboard')
  }

  return (
    <main className="relative mx-auto flex min-h-[calc(100vh-65px)] max-w-md flex-col justify-center px-6 py-12">
      <div className="absolute inset-x-0 top-10 -z-10 mx-auto h-72 w-72 rounded-full bg-emerald-200/40 blur-3xl" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      >
        <Link to="/" className="mb-8 flex items-center justify-center gap-2">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-900 text-white shadow-lg shadow-slate-900/20">
            <MessageCircle className="h-5 w-5" />
          </span>
          <span className="text-xl font-semibold tracking-tight">VendorHQ</span>
        </Link>

        <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-xl shadow-slate-900/5">
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            {mode === 'signup' ? 'Create your account' : 'Welcome back'}
          </h1>
          <p className="mt-1.5 text-sm text-slate-500">
            {mode === 'signup' ? 'Free for the first 100 messages this month.' : 'Sign in to your inbox.'}
          </p>

          <form onSubmit={handleSubmit} className="mt-7 space-y-4">
            {mode === 'signup' && (
              <>
                <Field label="Your name" value={name} onChange={setName} placeholder="e.g. Adaeze Okafor" />
                <Field label="Business name" value={businessName} onChange={setBusinessName} placeholder="e.g. Ada's Closet" />
              </>
            )}
            <Field label="Email" type="email" value={email} onChange={setEmail} placeholder="you@example.com" />

            <motion.button
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              className="group inline-flex w-full items-center justify-center gap-2 rounded-xl bg-slate-900 px-4 py-3 font-medium text-white shadow-lg shadow-slate-900/20 transition hover:bg-slate-800"
            >
              {mode === 'signup' ? 'Create account' : 'Sign in'}
              <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
            </motion.button>
          </form>

          <p className="mt-6 text-center text-sm text-slate-500">
            {mode === 'signup' ? (
              <>
                Already have an account?{' '}
                <button onClick={() => setMode('login')} className="font-medium text-emerald-600 hover:text-emerald-700">
                  Sign in
                </button>
              </>
            ) : (
              <>
                New here?{' '}
                <button onClick={() => setMode('signup')} className="font-medium text-emerald-600 hover:text-emerald-700">
                  Create an account
                </button>
              </>
            )}
          </p>
        </div>

        <p className="mt-4 text-center text-xs text-slate-400">
          <Link to="/" className="hover:text-slate-600">← Back to home</Link>
        </p>
      </motion.div>
    </main>
  )
}

function Field({ label, value, onChange, type = 'text', placeholder }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-medium text-slate-700">{label}</span>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-slate-900 placeholder:text-slate-400 transition focus:border-slate-900 focus:outline-none focus:ring-4 focus:ring-slate-900/5"
      />
    </label>
  )
}
