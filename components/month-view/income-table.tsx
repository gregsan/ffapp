"use client"

import { INCOME_ROWS, formatUah } from "@/lib/budget-data"
import { Plus } from "lucide-react"

interface IncomeTableProps {
  onAddIncome?: () => void
}

export function IncomeTable({ onAddIncome }: IncomeTableProps) {
  const totalPlan = INCOME_ROWS.reduce((s, r) => s + r.planUah, 0)
  const totalFact = INCOME_ROWS.reduce((s, r) => s + r.factUah, 0)

  return (
    <div className="rounded-lg border border-border bg-card overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-border">
        <div className="flex items-center gap-3">
          <h2 className="text-sm font-semibold text-foreground">Приход</h2>
          <span className="text-xs text-muted-foreground">
            план: <span className="font-medium tabular-nums text-foreground">{formatUah(totalPlan)}</span>
          </span>
          <span className="text-xs text-muted-foreground">
            факт: <span className="font-medium tabular-nums text-foreground">{formatUah(totalFact)}</span>
          </span>
        </div>
        <button
          onClick={onAddIncome}
          className="flex items-center gap-1.5 text-xs font-medium text-primary hover:underline"
        >
          <Plus className="w-3.5 h-3.5" />
          Добавить приход
        </button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-muted/40">
              <th className="text-left px-4 py-2 text-xs font-medium text-muted-foreground whitespace-nowrap" rowSpan={2}>
                Наименование
              </th>
              <th className="text-center px-2 py-1 text-xs font-medium text-muted-foreground border-b border-border/60 border-l" colSpan={3}>
                План
              </th>
              <th className="text-center px-2 py-1 text-xs font-medium text-muted-foreground border-b border-border/60 border-l" colSpan={3}>
                Факт
              </th>
            </tr>
            <tr className="border-b border-border bg-muted/40">
              <th className="text-right px-3 py-1.5 text-xs font-medium text-muted-foreground border-l border-border/60 whitespace-nowrap">Дата</th>
              <th className="text-right px-3 py-1.5 text-xs font-medium text-muted-foreground whitespace-nowrap">Сумма</th>
              <th className="text-right px-3 py-1.5 text-xs font-medium text-muted-foreground whitespace-nowrap">Сумма ₴</th>
              <th className="text-right px-3 py-1.5 text-xs font-medium text-muted-foreground border-l border-border/60 whitespace-nowrap">Дата</th>
              <th className="text-right px-3 py-1.5 text-xs font-medium text-muted-foreground whitespace-nowrap">Сумма</th>
              <th className="text-right px-3 py-1.5 text-xs font-medium text-muted-foreground whitespace-nowrap">Сумма ₴</th>
            </tr>
          </thead>
          <tbody>
            {INCOME_ROWS.map((row, i) => (
              <tr
                key={row.id}
                className={i % 2 === 1 ? "bg-muted/20" : ""}
              >
                <td className="px-4 py-2 font-medium text-foreground whitespace-nowrap">{row.name}</td>
                <td className="text-right px-3 py-2 tabular-nums text-muted-foreground border-l border-border/40 whitespace-nowrap">
                  {row.planDate ?? "—"}
                </td>
                <td className="text-right px-3 py-2 tabular-nums text-foreground whitespace-nowrap">
                  {row.planAmount ? `${row.planAmount} ${row.planCurrency}` : "—"}
                </td>
                <td className="text-right px-3 py-2 tabular-nums font-medium text-foreground whitespace-nowrap">
                  {row.planUah > 0 ? formatUah(row.planUah) : "—"}
                </td>
                <td className="text-right px-3 py-2 tabular-nums text-muted-foreground border-l border-border/40 whitespace-nowrap">
                  {row.factDate ?? "—"}
                </td>
                <td className="text-right px-3 py-2 tabular-nums text-muted-foreground whitespace-nowrap">—</td>
                <td className="text-right px-3 py-2 tabular-nums text-muted-foreground whitespace-nowrap">0 ₴</td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr className="border-t border-border bg-muted/30 font-semibold">
              <td className="px-4 py-2 text-xs text-muted-foreground uppercase tracking-wide">Итого</td>
              <td className="border-l border-border/40" />
              <td />
              <td className="text-right px-3 py-2 tabular-nums text-foreground">{formatUah(totalPlan)}</td>
              <td className="border-l border-border/40" />
              <td />
              <td className="text-right px-3 py-2 tabular-nums text-muted-foreground">0 ₴</td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  )
}
