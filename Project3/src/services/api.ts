/**
 * Typed API service layer using Axios.
 * All backend calls go through this module.
 * Base URL is injected via Vite env variable (VITE_API_BASE_URL).
 */

import axios from 'axios'
import type {
  Event,
  EventsResponse,
  EventDetailResponse,
  RegistrationPayload,
  RegistrationResponse,
  StudentDashboardResponse,
  ParkingResponse,
  RoutePayload,
  RouteResponse,
} from '../models/event'

// Create axios instance pointing at backend
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001',
  headers: { 'Content-Type': 'application/json' },
  timeout: 15000,
})

// ─── Events ──────────────────────────────────────────────────────────────────

export interface EventFilters {
  search?: string
  date?: string
  sort?: 'date' | 'name'
}

export async function fetchEvents(filters: EventFilters = {}): Promise<EventsResponse> {
  const { data } = await api.get<EventsResponse>('/events', { params: filters })
  return data
}

export async function fetchEvent(id: number | string): Promise<EventDetailResponse> {
  const { data } = await api.get<EventDetailResponse>(`/events/${id}`)
  return data
}

export async function createEvent(payload: Partial<Event>): Promise<EventDetailResponse> {
  const { data } = await api.post<EventDetailResponse>('/events', payload)
  return data
}

// ─── Students ────────────────────────────────────────────────────────────────

export async function registerStudent(payload: RegistrationPayload): Promise<RegistrationResponse> {
  const { data } = await api.post<RegistrationResponse>('/students/register', payload)
  return data
}

export async function fetchStudentDashboard(studentId: string): Promise<StudentDashboardResponse> {
  const { data } = await api.get<StudentDashboardResponse>(`/students/${studentId}`)
  return data
}

// ─── Parking ─────────────────────────────────────────────────────────────────

export async function fetchParking(eventId: number | string): Promise<ParkingResponse> {
  const { data } = await api.get<ParkingResponse>(`/parking/${eventId}`)
  return data
}

// ─── Routes ──────────────────────────────────────────────────────────────────

export async function calculateRoute(payload: RoutePayload): Promise<RouteResponse> {
  const { data } = await api.post<RouteResponse>('/routes/calculate', payload)
  return data
}

export default api
