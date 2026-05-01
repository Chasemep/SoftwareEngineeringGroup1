/**
 * Campus Map Page — wraps the existing Leaflet campus map MVP.
 * Preserves all existing AppShell / map interaction behavior.
 */
import { AppShell } from '../app/AppShell'

export function CampusMapPage() {
  return (
    <div className="-mx-4 -my-6 lg:-mx-6">
      <AppShell />
    </div>
  )
}
