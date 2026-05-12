import { Link, Outlet } from 'react-router-dom'
import { MessageCircle } from 'lucide-react'
import { getUser } from '../lib/storage'
import ChatWidget from './ChatWidget'

export default function Layout() {
  const user = getUser()

  return (
    <div className="min-h-screen bg-white text-slate-900">
      <header className="sticky top-0 z-30 border-b border-slate-200/80 bg-white/70 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <Link to="/" className="flex items-center gap-2.5">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-900 text-white shadow-lg shadow-slate-900/15">
              <MessageCircle className="h-4 w-4" />
            </span>
            <span className="text-lg font-semibold tracking-tight">VendorHQ</span>
          </Link>

          <nav className="flex items-center gap-1">
            <a href="/#features" className="hidden rounded-lg px-3 py-2 text-sm text-slate-600 transition hover:bg-slate-100 hover:text-slate-900 sm:inline-block">Features</a>
            <a href="/#pricing" className="hidden rounded-lg px-3 py-2 text-sm text-slate-600 transition hover:bg-slate-100 hover:text-slate-900 sm:inline-block">Pricing</a>
            {user ? (
              <Link
                to="/dashboard"
                className="ml-3 rounded-xl bg-slate-900 px-4 py-2 text-sm font-medium text-white shadow-lg shadow-slate-900/15 transition hover:bg-slate-800"
              >
                Open app
              </Link>
            ) : (
              <Link
                to="/auth"
                className="ml-3 rounded-xl bg-slate-900 px-4 py-2 text-sm font-medium text-white shadow-lg shadow-slate-900/15 transition hover:bg-slate-800"
              >
                Sign in
              </Link>
            )}
          </nav>
        </div>
      </header>

      <Outlet />

      <footer className="border-t border-slate-200 py-10 text-center text-sm text-slate-500">
        VendorHQ — run your whole business from one inbox.
      </footer>

      <ChatWidget />
    </div>
  )
}
