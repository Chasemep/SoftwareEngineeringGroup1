import type { CampusConfig } from '../../models/campus'

export const hammondCampusConfig: CampusConfig = {
  campusId: 'hammond',
  displayName: 'PNW Hammond Campus',
  center: [41.58555, -87.4742],
  defaultZoom: 16,
  minZoom: 16,
  initialBounds: [
    [41.5827, -87.47575],
    [41.58815, -87.47195],
  ],
  maxBounds: [
    [41.57755, -87.47595],
    [41.58835, -87.4706],
  ],
}
