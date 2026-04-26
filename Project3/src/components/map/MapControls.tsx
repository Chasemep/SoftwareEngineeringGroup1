import { Maximize2, Minus, Plus } from 'lucide-react'
import { useMap } from 'react-leaflet'
import { hammondCampusConfig } from '../../data/hammond/campusConfig'

export function MapControls() {
  const map = useMap()

  return (
    <div className="pointer-events-none absolute right-4 top-14 z-[500] flex flex-col gap-2 sm:top-16">
      <div className="pointer-events-auto overflow-hidden rounded-[16px] border border-slate-300/90 bg-white/94 shadow-panelMd panel-blur">
        <button
          type="button"
          onClick={() => map.zoomIn()}
          className="interactive-transition flex h-11 w-11 items-center justify-center border-b border-slate-200 text-text-primary hover:bg-surface-muted focus-visible:outline focus-visible:outline-2 focus-visible:outline-focus"
          aria-label="Zoom in"
        >
          <Plus className="h-4.5 w-4.5 text-accent-navy" />
        </button>
        <button
          type="button"
          onClick={() => map.zoomOut()}
          className="interactive-transition flex h-11 w-11 items-center justify-center text-text-primary hover:bg-surface-muted focus-visible:outline focus-visible:outline-2 focus-visible:outline-focus"
          aria-label="Zoom out"
        >
          <Minus className="h-4.5 w-4.5 text-accent-navy" />
        </button>
      </div>

      <button
        type="button"
        onClick={() =>
          map.fitBounds(hammondCampusConfig.initialBounds, {
            animate: true,
            duration: 0.85,
            padding: [32, 32],
          })
        }
        className="interactive-transition pointer-events-auto inline-flex h-11 w-11 items-center justify-center rounded-full border border-slate-300/90 bg-white/94 text-text-primary shadow-panelMd panel-blur hover:-translate-y-0.5 hover:border-accent-navy/45 hover:bg-surface-muted focus-visible:outline focus-visible:outline-2 focus-visible:outline-focus"
        aria-label="Reset view"
        title="Reset view"
      >
        <Maximize2 className="h-4 w-4 text-accent-navy" />
      </button>
    </div>
  )
}
