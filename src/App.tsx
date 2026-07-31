import { useState, useRef, useEffect } from 'react'
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from 'recharts'
import xtsLogo from '@/imports/XTS_logo_Red-2.png'

// ─── Types ────────────────────────────────────────────────────────────────────
type Role = 'Owner' | 'Sales' | 'Warehouse' | 'Marketing'

// ─── Sample Data ──────────────────────────────────────────────────────────────
const salesData = Array.from({ length: 30 }, (_, i) => {
  const d = new Date(2026, 6, 1 + i)
  const label = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
  const current = Math.floor(8000 + Math.random() * 14000)
  const previous = Math.floor(7000 + Math.random() * 12000)
  return { date: label, current, previous }
})

const orders = [
  { id: 'DMA-10382', customer: 'Backwoods Sports', rep: 'Elissa M.', status: 'Processing', total: 2140, date: 'Jul 31', priority: 'Normal' },
  { id: 'DMA-10381', customer: 'Fun Guns', rep: 'Matt R.', status: 'Awaiting Documents', total: 3420, date: 'Jul 31', priority: 'High' },
  { id: 'DMA-10380', customer: "Hart's Gun & Optics", rep: 'Sarah K.', status: 'Shipped', total: 1895, date: 'Jul 30', priority: 'Normal' },
  { id: 'DMA-10379', customer: 'Creekside', rep: 'Michael T.', status: 'On Hold', total: 740, date: 'Jul 30', priority: 'High' },
  { id: 'DMA-10378', customer: 'Lone Star Sporting Goods', rep: 'Elissa M.', status: 'Picking', total: 4260, date: 'Jul 29', priority: 'Rush' },
  { id: 'DMA-10377', customer: 'Red River Tactical', rep: 'Matt R.', status: 'Packed', total: 1630, date: 'Jul 29', priority: 'Normal' },
  { id: 'DMA-10376', customer: '2A Outfitters', rep: 'Sarah K.', status: 'Shipped', total: 5100, date: 'Jul 28', priority: 'Normal' },
]

const inventoryAlerts = [
  { sku: 'XTS-ECR-15', name: 'XTS ECR 15-inch Handguard', qty: 8, status: 'Low', urgency: 'warning' as const },
  { sku: 'XTS-PH1', name: 'XTS Phase 1', qty: 0, status: 'Backordered', urgency: 'critical' as const },
  { sku: 'XTS-1913FA', name: 'XTS 1913 Folding Adapter', qty: 5, status: 'Low', urgency: 'warning' as const },
  { sku: 'XTS-QDEP', name: 'XTS QD Endplate', qty: 0, status: 'Out of Stock', urgency: 'critical' as const },
  { sku: 'AMMO-556-100', name: '5.56 NATO 100rd Value Pack', qty: 14, status: 'Low', urgency: 'warning' as const },
]

const dealerApps = [
  { name: 'Fun Guns', location: 'Austin, TX', status: 'Awaiting FFL', badge: 'warning' as const, date: 'Jul 29' },
  { name: '2A Outfitters', location: 'Denver, CO', status: 'Approved', badge: 'success' as const, date: 'Jul 28' },
  { name: 'Lone Star Armory', location: 'Dallas, TX', status: 'Needs EIN', badge: 'warning' as const, date: 'Jul 27' },
  { name: 'Red River Tactical', location: 'Shreveport, LA', status: 'Under Review', badge: 'blue' as const, date: 'Jul 25' },
  { name: 'Mountain Peak Arms', location: 'Salt Lake City, UT', status: 'Pending', badge: 'muted' as const, date: 'Jul 24' },
]

const topCustomers = [
  { name: 'Lone Star Sporting Goods', total: 48200, orders: 14, trend: '+12%', last: 'Jul 29', up: true },
  { name: "Hart's Gun & Optics", total: 31500, orders: 9, trend: '+8%', last: 'Jul 30', up: true },
  { name: 'Backwoods Sports', total: 27400, orders: 11, trend: '-3%', last: 'Jul 31', up: false },
  { name: '2A Outfitters', total: 22800, orders: 7, trend: '+21%', last: 'Jul 28', up: true },
  { name: 'Fun Guns', total: 19600, orders: 6, trend: '+5%', last: 'Jul 31', up: true },
]

const topProducts = [
  { name: 'XTS Phase 1 Rifle', sku: 'XTS-PH1', units: 48, revenue: 62400, stock: 'Backordered' },
  { name: 'XTS ECR 15" Handguard', sku: 'XTS-ECR-15', units: 134, revenue: 22110, stock: 'Low' },
  { name: 'Streamlight TLR-1 HL', sku: 'SL-TLR1HL', units: 89, revenue: 17355, stock: 'In Stock' },
  { name: 'Magpul PMAG 30 AR/M4', sku: 'MP-PMAG30', units: 412, revenue: 14832, stock: 'In Stock' },
  { name: 'XTS 1913 Folding Adapter', sku: 'XTS-1913FA', units: 61, revenue: 9455, stock: 'Low' },
]

const activityFeed = [
  { user: 'EL', name: 'Elissa', action: 'created Order DMA-10382 for Backwoods Sports', time: '8 min ago', color: '#7c3aed' },
  { user: 'MH', name: 'Michael', action: 'updated XTS-501 product information', time: '24 min ago', color: '#2563eb' },
  { user: 'MT', name: 'Matt', action: 'approved dealer application for 2A Outfitters', time: '41 min ago', color: '#16a34a' },
  { user: 'SK', name: 'Sarah', action: 'changed inventory quantity for XTS Phase 1 to 0', time: '1h 12m ago', color: '#d97706' },
  { user: 'MH', name: 'Michael', action: 'imported product pricing — 84 records updated', time: '2h 5m ago', color: '#2563eb' },
  { user: 'EL', name: 'Elissa', action: 'placed Order DMA-10381 for Fun Guns', time: '3h ago', color: '#7c3aed' },
]

const priorities = [
  { label: '3 dealer applications awaiting FFL documents', urgency: 'critical' as const, count: 3 },
  { label: '7 orders currently on hold', urgency: 'warning' as const, count: 7 },
  { label: '2 overdue invoices — $4,180 outstanding', urgency: 'critical' as const, count: 2 },
  { label: 'Inventory count needed for XTS Phase 1', urgency: 'warning' as const, count: 1 },
  { label: 'Follow up with Fun Guns — application stalled 3 days', urgency: 'info' as const, count: 1 },
]

