import {
  Building2,
  CarFront,
  Home,
} from 'lucide-react'
import type { CategoryConfig } from '../../models/campus'

export const hammondCategories: CategoryConfig[] = [
  {
    id: 'building',
    label: 'Buildings',
    description: 'Academic and administrative campus buildings',
    defaultEnabled: true,
    colorToken: 'var(--color-accent-navy)',
    icon: Building2,
  },
  {
    id: 'parking',
    label: 'Parking',
    description: 'Surface lots and the 169th Street parking garage',
    defaultEnabled: true,
    colorToken: 'var(--color-focus)',
    icon: CarFront,
  },
  {
    id: 'residence',
    label: 'Residence',
    description: 'Student housing locations near the Hammond campus',
    defaultEnabled: true,
    colorToken: 'var(--color-warning)',
    icon: Home,
  },
]
