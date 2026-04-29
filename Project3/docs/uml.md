# PNW Student Life Event Management System — UML & Architecture

## 1. Use Case Diagram

**Actors:**
- **Student**: Can view events, view parking, calculate routes, register for events, and view their own dashboard.
- **System / Admin** *(Implied)*: Can create events via the POST API.

**Use Cases:**
1. **Browse Events**: Filter by date, search by name, sort results.
2. **View Event Details**: See cost, location, description, and attendance count.
3. **Register for Event**: Input name and student ID to reserve a spot.
4. **View My Dashboard**: Look up registered events by Student ID.
5. **Get Parking Info**: Automatically see recommended parking lots on an event's detail page.
6. **Calculate Route**: Input home address and event location to get driving directions via OSRM.

*(Visual generation: You can copy these use cases into a tool like Draw.io or Lucidchart to generate a visual use case diagram).*

---

## 2. Class Diagram (Models)

```mermaid
classDiagram
    class Event {
        +int id
        +string name
        +string description
        +datetime event_date
        +decimal cost
        +string location
        +decimal latitude
        +decimal longitude
        +int registration_count
    }

    class Student {
        +int id
        +string first_name
        +string middle_name
        +string last_name
        +string student_id
        +string email
    }

    class Registration {
        +int id
        +int student_id
        +int event_id
        +timestamp registered_at
    }

    class ParkingLot {
        +int id
        +string name
        +string location
        +int event_id
        +int distance_ft
        +int walk_time_min
        +string notes
    }

    Event "1" -- "*" Registration : has
    Student "1" -- "*" Registration : makes
    Event "1" -- "*" ParkingLot : recommended_for
```

---

## 3. Sequence Diagram (Registration Flow)

```mermaid
sequenceDiagram
    actor Student
    participant React UI
    participant Express API
    participant MySQL DB

    Student->>React UI: Clicks "Register" on Event
    Student->>React UI: Fills out form (Name, Student ID) & Submits
    React UI->>Express API: POST /students/register {first_name, student_id, event_id...}
    
    Express API->>MySQL DB: START TRANSACTION
    Express API->>MySQL DB: SELECT * FROM events WHERE id = event_id
    MySQL DB-->>Express API: Event exists
    
    Express API->>MySQL DB: SELECT * FROM students WHERE student_id = ?
    alt Student Exists
        MySQL DB-->>Express API: Returns existing Student ID (DB pk)
    else Student is New
        Express API->>MySQL DB: INSERT INTO students...
        MySQL DB-->>Express API: Returns new Student ID (DB pk)
    end
    
    Express API->>MySQL DB: SELECT * FROM registrations WHERE student_id = ? AND event_id = ?
    alt Registration Exists
        MySQL DB-->>Express API: Found duplicate
        Express API->>MySQL DB: ROLLBACK
        Express API-->>React UI: 409 Conflict "Already registered"
        React UI-->>Student: Displays error message
    else No duplicate
        Express API->>MySQL DB: INSERT INTO registrations...
        Express API->>MySQL DB: COMMIT
        Express API-->>React UI: 201 Created (Success)
        React UI-->>Student: Displays success banner & confirmation
    end
```

---

## 4. Entity Relationship (ER) Diagram (Database)

```mermaid
erDiagram
    events {
        INT id PK
        VARCHAR name
        TEXT description
        DATETIME event_date
        DECIMAL cost
        VARCHAR location
        DECIMAL latitude
        DECIMAL longitude
    }
    
    students {
        INT id PK
        VARCHAR first_name
        VARCHAR middle_name
        VARCHAR last_name
        VARCHAR student_id UK
        VARCHAR email
    }
    
    registrations {
        INT id PK
        INT student_id FK
        INT event_id FK
        TIMESTAMP registered_at
    }
    
    parking_lots {
        INT id PK
        VARCHAR name
        VARCHAR location
        INT event_id FK
        INT distance_ft
        INT walk_time_min
    }

    students ||--o{ registrations : "registers"
    events ||--o{ registrations : "receives"
    events ||--o{ parking_lots : "has_recommended"
```

---

## 5. Flowcharts

### Route Calculation Flow
1. **Start**: User navigates to `/routes`.
2. **Input**: User enters home address and event location.
3. **Submit**: React app calls `POST /routes/calculate`.
4. **Geocode 1**: Backend calls Nominatim API to convert home address to Lat/Lon.
5. **Geocode 2**: Backend calls Nominatim API to convert event location to Lat/Lon.
6. **Route Calculation**: Backend calls OSRM API with the two sets of coordinates.
7. **Process**: Backend extracts distance, duration, and GeoJSON polyline.
8. **Return**: API sends JSON back to frontend.
9. **Render**: React-Leaflet draws the polyline on the map and displays stats.
10. **End**.

### Parking Lookup Flow
1. **Start**: User navigates to an event detail page (`/events/:id`).
2. **Fetch Event**: React app calls `GET /events/:id`.
3. **Fetch Parking**: React app calls `GET /parking/:id`.
4. **DB Query**: Backend queries `parking_lots` where `event_id = :id`.
5. **Check Result**: 
   - *If lots found*: Return event-specific lots.
   - *If no lots found*: Query general campus lots (`event_id IS NULL`) and return those as fallback.
6. **Render**: React displays parking cards ordered by distance (closest first).
7. **End**.