const warehouseOrders = [
  { id: 'DMA-10378', customer: 'Lone Star Sporting Goods', items: 12, status: 'Ready to Pick', priority: 'Rush' },
  { id: 'DMA-10374', customer: 'Red River Tactical', items: 6, status: 'Ready to Pack', priority: 'Normal' },
  { id: 'DMA-10371', customer: '2A Outfitters', items: 18, status: 'Ready to Pick', priority: 'Normal' },
  { id: 'DMA-10370', customer: 'Mountain Peak Arms', items: 4, status: 'Ready to Pack', priority: 'High' },
  { id: 'DMA-10368', customer: 'Backwoods Sports', items: 9, status: 'Packing', priority: 'Normal' },
]

const productIssues = [
  { sku: 'XTS-ECR-12', name: 'XTS ECR 12-inch Handguard', issue: 'Missing product image', severity: 'warning' as const },
  { sku: 'XTS-BCG', name: 'XTS Bolt Carrier Group', issue: 'Missing description', severity: 'warning' as const },
  { sku: 'XTS-LPK', name: 'XTS Lower Parts Kit', issue: 'Missing image + description', severity: 'critical' as const },
  { sku: 'MP-AFG2', name: 'Magpul AFG2 Angled Grip', issue: 'Low-stock but still advertised', severity: 'critical' as const },
  { sku: 'SL-TLR-7', name: 'Streamlight TLR-7 Sub', issue: 'Price not updated since Q1', severity: 'info' as const },
]

// ─── Nav Items ─────────────────────────────────────────────────────────────────
const navItems = [
  { icon: '▦', label: 'Dashboard', active: true },
  { icon: '◈', label: 'Customers' },
  { icon: '◻', label: 'Orders' },
  { icon: '◉', label: 'Products' },
  { icon: '⊟', label: 'Inventory' },
  { icon: '⊕', label: 'Purchasing' },
  { icon: '◫', label: 'Reports' },
  { icon: '◷', label: 'Activity' },
  { icon: '◎', label: 'Settings' },
]

// ─── Reusable Components ──────────────────────────────────────────────────────
function StatusBadge({ status }: { status: string }) {
  const map: Record<string, string> = {
    'Processing': 'bg-blue-100 text-blue-700',
    'Awaiting Documents': 'bg-amber-100 text-amber-700',
    'Shipped': 'bg-green-100 text-green-700',
    'On Hold': 'bg-red-100 text-red-700',
    'Picking': 'bg-sky-100 text-sky-700',
    'Packed': 'bg-purple-100 text-purple-700',
    'Ready to Pick': 'bg-sky-100 text-sky-700',
    'Ready to Pack': 'bg-purple-100 text-purple-700',
    'Packing': 'bg-violet-100 text-violet-700',
    'Approved': 'bg-green-100 text-green-700',
    'Awaiting FFL': 'bg-amber-100 text-amber-700',
    'Needs EIN': 'bg-orange-100 text-orange-700',
    'Under Review': 'bg-blue-100 text-blue-700',
    'Pending': 'bg-slate-100 text-slate-600',
    'Backordered': 'bg-red-100 text-red-700',
    'Out of Stock': 'bg-red-100 text-red-700',
    'Low': 'bg-amber-100 text-amber-700',
    'In Stock': 'bg-green-100 text-green-700',
  }
  const cls = map[status] ?? 'bg-slate-100 text-slate-600'
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium ${cls}`}>
      {status}
    </span>
  )
}

function PriorityBadge({ priority }: { priority: string }) {
  const map: Record<string, string> = {
    Rush: 'bg-red-100 text-red-700',
    High: 'bg-orange-100 text-orange-700',
    Normal: 'bg-slate-100 text-slate-500',
  }
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${map[priority] ?? 'bg-slate-100 text-slate-500'}`}>
      {priority}
    </span>
  )
}

function KpiCard({ label, value, change, changeUp, color }: {
  label: string; value: string; change?: string; changeUp?: boolean; color?: string
}) {
  return (
    <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm hover:shadow-md transition-shadow">
      <p className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-1">{label}</p>
      <p className="text-2xl font-700 text-slate-900" style={{ fontWeight: 700 }}>{value}</p>
      {change && (
        <p className={`text-xs mt-1 font-medium ${changeUp ? 'text-green-600' : 'text-red-500'}`}>
          {changeUp ? '↑' : '↓'} {change} vs last period
        </p>
      )}
      {color && <div className="mt-3 h-1 rounded-full opacity-60" style={{ backgroundColor: color, width: '40%' }} />}
    </div>
  )
}

