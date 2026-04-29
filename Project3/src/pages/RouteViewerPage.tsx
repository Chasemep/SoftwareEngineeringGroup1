import { useState, useEffect, useRef } from 'react'
import { useSearchParams } from 'react-router-dom'
import { MapContainer, TileLayer, Polyline, Marker, Popup, useMap } from 'react-leaflet'
import L from 'leaflet'
import { Navigation, Clock, Ruler, AlertCircle, Loader2 } from 'lucide-react'
import { calculateRoute } from '../services/api'
import type { RouteResponse } from '../models/event'
import 'leaflet/dist/leaflet.css'

// Fix Leaflet default marker icons in Vite builds
delete (L.Icon.Default.prototype as unknown as Record<string, unknown>)._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl:       'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl:     'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
})

/** Helper: converts GeoJSON [lon, lat] pairs → Leaflet [lat, lon] */
function geoJsonToLatLng(coords: [number, number][]): [number, number][] {
  return coords.map(([lon, lat]) => [lat, lon])
}

/** Inner component that fits the map to the route bounds */
function MapFit({ positions }: { positions: [number, number][] }) {
  const map = useMap()
  useEffect(() => {
    if (positions.length > 1) {
      map.fitBounds(positions, { padding: [40, 40] })
    }
  }, [map, positions])
  return null
}

/**
 * Route Viewer Page
 * Geocodes student address + event location via backend (Nominatim/OSRM)
 * and renders the driving route on a Leaflet map.
 */
export function RouteViewerPage() {
  const [searchParams] = useSearchParams()
  const prefilledLocation = searchParams.get('location') || ''

  const [studentAddress,  setStudentAddress]  = useState('')
  const [eventLocation,   setEventLocation]   = useState(prefilledLocation)
  const [result,          setResult]          = useState<RouteResponse | null>(null)
  const [loading,         setLoading]         = useState(false)
  const [error,           setError]           = useState('')

  const mapRef = useRef<L.Map | null>(null)

  async function handleCalculate(e: React.FormEvent) {
    e.preventDefault()
    if (!studentAddress.trim() || !eventLocation.trim()) return
    setLoading(true)
    setError('')
    setResult(null)

    try {
      const res = await calculateRoute({
        student_address: studentAddress.trim(),
        event_location:  eventLocation.trim(),
      })
      setResult(res)
    } catch (err: unknown) {
      const axiosErr = err as { response?: { data?: { error?: string } } }
      setError(axiosErr?.response?.data?.error || 'Could not calculate route. Check your addresses and try again.')
    } finally {
      setLoading(false)
    }
  }

  const routePositions: [number, number][] = result
    ? geoJsonToLatLng(result.route.geometry.coordinates)
    : []

  const originPos:      [number, number] | null = result ? [result.origin.lat,      result.origin.lon]      : null
  const destinationPos: [number, number] | null = result ? [result.destination.lat, result.destination.lon] : null

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="font-heading text-2xl font-extrabold text-text-primary">Route Calculator</h1>
        <p className="mt-1 text-sm text-slate-500">
          Enter your home address and an event location to get driving directions via OpenStreetMap.
        </p>
      </div>

      {/* Form */}
      <form onSubmit={handleCalculate} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="student-address" className="mb-1.5 block text-xs font-semibold text-slate-700">
              Your Address <span className="text-red-500">*</span>
            </label>
            <input
              id="student-address"
              type="text"
              value={studentAddress}
              onChange={(e) => setStudentAddress(e.target.value)}
              placeholder="e.g. 123 Main St, Munster, IN"
              required
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm outline-none focus:border-accent-navy/50 focus:ring-2 focus:ring-accent-navy/20"
            />
          </div>
          <div>
            <label htmlFor="event-location" className="mb-1.5 block text-xs font-semibold text-slate-700">
              Event Location <span className="text-red-500">*</span>
            </label>
            <input
              id="event-location"
              type="text"
              value={eventLocation}
              onChange={(e) => setEventLocation(e.target.value)}
              placeholder="e.g. 2200 169th St, Hammond, IN 46323"
              required
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm outline-none focus:border-accent-navy/50 focus:ring-2 focus:ring-accent-navy/20"
            />
          </div>
        </div>
        <button
          type="submit"
          disabled={loading}
          className="flex items-center gap-2 rounded-xl bg-accent-navy px-6 py-3 text-sm font-bold text-white hover:brightness-110 disabled:opacity-60 transition-all"
        >
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Navigation className="h-4 w-4" />}
          {loading ? 'Calculating…' : 'Get Directions'}
        </button>
      </form>

      {/* Error */}
      {error && (
        <div className="flex gap-3 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-600">
          <AlertCircle className="h-5 w-5 flex-shrink-0 mt-0.5" />
          <p>{error}</p>
        </div>
      )}

      {/* Route results */}
      {result && (
        <>
          {/* Stats */}
          <div className="grid grid-cols-3 gap-4">
            {[
              { icon: Ruler, label: 'Distance', value: `${result.route.distance_miles} mi`, sub: `${result.route.distance_km} km` },
              { icon: Clock, label: 'Drive Time', value: result.route.duration_human, sub: 'estimated' },
              { icon: Navigation, label: 'Route Type', value: 'Driving', sub: 'via OSRM' },
            ].map(({ icon: Icon, label, value, sub }) => (
              <div key={label} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm text-center">
                <Icon className="mx-auto mb-2 h-5 w-5 text-accent-navy" />
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">{label}</p>
                <p className="font-heading text-xl font-extrabold text-text-primary">{value}</p>
                <p className="text-[11px] text-slate-400">{sub}</p>
              </div>
            ))}
          </div>

          {/* From / To labels */}
          <div className="grid gap-3 sm:grid-cols-2 text-xs">
            <div className="rounded-xl border border-slate-100 bg-slate-50 p-3">
              <p className="font-semibold text-slate-500 uppercase tracking-wide text-[10px]">From</p>
              <p className="mt-1 text-slate-700">{result.origin.displayName}</p>
            </div>
            <div className="rounded-xl border border-slate-100 bg-slate-50 p-3">
              <p className="font-semibold text-slate-500 uppercase tracking-wide text-[10px]">To</p>
              <p className="mt-1 text-slate-700">{result.destination.displayName}</p>
            </div>
          </div>

          {/* Map */}
          <div className="h-[420px] overflow-hidden rounded-2xl border border-slate-200 shadow-sm">
            <MapContainer
              center={originPos ?? [41.5847, -87.4752]}
              zoom={12}
              style={{ height: '100%', width: '100%' }}
              ref={mapRef}
            >
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://openstreetmap.org">OpenStreetMap</a> contributors'
              />
              {routePositions.length > 0 && (
                <>
                  <MapFit positions={routePositions} />
                  <Polyline positions={routePositions} color="#1E2A5E" weight={5} opacity={0.85} />
                  {originPos && (
                    <Marker position={originPos}>
                      <Popup>📍 Your location</Popup>
                    </Marker>
                  )}
                  {destinationPos && (
                    <Marker position={destinationPos}>
                      <Popup>🎓 Event location</Popup>
                    </Marker>
                  )}
                </>
              )}
            </MapContainer>
          </div>
        </>
      )}
    </div>
  )
}
