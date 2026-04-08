# Frontend

This folder contains a Next.js frontend for the Spring Boot backend in `../backend/course-management-backend`.

## Features

- Loads the student roster from the backend
- Creates students through the existing `POST /api/students` endpoint
- Shows roster stats from `GET /api/students/stats`
- Deletes students with `DELETE /api/students/{id}`
- Proxies browser requests through Next.js route handlers so the UI does not depend on browser CORS setup

## Setup

1. Install dependencies:

   ```bash
   npm install
   ```

2. Copy the example environment file:

   ```bash
   cp .env.example .env.local
   ```

3. Start the Spring backend from `../backend/course-management-backend`:

   ```bash
   ./gradlew bootRun
   ```

4. Start the Next.js frontend from this folder:

   ```bash
   npm run dev
   ```

5. Open `http://localhost:3000`.

## Environment

- `SPRING_API_BASE_URL`
  Default: `http://localhost:8080`

  This is used by the Next.js proxy routes in `app/api`.
