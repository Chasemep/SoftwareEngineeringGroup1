import type { LucideIcon } from 'lucide-react'

export type CampusId = 'hammond'

export type CategoryId =
  | 'building'
  | 'parking'
  | 'residence'

export type GeometryType = 'point' | 'polygon'
export type MapBadgeId = 'running'

export type PointCoordinates = [number, number]
export type PolygonCoordinates = PointCoordinates[]

export interface CampusFeature {
  id: string
  campus: CampusId
  name: string
  code?: string
  category: CategoryId
  type: GeometryType
  coordinates: PointCoordinates | PolygonCoordinates
  shortDescription: string
  tags: string[]
  locationNote?: string
  accessibilityInfo?: string
  mapBadge?: MapBadgeId
  isPlaceholderData: boolean
}

export interface CategoryConfig {
  id: CategoryId
  label: string
  description: string
  defaultEnabled: boolean
  colorToken: string
  icon: LucideIcon
}

export interface CampusConfig {
  campusId: CampusId
  displayName: string
  center: PointCoordinates
  defaultZoom: number
  minZoom: number
  initialBounds: [PointCoordinates, PointCoordinates]
  maxBounds: [PointCoordinates, PointCoordinates]
}
