"use client"

import React from "react"
import { FUNDS, formatUah } from "@/lib/budget-data"
import { cn } from "@/lib/utils"
import { Plus } from "lucide-react"

interface ExpenseTableProps {
  onAddExpense?: () => void
}

export function ExpenseTable({ onAddExpense }: ExpenseTableProps) {
  const totalPlan = FUNDS.reduce((s, f) => s + f.rows.reduce((rs, r) => rs + r.planUah, 0), 0)
  const totalFact = 0

  return (
    <div className="rounded-lg border border-border bg-card overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-border">
        <div className="flex items-center gap-3">
          <h2 className="text-sm font-semibold text-foreground">Расход</h2>
          <span className="text-xs text-muted-foreground">
            план: <span className="font-medium tabular-nums text-foreground">{formatUah(totalPlan)}</span>
          </span>
          <span className="text-xs text-muted-foreground">
            факт: <span className="font-medium tabular-nums text-foreground">{formatUah(totalFact)}</span>
          </span>
        </div>
        <button
          onClick={onAddExpense}
          className="flex items-center gap-1.5 text-xs font-medium text-primary hover:underline"
        >
          <Plus className="w-3.5 h-3.5" />
          Добавить расход
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
              <th className="text-center px-2 py-1 text-xs font-medium text-muted-foreground border-b border-border/60 border-l" colSpan={1}>
                Наполн.
              </th>
              <th className="text-center px-2 py-1 text-xs font-medium text-muted-foreground border-b border-border/60 border-l" colSpan={3}>
                Факт
              </th>
              <th className="text-center px-2 py-1 text-xs font-medium text-muted-foreground border-b border-border/60 border-l" rowSpan={2}>
                Остаток
              </th>
            </tr>
            <tr className="border-b border-border bg-muted/40">
              <th className="text-right px-3 py-1.5 text-xs font-medium text-muted-foreground border-l border-border/60 whitespace-nowrap">Дата</th>
              <th className="text-right px-3 py-1.5 text-xs font-medium text-muted-foreground whitespace-nowrap">Сумма</th>
              <th className="text-right px-3 py-1.5 text-xs font-medium text-muted-foreground whitespace-nowrap">Сумма ₴</th>
              <th className="text-right px-3 py-1.5 text-xs font-medium text-muted-foreground border-l border-border/60 whitespace-nowrap">%</th>
              <th className="text-right px-3 py-1.5 text-xs font-medium text-muted-foreground border-l border-border/60 whitespace-nowrap">Дата</th>
              <th className="text-right px-3 py-1.5 text-xs font-medium text-muted-foreground whitespace-nowrap">Сумма</th>
              <th className="text-right px-3 py-1.5 text-xs font-medium text-muted-foreground whitespace-nowrap">Сумма ₴</th>
            </tr>
          </thead>
          <tbody>
            {FUNDS.map((fund) => {
              if (fund.rows.length === 0) return null
              const fundPlanTotal = fund.rows.reduce((s, r) => s + r.planUah, 0)

              return (
                <React.Fragment key={`fund-${fund.id}`}>
                  {/* Fund group header */}
                  <tr className="bg-muted/50 border-t border-border">
                    <td
                      colSpan={9}
                      className={cn(
                        "px-4 py-2",
                        fund.mandatory && "border-l-2 border-l-warning"
                      )}
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-semibold text-foreground uppercase tracking-wide">
                          {fund.name}
                        </span>
                        {fund.mandatory && (
                          <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium bg-warning/15 text-warning-foreground border border-warning/30">
                            обязательный
                          </span>
                        )}
                        <span className="ml-auto text-xs font-semibold tabular-nums text-muted-foreground">
                          {formatUah(fundPlanTotal)}
                        </span>
                      </div>
                    </td>
                  </tr>
                  {/* Fund rows */}
                  {fund.rows.map((row, i) => (
                    <tr
                      key={row.id}
                      className={cn(
                        "border-b border-border/40 last:border-b-0",
                        fund.mandatory && "border-l-2 border-l-warning/30",
                        i % 2 === 0 ? "" : "bg-muted/15"
                      )}
                    >
                      <td className="px-4 py-1.5 text-[13px] text-foreground whitespace-nowrap pl-6">{row.name}</td>
                      <td className="text-right px-3 py-1.5 tabular-nums text-muted-foreground text-[13px] border-l border-border/40 whitespace-nowrap">
                        {row.planDate ?? "—"}
                      </td>
                      <td className="text-right px-3 py-1.5 tabular-nums text-[13px] text-foreground whitespace-nowrap">
                        {row.planAmount ? `${row.planAmount} ${row.planCurrency}` : "—"}
                      </td>
                      <td className="text-right px-3 py-1.5 tabular-nums text-[13px] font-medium text-foreground whitespace-nowrap">
                        {row.planUah > 0 ? formatUah(row.planUah) : "—"}
                      </td>
                      <td className="text-right px-3 py-1.5 tabular-nums text-[13px] text-muted-foreground border-l border-border/40 whitespace-nowrap">
                        {row.fundFill}%
                      </td>
                      <td className="text-right px-3 py-1.5 tabular-nums text-[13px] text-muted-foreground border-l border-border/40 whitespace-nowrap">—</td>
                      <td className="text-right px-3 py-1.5 tabular-nums text-[13px] text-muted-foreground whitespace-nowrap">—</td>
                      <td className="text-right px-3 py-1.5 tabular-nums text-[13px] text-muted-foreground whitespace-nowrap">0 ₴</td>
                      <td className="text-right px-3 py-1.5 tabular-nums text-[13px] text-foreground border-l border-border/40 whitespace-nowrap">
                        {row.remaining > 0 ? formatUah(row.remaining) : "—"}
                      </td>
                    </tr>
                  ))}
                </React.Fragment>
              )
            })}
          </tbody>
          <tfoot>
            <tr className="border-t-2 border-border bg-muted/30 font-semibold">
              <td className="px-4 py-2 text-xs text-muted-foreground uppercase tracking-wide">Итого</td>
              <td className="border-l border-border/40" />
              <td />
              <td className="text-right px-3 py-2 tabular-nums text-foreground">{formatUah(totalPlan)}</td>
              <td className="border-l border-border/40" />
              <td className="border-l border-border/40" />
              <td />
              <td className="text-right px-3 py-2 tabular-nums text-muted-foreground">0 ₴</td>
              <td className="text-right px-3 py-2 tabular-nums text-foreground border-l border-border/40">{formatUah(totalPlan)}</td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  )
}
