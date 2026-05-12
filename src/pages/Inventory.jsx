import { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import { Search, Plus, AlertTriangle, Package } from 'lucide-react'
import { getProducts, formatNaira } from '../lib/storage'
import { cn } from '../lib/cn'

function getStockState(stock) {
  if (stock === 0) return { label: 'Out of stock', cls: 'bg-rose-50 text-rose-700 ring-rose-200', dot: 'bg-rose-500' }
  if (stock < 5) return { label: 'Low stock', cls: 'bg-amber-50 text-amber-700 ring-amber-200', dot: 'bg-amber-500' }
  return { label: 'In stock', cls: 'bg-emerald-50 text-emerald-700 ring-emerald-200', dot: 'bg-emerald-500' }
}

export default function Inventory() {
  const products = getProducts()
  const [query, setQuery] = useState('')
  const [tab, setTab] = useState('all')

  const filtered = useMemo(() => {
    return products.filter((p) => {
      const matchesTab =
        tab === 'all' ||
        (tab === 'low' && p.stock > 0 && p.stock < 5) ||
        (tab === 'out' && p.stock === 0) ||
        (tab === 'in' && p.stock >= 5)
      const q = query.trim().toLowerCase()
      const matchesQuery =
        !q ||
        p.name.toLowerCase().includes(q) ||
        p.sku.toLowerCase().includes(q) ||
        p.variant.toLowerCase().includes(q)
      return matchesTab && matchesQuery
    })
  }, [products, tab, query])

  const counts = {
    all: products.length,
    in: products.filter((p) => p.stock >= 5).length,
    low: products.filter((p) => p.stock > 0 && p.stock < 5).length,
    out: products.filter((p) => p.stock === 0).length,
  }

  const tabLabels = { all: 'All', in: 'In stock', low: 'Low', out: 'Out' }

  const inventoryValue = products.reduce((s, p) => s + p.price * p.stock, 0)
  const totalSold = products.reduce((s, p) => s + p.sold, 0)
  const lowOrOut = counts.low + counts.out

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="mx-auto max-w-6xl px-6 py-8"
    >
      <header className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">Inventory</h1>
          <p className="mt-1.5 text-sm text-slate-500">
            Stock levels across your catalog. Low-stock alerts fire automatically.
          </p>
        </div>
        <button className="inline-flex items-center gap-2 self-start rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-medium text-white shadow-lg shadow-slate-900/15 transition hover:bg-slate-800">
          <Plus className="h-4 w-4" /> Add product
        </button>
      </header>

      <div className="mb-6 grid grid-cols-2 gap-3 lg:grid-cols-4">
        <SmallStat icon={<Package className="h-4 w-4" />} label="Total products" value={products.length} color="blue" />
        <SmallStat icon={<AlertTriangle className="h-4 w-4" />} label="Need attention" value={lowOrOut} color="amber" />
        <SmallStat label="Inventory value" value={formatNaira(inventoryValue)} color="emerald" />
        <SmallStat label="Lifetime units sold" value={totalSold} color="violet" />
      </div>

      {lowOrOut > 0 && (
        <motion.div
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-5 flex items-start gap-3 rounded-xl border border-amber-200 bg-amber-50 p-4"
        >
          <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-amber-600" />
          <div className="flex-1 text-sm">
            <div className="font-medium text-amber-900">
              {lowOrOut} {lowOrOut === 1 ? 'product needs' : 'products need'} restocking
            </div>
            <div className="mt-0.5 text-amber-800/80">
              Enable the "Low stock alert" automation to be notified the moment any product drops below 5 units.
            </div>
          </div>
        </motion.div>
      )}

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
              {tabLabels[key]} <span className={tab === key ? 'opacity-80' : 'text-slate-400'}>({count})</span>
            </button>
          ))}
        </div>
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search products, SKU…"
            className="w-full rounded-xl border border-slate-200 bg-white py-2 pl-10 pr-3 text-sm text-slate-900 placeholder:text-slate-400 transition focus:border-slate-900 focus:outline-none focus:ring-4 focus:ring-slate-900/5"
          />
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="rounded-2xl border border-slate-200 bg-white p-16 text-center text-sm text-slate-500">
          No products match.
        </div>
      ) : (
        <motion.div
          initial="hidden"
          animate="show"
          variants={{ hidden: {}, show: { transition: { staggerChildren: 0.05 } } }}
          className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3"
        >
          {filtered.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </motion.div>
      )}
    </motion.div>
  )
}

function ProductCard({ product }) {
  const state = getStockState(product.stock)
  return (
    <motion.div
      variants={{ hidden: { opacity: 0, y: 10 }, show: { opacity: 1, y: 0 } }}
      whileHover={{ y: -3 }}
      transition={{ type: 'spring', stiffness: 300, damping: 22 }}
      className="group overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:border-slate-300 hover:shadow-lg hover:shadow-slate-900/5"
    >
      <div className="relative aspect-[16/10] overflow-hidden bg-slate-100">
        <img src={product.cover} alt="" className="h-full w-full object-cover transition duration-500 group-hover:scale-105" />
        <span className={cn('absolute left-3 top-3 inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[10px] font-medium uppercase tracking-wider ring-1 ring-inset backdrop-blur', state.cls)}>
          <span className={cn('h-1.5 w-1.5 rounded-full', state.dot)} />
          {state.label}
        </span>
      </div>
      <div className="p-5">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h3 className="truncate font-semibold text-slate-900">{product.name}</h3>
            <p className="mt-0.5 truncate text-xs text-slate-500">{product.variant}</p>
          </div>
          <div className="text-right shrink-0">
            <div className="font-bold tracking-tight text-slate-900">{formatNaira(product.price)}</div>
          </div>
        </div>

        <div className="mt-4 flex items-center justify-between text-xs">
          <span className="text-slate-500">SKU <span className="font-mono text-slate-700">{product.sku}</span></span>
          <span className="text-slate-500">{product.sold} sold</span>
        </div>

        <StockBar stock={product.stock} sold={product.sold} />
      </div>
    </motion.div>
  )
}

function StockBar({ stock, sold }) {
  const total = stock + sold
  const pct = total === 0 ? 0 : Math.round((stock / total) * 100)
  const barColor = stock === 0 ? 'bg-rose-500' : stock < 5 ? 'bg-amber-500' : 'bg-emerald-500'

  return (
    <div className="mt-3">
      <div className="flex items-baseline justify-between text-xs">
        <span className="font-medium text-slate-900">{stock} in stock</span>
        <span className="text-slate-400">{pct}%</span>
      </div>
      <div className="mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-slate-100">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className={cn('h-full rounded-full', barColor)}
        />
      </div>
    </div>
  )
}

function SmallStat({ icon, label, value, color }) {
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
