import { describe, expect, it } from 'vitest'
import { hammondFeatures } from '../src/data/hammond/features'
import { searchFeatures } from '../src/utils/search'

describe('searchFeatures', () => {
  it('returns ranked matches for building-related query', () => {
    const results = searchFeatures(hammondFeatures, 'porter')
    expect(results.length).toBeGreaterThan(0)
    expect(results.some((item) => item.id === 'hammond-porter-hall')).toBe(true)
  })

  it('matches building codes directly', () => {
    const results = searchFeatures(hammondFeatures, 'ANDR')
    expect(results.some((item) => item.id === 'hammond-anderson-building')).toBe(true)
  })

  it('returns empty array when query is blank', () => {
    expect(searchFeatures(hammondFeatures, '')).toEqual([])
    expect(searchFeatures(hammondFeatures, '   ')).toEqual([])
  })
})
