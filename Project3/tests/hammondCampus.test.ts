import { describe, expect, it } from 'vitest'
import { hammondCampusConfig } from '../src/data/hammond/campusConfig'
import { hammondCategories } from '../src/data/hammond/categories'
import { hammondFeatures } from '../src/data/hammond/features'

describe('Hammond campus student-facing configuration', () => {
  it('uses only non-placeholder building, parking, and residence categories', () => {
    expect(hammondCategories.map((category) => category.id)).toEqual(['building', 'parking', 'residence'])
    expect(hammondFeatures.every((feature) => feature.isPlaceholderData === false)).toBe(true)
    expect(hammondFeatures.every((feature) => feature.type === 'polygon')).toBe(true)
    expect(hammondFeatures).toHaveLength(22)
  })

  it('includes collected building codes, gym badge, and housing coordinates', () => {
    expect(
      hammondFeatures
        .filter((feature) => feature.category === 'building')
        .filter((feature) => feature.code)
        .map((feature) => feature.code),
    ).toEqual(['ANDR', 'CLO', 'GYTE', 'SULB', 'NILS', 'PWRS', 'POTT', 'PORT', 'LAWS'])
    expect(
      hammondFeatures.find((feature) => feature.id === 'hammond-fitness-recreation-center')?.mapBadge,
    ).toBe('running')
    expect(
      hammondFeatures
        .filter((feature) => feature.category === 'residence')
        .map((feature) => feature.name),
    ).toEqual(['Student Housing - 173rd Street East', 'Student Housing - 173rd Street West'])
  })

  it('keeps the initial view on the main academic core while allowing the full campus extent', () => {
    expect(hammondCampusConfig.minZoom).toBe(16)
    expect(hammondCampusConfig.defaultZoom).toBe(16)
    expect(hammondCampusConfig.initialBounds).toEqual([
      [41.5827, -87.47575],
      [41.58815, -87.47195],
    ])
    expect(hammondCampusConfig.maxBounds).toEqual([
      [41.57755, -87.47595],
      [41.58835, -87.4706],
    ])
  })
})
