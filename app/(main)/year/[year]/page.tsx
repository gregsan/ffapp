"use client"

import { use } from "react"
import Link from "next/link"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts"
import { YEAR_MONTHLY_DATA, YEAR_TOTALS, formatUah } from "@/lib/budget-data"
import { cn } from "@/lib/utils"

interface PageProps {
  params: Promise<{ year: string }>
}

const COLORS = {
  incomePlan: "var(--color-chart-2)",
  incomeFact: "var(--color-chart-1)",
  expensePlan: "var(--color-chart-4)",
  expenseFact: "var(--color-chart-3)",
}

function formatK(v: number) {
  if (v >= 1000) return `${Math.round(v / 1000)}k`
  return String(v)
}

export default function YearPage({ params }: PageProps) {
  const { year } = use(params)

  const chartData = YEAR_MONTHLY_DATA.map((m) => ({
    name: m.monthRu,
    "Приход план": m.incomePlan,
    "Приход факт": m.incomeFact,
    "Расход план": m.expensePlan,
    "Расход факт": m.expenseFact,
  }))

  return (
    <div className="px-6 py-5 space-y-6">
      {/* Heading */}
      <div>
        <h1 className="text-lg font-semibold text-foreground">Годовой обзор {year}</h1>
        <p className="text-xs text-muted-foreground mt-0.5">Сводная аналитика за {year} год</p>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <SummaryCard label="Приход план" value={formatUah(YEAR_TOTALS.incomePlan)} />
        <SummaryCard label="Приход факт" value={formatUah(YEAR_TOTALS.incomeFact)} muted />
        <SummaryCard label="Расход план" value={formatUah(YEAR_TOTALS.expensePlan)} />
        <SummaryCard label="Накоплено" value={formatUah(YEAR_TOTALS.savedFact)} highlight />
      </div>

      {/* Bar chart */}
      <div className="rounded-lg border border-border bg-card overflow-hidden">
        <div className="px-4 py-3 border-b border-border">
          <h2 className="text-sm font-semibold text-foreground">Приход и расход по месяцам</h2>
          <p className="text-xs text-muted-foreground mt-0.5">Плановые vs фактические значения, ₴</p>
        </div>
        <div className="p-4">
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={chartData} barCategoryGap="30%" barGap={2}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
              <XAxis
                dataKey="name"
                tick={{ fontSize: 12, fill: "var(--muted-foreground)" }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tickFormatter={formatK}
                tick={{ fontSize: 11, fill: "var(--muted-foreground)" }}
                axisLine={false}
                tickLine={false}
                width={36}
              />
              <Tooltip
                formatter={(v: number) => [formatUah(v), ""]}
                contentStyle={{
                  fontSize: 12,
                  borderRadius: 8,
                  border: "1px solid var(--border)",
                  background: "var(--card)",
                  color: "var(--card-foreground)",
                }}
                cursor={{ fill: "var(--muted)", opacity: 0.4 }}
              />
              <Legend
                iconType="circle"
                iconSize={8}
                formatter={(value) => (
                  <span style={{ fontSize: 12, color: "var(--muted-foreground)" }}>{value}</span>
                )}
              />
              <Bar dataKey="Приход план" fill={COLORS.incomePlan} radius={[3, 3, 0, 0]} />
              <Bar dataKey="Приход факт" fill={COLORS.incomeFact} radius={[3, 3, 0, 0]} />
              <Bar dataKey="Расход план" fill={COLORS.expensePlan} radius={[3, 3, 0, 0]} />
              <Bar dataKey="Расход факт" fill={COLORS.expenseFact} radius={[3, 3, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Monthly breakdown table */}
      <div className="rounded-lg border border-border bg-card overflow-hidden">
        <div className="px-4 py-3 border-b border-border">
          <h2 className="text-sm font-semibold text-foreground">По месяцам</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/40">
                <th className="text-left px-4 py-2.5 text-xs font-medium text-muted-foreground">Месяц</th>
                <th className="text-right px-4 py-2.5 text-xs font-medium text-muted-foreground">Приход план</th>
                <th className="text-right px-4 py-2.5 text-xs font-medium text-muted-foreground">Приход факт</th>
                <th className="text-right px-4 py-2.5 text-xs font-medium text-muted-foreground">Расход план</th>
                <th className="text-right px-4 py-2.5 text-xs font-medium text-muted-foreground">Расход факт</th>
                <th className="text-right px-4 py-2.5 text-xs font-medium text-muted-foreground">Остаток</th>
                <th className="w-10" />
              </tr>
            </thead>
            <tbody>
              {YEAR_MONTHLY_DATA.map((m, i) => {
                const surplus = m.hasData ? m.incomeFact - m.expenseFact : null
                return (
                  <tr
                    key={m.slug}
                    className={cn(
                      "border-b border-border/40 last:border-b-0",
                      i % 2 === 1 && "bg-muted/15"
                    )}
                  >
                    <td className="px-4 py-2.5">
                      <span className={cn("text-[13px] font-medium", m.hasData ? "text-foreground" : "text-muted-foreground")}>
                        {m.monthRu}
                      </span>
                      {!m.hasData && (
                        <span className="ml-2 text-[10px] text-muted-foreground/60">план</span>
                      )}
                    </td>
                    <td className="text-right px-4 py-2.5 tabular-nums text-[13px] text-muted-foreground">
                      {formatUah(m.incomePlan)}
                    </td>
                    <td className="text-right px-4 py-2.5 tabular-nums text-[13px] text-foreground">
                      {m.hasData ? formatUah(m.incomeFact) : "—"}
                    </td>
                    <td className="text-right px-4 py-2.5 tabular-nums text-[13px] text-muted-foreground">
                      {formatUah(m.expensePlan)}
                    </td>
                    <td className="text-right px-4 py-2.5 tabular-nums text-[13px] text-foreground">
                      {m.hasData ? formatUah(m.expenseFact) : "—"}
                    </td>
                    <td className={cn(
                      "text-right px-4 py-2.5 tabular-nums text-[13px] font-medium",
                      surplus != null && surplus >= 0 ? "text-success" : "text-destructive"
                    )}>
                      {surplus != null ? formatUah(surplus) : "—"}
                    </td>
                    <td className="px-3 py-2.5 text-right">
                      <Link
                        href={`/${year}/${m.slug}`}
                        className="text-xs text-primary hover:underline whitespace-nowrap"
                      >
                        Открыть
                      </Link>
                    </td>
                  </tr>
                )
              })}
            </tbody>
            <tfoot>
              <tr className="border-t-2 border-border bg-muted/30 font-semibold">
                <td className="px-4 py-2.5 text-xs text-muted-foreground uppercase tracking-wide">Итого</td>
                <td className="text-right px-4 py-2.5 tabular-nums text-[13px] text-muted-foreground">
                  {formatUah(YEAR_TOTALS.incomePlan)}
                </td>
                <td className="text-right px-4 py-2.5 tabular-nums text-[13px] text-foreground">
                  {formatUah(YEAR_TOTALS.incomeFact)}
                </td>
                <td className="text-right px-4 py-2.5 tabular-nums text-[13px] text-muted-foreground">
                  {formatUah(YEAR_TOTALS.expensePlan)}
                </td>
                <td className="text-right px-4 py-2.5 tabular-nums text-[13px] text-foreground">
                  {formatUah(YEAR_TOTALS.expenseFact)}
                </td>
                <td className="text-right px-4 py-2.5 tabular-nums text-[13px] font-semibold text-success">
                  {formatUah(YEAR_TOTALS.savedFact)}
                </td>
                <td />
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    </div>
  )
}

function SummaryCard({
  label,
  value,
  muted,
  highlight,
}: {
  label: string
  value: string
  muted?: boolean
  highlight?: boolean
}) {
  return (
    <div
      className={cn(
        "rounded-lg border border-border bg-card p-3.5 flex flex-col gap-1",
        highlight && "border-primary/30 bg-accent"
      )}
    >
      <p className="text-[11px] font-medium text-muted-foreground uppercase tracking-wide leading-tight">
        {label}
      </p>
      <p
        className={cn(
          "text-[17px] font-semibold tabular-nums leading-tight",
          highlight ? "text-accent-foreground" : muted ? "text-muted-foreground" : "text-foreground"
        )}
      >
        {value}
      </p>
    </div>
  )
}
