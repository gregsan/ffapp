import { SUMMARY, FUNDS, formatUah } from "@/lib/budget-data"
import { cn } from "@/lib/utils"

function FillBar({ pct }: { pct: number }) {
  const color = pct >= 80 ? "bg-success" : pct >= 40 ? "bg-warning" : "bg-destructive"
  return (
    <div className="flex-1 h-1.5 rounded-full bg-muted overflow-hidden">
      <div className={cn("h-full rounded-full", color)} style={{ width: `${Math.min(pct, 100)}%` }} />
    </div>
  )
}

interface MobileSummaryViewProps {
  onAdd?: () => void
}

export function MobileSummaryView({ onAdd }: MobileSummaryViewProps) {
  const mandatoryFunds = FUNDS.filter((f) => f.mandatory)

  return (
    <div className="px-4 py-5 space-y-5">
      <div>
        <h1 className="text-lg font-semibold text-foreground">Март 2026</h1>
        <p className="text-xs text-muted-foreground">Семейный бюджет</p>
      </div>

      {/* 2×2 summary grid */}
      <div className="grid grid-cols-2 gap-3">
        <StatCard label="Приход план" value={formatUah(SUMMARY.incomePlan)} />
        <StatCard label="Приход факт" value={formatUah(SUMMARY.incomeFact)} muted />
        <StatCard label="Расход план" value={formatUah(SUMMARY.expensePlan)} />
        <StatCard label="Расход факт" value={formatUah(SUMMARY.expenseFact)} muted />
      </div>

      {/* Free balance */}
      <div className="rounded-lg border border-primary/30 bg-accent px-4 py-3">
        <p className="text-xs text-muted-foreground uppercase tracking-wide font-medium">Свободный остаток</p>
        <p className="text-xl font-semibold tabular-nums text-accent-foreground mt-0.5">
          {formatUah(SUMMARY.freeBalance)}
        </p>
      </div>

      {/* Mandatory funds */}
      <div>
        <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground/70 mb-2">
          Обязательные фонды
        </p>
        <div className="space-y-2.5">
          {mandatoryFunds.map((fund) => {
            const total = fund.rows.reduce((s, r) => s + r.planUah, 0)
            const pct = fund.fill
            return (
              <div key={fund.id} className="rounded-lg border border-border bg-card px-4 py-3">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[13px] font-medium text-foreground">{fund.name}</span>
                  <span className="text-xs tabular-nums text-muted-foreground">{formatUah(total)}</span>
                </div>
                <div className="flex items-center gap-2">
                  <FillBar pct={pct} />
                  <span className="text-xs text-muted-foreground w-8 text-right">{pct}%</span>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

function StatCard({ label, value, muted }: { label: string; value: string; muted?: boolean }) {
  return (
    <div className="rounded-lg border border-border bg-card px-3.5 py-3">
      <p className="text-[11px] font-medium text-muted-foreground uppercase tracking-wide leading-tight">{label}</p>
      <p className={cn("text-[15px] font-semibold tabular-nums mt-1", muted ? "text-muted-foreground" : "text-foreground")}>
        {value}
      </p>
    </div>
  )
}
