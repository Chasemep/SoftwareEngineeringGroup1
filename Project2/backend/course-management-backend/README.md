# Course Management Backend

A RESTful backend for a course management system built with Spring Boot. It stores student records and course scores, and exposes API endpoints for a React frontend.

## Tech Stack

- Java
- Spring Boot
- Spring Data JPA (Hibernate)
- H2 database (Prototyping purposes only) / MySQL database 
- Gradle
- Docker

## Running the App

### Dev (H2 in-memory database)

```bash
./gradlew bootRun
```

- The app starts on `http://localhost:8080` with an embedded H2 database. No external DB needed.
- The OpenAPI/Swagger documentation UI is available at `http://localhost:8080/swagger-ui/index.html`.

H2 console: `http://localhost:8080/h2-console` (JDBC URL: `jdbc:h2:mem:coursedb`, user: `sa`, no password)

### Run with Docker and start the database (MySQL)

```bash
docker compose up --build
```

This starts both MySQL and the Spring Boot app. The API is available on `http://localhost:8080`.

To stop and remove volumes:

```bash
docker compose down -v
```

### Tests

```bash
./gradlew test
```

All tests run against H2 — no MySQL required.

## API Endpoints

Base path: `/api/students`

| Method | Path     | Description                        |
|--------|----------|------------------------------------|
| POST   | `/`      | Create a new student               |
| GET    | `/`      | List all students (sorted by ID)   |
| GET    | `/stats` | Get count and average score        |
| GET    | `/{id}`  | Get a student by database ID       |
| DELETE | `/{id}`  | Delete a student by database ID    |

### Example: Create a student

```bash
curl -X POST http://localhost:8080/api/students \
  -H "Content-Type: application/json" \
  -d '{"studentId": 3, "firstName": "Jane", "middleName": "A", "lastName": "Doe", "score": 87.5}'
```

### Example: Get stats

```bash
curl http://localhost:8080/api/students/stats
```

```json
{
  "count": 5,
  "averageScore": 85.4
}
```

## Validation

- `studentId`: required, 1-10
- `firstName`, `lastName`: required, not blank
- `middleName`: optional
- `score`: required, 0.0-100.0

Invalid requests return `400` with field-level errors. Duplicate `studentId` returns `409`.
