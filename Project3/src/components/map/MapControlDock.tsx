import { useMemo, useState } from 'react'
import clsx from 'clsx'
import { Info, Layers3, Search, X } from 'lucide-react'
import { SearchPanel } from '../sidebar/SearchPanel'
import { CategoryList } from '../sidebar/CategoryList'
import { CampusInfoPanel } from '../sidebar/CampusInfoPanel'

type DockPanelId = 'search' | 'layers' | 'info'

const dockPanels = [
  { id: 'search' as const, label: 'Search', icon: Search },
  { id: 'layers' as const, label: 'Layers', icon: Layers3 },
  { id: 'info' as const, label: 'Campus', icon: Info },
]

function renderPanelContent(panelId: DockPanelId) {
  if (panelId === 'search') {
    return <SearchPanel />
  }

  if (panelId === 'layers') {
    return <CategoryList />
  }

  return <CampusInfoPanel />
}

export function MapControlDock() {
  const [activePanel, setActivePanel] = useState<DockPanelId | null>(null)

  const currentPanel = useMemo(
    () => dockPanels.find((panel) => panel.id === activePanel) ?? null,
    [activePanel],
  )

  return (
    <div className="pointer-events-none absolute left-4 top-20 z-[520] hidden items-start lg:flex">
      <div className="pointer-events-auto flex flex-col gap-2">
        {dockPanels.map((panel) => {
          const Icon = panel.icon
          const active = panel.id === activePanel

          return (
            <button
              key={panel.id}
              type="button"
              onClick={() => setActivePanel(active ? null : panel.id)}
              aria-label={panel.label}
              aria-pressed={active}
              title={panel.label}
              className={clsx(
                'interactive-transition inline-flex h-12 w-12 items-center justify-center rounded-full border shadow-panelMd panel-blur',
                active
                  ? 'border-accent-navy/35 bg-accent-navy text-white'
                  : 'border-slate-300/90 bg-white/92 text-text-primary hover:-translate-y-0.5 hover:border-accent-navy/35 hover:bg-surface-muted',
              )}
            >
              <Icon className="h-5 w-5" aria-hidden="true" />
            </button>
          )
        })}
      </div>

      <div
        className={clsx(
          'ml-3 flex w-[360px] max-w-[calc(100vw-8.5rem)] flex-col gap-2 transition-all duration-200',
          currentPanel ? 'translate-x-0 opacity-100' : 'pointer-events-none -translate-x-3 opacity-0',
        )}
      >
        {currentPanel ? (
          <>
            <div className="pointer-events-auto inline-flex items-center gap-2 self-start rounded-full border border-slate-300/85 bg-white/92 px-3 py-2 text-xs font-semibold uppercase tracking-[0.12em] text-text-secondary shadow-panelSm panel-blur">
              <currentPanel.icon className="h-3.5 w-3.5 text-accent-navy" aria-hidden="true" />
              <span>{currentPanel.label}</span>
              <button
                type="button"
                onClick={() => setActivePanel(null)}
                className="interactive-transition inline-flex h-6 w-6 items-center justify-center rounded-full border border-slate-200 bg-white text-text-secondary hover:border-accent-navy/35 hover:text-text-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-focus"
                aria-label={`Close ${currentPanel.label.toLowerCase()} panel`}
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </div>

            <div className="pointer-events-auto max-h-[calc(100vh-220px)] overflow-y-auto pr-1">
              {renderPanelContent(currentPanel.id)}
            </div>
          </>
        ) : null}
      </div>
    </div>
  )
}
