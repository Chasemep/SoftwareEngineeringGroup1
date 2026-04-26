import { Fragment } from 'react'
import { divIcon } from 'leaflet'
import { CircleMarker, Marker, Polygon, Tooltip } from 'react-leaflet'
import type { CampusFeature } from '../../models/campus'
import { getCategoryColor, getFeatureCenter } from '../../utils/map'

interface MapFeatureLayerProps {
  features: CampusFeature[]
  selectedFeatureId: string | null
  onFeatureClick: (featureId: string) => void
}

export function MapFeatureLayer({
  features,
  selectedFeatureId,
  onFeatureClick,
}: MapFeatureLayerProps) {
  return (
    <>
      {features.map((feature) => {
        const selected = selectedFeatureId === feature.id
        const color = getCategoryColor(feature.category)
        const badgeIcon =
          feature.mapBadge === 'running'
            ? divIcon({
                className: 'map-feature-badge-icon',
                html: `<div class="map-feature-badge ${selected ? 'is-selected' : ''}" aria-hidden="true">🏃</div>`,
                iconSize: [32, 32],
                iconAnchor: [16, 16],
              })
            : null

        if (feature.type === 'point') {
          return (
            <CircleMarker
              key={feature.id}
              center={feature.coordinates as [number, number]}
              radius={selected ? 10 : 7.5}
              pathOptions={{
                color,
                weight: selected ? 4 : 2.2,
                fillColor: color,
                fillOpacity: selected ? 0.95 : 0.7,
              }}
              eventHandlers={{
                click: () => onFeatureClick(feature.id),
                mouseover: (event) => {
                  if (!selected) {
                    event.target.setStyle({ weight: 3, fillOpacity: 0.82 })
                    event.target.setRadius(8.5)
                  }
                },
                mouseout: (event) => {
                  if (!selected) {
                    event.target.setStyle({ weight: 2.2, fillOpacity: 0.7 })
                    event.target.setRadius(7.5)
                  }
                },
              }}
            >
              <Tooltip>{feature.name}</Tooltip>
            </CircleMarker>
          )
        }

        return (
          <Fragment key={feature.id}>
            <Polygon
              positions={feature.coordinates as [number, number][]}
              pathOptions={{
                color,
                weight: selected ? 3.8 : 2.3,
                fillOpacity: selected ? 0.42 : 0.23,
              }}
              eventHandlers={{
                click: () => onFeatureClick(feature.id),
                mouseover: (event) => {
                  if (!selected) {
                    event.target.setStyle({ weight: 3, fillOpacity: 0.3 })
                  }
                },
                mouseout: (event) => {
                  if (!selected) {
                    event.target.setStyle({ weight: 2.3, fillOpacity: 0.23 })
                  }
                },
              }}
            >
              <Tooltip>{feature.code ? `${feature.code} • ${feature.name}` : feature.name}</Tooltip>
            </Polygon>
            {badgeIcon ? (
              <Marker
                position={getFeatureCenter(feature)}
                icon={badgeIcon}
                zIndexOffset={selected ? 800 : 600}
                eventHandlers={{ click: () => onFeatureClick(feature.id) }}
              >
                <Tooltip>{feature.code ? `${feature.code} • ${feature.name}` : feature.name}</Tooltip>
              </Marker>
            ) : null}
          </Fragment>
        )
      })}
    </>
  )
}
