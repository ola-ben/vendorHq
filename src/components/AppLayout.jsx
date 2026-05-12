import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom'
import {
  MessageCircle,
  LayoutDashboard,
  Inbox,
  ShoppingBag,
  Users,
  Package,
  Zap,
  LogOut,
} from 'lucide-react'
import { getUser, clearUser } from '../lib/storage'

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

  function handleLogout() {
    clearUser()
    navigate('/')
  }

  return (
    <div className="flex min-h-screen bg-slate-50 text-slate-900">
      <aside className="hidden w-60 shrink-0 border-r border-slate-200 bg-white md:flex md:flex-col">
        <Link to="/" className="flex items-center gap-2 border-b border-slate-200 px-5 py-4">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500 text-white">
            <MessageCircle className="h-4 w-4" />
          </span>
          <span className="font-semibold">VendorHQ</span>
        </Link>

        <nav className="flex-1 space-y-1 p-3">
          {NAV.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                [
                  'flex items-center gap-3 rounded-md px-3 py-2 text-sm transition',
                  isActive
                    ? 'bg-emerald-50 text-emerald-700 font-medium'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900',
                ].join(' ')
              }
            >
              <Icon className="h-4 w-4" />
              {label}
            </NavLink>
          ))}
        </nav>

        <div className="border-t border-slate-200 p-3">
          <div className="flex items-center gap-2 px-2 py-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-200 text-sm font-medium text-slate-700">
              {user?.name?.[0]?.toUpperCase() || 'V'}
            </div>
            <div className="min-w-0 flex-1">
              <div className="truncate text-sm font-medium text-slate-900">{user?.name}</div>
              <div className="truncate text-xs text-slate-500">{user?.email}</div>
            </div>
            <button
              onClick={handleLogout}
              title="Sign out"
              className="rounded-md p-1.5 text-slate-500 hover:bg-slate-100 hover:text-slate-700"
            >
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex items-center justify-between border-b border-slate-200 bg-white px-6 py-3 md:hidden">
          <Link to="/" className="flex items-center gap-2">
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-500 text-white">
              <MessageCircle className="h-3.5 w-3.5" />
            </span>
            <span className="font-semibold">VendorHQ</span>
          </Link>
          <button onClick={handleLogout} className="text-sm text-slate-600">
            Sign out
          </button>
        </header>

        <nav className="flex border-b border-slate-200 bg-white px-2 md:hidden">
          {NAV.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                [
                  'flex flex-1 flex-col items-center gap-0.5 py-2 text-xs',
                  isActive ? 'text-emerald-600' : 'text-slate-500',
                ].join(' ')
              }
            >
              <Icon className="h-4 w-4" />
              {label}
            </NavLink>
          ))}
        </nav>

        <main className="flex-1 overflow-x-hidden">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
