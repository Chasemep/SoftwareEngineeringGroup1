import { Compass, Layers3, Menu } from 'lucide-react'
import { useMapStore } from '../../state/useMapStore'

interface TopNavProps {
  onOpenMobileDrawer: () => void
}

const PURDUE_LOGO_URL = 'https://engineering.purdue.edu/ECE/Communications/files/PU-V-Full-RGB.png'

export function TopNav({ onOpenMobileDrawer }: TopNavProps) {
  const selectedFeatureId = useMapStore((state) => state.selectedFeatureId)

  return (
    <header className="border-b border-[#9d7316] bg-accent-gold shadow-panelSm">
      <div className="mx-auto flex h-[74px] w-full max-w-[1600px] items-center justify-between gap-3 px-4 sm:px-6 lg:px-8">
        <div className="flex min-w-0 items-center gap-3.5">
          <button
            type="button"
            className="interactive-transition inline-flex h-10 w-10 items-center justify-center rounded-control border border-[#9d7316] bg-white/88 text-text-primary hover:-translate-y-0.5 hover:border-accent-navy/35 hover:bg-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus lg:hidden"
            aria-label="Open map controls"
            onClick={onOpenMobileDrawer}
          >
            <Menu className="h-5 w-5" />
          </button>
          <div className="flex items-center gap-3.5">
            <div className="flex h-11 w-14 items-center justify-center rounded-control border border-[#9d7316] bg-white/92 shadow-panelSm">
              <img
                src={PURDUE_LOGO_URL}
                alt="Purdue University logo"
                className="h-9 w-9 object-contain"
              />
            </div>
            <div className="min-w-0 space-y-0.5">
              <p className="truncate font-heading text-base font-semibold tracking-tight text-[#22170a]">
                Purdue University Northwest
              </p>
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1.5 rounded-full border border-[#9d7316] bg-[#f6e7bf] px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wide text-[#4f3808]">
                  <Layers3 className="h-3.5 w-3.5 text-[#4f3808]" />
                  Hammond Campus Map
                </span>
                <p className="hidden truncate text-xs text-[#4f3808]/85 sm:block">
                  Buildings, parking, and student housing
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 rounded-control border border-[#9d7316] bg-white/82 px-3 py-2 text-xs font-semibold text-[#4f3808] shadow-panelSm">
          <Compass className="h-4 w-4 text-accent-navy" />
          <span className="inline-flex items-center gap-2">
            <span
              className={`inline-block h-2 w-2 rounded-full ${selectedFeatureId ? 'bg-success' : 'bg-slate-300'}`}
              aria-hidden="true"
            />
            {selectedFeatureId ? 'Feature selected' : 'No selection'}
          </span>
        </div>
      </div>
    </header>
  )
}
