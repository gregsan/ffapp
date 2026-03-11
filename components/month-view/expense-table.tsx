"use client"

import React, { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { cn } from "@/lib/utils"
import { Plus } from "lucide-react"

interface ExpenseTableProps {
  year: string
  month: string
  onAddExpense?: () => void
}

type Category = { id: string; name: string }
type Fund = { id: string; name: string; is_mandatory: boolean; sort_order: number }
type ExpenseRow = {
  id: string
  fund: { id: string; name: string } | null
  category: { id: string; name: string } | null
  type: "plan" | "fact"
  amount: number
  currency: string
  date: string | null
}

function formatUah(n: number) {
  return n.toLocaleString("uk-UA", { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + " ₴"
}

export function ExpenseTable({ year, month, onAddExpense }: ExpenseTableProps) {
  const [funds, setFunds] = useState<Fund[]>([])
  const [categories, setCategories] = useState<(Category & { fund_id: string })[]>([])
  const [rows, setRows] = useState<ExpenseRow[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    async function load() {
      setLoading(true)

      const monthNames: Record<string, number> = {
        january: 1, february: 2, march: 3, april: 4,
        may: 5, june: 6, july: 7, august: 8,
        september: 9, october: 10, november: 11, december: 12,
      }
      const monthNum = monthNames[month.toLowerCase()]

      // Загружаем фонды и категории параллельно
      const [fundsRes, categoriesRes] = await Promise.all([
        supabase.from("funds").select("id, name, is_mandatory, sort_order").order("sort_order"),
        supabase.from("categories").select("id, name, fund_id").order("sort_order"),
      ])

      if (fundsRes.data) setFunds(fundsRes.data)
      if (categoriesRes.data) setCategories(categoriesRes.data)

      // Ищем месяц
      const { data: monthData } = await supabase
        .from("months")
        .select("id")
        .eq("year", Number(year))
        .eq("month", monthNum)
        .single()

      if (!monthData) { setLoading(false); return }

      // Загружаем расходы за месяц
      const { data: expensesData } = await supabase
        .from("expenses")
        .select("id, type, amount, currency, date, fund:funds(id, name), category:categories(id, name)")
        .eq("month_id", monthData.id)
        .order("date")

      if (expensesData) setRows(expensesData as unknown as ExpenseRow[])
      setLoading(false)
    }

    load()
  }, [year, month])

  // Считаем итоги
  const totalPlanUah = rows
    .filter(r => r.type === "plan" && r.currency === "UAH")
    .reduce((s, r) => s + r.amount, 0)
  const totalFactUah = rows
    .filter(r => r.type === "fact" && r.currency === "UAH")
    .reduce((s, r) => s + r.amount, 0)

  return (
    <div className="rounded-lg border border-border bg-card overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-border">
        <div className="flex items-center gap-3">
          <h2 className="text-sm font-semibold text-foreground">Расход</h2>
          <span className="text-xs text-muted-foreground">
            план: <span className="font-medium tabular-nums text-foreground">{formatUah(totalPlanUah)}</span>
          </span>
          <span className="text-xs text-muted-foreground">
            факт: <span className="font-medium tabular-nums text-foreground">{formatUah(totalFactUah)}</span>
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
            {loading ? (
              <tr>
                <td colSpan={9} className="px-4 py-6 text-center text-sm text-muted-foreground">
                  Загрузка...
                </td>
              </tr>
            ) : (
              funds.map((fund) => {
                // Категории этого фонда
                const fundCategories = categories.filter(c => c.fund_id === fund.id)
                if (fundCategories.length === 0) return null

                // Расходы плана/факта по фонду
                const fundPlanRows = rows.filter(r => r.fund?.id === fund.id && r.type === "plan")
                const fundFactRows = rows.filter(r => r.fund?.id === fund.id && r.type === "fact")

                const fundPlanUah = fundPlanRows
                  .filter(r => r.currency === "UAH")
                  .reduce((s, r) => s + r.amount, 0)
                const fundFactUah = fundFactRows
                  .filter(r => r.currency === "UAH")
                  .reduce((s, r) => s + r.amount, 0)

                // Наполненность фонда в %
                const fundFillPct = fundPlanUah > 0
                  ? Math.round((fundFactUah / fundPlanUah) * 100)
                  : 0

                return (
                  <React.Fragment key={fund.id}>
                    {/* Fund group header */}
                    <tr className="bg-muted/50 border-t border-border">
                      <td
                        colSpan={9}
                        className={cn("px-4 py-2", fund.is_mandatory && "border-l-2 border-l-amber-500")}
                      >
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-semibold text-foreground uppercase tracking-wide">
                            {fund.name}
                          </span>
                          {fund.is_mandatory && (
                            <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium bg-amber-500/10 text-amber-500 border border-amber-500/30">
                              обязательный
                            </span>
                          )}
                          <span className="ml-auto text-xs font-semibold tabular-nums text-muted-foreground">
                            {fundPlanUah > 0 ? formatUah(fundPlanUah) : "—"}
                          </span>
                        </div>
                      </td>
                    </tr>

                    {/* Category rows */}
                    {fundCategories.map((cat, i) => {
                      const planRow = fundPlanRows.find(r => r.category?.id === cat.id)
                      const factRows = fundFactRows.filter(r => r.category?.id === cat.id)
                      const factUah = factRows
                        .filter(r => r.currency === "UAH")
                        .reduce((s, r) => s + r.amount, 0)
                      const planUah = planRow?.currency === "UAH" ? planRow.amount : 0
                      const remaining = planUah - factUah
                      const fillPct = planUah > 0 ? Math.round((factUah / planUah) * 100) : 0

                      return (
                        <tr
                          key={cat.id}
                          className={cn(
                            "border-b border-border/40 last:border-b-0",
                            fund.is_mandatory && "border-l-2 border-l-amber-500/30",
                            i % 2 !== 0 && "bg-muted/15"
                          )}
                        >
                          <td className="px-4 py-1.5 text-[13px] text-foreground whitespace-nowrap pl-6">
                            {cat.name}
                          </td>
                          {/* План */}
                          <td className="text-right px-3 py-1.5 tabular-nums text-muted-foreground text-[13px] border-l border-border/40 whitespace-nowrap">
                            {planRow?.date ?? "—"}
                          </td>
                          <td className="text-right px-3 py-1.5 tabular-nums text-[13px] text-foreground whitespace-nowrap">
                            {planRow ? `${planRow.amount} ${planRow.currency}` : "—"}
                          </td>
                          <td className="text-right px-3 py-1.5 tabular-nums text-[13px] font-medium text-foreground whitespace-nowrap">
                            {planUah > 0 ? formatUah(planUah) : "—"}
                          </td>
                          {/* Наполнение */}
                          <td className="text-right px-3 py-1.5 tabular-nums text-[13px] border-l border-border/40 whitespace-nowrap">
                            <span className={cn(
                              "font-medium",
                              fillPct >= 80 ? "text-emerald-500" :
                              fillPct >= 40 ? "text-amber-500" : "text-red-500"
                            )}>
                              {fillPct}%
                            </span>
                          </td>
                          {/* Факт */}
                          <td className="text-right px-3 py-1.5 tabular-nums text-[13px] text-muted-foreground border-l border-border/40 whitespace-nowrap">
                            {factRows[0]?.date ?? "—"}
                          </td>
                          <td className="text-right px-3 py-1.5 tabular-nums text-[13px] text-muted-foreground whitespace-nowrap">
                            {factRows.length > 0 ? `${factRows.reduce((s, r) => s + r.amount, 0)} ${factRows[0].currency}` : "—"}
                          </td>
                          <td className="text-right px-3 py-1.5 tabular-nums text-[13px] text-muted-foreground whitespace-nowrap">
                            {factUah > 0 ? formatUah(factUah) : "0 ₴"}
                          </td>
                          {/* Остаток */}
                          <td className="text-right px-3 py-1.5 tabular-nums text-[13px] border-l border-border/40 whitespace-nowrap">
                            <span className={remaining < 0 ? "text-red-500" : "text-foreground"}>
                              {planUah > 0 ? formatUah(remaining) : "—"}
                            </span>
                          </td>
                        </tr>
                      )
                    })}
                  </React.Fragment>
                )
              })
            )}
          </tbody>
          <tfoot>
            <tr className="border-t-2 border-border bg-muted/30 font-semibold">
              <td className="px-4 py-2 text-xs text-muted-foreground uppercase tracking-wide">Итого</td>
              <td className="border-l border-border/40" />
              <td />
              <td className="text-right px-3 py-2 tabular-nums text-foreground">{formatUah(totalPlanUah)}</td>
              <td className="border-l border-border/40" />
              <td className="border-l border-border/40" />
              <td />
              <td className="text-right px-3 py-2 tabular-nums text-muted-foreground">{formatUah(totalFactUah)}</td>
              <td className="text-right px-3 py-2 tabular-nums text-foreground border-l border-border/40">
                {formatUah(totalPlanUah - totalFactUah)}
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  )
}