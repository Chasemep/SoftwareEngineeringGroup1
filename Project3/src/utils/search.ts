import Fuse from 'fuse.js'
import type { CampusFeature } from '../models/campus'

const SEARCH_LIMIT = 8

export function searchFeatures(features: CampusFeature[], query: string): CampusFeature[] {
  const trimmed = query.trim()
  if (!trimmed) {
    return []
  }

  const fuse = new Fuse(features, {
    includeScore: true,
    threshold: 0.34,
    keys: [
      { name: 'name', weight: 0.5 },
      { name: 'code', weight: 0.25 },
      { name: 'tags', weight: 0.2 },
      { name: 'category', weight: 0.05 },
    ],
  })

  return fuse
    .search(trimmed, { limit: SEARCH_LIMIT })
    .map((result) => result.item)
}
