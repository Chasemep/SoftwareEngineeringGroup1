/**
 * TypeScript model interfaces for the PNW Event Management System.
 * These mirror the MySQL schema and API response shapes.
 */

// ─── Database Models ──────────────────────────────────────────────────────────

export interface Event {
  id: number
  name: string
  description: string
  event_date: string          // ISO 8601 string from MySQL DATETIME
  cost: number
  location: string
  latitude: number | null
  longitude: number | null
  registration_count?: number
  created_at?: string
}

export interface Student {
  id: number
  first_name: string
  middle_name: string | null
  last_name: string
  student_id: string          // PNW student ID string, e.g. "0012345678"
  email: string | null
  created_at?: string
}

export interface Registration {
  registration_id: number
  registered_at: string
  event_id: number
  event_name: string
  description: string
  event_date: string
  cost: number
  location: string
}

export interface ParkingLot {
  id: number
  name: string
  location: string
  distance_ft: number
  walk_time_min: number
  latitude: number | null
  longitude: number | null
  notes: string | null
}

// ─── Route / OSRM ────────────────────────────────────────────────────────────

export interface GeoJsonLineString {
  type: 'LineString'
  coordinates: [number, number][]   // [lon, lat] pairs
}

export interface RouteResult {
  distance_miles: number
  distance_km: number
  duration_seconds: number
  duration_human: string
  geometry: GeoJsonLineString
}

// ─── API Request Payloads ─────────────────────────────────────────────────────

export interface RegistrationPayload {
  first_name: string
  middle_name?: string
  last_name: string
  student_id: string
  email?: string
  event_id: number
}

export interface RoutePayload {
  student_address: string
  event_location: string
}

// ─── API Response Shapes ──────────────────────────────────────────────────────

export interface EventsResponse {
  events: Event[]
}

export interface EventDetailResponse {
  event: Event
}

export interface RegistrationResponse {
  message: string
  registration: {
    id: number
    student_id: string
    student_name: string
    event_id: number
    event_name: string
    event_date: string
    registered_at: string
  }
}

export interface StudentDashboardResponse {
  student: Student
  registrations: Registration[]
}

export interface ParkingResponse {
  event: { id: number; name: string; location: string }
  parking_lots: ParkingLot[]
  count: number
}

export interface RouteResponse {
  origin: { address: string; displayName: string; lat: number; lon: number }
  destination: { address: string; displayName: string; lat: number; lon: number }
  route: RouteResult
}
