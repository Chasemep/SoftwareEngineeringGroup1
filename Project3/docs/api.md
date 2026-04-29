# PNW Student Life Event Management System — API Documentation

**Base URL (local):** `http://localhost:3001`

All responses are `application/json`. All POST request bodies must be `Content-Type: application/json`.

---

## Events

### `GET /events`

List all events, sorted ascending by date by default.

**Query Parameters:**

| Param    | Type   | Required | Description                        |
|----------|--------|----------|------------------------------------|
| `search` | string | No       | Full-text search across name, description, location |
| `date`   | string | No       | Filter by exact date `YYYY-MM-DD`  |
| `sort`   | string | No       | `date` (default) or `name`         |

**Success Response — 200:**
```json
{
  "events": [
    {
      "id": 1,
      "name": "Welcome Week Kickoff BBQ",
      "description": "...",
      "event_date": "2025-08-25T11:00:00.000Z",
      "cost": 0.00,
      "location": "Student Union and Library Building (SULB) Outdoor Patio, Hammond Campus",
      "latitude": 41.58448,
      "longitude": -87.47421,
      "registration_count": 12
    }
  ]
}
```

---

### `GET /events/:id`

Get a single event by its numeric ID.

**Success Response — 200:**
```json
{
  "event": { /* same shape as above */ }
}
```

**Error Response — 404:**
```json
{ "error": "Event with ID 99 not found" }
```

---

### `POST /events`

Create a new event.

**Request Body:**
```json
{
  "name": "Study Break Social",
  "description": "Free snacks and games in the SULB Atrium.",
  "event_date": "2026-04-10T14:00:00",
  "cost": 0,
  "location": "SULB Atrium, Hammond Campus",
  "latitude": 41.58448,
  "longitude": -87.47421
}
```

**Success Response — 201:**
```json
{
  "event": { /* full event object with generated id */ },
  "message": "Event created successfully"
}
```

**Validation Error — 422:**
```json
{
  "errors": [
    { "msg": "Event name is required", "path": "name" }
  ]
}
```

---

## Students

### `POST /students/register`

Register a student for an event. Upserts the student record (creates if new, reuses if existing). Prevents duplicate registrations.

**Request Body:**
```json
{
  "first_name": "Jane",
  "middle_name": "Marie",
  "last_name": "Doe",
  "student_id": "0012345678",
  "email": "jdoe@pnw.edu",
  "event_id": 1
}
```

**Success Response — 201:**
```json
{
  "message": "Registration successful",
  "registration": {
    "id": 42,
    "student_id": "0012345678",
    "student_name": "Jane Marie Doe",
    "event_id": 1,
    "event_name": "Welcome Week Kickoff BBQ",
    "event_date": "2025-08-25T11:00:00.000Z",
    "registered_at": "2025-08-01T10:30:00.000Z"
  }
}
```

**Duplicate Registration — 409:**
```json
{ "error": "Student is already registered for this event" }
```

---

### `GET /students/:studentId`

Look up a student by their PNW Student ID string and return their registered events.

**URL Parameter:** `:studentId` — e.g. `0012345678`

**Success Response — 200:**
```json
{
  "student": {
    "id": 5,
    "first_name": "Jane",
    "middle_name": "Marie",
    "last_name": "Doe",
    "student_id": "0012345678",
    "email": "jdoe@pnw.edu"
  },
  "registrations": [
    {
      "registration_id": 42,
      "registered_at": "2025-08-01T10:30:00.000Z",
      "event_id": 1,
      "event_name": "Welcome Week Kickoff BBQ",
      "description": "...",
      "event_date": "2025-08-25T11:00:00.000Z",
      "cost": 0.00,
      "location": "SULB Outdoor Patio, Hammond Campus"
    }
  ]
}
```

---

## Parking

### `GET /parking/:eventId`

Return parking lots associated with the specified event. Falls back to general campus lots if no event-specific lots are configured.

**Success Response — 200:**
```json
{
  "event": {
    "id": 1,
    "name": "Welcome Week Kickoff BBQ",
    "location": "SULB Outdoor Patio, Hammond Campus"
  },
  "parking_lots": [
    {
      "id": 6,
      "name": "North 173rd Street Parking (SULB Access)",
      "location": "N 173rd St, Hammond Campus",
      "distance_ft": 400,
      "walk_time_min": 3,
      "latitude": 41.58168,
      "longitude": -87.47541,
      "notes": "Closest lot to SULB Outdoor Patio. Enter from 173rd Street."
    }
  ],
  "count": 2
}
```

---

## Routes

### `POST /routes/calculate`

Geocode two addresses with Nominatim (OpenStreetMap) and compute the driving route via OSRM. Returns route geometry as a GeoJSON LineString suitable for Leaflet.

**Request Body:**
```json
{
  "student_address": "123 Main St, Munster, IN 46321",
  "event_location": "2200 169th St, Hammond, IN 46323"
}
```

**Success Response — 200:**
```json
{
  "origin": {
    "address": "123 Main St, Munster, IN 46321",
    "displayName": "123 Main Street, Munster, Lake County, Indiana, 46321, United States",
    "lat": 41.553,
    "lon": -87.512
  },
  "destination": {
    "address": "2200 169th St, Hammond, IN 46323",
    "displayName": "Purdue University Northwest...",
    "lat": 41.584,
    "lon": -87.475
  },
  "route": {
    "distance_miles": 4.2,
    "distance_km": 6.76,
    "duration_seconds": 540,
    "duration_human": "9 min",
    "geometry": {
      "type": "LineString",
      "coordinates": [
        [-87.512, 41.553],
        [-87.498, 41.563],
        "..."
      ]
    }
  }
}
```

**Geocode Failure — 422:**
```json
{ "error": "Could not geocode address: \"Nowhere, ZZ\"" }
```

---

## Health Check

### `GET /health`

```json
{
  "status": "ok",
  "service": "pnw-events-api",
  "timestamp": "2026-04-29T17:00:00.000Z"
}
```
