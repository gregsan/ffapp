import { SUMMARY, formatUah } from "@/lib/budget-data"
import { cn } from "@/lib/utils"

type Stat = {
  label: string
  value: string
  sub?: string
  subLabel?: string
  subClass?: string
  highlight?: boolean
}

const stats: Stat[] = [
  {
    label: "Остаток на начало",
    value: formatUah(SUMMARY.openingBalance),
  },
  {
    label: "Приход",
    value: formatUah(SUMMARY.incomePlan),
    sub: formatUah(SUMMARY.incomeFact),
    subLabel: "факт",
    subClass: "text-muted-foreground",
  },
  {
    label: "Расход",
    value: formatUah(SUMMARY.expensePlan),
    sub: formatUah(SUMMARY.expenseFact),
    subLabel: "факт",
    subClass: "text-muted-foreground",
  },
  {
    label: "Свободный остаток",
    value: formatUah(SUMMARY.freeBalance),
    highlight: true,
  },
  {
    label: "Остаток на конец",
    value: "—",
  },
]

export function SummaryCards() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
      {stats.map((stat) => (
        <div
          key={stat.label}
          className={cn(
            "rounded-lg border border-border bg-card p-3.5 flex flex-col gap-1",
            stat.highlight && "border-primary/30 bg-accent"
          )}
        >
          <p className="text-[11px] font-medium text-muted-foreground uppercase tracking-wide leading-tight">
            {stat.label}
          </p>
          <p
            className={cn(
              "text-[17px] font-semibold tabular-nums leading-tight",
              stat.highlight ? "text-accent-foreground" : "text-foreground"
            )}
          >
            {stat.value}
          </p>
          {stat.sub !== undefined && (
            <p className={cn("text-xs tabular-nums", stat.subClass)}>
              <span className="text-muted-foreground/70">{stat.subLabel}: </span>
              {stat.sub}
            </p>
          )}
        </div>
      ))}
    </div>
  )
}
