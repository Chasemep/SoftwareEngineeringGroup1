import { describe, expect, it } from 'vitest'
import { useMapStore } from '../src/state/useMapStore'

describe('selection state', () => {
  it('sets selected and focused feature when requesting focus', () => {
    const baseline = useMapStore.getState().focusRevision
    useMapStore.getState().requestFeatureFocus('hammond-porter-hall')

    const next = useMapStore.getState()
    expect(next.selectedFeatureId).toBe('hammond-porter-hall')
    expect(next.focusedFeatureId).toBe('hammond-porter-hall')
    expect(next.focusRevision).toBe(baseline + 1)
  })

  it('increments focus revision even on repeated feature focus', () => {
    const baseline = useMapStore.getState().focusRevision
    useMapStore.getState().requestFeatureFocus('hammond-porter-hall')
    const next = useMapStore.getState()
    expect(next.focusRevision).toBe(baseline + 1)
  })
})
