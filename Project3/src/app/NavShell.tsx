import { useState } from 'react'
import { NavLink, Link } from 'react-router-dom'
import { Menu, X, MapPin, Calendar, UserCheck, Navigation, Map } from 'lucide-react'

interface NavShellProps {
  children: React.ReactNode
}

const navItems = [
  { to: '/',        label: 'Home',       icon: null },
  { to: '/events',  label: 'Events',     icon: Calendar },
  { to: '/register',label: 'Register',   icon: UserCheck },
  { to: '/routes',  label: 'Route',      icon: Navigation },
  { to: '/map',     label: 'Campus Map', icon: Map },
]

/**
 * NavShell — persistent top navigation + mobile menu.
 * Wraps all pages. Uses PNW brand colors (navy / gold).
 */
export function NavShell({ children }: NavShellProps) {
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <div className="min-h-screen bg-bg font-body text-text-primary">

      {/* ── Top Nav ───────────────────────────────────────────────────────────── */}
      <header className="sticky top-0 z-50 border-b border-slate-200/60 bg-white/90 shadow-sm backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 lg:px-6">

          {/* Logo / Brand */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-accent-navy shadow-md group-hover:scale-105 transition-transform">
              <MapPin className="h-4.5 w-4.5 text-accent-gold" />
            </span>
            <div className="leading-tight">
              <p className="font-heading text-sm font-bold text-accent-navy">PNW Events</p>
              <p className="text-[10px] text-slate-400 font-medium tracking-wide">Student Life</p>
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-1">
            {navItems.map(({ to, label, icon: Icon }) => (
              <NavLink
                key={to}
                to={to}
                end={to === '/'}
                className={({ isActive }) =>
                  `flex items-center gap-1.5 rounded-lg px-3.5 py-2 text-sm font-medium transition-all duration-150
                  ${isActive
                    ? 'bg-accent-navy text-white shadow-sm'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-accent-navy'
                  }`
                }
              >
                {Icon && <Icon className="h-3.5 w-3.5" />}
                {label}
              </NavLink>
            ))}
          </nav>

          {/* My Dashboard CTA (desktop) */}
          <div className="hidden lg:flex items-center gap-2">
            <Link
              to="/students/lookup"
              className="rounded-lg border border-accent-navy/30 px-3.5 py-2 text-sm font-semibold text-accent-navy hover:bg-accent-navy hover:text-white transition-all duration-150"
            >
              My Dashboard
            </Link>
          </div>

          {/* Mobile hamburger */}
          <button
            type="button"
            className="lg:hidden rounded-lg p-2 text-slate-600 hover:bg-slate-100"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileOpen && (
          <nav className="border-t border-slate-200 bg-white px-4 py-3 lg:hidden">
            <div className="flex flex-col gap-1">
              {navItems.map(({ to, label, icon: Icon }) => (
                <NavLink
                  key={to}
                  to={to}
                  end={to === '/'}
                  onClick={() => setMobileOpen(false)}
                  className={({ isActive }) =>
                    `flex items-center gap-2 rounded-lg px-3 py-2.5 text-sm font-medium
                    ${isActive ? 'bg-accent-navy text-white' : 'text-slate-700 hover:bg-slate-100'}`
                  }
                >
                  {Icon && <Icon className="h-4 w-4" />}
                  {label}
                </NavLink>
              ))}
              <Link
                to="/students/lookup"
                onClick={() => setMobileOpen(false)}
                className="mt-2 rounded-lg border border-accent-navy px-3 py-2.5 text-center text-sm font-semibold text-accent-navy"
              >
                My Dashboard
              </Link>
            </div>
          </nav>
        )}
      </header>

      {/* ── Page Content ──────────────────────────────────────────────────────── */}
      <main className="mx-auto max-w-7xl px-4 py-6 lg:px-6">
        {children}
      </main>
    </div>
  )
}
