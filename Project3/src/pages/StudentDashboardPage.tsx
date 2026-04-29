import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Search, Calendar, MapPin, Clock, UserCheck, AlertCircle } from 'lucide-react'
import { fetchStudentDashboard } from '../services/api'
import type { Student, Registration } from '../models/event'

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('en-US', {
    weekday: 'long', month: 'long', day: 'numeric', year: 'numeric',
  })
}
function formatTime(dateStr: string) {
  return new Date(dateStr).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })
}

/**
 * Student Dashboard Page
 * Looks up a student by their PNW Student ID and shows their registered events.
 */
export function StudentDashboardPage() {
  const [query,         setQuery]         = useState('')
  const [student,       setStudent]       = useState<Student | null>(null)
  const [registrations, setRegistrations] = useState<Registration[]>([])
  const [loading,       setLoading]       = useState(false)
  const [error,         setError]         = useState('')
  const [searched,      setSearched]      = useState(false)

  async function handleSearch(e: React.FormEvent) {
    e.preventDefault()
    if (!query.trim()) return
    setLoading(true)
    setError('')
    setStudent(null)
    setRegistrations([])
    setSearched(true)

    try {
      const res = await fetchStudentDashboard(query.trim())
      setStudent(res.student)
      setRegistrations(res.registrations)
    } catch (err: unknown) {
      const axiosErr = err as { response?: { data?: { error?: string } } }
      setError(axiosErr?.response?.data?.error || 'Student not found. Check the ID and try again.')
    } finally {
      setLoading(false)
    }
  }

  // Separate upcoming vs past registrations
  const now = Date.now()
  const upcoming = registrations.filter((r) => new Date(r.event_date).getTime() >= now)
  const past     = registrations.filter((r) => new Date(r.event_date).getTime()  < now)

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      {/* Header */}
      <div>
        <h1 className="font-heading text-2xl font-extrabold text-text-primary">My Dashboard</h1>
        <p className="mt-1 text-sm text-slate-500">Enter your PNW Student ID to view your event registrations.</p>
      </div>

      {/* Search form */}
      <form onSubmit={handleSearch} className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            id="student-id-search"
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Enter PNW Student ID (e.g. 0012345678)"
            className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-9 pr-3 text-sm outline-none focus:border-accent-navy/50 focus:ring-2 focus:ring-accent-navy/20"
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="rounded-xl bg-accent-navy px-5 py-3 text-sm font-bold text-white hover:brightness-110 disabled:opacity-60 transition-all"
        >
          {loading ? '…' : 'Look Up'}
        </button>
      </form>

      {/* Error */}
      {error && (
        <div className="flex gap-3 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-600">
          <AlertCircle className="h-5 w-5 flex-shrink-0 mt-0.5" />
          <p>{error}</p>
        </div>
      )}

      {/* Student card */}
      {student && (
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-accent-navy shadow">
              <UserCheck className="h-6 w-6 text-accent-gold" />
            </div>
            <div>
              <p className="font-heading text-lg font-bold text-text-primary">
                {student.first_name}
                {student.middle_name ? ` ${student.middle_name}` : ''}
                {' '}{student.last_name}
              </p>
              <p className="text-sm text-slate-500">Student ID: <span className="font-mono font-semibold">{student.student_id}</span></p>
              {student.email && <p className="text-xs text-slate-400">{student.email}</p>}
            </div>
          </div>

          <div className="mt-4 flex gap-4">
            <div className="rounded-xl bg-slate-50 px-4 py-3 text-center">
              <p className="text-2xl font-extrabold text-accent-navy">{registrations.length}</p>
              <p className="text-[11px] font-medium text-slate-500">Total Registrations</p>
            </div>
            <div className="rounded-xl bg-green-50 px-4 py-3 text-center">
              <p className="text-2xl font-extrabold text-green-600">{upcoming.length}</p>
              <p className="text-[11px] font-medium text-slate-500">Upcoming</p>
            </div>
            <div className="rounded-xl bg-slate-100 px-4 py-3 text-center">
              <p className="text-2xl font-extrabold text-slate-400">{past.length}</p>
              <p className="text-[11px] font-medium text-slate-500">Past</p>
            </div>
          </div>
        </div>
      )}

      {/* Upcoming registrations */}
      {student && (
        <div className="space-y-4">
          <h2 className="font-heading text-base font-bold text-text-primary">
            Upcoming Events ({upcoming.length})
          </h2>
          {upcoming.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-slate-300 p-8 text-center">
              <p className="text-sm text-slate-500">No upcoming registrations.</p>
              <Link to="/events" className="mt-2 inline-block text-xs font-semibold text-accent-navy hover:underline">
                Browse events →
              </Link>
            </div>
          ) : (
            upcoming.map((reg) => <RegistrationCard key={reg.registration_id} reg={reg} />)
          )}

          {past.length > 0 && (
            <>
              <h2 className="font-heading text-base font-bold text-slate-400 mt-6">
                Past Events ({past.length})
              </h2>
              {past.map((reg) => <RegistrationCard key={reg.registration_id} reg={reg} past />)}
            </>
          )}
        </div>
      )}

      {/* No results */}
      {!student && searched && !loading && !error && (
        <div className="rounded-2xl border border-dashed border-slate-200 p-10 text-center text-sm text-slate-400">
          No results yet.
        </div>
      )}
    </div>
  )
}

function RegistrationCard({ reg, past = false }: { reg: Registration; past?: boolean }) {
  return (
    <Link
      to={`/events/${reg.event_id}`}
      className={`block rounded-2xl border p-4 transition-all hover:-translate-y-0.5 hover:shadow-md ${
        past ? 'border-slate-100 bg-slate-50 opacity-70' : 'border-slate-200 bg-white shadow-sm'
      }`}
    >
      <div className="flex items-start gap-4">
        <div className={`flex h-12 w-12 flex-shrink-0 flex-col items-center justify-center rounded-xl text-white ${past ? 'bg-slate-300' : 'bg-accent-navy'}`}>
          <span className="text-[9px] font-semibold uppercase">
            {new Date(reg.event_date).toLocaleString('en-US', { month: 'short' })}
          </span>
          <span className="text-lg font-extrabold leading-none">
            {new Date(reg.event_date).getDate()}
          </span>
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-heading text-sm font-bold text-text-primary truncate">{reg.event_name}</p>
          <div className="mt-1 flex flex-wrap gap-x-3 gap-y-1 text-xs text-slate-500">
            <span className="flex items-center gap-1">
              <Calendar className="h-3 w-3" /> {formatDate(reg.event_date)}
            </span>
            <span className="flex items-center gap-1">
              <Clock className="h-3 w-3" /> {formatTime(reg.event_date)}
            </span>
          </div>
          <div className="mt-1 flex items-center gap-1 text-xs text-slate-400">
            <MapPin className="h-3 w-3 flex-shrink-0" />
            <span className="truncate">{reg.location.split(',')[0]}</span>
          </div>
        </div>
        <span className={`flex-shrink-0 rounded-full px-2.5 py-1 text-[11px] font-semibold ${Number(reg.cost) === 0 ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>
          {Number(reg.cost) === 0 ? 'Free' : `$${Number(reg.cost).toFixed(2)}`}
        </span>
      </div>
    </Link>
  )
}
