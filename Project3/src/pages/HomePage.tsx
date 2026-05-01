import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Calendar, MapPin, ArrowRight, Users, Navigation, ChevronRight } from 'lucide-react'
import { fetchEvents } from '../services/api'
import type { Event } from '../models/event'

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  })
}

function formatTime(dateStr: string) {
  return new Date(dateStr).toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
  })
}

/**
 * Home Page — PNW branding hero + upcoming events preview.
 */
export function HomePage() {
  const [featured, setFeatured] = useState<Event[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchEvents({ sort: 'date' })
      .then((res) => setFeatured(res.events.slice(0, 3)))
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  return (
    <div className="space-y-10">

      {/* ── Hero ──────────────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden rounded-3xl bg-accent-navy px-8 py-14 text-white shadow-2xl lg:px-14">
        {/* Decorative blobs */}
        <div className="pointer-events-none absolute -right-16 -top-16 h-72 w-72 rounded-full bg-accent-gold/20 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-10 left-10 h-52 w-52 rounded-full bg-white/5 blur-2xl" />

        <div className="relative z-10 max-w-2xl">
          <span className="mb-4 inline-block rounded-full border border-accent-gold/60 bg-accent-gold/20 px-4 py-1 text-xs font-semibold uppercase tracking-widest text-accent-gold">
            Purdue University Northwest
          </span>
          <h1 className="font-heading text-4xl font-extrabold leading-tight lg:text-5xl">
            Student Life<br />Event System
          </h1>
          <p className="mt-4 text-base text-slate-300 lg:text-lg">
            Discover upcoming events, register in seconds, find parking, and get
            driving directions — all in one place for PNW students.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              to="/events"
              className="inline-flex items-center gap-2 rounded-xl bg-accent-gold px-6 py-3 text-sm font-bold text-accent-navy shadow-lg hover:brightness-110 transition-all"
            >
              Browse Events <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              to="/register"
              className="inline-flex items-center gap-2 rounded-xl border border-white/30 bg-white/10 px-6 py-3 text-sm font-semibold text-white hover:bg-white/20 transition-all"
            >
              Register Now
            </Link>
          </div>
        </div>
      </section>

      {/* ── Quick Action Cards ─────────────────────────────────────────────────── */}
      <section>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          {[
            { to: '/events', icon: Calendar, label: 'View All Events', desc: 'Browse & filter upcoming student life events', color: 'bg-blue-50 text-blue-700' },
            { to: '/routes', icon: Navigation, label: 'Get Directions', desc: 'Enter your address and get a driving route', color: 'bg-green-50 text-green-700' },
            { to: '/map',    icon: MapPin,    label: 'Campus Map',      desc: 'Explore PNW Hammond buildings & parking', color: 'bg-amber-50 text-amber-700' },
          ].map(({ to, icon: Icon, label, desc, color }) => (
            <Link
              key={to}
              to={to}
              className="group flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all"
            >
              <span className={`inline-flex h-11 w-11 items-center justify-center rounded-xl ${color}`}>
                <Icon className="h-5 w-5" />
              </span>
              <div>
                <p className="font-heading text-sm font-bold text-text-primary">{label}</p>
                <p className="mt-0.5 text-xs text-slate-500">{desc}</p>
              </div>
              <ChevronRight className="h-4 w-4 text-slate-400 group-hover:text-accent-navy transition-colors mt-auto self-end" />
            </Link>
          ))}
        </div>
      </section>

      {/* ── Upcoming Events Preview ────────────────────────────────────────────── */}
      <section>
        <div className="mb-5 flex items-center justify-between">
          <h2 className="font-heading text-xl font-bold text-text-primary">Upcoming Events</h2>
          <Link to="/events" className="flex items-center gap-1 text-sm font-semibold text-accent-navy hover:underline">
            View all <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        {loading ? (
          <div className="grid gap-4 sm:grid-cols-3">
            {[1,2,3].map(i => (
              <div key={i} className="h-48 animate-pulse rounded-2xl bg-slate-100" />
            ))}
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-3">
            {featured.map((event) => (
              <Link
                key={event.id}
                to={`/events/${event.id}`}
                className="group flex flex-col rounded-2xl border border-slate-200 bg-white p-5 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all"
              >
                {/* Date badge */}
                <div className="mb-3 flex items-center gap-2">
                  <span className="flex h-10 w-10 flex-col items-center justify-center rounded-xl bg-accent-navy text-white leading-none">
                    <span className="text-[10px] font-semibold uppercase">
                      {new Date(event.event_date).toLocaleString('en-US', { month: 'short' })}
                    </span>
                    <span className="text-lg font-extrabold leading-none">
                      {new Date(event.event_date).getDate()}
                    </span>
                  </span>
                  <div>
                    <p className="text-xs font-medium text-slate-500">{formatDate(event.event_date)}</p>
                    <p className="text-xs text-slate-400">{formatTime(event.event_date)}</p>
                  </div>
                </div>

                <h3 className="font-heading text-sm font-bold text-text-primary group-hover:text-accent-navy transition-colors line-clamp-2">
                  {event.name}
                </h3>
                <p className="mt-1 line-clamp-2 text-xs text-slate-500">{event.description}</p>

                <div className="mt-3 flex items-center gap-1.5 text-xs text-slate-400">
                  <MapPin className="h-3 w-3 flex-shrink-0" />
                  <span className="truncate">{event.location.split(',')[0]}</span>
                </div>

                <div className="mt-2 flex items-center justify-between">
                  <span className={`rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${Number(event.cost) === 0 ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>
                    {Number(event.cost) === 0 ? 'Free' : `$${Number(event.cost).toFixed(2)}`}
                  </span>
                  <span className="flex items-center gap-1 text-[11px] text-slate-400">
                    <Users className="h-3 w-3" />
                    {event.registration_count ?? 0} registered
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>
    </div>
  )
}
