import { useEffect, useState, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { Search, Calendar, MapPin, Users, SlidersHorizontal, X } from 'lucide-react'
import { fetchEvents, type EventFilters } from '../services/api'
import type { Event } from '../models/event'

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('en-US', {
    weekday: 'short', month: 'long', day: 'numeric', year: 'numeric',
  })
}

function formatTime(dateStr: string) {
  return new Date(dateStr).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })
}

/**
 * Event List Page — searchable, filterable grid of all events sorted by date.
 */
export function EventListPage() {
  const [events, setEvents]   = useState<Event[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError]     = useState('')

  const [search, setSearch] = useState('')
  const [date, setDate]     = useState('')
  const [sort, setSort]     = useState<'date' | 'name'>('date')

  const load = useCallback(() => {
    setLoading(true)
    setError('')
    const filters: EventFilters = {}
    if (search.trim()) filters.search = search.trim()
    if (date)          filters.date   = date
    filters.sort = sort

    fetchEvents(filters)
      .then((res) => setEvents(res.events))
      .catch(() => setError('Failed to load events. Is the backend running?'))
      .finally(() => setLoading(false))
  }, [search, date, sort])

  // Debounce search
  useEffect(() => {
    const t = setTimeout(load, 350)
    return () => clearTimeout(t)
  }, [load])

  const clearFilters = () => { setSearch(''); setDate(''); setSort('date') }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="font-heading text-2xl font-extrabold text-text-primary">Student Life Events</h1>
        <p className="mt-1 text-sm text-slate-500">
          All events are sorted by date. Register directly from any event detail page.
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        {/* Search */}
        <div className="relative flex-1 min-w-[180px]">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            id="event-search"
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search events…"
            className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-9 pr-3 text-sm outline-none focus:border-accent-navy/50 focus:ring-2 focus:ring-accent-navy/20"
          />
        </div>

        {/* Date filter */}
        <div className="relative flex items-center">
          <Calendar className="absolute left-3 h-4 w-4 text-slate-400" />
          <input
            id="event-date-filter"
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-9 pr-3 text-sm outline-none focus:border-accent-navy/50 focus:ring-2 focus:ring-accent-navy/20"
          />
        </div>

        {/* Sort */}
        <div className="relative flex items-center">
          <SlidersHorizontal className="absolute left-3 h-4 w-4 text-slate-400" />
          <select
            id="event-sort"
            value={sort}
            onChange={(e) => setSort(e.target.value as 'date' | 'name')}
            className="rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-9 pr-8 text-sm outline-none focus:border-accent-navy/50 focus:ring-2 focus:ring-accent-navy/20 appearance-none"
          >
            <option value="date">Sort: Date</option>
            <option value="name">Sort: Name</option>
          </select>
        </div>

        {/* Clear */}
        {(search || date || sort !== 'date') && (
          <button
            type="button"
            onClick={clearFilters}
            className="flex items-center gap-1.5 rounded-xl border border-slate-200 px-3 py-2.5 text-xs font-medium text-slate-500 hover:bg-slate-50"
          >
            <X className="h-3.5 w-3.5" /> Clear
          </button>
        )}
      </div>

      {/* Results count */}
      {!loading && (
        <p className="text-xs text-slate-400 font-medium">
          {events.length} event{events.length !== 1 ? 's' : ''} found
        </p>
      )}

      {/* Event Grid */}
      {loading ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[1,2,3,4,5,6].map(i => (
            <div key={i} className="h-56 animate-pulse rounded-2xl bg-slate-100" />
          ))}
        </div>
      ) : error ? (
        <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-center text-sm text-red-600">
          {error}
        </div>
      ) : events.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-300 p-12 text-center">
          <Calendar className="mx-auto h-10 w-10 text-slate-300" />
          <p className="mt-3 text-sm font-medium text-slate-500">No events match your search.</p>
          <button onClick={clearFilters} className="mt-2 text-xs text-accent-navy hover:underline">Clear filters</button>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {events.map((event) => (
            <Link
              key={event.id}
              to={`/events/${event.id}`}
              className="group flex flex-col rounded-2xl border border-slate-200 bg-white p-5 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all"
            >
              {/* Month/Day badge + time */}
              <div className="mb-4 flex items-center gap-3">
                <div className="flex h-12 w-12 flex-shrink-0 flex-col items-center justify-center rounded-xl bg-accent-navy text-white shadow">
                  <span className="text-[9px] font-semibold uppercase leading-none">
                    {new Date(event.event_date).toLocaleString('en-US', { month: 'short' })}
                  </span>
                  <span className="text-xl font-extrabold leading-tight">
                    {new Date(event.event_date).getDate()}
                  </span>
                </div>
                <div>
                  <p className="text-xs font-semibold text-slate-600">{formatDate(event.event_date)}</p>
                  <p className="text-xs text-slate-400">{formatTime(event.event_date)}</p>
                </div>
              </div>

              <h2 className="font-heading text-sm font-bold text-text-primary group-hover:text-accent-navy transition-colors line-clamp-2">
                {event.name}
              </h2>
              <p className="mt-1 line-clamp-3 text-xs text-slate-500 flex-1">{event.description}</p>

              <div className="mt-4 space-y-1.5">
                <div className="flex items-center gap-1.5 text-xs text-slate-400">
                  <MapPin className="h-3.5 w-3.5 flex-shrink-0 text-accent-navy/60" />
                  <span className="truncate">{event.location.split(',')[0]}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className={`rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${Number(event.cost) === 0 ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>
                    {Number(event.cost) === 0 ? 'Free' : `$${Number(event.cost).toFixed(2)}`}
                  </span>
                  <span className="flex items-center gap-1 text-[11px] text-slate-400">
                    <Users className="h-3 w-3" />
                    {event.registration_count ?? 0} registered
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
