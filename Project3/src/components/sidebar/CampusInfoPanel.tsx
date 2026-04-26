export function CampusInfoPanel() {
  return (
    <section className="surface-card overflow-hidden rounded-panel border border-slate-200/90 shadow-panelMd">
      <div className="hero-banner relative h-28 w-full" role="img" aria-label="PNW Hammond campus overview">
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/35 to-transparent" />
        <div className="absolute bottom-3 left-3 inline-flex items-center gap-1.5 rounded-full border border-white/45 bg-white/20 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide text-white panel-blur">
          Hammond Campus
        </div>
      </div>

      <div className="space-y-3 border-t border-slate-200/70 p-3.5">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-text-secondary">
            Campus Control Center
          </p>
          <h1 className="font-heading text-[1.28rem] font-semibold leading-tight text-text-primary">
            PNW Hammond Map
          </h1>
        </div>

        <div className="flex flex-wrap gap-1.5">
          <span className="rounded-full border border-accent-gold/45 bg-accent-gold-soft/85 px-2.5 py-1 text-[11px] font-semibold text-[#63460a]">
            Official buildings
          </span>
          <span className="rounded-full border border-focus/35 bg-accent-navy-soft/70 px-2.5 py-1 text-[11px] font-semibold text-accent-navy">
            Parking + housing
          </span>
        </div>

        <p className="text-xs leading-relaxed text-text-secondary">
          Building, parking, and housing areas are drawn from the coordinates you collected so selection lands on a visible campus footprint.
        </p>

        <div className="rounded-card border border-slate-200/90 bg-white/85 p-3 shadow-softInset">
          <p className="font-heading text-base font-semibold text-text-primary">Purdue University Northwest</p>
          <p className="mt-1 text-xs text-text-secondary">
            Hammond Main Campus: 2200 169th Street, Hammond, IN 46323
          </p>
          <p className="mt-2 rounded-control border border-slate-200 bg-surface-muted/80 px-2 py-1 text-[11px] text-text-secondary">
            Area outlines are campus focus shapes derived from the building centers and parking anchors currently available.
          </p>
        </div>
      </div>
    </section>
  )
}
