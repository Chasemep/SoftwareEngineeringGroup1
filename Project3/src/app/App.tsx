import { Routes, Route } from 'react-router-dom'
import { NavShell } from './NavShell'
import { HomePage } from '../pages/HomePage'
import { EventListPage } from '../pages/EventListPage'
import { EventDetailPage } from '../pages/EventDetailPage'
import { RegistrationFormPage } from '../pages/RegistrationFormPage'
import { StudentDashboardPage } from '../pages/StudentDashboardPage'
import { RouteViewerPage } from '../pages/RouteViewerPage'
import { CampusMapPage } from '../pages/CampusMapPage'

/**
 * Root application router.
 * All pages are wrapped in <NavShell> which provides the top navigation bar.
 */
export function App() {
  return (
    <NavShell>
      <Routes>
        <Route path="/"            element={<HomePage />} />
        <Route path="/events"      element={<EventListPage />} />
        <Route path="/events/:id"  element={<EventDetailPage />} />
        <Route path="/register"    element={<RegistrationFormPage />} />
        <Route path="/students/:studentId" element={<StudentDashboardPage />} />
        <Route path="/routes"      element={<RouteViewerPage />} />
        <Route path="/map"         element={<CampusMapPage />} />
        {/* Catch-all redirect */}
        <Route path="*"            element={<HomePage />} />
      </Routes>
    </NavShell>
  )
}