function Widget({
  title, subtitle, children, className = '', action, onAction
}: {
  title: string
  subtitle?: string
  children: React.ReactNode
  className?: string
  action?: string
  onAction?: () => void
}) {
  const [menuOpen, setMenuOpen] = useState(false)
  return (
    <div className={`bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden ${className}`}>
      <div className="flex items-start justify-between px-5 pt-4 pb-3 border-b border-slate-100">
        <div>
          <h3 className="text-sm font-600 text-slate-900" style={{ fontWeight: 600 }}>{title}</h3>
          {subtitle && <p className="text-xs text-slate-500 mt-0.5">{subtitle}</p>}
        </div>
        <div className="flex items-center gap-1">
          {action && (
            <button onClick={onAction} className="text-xs font-medium text-[#c41e2e] hover:underline px-2">
              {action}
            </button>
          )}
          <div className="relative">
            <button
              onClick={() => setMenuOpen(v => !v)}
              className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors text-lg leading-none"
            >
              ···
            </button>
            {menuOpen && (
              <div className="absolute right-0 top-8 z-50 bg-white border border-slate-200 rounded-lg shadow-lg py-1 min-w-36" onMouseLeave={() => setMenuOpen(false)}>
                {['Refresh', 'View Details', 'Edit Widget', 'Hide Widget'].map(item => (
                  <button key={item} className="block w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 transition-colors" onClick={() => setMenuOpen(false)}>
                    {item}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
      <div className="p-5">{children}</div>
    </div>
  )
}

function Avatar({ initials, color, size = 'sm' }: { initials: string; color: string; size?: 'sm' | 'md' }) {
  const s = size === 'sm' ? 'w-7 h-7 text-xs' : 'w-9 h-9 text-sm'
  return (
    <div className={`${s} rounded-full flex items-center justify-center text-white font-600 flex-shrink-0`} style={{ backgroundColor: color, fontWeight: 600 }}>
      {initials}
    </div>
  )
}

// ─── Sidebar ──────────────────────────────────────────────────────────────────
function Sidebar({ currentRole }: { currentRole: Role }) {
  const [collapsed, setCollapsed] = useState(false)
  return (
    <aside
      className="flex flex-col h-full transition-all duration-200"
      style={{ width: collapsed ? 64 : 220, backgroundColor: 'var(--sidebar-bg)', flexShrink: 0 }}
    >
      {/* Logo */}
      <div className="flex items-center gap-3 px-4 py-5 border-b border-white/10">
        <div
          className="w-8 h-8 rounded-lg flex items-center justify-center text-white text-xs font-700 flex-shrink-0"
          style={{ backgroundColor: 'var(--dma-red)', fontWeight: 700 }}
        >
          DMA
        </div>
        {!collapsed && (
          <div>
            <p className="text-white text-sm font-600" style={{ fontWeight: 600, lineHeight: 1.2 }}>DMA Inc.</p>
            <p className="text-slate-400 text-xs">Distribution</p>
          </div>
        )}
        <button
          className="ml-auto text-slate-500 hover:text-slate-300 text-xs"
          onClick={() => setCollapsed(v => !v)}
        >
          {collapsed ? '›' : '‹'}
        </button>
      </div>

      {/* Nav */}
      <nav className="flex-1 py-4 overflow-y-auto scrollbar-hidden">
        {navItems.map(item => (
          <button
            key={item.label}
            className={`w-full flex items-center gap-3 px-4 py-2.5 text-left transition-colors group ${
              item.active
                ? 'bg-white/10 text-white'
                : 'text-slate-400 hover:bg-white/5 hover:text-slate-200'
            }`}
          >
            <span className="text-base w-5 flex-shrink-0 text-center">{item.icon}</span>
            {!collapsed && (
              <span className="text-sm font-medium">{item.label}</span>
            )}
            {item.active && !collapsed && (
              <span className="ml-auto w-1.5 h-1.5 rounded-full bg-red-400 flex-shrink-0" />
            )}
          </button>
        ))}
      </nav>

      {/* Bottom */}
      <div className="border-t border-white/10 py-3">
        {['? Help', '⊙ Profile', '⎋ Sign Out'].map(item => {
          const [icon, label] = item.split(' ')
          return (
            <button key={label} className="w-full flex items-center gap-3 px-4 py-2 text-slate-500 hover:text-slate-300 hover:bg-white/5 transition-colors">
              <span className="w-5 flex-shrink-0 text-center text-sm">{icon}</span>
              {!collapsed && <span className="text-xs">{label}</span>}
            </button>
          )
        })}

        {!collapsed && (
          <div className="flex items-center gap-3 px-4 py-3 mt-2 border-t border-white/10">
            <Avatar initials="OB" color="#c41e2e" />
            <div className="overflow-hidden">
              <p className="text-white text-xs font-medium leading-tight truncate">Obie Braverman</p>
              <p className="text-slate-400 text-xs truncate">{currentRole}</p>
            </div>
          </div>
        )}
      </div>
    </aside>
  )
}

// ─── Top Header ───────────────────────────────────────────────────────────────
function Header({ role, setRole }: { role: Role; setRole: (r: Role) => void }) {
  const [quickOpen, setQuickOpen] = useState(false)
  const [notifOpen, setNotifOpen] = useState(false)
  const quickItems = ['New Order', 'New Customer', 'Add Product', 'Receive Inventory', 'Create Task']
  const roles: Role[] = ['Owner', 'Sales', 'Warehouse', 'Marketing']

  return (
    <header className="h-14 flex items-center gap-4 px-6 bg-white border-b border-slate-200 flex-shrink-0">
      {/* Search */}
      <div className="flex-1 max-w-sm">
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">⌕</span>
          <input
            className="w-full pl-8 pr-4 py-1.5 text-sm bg-slate-50 border border-slate-200 rounded-lg placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-red-200 focus:border-red-300 transition"
            placeholder="Search orders, customers, products…"
          />
        </div>
      </div>

      <div className="flex items-center gap-2 ml-auto">
        {/* Role selector */}
        <div className="flex items-center bg-slate-100 rounded-lg p-0.5 gap-0.5">
          {roles.map(r => (
            <button
              key={r}
              onClick={() => setRole(r)}
              className={`px-3 py-1 text-xs font-medium rounded-md transition-all ${
                role === r
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              {r}
            </button>
          ))}
        </div>

        {/* Notifications */}
        <div className="relative">
          <button
            onClick={() => setNotifOpen(v => !v)}
            className="relative w-9 h-9 flex items-center justify-center rounded-lg hover:bg-slate-100 text-slate-500 transition-colors"
          >
            <span className="text-base">🔔</span>
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border border-white" />
          </button>
          {notifOpen && (
            <div className="absolute right-0 top-11 z-50 w-80 bg-white border border-slate-200 rounded-xl shadow-xl" onMouseLeave={() => setNotifOpen(false)}>
              <div className="px-4 py-3 border-b border-slate-100 flex items-center justify-between">
                <p className="text-sm font-600" style={{ fontWeight: 600 }}>Notifications</p>
                <span className="text-xs text-red-600 font-medium">5 unread</span>
              </div>
              {[
                { msg: 'Fun Guns — FFL document still pending', time: '10m ago', dot: 'bg-amber-400' },
                { msg: 'XTS Phase 1 is now backordered', time: '1h ago', dot: 'bg-red-500' },
                { msg: 'Order DMA-10379 placed on hold', time: '2h ago', dot: 'bg-red-500' },
                { msg: 'Dealer app approved: 2A Outfitters', time: '3h ago', dot: 'bg-green-500' },
              ].map((n, i) => (
                <div key={i} className="flex items-start gap-3 px-4 py-3 hover:bg-slate-50 cursor-pointer border-b border-slate-50 last:border-0">
                  <span className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${n.dot}`} />
                  <div>
                    <p className="text-xs text-slate-700">{n.msg}</p>
                    <p className="text-xs text-slate-400 mt-0.5">{n.time}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Quick create */}
        <div className="relative">
          <button
            onClick={() => setQuickOpen(v => !v)}
            className="flex items-center gap-1.5 px-4 py-1.5 text-sm font-medium text-white rounded-lg transition-all hover:opacity-90 active:scale-95"
            style={{ backgroundColor: 'var(--dma-red)' }}
          >
            <span className="text-base leading-none">+</span>
            Create
          </button>
          {quickOpen && (
            <div className="absolute right-0 top-10 z-50 bg-white border border-slate-200 rounded-xl shadow-xl py-2 min-w-44" onMouseLeave={() => setQuickOpen(false)}>
              {quickItems.map(item => (
                <button
                  key={item}
                  className="w-full text-left px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 transition-colors"
                  onClick={() => setQuickOpen(false)}
                >
                  {item}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Avatar */}
        <Avatar initials="OB" color="#c41e2e" />
      </div>
    </header>
  )
}

// ─── Dashboard Header ─────────────────────────────────────────────────────────
function DashboardHeader({ role, setRole, onCustomize }: {
  role: Role; setRole: (r: Role) => void; onCustomize: () => void
}) {
  const [dateRange, setDateRange] = useState('Last 30 days')
  const dateOptions = ['Today', 'Last 7 days', 'Last 30 days', 'Last Quarter', 'Year to Date']
  const [ddOpen, setDdOpen] = useState(false)

  return (
    <div className="flex items-end justify-between mb-6">
      <div>
        <h1 className="text-2xl font-700 text-slate-900" style={{ fontWeight: 700 }}>
          Good morning, Obie 👋
        </h1>
        <p className="text-sm text-slate-500 mt-1">Here is what needs your attention today.</p>
      </div>
      <div className="flex items-center gap-2">
        {/* Date range */}
        <div className="relative">
          <button
            onClick={() => setDdOpen(v => !v)}
            className="flex items-center gap-2 px-3 py-1.5 text-sm bg-white border border-slate-200 rounded-lg hover:bg-slate-50 text-slate-700 transition-colors"
          >
            📅 {dateRange}
            <span className="text-slate-400 text-xs">▾</span>
          </button>
          {ddOpen && (
            <div className="absolute right-0 top-10 z-50 bg-white border border-slate-200 rounded-lg shadow-lg py-1 min-w-40" onMouseLeave={() => setDdOpen(false)}>
              {dateOptions.map(opt => (
                <button key={opt} className="block w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 transition-colors" onClick={() => { setDateRange(opt); setDdOpen(false) }}>
                  {opt}
                </button>
              ))}
            </div>
          )}
        </div>

        <button
          onClick={onCustomize}
          className="flex items-center gap-2 px-3 py-1.5 text-sm bg-white border border-slate-200 rounded-lg hover:bg-slate-50 text-slate-700 transition-colors"
        >
          ⊞ Customize
        </button>

        <button
          className="flex items-center gap-2 px-4 py-1.5 text-sm font-medium text-white rounded-lg transition-all hover:opacity-90"
          style={{ backgroundColor: 'var(--dma-red)' }}
        >
          + Create Order
        </button>
      </div>
    </div>
  )
}

// ─── Owner Dashboard ─────────────────────────────────────────────────────────
function OwnerDashboard() {
  return (
    <div className="grid grid-cols-12 gap-4">
      {/* KPI Strip */}
      {[
        { label: "Today's Sales", value: '$18,540', change: '14%', changeUp: true },
        { label: 'Open Orders', value: '42', change: '8%', changeUp: true },
        { label: 'Orders on Hold', value: '7', change: '3', changeUp: false },
        { label: 'Low Inventory', value: '12 items', change: '4', changeUp: false },
        { label: 'Dealer Applications', value: '5 pending', change: '2', changeUp: true },
        { label: 'Shipments Today', value: '18', change: '22%', changeUp: true },
      ].map(k => (
        <div key={k.label} className="col-span-2">
          <KpiCard {...k} />
        </div>
      ))}

      {/* Today's Priorities */}
      <div className="col-span-5">
        <Widget title="Today's Priorities" subtitle="Items requiring your attention" action="View All">
          <div className="space-y-3">
            {priorities.map((p, i) => (
              <div key={i} className={`flex items-start gap-3 p-3 rounded-lg border ${
                p.urgency === 'critical' ? 'border-red-200 bg-red-50' :
                p.urgency === 'warning' ? 'border-amber-200 bg-amber-50' :
                'border-blue-200 bg-blue-50'
              }`}>
                <span className={`mt-0.5 w-5 h-5 rounded-full flex items-center justify-center text-white text-xs font-700 flex-shrink-0 ${
                  p.urgency === 'critical' ? 'bg-red-500' :
                  p.urgency === 'warning' ? 'bg-amber-500' :
                  'bg-blue-500'
                }`} style={{ fontWeight: 700 }}>
                  {p.count}
                </span>
                <p className={`text-sm ${
                  p.urgency === 'critical' ? 'text-red-800' :
                  p.urgency === 'warning' ? 'text-amber-800' :
                  'text-blue-800'
                }`}>{p.label}</p>
                <button className="ml-auto text-xs font-medium text-slate-500 hover:text-slate-700 flex-shrink-0">
                  Act →
                </button>
              </div>
            ))}
          </div>
        </Widget>
      </div>

      {/* Sales Chart */}
      <div className="col-span-7">
        <Widget title="Sales Overview" subtitle="Last 30 days vs previous period">
          <div className="flex gap-6 mb-4">
            {[
              { label: 'Total Sales', value: '$318,420' },
              { label: 'Avg Order Value', value: '$2,144' },
              { label: 'Total Orders', value: '148' },
            ].map(s => (
              <div key={s.label}>
                <p className="text-xs text-slate-500">{s.label}</p>
                <p className="text-lg font-700 text-slate-900" style={{ fontWeight: 700 }}>{s.value}</p>
              </div>
            ))}
          </div>
          <ResponsiveContainer width="100%" height={180}>
            <AreaChart data={salesData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="current" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#c41e2e" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="#c41e2e" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="previous" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#94a3b8" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="#94a3b8" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="date" tick={{ fontSize: 10, fill: '#94a3b8' }} tickLine={false} interval={4} />
              <YAxis tick={{ fontSize: 10, fill: '#94a3b8' }} tickLine={false} axisLine={false} tickFormatter={v => `$${(v / 1000).toFixed(0)}k`} />
              <Tooltip
                contentStyle={{ borderRadius: 8, border: '1px solid #e2e8f0', fontSize: 12 }}
                formatter={(v) => [`$${Number(v).toLocaleString()}`, '']}
              />
              <Area type="monotone" dataKey="previous" stroke="#94a3b8" strokeWidth={1.5} fill="url(#previous)" dot={false} name="Previous" />
              <Area type="monotone" dataKey="current" stroke="#c41e2e" strokeWidth={2} fill="url(#current)" dot={false} name="Current" />
            </AreaChart>
          </ResponsiveContainer>
        </Widget>
      </div>

      {/* Recent Orders */}
      <div className="col-span-8">
        <Widget title="Recent Orders" subtitle="Latest 7 orders across all customers" action="View All Orders">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-100">
                  {['Order', 'Customer', 'Rep', 'Status', 'Total', 'Date', 'Priority'].map(h => (
                    <th key={h} className="text-left text-xs font-medium text-slate-400 uppercase tracking-wide pb-2 pr-3">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {orders.map(o => (
                  <tr key={o.id} className="border-b border-slate-50 hover:bg-slate-50 transition-colors cursor-pointer">
                    <td className="py-2.5 pr-3 font-medium text-blue-600 text-xs">{o.id}</td>
                    <td className="py-2.5 pr-3 text-slate-700 text-xs">{o.customer}</td>
                    <td className="py-2.5 pr-3 text-slate-500 text-xs">{o.rep}</td>
                    <td className="py-2.5 pr-3"><StatusBadge status={o.status} /></td>
                    <td className="py-2.5 pr-3 font-medium text-slate-800 text-xs">${o.total.toLocaleString()}</td>
                    <td className="py-2.5 pr-3 text-slate-400 text-xs">{o.date}</td>
                    <td className="py-2.5"><PriorityBadge priority={o.priority} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Widget>
      </div>

      {/* Inventory Alerts */}
      <div className="col-span-4">
        <Widget title="Inventory Alerts" subtitle="Items needing attention" action="View Inventory">
          <div className="space-y-2">
            {inventoryAlerts.map((item) => (
              <div key={item.sku} className={`flex items-start gap-3 p-2.5 rounded-lg border ${
                item.urgency === 'critical' ? 'border-red-100 bg-red-50' : 'border-amber-100 bg-amber-50'
              }`}>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5 mb-0.5">
                    {item.sku.startsWith('XTS') && (
                      <img src={xtsLogo} alt="XTS" className="h-4 object-contain flex-shrink-0" />
                    )}
                    <p className="text-xs font-medium text-slate-800 truncate">{item.name}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-slate-500">{item.sku}</span>
                    <StatusBadge status={item.status} />
                  </div>
                  {item.qty > 0 && <p className="text-xs text-slate-500 mt-0.5">{item.qty} remaining</p>}
                </div>
              </div>
            ))}
          </div>
        </Widget>
      </div>

      {/* Dealer Applications */}
      <div className="col-span-4">
        <Widget title="Dealer Applications" subtitle="5 pending review" action="View All">
          <div className="space-y-3">
            {dealerApps.map(d => (
              <div key={d.name} className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-3">
                  <Avatar initials={d.name[0] + d.name.split(' ').pop()![0]} color="#475569" size="sm" />
                  <div>
                    <p className="text-xs font-medium text-slate-800">{d.name}</p>
                    <p className="text-xs text-slate-400">{d.location} · {d.date}</p>
                  </div>
                </div>
                <StatusBadge status={d.status} />
              </div>
            ))}
          </div>
        </Widget>
      </div>

      {/* Top Customers */}
      <div className="col-span-4">
        <Widget title="Top Customers" subtitle="By revenue this period" action="View All">
          <div className="space-y-3">
            {topCustomers.map((c, i) => (
              <div key={c.name} className="flex items-center gap-3">
                <span className="text-xs font-700 text-slate-300 w-4 flex-shrink-0" style={{ fontWeight: 700 }}>{i + 1}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-slate-800 truncate">{c.name}</p>
                  <p className="text-xs text-slate-400">{c.orders} orders · last {c.last}</p>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="text-xs font-600 text-slate-800" style={{ fontWeight: 600 }}>${(c.total / 1000).toFixed(1)}k</p>
                  <p className={`text-xs font-medium ${c.up ? 'text-green-600' : 'text-red-500'}`}>{c.trend}</p>
                </div>
              </div>
            ))}
          </div>
        </Widget>
      </div>

      {/* Product Performance */}
      <div className="col-span-4">
        <Widget title="Product Performance" subtitle="Top-selling products this period" action="View Reports">
          <div className="space-y-3">
            {topProducts.map(p => (
              <div key={p.sku} className="flex items-start gap-2">
                {p.sku.startsWith('XTS') && (
                  <img src={xtsLogo} alt="XTS" className="h-4 mt-0.5 object-contain flex-shrink-0" />
                )}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-xs font-medium text-slate-800 truncate">{p.name}</p>
                    <StatusBadge status={p.stock} />
                  </div>
                  <div className="flex items-center gap-3 mt-0.5">
                    <span className="text-xs text-slate-400">{p.units} units</span>
                    <span className="text-xs font-medium text-slate-700">${p.revenue.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Widget>
      </div>

      {/* Recent Activity */}
      <div className="col-span-8">
        <Widget title="Recent Activity" subtitle="Team actions and system events" action="View All Activity">
          <div className="space-y-4">
            {activityFeed.map((a, i) => (
              <div key={i} className="flex items-start gap-3">
                <Avatar initials={a.user} color={a.color} size="sm" />
                <div className="flex-1">
                  <p className="text-xs text-slate-700">
                    <span className="font-medium">{a.name}</span> {a.action}
                  </p>
                  <p className="text-xs text-slate-400 mt-0.5">{a.time}</p>
                </div>
              </div>
            ))}
          </div>
        </Widget>
      </div>
    </div>
  )
}

// ─── Sales Dashboard ──────────────────────────────────────────────────────────
function SalesDashboard() {
  const myOrders = orders.filter(o => ['Elissa M.', 'Matt R.'].includes(o.rep))
  const followUpCustomers = [
    { name: 'Fun Guns', reason: 'Awaiting FFL documents', days: 3, urgency: 'critical' as const },
    { name: 'Creekside', reason: 'Order on hold — payment issue', days: 2, urgency: 'warning' as const },
    { name: 'Mountain Peak Arms', reason: 'No activity in 14 days', days: 14, urgency: 'info' as const },
    { name: 'Red River Tactical', reason: 'Application needs EIN follow-up', days: 4, urgency: 'warning' as const },
  ]
  return (
    <div className="grid grid-cols-12 gap-4">
      {/* KPI */}
      {[
        { label: 'My Sales (Month)', value: '$41,280', change: '11%', changeUp: true },
        { label: 'My Open Orders', value: '18', change: '2', changeUp: true },
        { label: 'Draft Orders', value: '3', change: '', changeUp: true },
        { label: 'Customers Needing Action', value: '4', change: '', changeUp: false },
      ].map(k => (
        <div key={k.label} className="col-span-3">
          <KpiCard {...k} />
        </div>
      ))}

      {/* Follow-up priorities */}
      <div className="col-span-5">
        <Widget title="Customers Requiring Follow-Up" subtitle="Act on these today" action="View CRM">
          <div className="space-y-3">
            {followUpCustomers.map((c, i) => (
              <div key={i} className={`flex items-start gap-3 p-3 rounded-lg border ${
                c.urgency === 'critical' ? 'border-red-200 bg-red-50' :
                c.urgency === 'warning' ? 'border-amber-200 bg-amber-50' : 'border-blue-200 bg-blue-50'
              }`}>
                <Avatar initials={c.name[0] + (c.name.split(' ')[1]?.[0] ?? c.name[1])} color="#475569" size="sm" />
                <div className="flex-1">
                  <p className="text-xs font-medium text-slate-800">{c.name}</p>
                  <p className="text-xs text-slate-600 mt-0.5">{c.reason}</p>
                  <p className="text-xs text-slate-400 mt-0.5">{c.days} days pending</p>
                </div>
                <button className="text-xs font-medium text-blue-600 hover:underline flex-shrink-0">Contact</button>
              </div>
            ))}
          </div>
        </Widget>
      </div>

      {/* My Orders */}
      <div className="col-span-7">
        <Widget title="My Recent Orders" subtitle="Your assigned orders" action="New Order">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-100">
                {['Order', 'Customer', 'Status', 'Total', 'Date'].map(h => (
                  <th key={h} className="text-left text-xs font-medium text-slate-400 uppercase tracking-wide pb-2 pr-3">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {myOrders.map(o => (
                <tr key={o.id} className="border-b border-slate-50 hover:bg-slate-50 transition-colors cursor-pointer">
                  <td className="py-2.5 pr-3 font-medium text-blue-600 text-xs">{o.id}</td>
                  <td className="py-2.5 pr-3 text-slate-700 text-xs">{o.customer}</td>
                  <td className="py-2.5 pr-3"><StatusBadge status={o.status} /></td>
                  <td className="py-2.5 pr-3 font-medium text-slate-800 text-xs">${o.total.toLocaleString()}</td>
                  <td className="py-2.5 text-slate-400 text-xs">{o.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Widget>
      </div>

      {/* Missing documents */}
      <div className="col-span-4">
        <Widget title="Missing Documents" subtitle="Applications blocked on paperwork" action="Send Request">
          <div className="space-y-3">
            {dealerApps.filter(d => ['Awaiting FFL', 'Needs EIN'].includes(d.status)).map(d => (
              <div key={d.name} className="flex items-center gap-3 p-2.5 bg-amber-50 border border-amber-100 rounded-lg">
                <Avatar initials={d.name[0] + d.name.split(' ').pop()![0]} color="#d97706" size="sm" />
                <div className="flex-1">
                  <p className="text-xs font-medium text-slate-800">{d.name}</p>
                  <StatusBadge status={d.status} />
                </div>
              </div>
            ))}
          </div>
        </Widget>
      </div>

      {/* Dealer apps */}
      <div className="col-span-4">
        <Widget title="Dealer Applications" subtitle="All pending applications" action="View All">
          <div className="space-y-3">
            {dealerApps.map(d => (
              <div key={d.name} className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium text-slate-800">{d.name}</p>
                  <p className="text-xs text-slate-400">{d.date}</p>
                </div>
                <StatusBadge status={d.status} />
              </div>
            ))}
          </div>
        </Widget>
      </div>

      {/* Personal performance */}
      <div className="col-span-4">
        <Widget title="My Performance" subtitle="Month to date">
          <div className="space-y-3">
            {[
              { label: 'Sales vs Target', value: '87%', bar: 87, color: '#16a34a' },
              { label: 'Orders Placed', value: '26', bar: 72, color: '#2563eb' },
              { label: 'New Customers', value: '3', bar: 60, color: '#7c3aed' },
              { label: 'Avg Deal Size', value: '$1,588', bar: 68, color: '#d97706' },
            ].map(m => (
              <div key={m.label}>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-slate-500">{m.label}</span>
                  <span className="font-medium text-slate-800">{m.value}</span>
                </div>
                <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full rounded-full transition-all" style={{ width: `${m.bar}%`, backgroundColor: m.color }} />
                </div>
              </div>
            ))}
          </div>
        </Widget>
      </div>
    </div>
  )
}

// ─── Warehouse Dashboard ──────────────────────────────────────────────────────
function WarehouseDashboard() {
  return (
    <div className="grid grid-cols-12 gap-4">
      {/* KPI strip */}
      {[
        { label: 'Ready to Pick', value: '14 orders' },
        { label: 'Ready to Pack', value: '8 orders' },
        { label: 'Shipments Due Today', value: '18' },
        { label: 'Backordered Items', value: '6 SKUs' },
      ].map(k => (
        <div key={k.label} className="col-span-3">
          <KpiCard {...k} />
        </div>
      ))}

      {/* Pick queue */}
      <div className="col-span-8">
        <Widget title="Orders Ready to Pick" subtitle="Sorted by priority · 14 orders" action="Print Pick List">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-100">
                {['Order', 'Customer', 'Items', 'Status', 'Priority'].map(h => (
                  <th key={h} className="text-left text-xs font-medium text-slate-400 uppercase tracking-wide pb-2 pr-3">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {warehouseOrders.map(o => (
                <tr key={o.id} className="border-b border-slate-50 hover:bg-slate-50 transition-colors cursor-pointer">
                  <td className="py-2.5 pr-3 font-medium text-blue-600 text-xs">{o.id}</td>
                  <td className="py-2.5 pr-3 text-slate-700 text-xs">{o.customer}</td>
                  <td className="py-2.5 pr-3 text-slate-500 text-xs">{o.items} items</td>
                  <td className="py-2.5 pr-3"><StatusBadge status={o.status} /></td>
                  <td className="py-2.5"><PriorityBadge priority={o.priority} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </Widget>
      </div>

      {/* Inventory shortages */}
      <div className="col-span-4">
        <Widget title="Inventory Shortages" subtitle="Blocking fulfillment" action="View Inventory">
          <div className="space-y-2">
            {inventoryAlerts.map(item => (
              <div key={item.sku} className={`p-2.5 rounded-lg border ${
                item.urgency === 'critical' ? 'border-red-100 bg-red-50' : 'border-amber-100 bg-amber-50'
              }`}>
                <div className="flex items-center gap-1 mb-0.5">
                  {item.sku.startsWith('XTS') && <img src={xtsLogo} alt="XTS" className="h-3.5 object-contain" />}
                  <p className="text-xs font-medium text-slate-800 truncate">{item.name}</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-400">{item.sku}</span>
                  <StatusBadge status={item.status} />
                </div>
              </div>
            ))}
          </div>
        </Widget>
      </div>

      {/* Shipments due */}
      <div className="col-span-5">
        <Widget title="Shipments Due Today" subtitle="18 packages due to ship by 5PM" action="Print Labels">
          <div className="space-y-2">
            {[
              { carrier: 'UPS Ground', count: 8, cutoff: '3:00 PM' },
              { carrier: 'FedEx Priority', count: 4, cutoff: '2:30 PM' },
              { carrier: 'USPS Priority Mail', count: 3, cutoff: '4:00 PM' },
              { carrier: 'Will Call / Pickup', count: 3, cutoff: 'By 5 PM' },
            ].map(s => (
              <div key={s.carrier} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg border border-slate-100">
                <div>
                  <p className="text-xs font-medium text-slate-800">{s.carrier}</p>
                  <p className="text-xs text-slate-400">Cutoff: {s.cutoff}</p>
                </div>
                <span className="text-lg font-700 text-slate-700" style={{ fontWeight: 700 }}>{s.count}</span>
              </div>
            ))}
          </div>
        </Widget>
      </div>

      {/* Incoming inventory */}
      <div className="col-span-4">
        <Widget title="Incoming Inventory" subtitle="Expected PO arrivals" action="View POs">
          <div className="space-y-3">
            {[
              { po: 'PO-2144', vendor: 'XTS Direct', items: '3 SKUs', date: 'Aug 1', status: 'In Transit' },
              { po: 'PO-2143', vendor: 'Magpul Industries', items: '8 SKUs', date: 'Aug 3', status: 'Confirmed' },
              { po: 'PO-2141', vendor: 'Streamlight', items: '5 SKUs', date: 'Aug 5', status: 'Ordered' },
            ].map(p => (
              <div key={p.po} className="flex items-center gap-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-medium text-blue-600">{p.po}</span>
                    <StatusBadge status={p.status} />
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">{p.vendor} · {p.items}</p>
                  <p className="text-xs text-slate-400">ETA: {p.date}</p>
                </div>
              </div>
            ))}
          </div>
        </Widget>
      </div>

      {/* Fulfillment activity */}
      <div className="col-span-3">
        <Widget title="Today's Activity" subtitle="Warehouse events">
          <div className="space-y-3">
            {[
              { action: 'Shipped DMA-10380', time: '9:12 AM', icon: '📦' },
              { action: 'Picked DMA-10374 (6 items)', time: '9:05 AM', icon: '✅' },
              { action: 'Label printed: DMA-10377', time: '8:58 AM', icon: '🖨️' },
              { action: 'Received PO-2139 — Magpul', time: '8:41 AM', icon: '📥' },
              { action: 'Discrepancy flagged: XTS-ECR-12', time: '8:30 AM', icon: '⚠️' },
            ].map((a, i) => (
              <div key={i} className="flex items-start gap-2">
                <span className="text-sm">{a.icon}</span>
                <div>
                  <p className="text-xs text-slate-700">{a.action}</p>
                  <p className="text-xs text-slate-400">{a.time}</p>
                </div>
              </div>
            ))}
          </div>
        </Widget>
      </div>
    </div>
  )
}

// ─── Marketing Dashboard ──────────────────────────────────────────────────────
function MarketingDashboard() {
  return (
    <div className="grid grid-cols-12 gap-4">
      {/* KPI */}
      {[
        { label: 'Products Missing Images', value: '14 SKUs', change: '3', changeUp: false },
        { label: 'Missing Descriptions', value: '22 SKUs', change: '5', changeUp: false },
        { label: 'New Dealer Signups', value: '5 this month', change: '2', changeUp: true },
        { label: 'Low-Stock Items Advertised', value: '3 active', change: '', changeUp: false },
      ].map(k => (
        <div key={k.label} className="col-span-3">
          <KpiCard {...k} />
        </div>
      ))}

      {/* Data quality issues */}
      <div className="col-span-6">
        <Widget title="Product Data Quality Issues" subtitle="Items needing content work" action="Open Task List">
          <div className="space-y-2">
            {productIssues.map(p => (
              <div key={p.sku} className={`flex items-start gap-3 p-3 rounded-lg border ${
                p.severity === 'critical' ? 'border-red-100 bg-red-50' :
                p.severity === 'warning' ? 'border-amber-100 bg-amber-50' : 'border-blue-100 bg-blue-50'
              }`}>
                {p.sku.startsWith('XTS') && <img src={xtsLogo} alt="XTS" className="h-5 mt-0.5 object-contain flex-shrink-0" />}
                <div className="flex-1">
                  <p className="text-xs font-medium text-slate-800">{p.name}</p>
                  <p className="text-xs text-slate-500">{p.sku}</p>
                </div>
                <span className={`text-xs font-medium flex-shrink-0 ${
                  p.severity === 'critical' ? 'text-red-600' :
                  p.severity === 'warning' ? 'text-amber-600' : 'text-blue-600'
                }`}>{p.issue}</span>
              </div>
            ))}
          </div>
        </Widget>
      </div>

      {/* Product performance */}
      <div className="col-span-6">
        <Widget title="Product Performance" subtitle="Revenue by product this period">
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={topProducts.map(p => ({ name: p.name.slice(0, 14) + '…', revenue: p.revenue }))} margin={{ left: -20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="name" tick={{ fontSize: 9, fill: '#94a3b8' }} />
              <YAxis tick={{ fontSize: 9, fill: '#94a3b8' }} tickFormatter={v => `$${(v / 1000).toFixed(0)}k`} />
              <Tooltip formatter={(v) => [`$${Number(v).toLocaleString()}`, 'Revenue']} contentStyle={{ borderRadius: 8, border: '1px solid #e2e8f0', fontSize: 12 }} />
              <Bar dataKey="revenue" fill="#c41e2e" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Widget>
      </div>

      {/* Dealer signups */}
      <div className="col-span-4">
        <Widget title="Recent Dealer Signups" subtitle="New applications this month" action="View All">
          <div className="space-y-3">
            {dealerApps.map(d => (
              <div key={d.name} className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium text-slate-800">{d.name}</p>
                  <p className="text-xs text-slate-400">{d.location}</p>
                </div>
                <StatusBadge status={d.status} />
              </div>
            ))}
          </div>
        </Widget>
      </div>

      {/* Low stock / advertised */}
      <div className="col-span-4">
        <Widget title="Low-Stock — Still Advertised" subtitle="Risk of disappointing customers" action="Update Ads">
          <div className="space-y-2">
            {inventoryAlerts.filter(a => a.urgency === 'critical').map(item => (
              <div key={item.sku} className="flex items-center gap-3 p-2.5 bg-red-50 border border-red-100 rounded-lg">
                {item.sku.startsWith('XTS') && <img src={xtsLogo} alt="XTS" className="h-4 object-contain" />}
                <div className="flex-1">
                  <p className="text-xs font-medium text-red-800">{item.name}</p>
                  <StatusBadge status={item.status} />
                </div>
                <button className="text-xs text-red-600 font-medium hover:underline">Pause Ads</button>
              </div>
            ))}
            <p className="text-xs text-slate-400 text-center pt-1">+1 low-stock item still active</p>
          </div>
        </Widget>
      </div>

      {/* Recently updated products */}
      <div className="col-span-4">
        <Widget title="Recently Updated Products" subtitle="Last 7 days" action="View Product Catalog">
          <div className="space-y-3">
            {[
              { name: 'XTS Phase 1', sku: 'XTS-PH1', by: 'Michael', time: '2h ago', change: 'Inventory updated' },
              { name: 'XTS 1913 Folding Adapter', sku: 'XTS-1913FA', by: 'Michael', time: '3h ago', change: 'Description added' },
              { name: 'Streamlight TLR-1 HL', sku: 'SL-TLR1HL', by: 'Sarah', time: 'Jul 30', change: 'Pricing updated' },
              { name: 'Magpul PMAG 30', sku: 'MP-PMAG30', by: 'Michael', time: 'Jul 29', change: 'Image added' },
            ].map(p => (
              <div key={p.sku} className="flex items-start gap-2">
                {p.sku.startsWith('XTS') && <img src={xtsLogo} alt="XTS" className="h-4 mt-0.5 object-contain flex-shrink-0" />}
                <div>
                  <p className="text-xs font-medium text-slate-800">{p.name}</p>
                  <p className="text-xs text-slate-400">{p.change} · {p.by} · {p.time}</p>
                </div>
              </div>
            ))}
          </div>
        </Widget>
      </div>
    </div>
  )
}

// ─── Customize Panel ──────────────────────────────────────────────────────────
function CustomizePanel({ onClose }: { onClose: () => void }) {
  const [activeGroup, setActiveGroup] = useState('Performance')
  const groups = ['Performance', 'Orders', 'Customers', 'Inventory', 'Tasks', 'Activity']
  const widgetCatalog: Record<string, string[]> = {
    Performance: ['Sales Overview', 'KPI Strip', 'Product Performance', 'Personal Performance'],
    Orders: ['Recent Orders', 'Draft Orders', 'Orders on Hold', 'Order Fulfillment'],
    Customers: ['Top Customers', 'Dealer Applications', 'Follow-Up Queue', 'Customer Balances'],
    Inventory: ['Inventory Alerts', 'Incoming POs', 'Low-Stock Products', 'Backorders'],
    Tasks: ["Today's Priorities", 'Content Tasks', 'Open Tasks'],
    Activity: ['Recent Activity', 'Team Activity', 'Audit Log'],
  }
  return (
    <div className="fixed inset-0 z-50 flex">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative ml-auto w-96 h-full bg-white shadow-2xl flex flex-col">
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-200">
          <div>
            <h2 className="text-sm font-600 text-slate-900" style={{ fontWeight: 600 }}>Customize Dashboard</h2>
            <p className="text-xs text-slate-500 mt-0.5">Add, remove, or reorder your widgets</p>
          </div>
          <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-slate-100 text-slate-400 transition-colors">✕</button>
        </div>

        <div className="flex gap-1 px-4 py-3 border-b border-slate-100 flex-wrap">
          {groups.map(g => (
            <button
              key={g}
              onClick={() => setActiveGroup(g)}
              className={`px-2.5 py-1 text-xs rounded-md font-medium transition-colors ${
                activeGroup === g ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {g}
            </button>
          ))}
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-2">
          <p className="text-xs text-slate-500 mb-3">Click to toggle widgets on your dashboard</p>
          {widgetCatalog[activeGroup]?.map(w => (
            <div key={w} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg border border-slate-100 hover:border-slate-200 transition-colors">
              <span className="text-sm text-slate-700">{w}</span>
              <button className="w-9 h-5 bg-slate-200 rounded-full relative transition-colors hover:bg-slate-300">
                <span className="absolute left-0.5 top-0.5 w-4 h-4 bg-white rounded-full shadow-sm transition-transform" />
              </button>
            </div>
          ))}
        </div>

        <div className="p-4 border-t border-slate-100 space-y-2">
          <p className="text-xs text-slate-400">
            ℹ️ Dashboard customization changes layout only and does not modify your account permissions.
          </p>
          <div className="flex gap-2">
            <button className="flex-1 px-3 py-2 text-sm border border-slate-200 rounded-lg hover:bg-slate-50 text-slate-600 transition-colors">
              Reset to Default
            </button>
            <button
              onClick={onClose}
              className="flex-1 px-3 py-2 text-sm text-white rounded-lg transition-all hover:opacity-90 font-medium"
              style={{ backgroundColor: 'var(--dma-red)' }}
            >
              Save Layout
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── Main App ─────────────────────────────────────────────────────────────────
export default function App() {
  const [role, setRole] = useState<Role>('Owner')
  const [customizing, setCustomizing] = useState(false)

  const dashboardMap: Record<Role, React.ReactNode> = {
    Owner: <OwnerDashboard />,
    Sales: <SalesDashboard />,
    Warehouse: <WarehouseDashboard />,
    Marketing: <MarketingDashboard />,
  }

  const greetingMap: Record<Role, string> = {
    Owner: "Here is what needs your attention today.",
    Sales: "Which customers and orders need action today?",
    Warehouse: "What needs to leave the building next?",
    Marketing: "What product, website, or marketing information needs attention?",
  }

  return (
    <div className="flex h-screen overflow-hidden" style={{ fontFamily: "'Inter', system-ui, sans-serif" }}>
      <Sidebar currentRole={role} />

      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
        <Header role={role} setRole={setRole} />

        <main className="flex-1 overflow-y-auto scrollbar-hidden p-6" style={{ backgroundColor: 'var(--bg-page)' }}>
          <DashboardHeader
            role={role}
            setRole={setRole}
            onCustomize={() => setCustomizing(true)}
          />
          {dashboardMap[role]}
        </main>
      </div>

      {customizing && <CustomizePanel onClose={() => setCustomizing(false)} />}
    </div>
  )
}
