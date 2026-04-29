# PNW Student Life Event Management System

This project transforms the initial Hammond Campus Map MVP into a full-stack **Student Life Event Management System** for Purdue University Northwest.

It includes a Node.js/Express REST API, a MySQL database, and a React frontend, all orchestrated via Docker Compose.

---

## Features

- **Browse Events:** Search and filter upcoming student life events.
- **Event Registration:** Students can register for events using their PNW Student ID.
- **Student Dashboard:** Look up a student by ID to see their upcoming and past registrations.
- **Parking Suggestions:** Automatically see recommended parking lots and walking times on event detail pages.
- **Route Calculator:** Enter a home address and an event location to get driving directions and an interactive route map (powered by OpenStreetMap/OSRM).
- **Campus Map:** The original interactive 2D Hammond campus map is preserved on its own dedicated tab.

---

## Tech Stack

- **Frontend:** React 19, TypeScript, Vite, React Router, Tailwind CSS, Zustand, React Leaflet.
- **Backend:** Node.js 20, Express, `mysql2`, `express-validator`, Axios.
- **Database:** MySQL 8.0.
- **DevOps:** Docker, Docker Compose, Nginx.
- **External APIs:** OpenStreetMap (Nominatim) for geocoding, OSRM for route calculation (no API keys required).

---

## Project Structure

```text
Project3/
├── backend/                  # Node.js REST API
│   ├── src/                  # Express app, routes, middleware, db connection
│   ├── package.json          # Backend dependencies
│   └── Dockerfile            # Multi-stage Node image
├── database/                 # MySQL setup
│   ├── schema.sql            # Table definitions (events, students, registrations, parking)
│   └── seed.sql              # 10 realistic PNW events + parking lots
├── docs/                     # Documentation
│   ├── api.md                # REST API endpoints & payloads
│   └── uml.md                # UML diagrams (Class, ER, Sequence) & Flowcharts
├── src/                      # React Frontend
│   ├── app/                  # App routing and layout shell (NavShell)
│   ├── pages/                # Home, EventList, EventDetail, Registration, Dashboard, etc.
│   ├── services/             # Axios API integration
│   ├── models/               # TypeScript interfaces matching DB & API
│   └── components/           # Existing map components
├── package.json              # Frontend dependencies
├── Dockerfile.frontend       # Multi-stage Vite build + Nginx server
├── docker-compose.yml        # Full-stack local orchestration
└── README.md                 # This file
```

---

## Getting Started (Docker Compose)

The easiest way to run the entire system is using Docker Compose. This will build the frontend, backend, start a MySQL database, and automatically seed it with PNW events.

### Prerequisites
- [Docker](https://www.docker.com/get-started) installed and running.

### 1. Build and Start the System

Open your terminal in the `Project3` directory and run:

```bash
docker compose up --build
```

*(This may take a few minutes the first time as it downloads the Node, MySQL, and Nginx base images).*

### 2. Access the Application

Once the terminal output settles down and says `database system is ready to accept connections` and the backend logs `MySQL connected successfully`:

- **Frontend Web App:** [http://localhost:3000](http://localhost:3000)
- **Backend REST API:** [http://localhost:3001](http://localhost:3001)
- **Adminer (DB Viewer):** [http://localhost:8081](http://localhost:8081)
  - *System:* MySQL
  - *Server:* `mysql`
  - *Username:* `pnwuser`
  - *Password:* `pnwpass`
  - *Database:* `pnw_events`

### 3. Stop the System

To stop the running containers gracefully, press `Ctrl+C` in the terminal where they are running.

To remove the containers entirely (but keep your database volume):
```bash
docker compose down
```

To remove the containers **and wipe the database** (so it seeds fresh next time):
```bash
docker compose down -v
```

---

## Local Development (Without Docker)

If you prefer to run the Node and React servers directly on your host machine for faster development iterations:

1. **Start a standalone MySQL database** (you can still use docker for just the DB):
   ```bash
   docker run -d -p 3306:3306 -e MYSQL_DATABASE=pnw_events -e MYSQL_ROOT_PASSWORD=rootsecret -e MYSQL_USER=pnwuser -e MYSQL_PASSWORD=pnwpass --name pnw_db_dev mysql:8.0
   ```
   *Note: You will need to manually run `database/schema.sql` and `database/seed.sql` against this DB instance if running it outside of compose.*

2. **Run the Backend:**
   ```bash
   cd backend
   npm install
   npm run dev
   ```

3. **Run the Frontend:**
   Open a new terminal tab:
   ```bash
   npm install
   npm run dev
   ```
   Access the frontend at `http://localhost:5173`.
