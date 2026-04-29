import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { ArrowLeft, Calendar, MapPin, DollarSign, Users, Car, Clock, Navigation } from 'lucide-react'
import { fetchEvent, fetchParking } from '../services/api'
import type { Event, ParkingLot } from '../models/event'

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('en-US', {
    weekday: 'long', month: 'long', day: 'numeric', year: 'numeric',
  })
}
function formatTime(dateStr: string) {
  return new Date(dateStr).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })
}

/**
 * Event Detail Page — full event info + parking suggestions + register CTA.
 */
export function EventDetailPage() {
  const { id } = useParams<{ id: string }>()

  const [event,   setEvent]   = useState<Event | null>(null)
  const [parking, setParking] = useState<ParkingLot[]>([])
  const [loading, setLoading] = useState(!!id)
  const [error,   setError]   = useState('')

  useEffect(() => {
    if (!id) return

    Promise.all([
      fetchEvent(id),
      fetchParking(id),
    ])
      .then(([evtRes, pkgRes]) => {
        setEvent(evtRes.event)
        setParking(pkgRes.parking_lots)
      })
      .catch(() => setError('Could not load event details.'))
      .finally(() => setLoading(false))
  }, [id])

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="h-8 w-40 animate-pulse rounded-xl bg-slate-100" />
        <div className="h-64 animate-pulse rounded-2xl bg-slate-100" />
      </div>
    )
  }

  if (error || !event) {
    return (
      <div className="rounded-2xl border border-red-200 bg-red-50 p-8 text-center text-sm text-red-600">
        {error || 'Event not found.'}
        <div className="mt-4">
          <Link to="/events" className="text-accent-navy font-semibold hover:underline">← Back to Events</Link>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Back */}
      <Link to="/events" className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-500 hover:text-accent-navy transition-colors">
        <ArrowLeft className="h-4 w-4" /> Back to Events
      </Link>

      {/* ── Main Card ─────────────────────────────────────────────────────────── */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm lg:p-8">
        {/* Cost badge */}
        <div className="mb-4 flex flex-wrap items-center gap-2">
          <span className={`rounded-full px-3 py-1 text-xs font-bold ${Number(event.cost) === 0 ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>
            {Number(event.cost) === 0 ? '🎉 Free Event' : `$${Number(event.cost).toFixed(2)}`}
          </span>
          <span className="flex items-center gap-1 rounded-full bg-slate-100 px-3 py-1 text-xs text-slate-500">
            <Users className="h-3 w-3" /> {event.registration_count ?? 0} registered
          </span>
        </div>

        <h1 className="font-heading text-2xl font-extrabold text-text-primary lg:text-3xl">
          {event.name}
        </h1>

        {/* Meta row */}
        <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          <div className="flex items-start gap-3 rounded-xl bg-slate-50 p-3">
            <Calendar className="mt-0.5 h-4 w-4 flex-shrink-0 text-accent-navy" />
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">Date & Time</p>
              <p className="text-sm font-medium text-text-primary">{formatDate(event.event_date)}</p>
              <p className="text-xs text-slate-500">{formatTime(event.event_date)}</p>
            </div>
          </div>

          <div className="flex items-start gap-3 rounded-xl bg-slate-50 p-3">
            <MapPin className="mt-0.5 h-4 w-4 flex-shrink-0 text-accent-navy" />
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">Location</p>
              <p className="text-sm font-medium text-text-primary">{event.location}</p>
            </div>
          </div>

          <div className="flex items-start gap-3 rounded-xl bg-slate-50 p-3">
            <DollarSign className="mt-0.5 h-4 w-4 flex-shrink-0 text-accent-navy" />
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">Admission</p>
              <p className="text-sm font-medium text-text-primary">
                {Number(event.cost) === 0 ? 'Free — no charge' : `$${Number(event.cost).toFixed(2)}`}
              </p>
            </div>
          </div>
        </div>

        {/* Description */}
        {event.description && (
          <div className="mt-6">
            <h2 className="font-heading text-base font-bold text-text-primary">About This Event</h2>
            <p className="mt-2 text-sm leading-relaxed text-slate-600">{event.description}</p>
          </div>
        )}

        {/* Action buttons */}
        <div className="mt-8 flex flex-wrap gap-3">
          <Link
            to={`/register?eventId=${event.id}`}
            className="inline-flex items-center gap-2 rounded-xl bg-accent-navy px-6 py-3 text-sm font-bold text-white shadow hover:brightness-110 transition-all"
          >
            Register for This Event
          </Link>
          <Link
            to={`/routes?location=${encodeURIComponent(event.location)}`}
            className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-5 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-100 transition-all"
          >
            <Navigation className="h-4 w-4" /> Get Directions
          </Link>
        </div>
      </div>

      {/* ── Parking Suggestions ───────────────────────────────────────────────── */}
      {parking.length > 0 && (
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="font-heading text-base font-bold text-text-primary flex items-center gap-2">
            <Car className="h-4 w-4 text-accent-navy" /> Nearby Parking
          </h2>
          <p className="mt-1 text-xs text-slate-500">Recommended parking options for this event location.</p>

          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {parking.map((lot) => (
              <div
                key={lot.id}
                className="rounded-xl border border-slate-100 bg-slate-50 p-4"
              >
                <p className="text-sm font-semibold text-text-primary">{lot.name}</p>
                <p className="mt-0.5 text-xs text-slate-500">{lot.location}</p>
                <div className="mt-3 flex gap-4 text-xs text-slate-500">
                  <span className="flex items-center gap-1">
                    <MapPin className="h-3 w-3 text-accent-navy" />
                    {lot.distance_ft.toLocaleString()} ft away
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="h-3 w-3 text-accent-navy" />
                    ~{lot.walk_time_min} min walk
                  </span>
                </div>
                {lot.notes && (
                  <p className="mt-2 text-[11px] italic text-slate-400">{lot.notes}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
