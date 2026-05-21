import { useState, useEffect } from 'react'
import { Link, NavLink, Outlet, useNavigate, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { toast } from 'sonner'
import {
  MessageCircle,
  LayoutDashboard,
  Inbox,
  ShoppingBag,
  Users,
  Package,
  Zap,
  LogOut,
  Menu,
  X,
  Settings,
} from 'lucide-react'
import { getUser, clearUser } from '../lib/storage'
import Tooltip from './Tooltip'
import { cn } from '../lib/cn'

const NAV = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/inbox', label: 'Inbox', icon: Inbox },
  { to: '/orders', label: 'Orders', icon: ShoppingBag },
  { to: '/customers', label: 'Customers', icon: Users },
  { to: '/inventory', label: 'Inventory', icon: Package },
  { to: '/automations', label: 'Automations', icon: Zap },
]

export default function AppLayout() {
  const user = getUser()
  const navigate = useNavigate()
  const location = useLocation()
  const [drawerOpen, setDrawerOpen] = useState(false)

  useEffect(() => {
    setDrawerOpen(false)
  }, [location.pathname])

  function handleLogout() {
    clearUser()
    toast.success('Signed out', { description: 'See you again soon.' })
    navigate('/')
  }

  const currentPage = NAV.find((n) => n.to === location.pathname)?.label || 'VendorHQ'

  return (
    <div className="flex min-h-screen bg-slate-50 text-slate-900">
      <aside className="sticky top-0 hidden h-screen w-64 shrink-0 flex-col border-r border-slate-200 bg-white md:flex">
        <Brand />
        <NavList />
        <UserChip user={user} onLogout={handleLogout} />
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-20 flex items-center justify-between border-b border-slate-200 bg-white/80 px-4 py-3 backdrop-blur-md md:hidden">
          <Tooltip label="Menu">
            <button
              onClick={() => setDrawerOpen(true)}
              aria-label="Open menu"
              className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-slate-600 transition hover:bg-slate-100 hover:text-slate-900"
            >
              <Menu className="h-5 w-5" />
            </button>
          </Tooltip>
          <div className="text-base font-semibold">{currentPage}</div>
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-900 text-sm font-medium text-white">
            {user?.name?.[0]?.toUpperCase() || 'V'}
          </div>
        </header>

        <main className="flex-1 overflow-x-hidden">
          <Outlet />
        </main>
      </div>

      <AnimatePresence>
        {drawerOpen && (
          <>
            <motion.div
              key="scrim"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => setDrawerOpen(false)}
              className="fixed inset-0 z-40 bg-slate-900/40 backdrop-blur-sm md:hidden"
            />
            <motion.aside
              key="drawer"
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', stiffness: 320, damping: 32 }}
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={{ left: 0.3, right: 0 }}
              onDragEnd={(_, info) => {
                if (info.offset.x < -60 || info.velocity.x < -300) setDrawerOpen(false)
              }}
              className="fixed inset-y-0 left-0 z-50 flex w-72 flex-col border-r border-slate-200 bg-white shadow-2xl md:hidden"
            >
              <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
                <div className="flex items-center gap-2.5">
                  <Link to="/" className="flex items-center gap-2.5">
                    <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-900 text-white shadow-lg shadow-slate-900/15">
                      <MessageCircle className="h-4 w-4" />
                    </span>
                    <span className="font-semibold tracking-tight">VendorHQ</span>
                  </Link>
                </div>
                <button
                  onClick={() => setDrawerOpen(false)}
                  aria-label="Close menu"
                  className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-slate-500 transition hover:bg-slate-100 hover:text-slate-900"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              <NavList />
              <div className="-mt-2 px-3 pb-1 text-center text-[10px] text-slate-400">
                Swipe left to close
              </div>
              <UserChip user={user} onLogout={handleLogout} />
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}

function Brand() {
  return (
    <Link
      to="/"
      className="flex items-center gap-2.5 border-b border-slate-200 px-5 py-4"
    >
      <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-900 text-white shadow-lg shadow-slate-900/15">
        <MessageCircle className="h-4 w-4" />
      </span>
      <span className="font-semibold tracking-tight">VendorHQ</span>
    </Link>
  )
}

function NavList() {
  return (
    <nav className="flex-1 space-y-0.5 p-3">
      {NAV.map(({ to, label, icon: Icon }) => (
        <NavLink
          key={to}
          to={to}
          end
          className={({ isActive }) =>
            cn(
              'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition',
              isActive
                ? 'bg-slate-900 text-white shadow-sm shadow-slate-900/10'
                : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900',
            )
          }
        >
          <Icon className="h-4 w-4" />
          {label}
        </NavLink>
      ))}
    </nav>
  )
}

function UserChip({ user, onLogout }) {
  return (
    <div className="border-t border-slate-200 p-3">
      <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 p-2.5">
        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-900 text-sm font-medium text-white">
          {user?.name?.[0]?.toUpperCase() || 'V'}
        </div>
        <div className="min-w-0 flex-1">
          <div className="truncate text-sm font-medium text-slate-900">{user?.name}</div>
          <div className="truncate text-xs text-slate-500">
            {user?.businessName || user?.email}
          </div>
        </div>
        <Tooltip label="Settings">
          <Link
            to="/dashboard"
            className="rounded-md p-1.5 text-slate-500 hover:bg-white hover:text-slate-700"
          >
            <Settings className="h-4 w-4" />
          </Link>
        </Tooltip>
        <Tooltip label="Sign out">
          <button
            onClick={onLogout}
            aria-label="Sign out"
            className="rounded-md p-1.5 text-slate-500 hover:bg-white hover:text-slate-700"
          >
            <LogOut className="h-4 w-4" />
          </button>
        </Tooltip>
      </div>
    </div>
  )
}
