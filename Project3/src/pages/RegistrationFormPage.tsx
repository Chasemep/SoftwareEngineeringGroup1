import { useEffect, useState } from 'react'
import { useSearchParams, Link } from 'react-router-dom'
import { CheckCircle, AlertCircle, ArrowLeft } from 'lucide-react'
import { fetchEvents } from '../services/api'
import { registerStudent } from '../services/api'
import type { Event } from '../models/event'

interface FormState {
  first_name: string
  middle_name: string
  last_name: string
  student_id: string
  email: string
  event_id: string
}

const EMPTY_FORM: FormState = {
  first_name: '', middle_name: '', last_name: '',
  student_id: '', email: '', event_id: '',
}

/**
 * Student Registration Form Page
 * Supports pre-filling eventId from URL query param (?eventId=N)
 */
export function RegistrationFormPage() {
  const [searchParams] = useSearchParams()
  const prefilledEventId = searchParams.get('eventId') || ''

  const [form,     setForm]     = useState<FormState>({ ...EMPTY_FORM, event_id: prefilledEventId })
  const [events,   setEvents]   = useState<Event[]>([])
  const [loading,  setLoading]  = useState(false)
  const [success,  setSuccess]  = useState<string | null>(null)
  const [error,    setError]    = useState<string | null>(null)
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({})

  // Load events for the dropdown
  useEffect(() => {
    fetchEvents({ sort: 'date' })
      .then((res) => setEvents(res.events))
      .catch(console.error)
  }, [])

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
    // Clear field-level error on change
    setFieldErrors((prev) => ({ ...prev, [name]: '' }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setSuccess(null)
    setFieldErrors({})
    setLoading(true)

    try {
      const payload = {
        first_name:  form.first_name.trim(),
        middle_name: form.middle_name.trim() || undefined,
        last_name:   form.last_name.trim(),
        student_id:  form.student_id.trim(),
        email:       form.email.trim() || undefined,
        event_id:    parseInt(form.event_id, 10),
      }
      const res = await registerStudent(payload)
      setSuccess(`✅ Registered! ${res.registration.student_name} is now registered for "${res.registration.event_name}" on ${new Date(res.registration.event_date).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}.`)
      setForm({ ...EMPTY_FORM, event_id: prefilledEventId })
    } catch (err: unknown) {
      // Handle validation errors array
      const axiosErr = err as { response?: { data?: { errors?: { msg: string; path: string }[]; error?: string } } }
      const data = axiosErr?.response?.data
      if (data?.errors) {
        const fe: Record<string, string> = {}
        data.errors.forEach((e) => { fe[e.path] = e.msg })
        setFieldErrors(fe)
      } else {
        setError(data?.error || 'Registration failed. Please try again.')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="mx-auto max-w-xl space-y-6">
      {/* Back */}
      <Link to="/events" className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-500 hover:text-accent-navy transition-colors">
        <ArrowLeft className="h-4 w-4" /> Back to Events
      </Link>

      <div>
        <h1 className="font-heading text-2xl font-extrabold text-text-primary">Event Registration</h1>
        <p className="mt-1 text-sm text-slate-500">Fill in your details to register for a PNW Student Life event.</p>
      </div>

      {/* Success banner */}
      {success && (
        <div className="flex gap-3 rounded-2xl border border-green-200 bg-green-50 p-4 text-sm text-green-700">
          <CheckCircle className="h-5 w-5 flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold">Registration Confirmed</p>
            <p className="mt-1">{success}</p>
            <Link to="/events" className="mt-2 inline-block text-xs font-semibold text-green-800 hover:underline">
              View more events →
            </Link>
          </div>
        </div>
      )}

      {/* Error banner */}
      {error && (
        <div className="flex gap-3 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-600">
          <AlertCircle className="h-5 w-5 flex-shrink-0 mt-0.5" />
          <p>{error}</p>
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-5 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

        {/* Event selector */}
        <div>
          <label htmlFor="event_id" className="mb-1.5 block text-xs font-semibold text-slate-700">
            Select Event <span className="text-red-500">*</span>
          </label>
          <select
            id="event_id"
            name="event_id"
            value={form.event_id}
            onChange={handleChange}
            required
            className={`w-full rounded-xl border px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-accent-navy/20 ${fieldErrors.event_id ? 'border-red-400 bg-red-50' : 'border-slate-200 bg-slate-50'}`}
          >
            <option value="">— Choose an event —</option>
            {events.map((e) => (
              <option key={e.id} value={e.id}>
                {e.name} — {new Date(e.event_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
              </option>
            ))}
          </select>
          {fieldErrors.event_id && <p className="mt-1 text-[11px] text-red-500">{fieldErrors.event_id}</p>}
        </div>

        {/* Name row */}
        <div className="grid gap-3 sm:grid-cols-3">
          {[
            { id: 'first_name',  label: 'First Name',         required: true  },
            { id: 'middle_name', label: 'Middle Name',        required: false },
            { id: 'last_name',   label: 'Last Name',          required: true  },
          ].map(({ id, label, required }) => (
            <div key={id}>
              <label htmlFor={id} className="mb-1.5 block text-xs font-semibold text-slate-700">
                {label} {required && <span className="text-red-500">*</span>}
              </label>
              <input
                id={id}
                name={id}
                type="text"
                value={form[id as keyof FormState]}
                onChange={handleChange}
                required={required}
                className={`w-full rounded-xl border px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-accent-navy/20 ${fieldErrors[id] ? 'border-red-400 bg-red-50' : 'border-slate-200 bg-slate-50'}`}
              />
              {fieldErrors[id] && <p className="mt-1 text-[11px] text-red-500">{fieldErrors[id]}</p>}
            </div>
          ))}
        </div>

        {/* Student ID */}
        <div>
          <label htmlFor="student_id" className="mb-1.5 block text-xs font-semibold text-slate-700">
            PNW Student ID <span className="text-red-500">*</span>
          </label>
          <input
            id="student_id"
            name="student_id"
            type="text"
            value={form.student_id}
            onChange={handleChange}
            required
            placeholder="e.g. 0012345678"
            className={`w-full rounded-xl border px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-accent-navy/20 ${fieldErrors.student_id ? 'border-red-400 bg-red-50' : 'border-slate-200 bg-slate-50'}`}
          />
          {fieldErrors.student_id && <p className="mt-1 text-[11px] text-red-500">{fieldErrors.student_id}</p>}
        </div>

        {/* Email */}
        <div>
          <label htmlFor="email" className="mb-1.5 block text-xs font-semibold text-slate-700">
            Email <span className="text-slate-400 font-normal">(optional)</span>
          </label>
          <input
            id="email"
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            placeholder="you@pnw.edu"
            className={`w-full rounded-xl border px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-accent-navy/20 ${fieldErrors.email ? 'border-red-400 bg-red-50' : 'border-slate-200 bg-slate-50'}`}
          />
          {fieldErrors.email && <p className="mt-1 text-[11px] text-red-500">{fieldErrors.email}</p>}
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-xl bg-accent-navy py-3 text-sm font-bold text-white shadow hover:brightness-110 disabled:opacity-60 transition-all"
        >
          {loading ? 'Registering…' : 'Register for Event'}
        </button>

        <p className="text-center text-xs text-slate-400">
          Already registered?{' '}
          <Link to="/students/lookup" className="font-semibold text-accent-navy hover:underline">
            View My Dashboard
          </Link>
        </p>
      </form>
    </div>
  )
}
