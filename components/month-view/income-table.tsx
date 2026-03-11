"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { Plus } from "lucide-react"

interface IncomeTableProps {
  year: string
  month: string
  onAddIncome?: () => void
}

// Типы данных из Supabase
type IncomeSource = { id: string; name: string }
type IncomeRow = {
  id: string
  source: IncomeSource[] | null
  type: "plan" | "fact"
  amount: number
  currency: string
  date: string | null
}

function formatUah(n: number) {
  return n.toLocaleString("uk-UA", { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + " ₴"
}

export function IncomeTable({ year, month, onAddIncome }: IncomeTableProps) {
  const [sources, setSources] = useState<IncomeSource[]>([])
  const [rows, setRows] = useState<IncomeRow[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    async function load() {
      setLoading(true)

      // Конвертируем "march" → 3
      const monthNames: Record<string, number> = {
        january: 1, february: 2, march: 3, april: 4,
        may: 5, june: 6, july: 7, august: 8,
        september: 9, october: 10, november: 11, december: 12,
      }
      const monthNum = monthNames[month.toLowerCase()]

      // Загружаем источники дохода
      const { data: sourcesData } = await supabase
        .from("income_sources")
        .select("id, name")
        .order("sort_order")

      if (sourcesData) setSources(sourcesData)

      // Ищем месяц в БД
      const { data: monthData } = await supabase
        .from("months")
        .select("id")
        .eq("year", Number(year))
        .eq("month", monthNum)
        .single()

      if (!monthData) { setLoading(false); return }

      // Загружаем транзакции прихода за этот месяц
      const { data: incomeData } = await supabase
        .from("income")
        .select("id, type, amount, currency, date, source:income_sources(id, name)")
        .eq("month_id", monthData.id)
        .order("date")

      if (incomeData) setRows(incomeData as unknown as IncomeRow[])
      setLoading(false)
    }

    load()
  }, [year, month])

  // Группируем по источнику: план и факт отдельно
  const planBySource = Object.fromEntries(
    sources.map(s => [s.id, rows.find(r => r.source?.[0]?.id === s.id && r.type === "plan")])
  )
  const factBySource = Object.fromEntries(
    sources.map(s => [s.id, rows.filter(r => r.source?.[0]?.id === s.id && r.type === "fact")])
  )

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
          <h2 className="text-sm font-semibold text-foreground">Приход</h2>
          <span className="text-xs text-muted-foreground">
            план: <span className="font-medium tabular-nums text-foreground">{formatUah(totalPlanUah)}</span>
          </span>
          <span className="text-xs text-muted-foreground">
            факт: <span className="font-medium tabular-nums text-foreground">{formatUah(totalFactUah)}</span>
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
            {loading ? (
              <tr>
                <td colSpan={7} className="px-4 py-6 text-center text-sm text-muted-foreground">
                  Загрузка...
                </td>
              </tr>
            ) : sources.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-4 py-6 text-center text-sm text-muted-foreground">
                  Нет данных
                </td>
              </tr>
            ) : (
              sources.map((source, i) => {
                const plan = planBySource[source.id]
                const facts = factBySource[source.id] ?? []
                const factTotalUah = facts
                  .filter(f => f.currency === "UAH")
                  .reduce((s, f) => s + f.amount, 0)

                return (
                  <tr key={source.id} className={i % 2 === 1 ? "bg-muted/20" : ""}>
                    <td className="px-4 py-2 font-medium text-foreground whitespace-nowrap">
                      {source.name}
                    </td>
                    {/* План */}
                    <td className="text-right px-3 py-2 tabular-nums text-muted-foreground border-l border-border/40 whitespace-nowrap">
                      {plan?.date ?? "—"}
                    </td>
                    <td className="text-right px-3 py-2 tabular-nums text-foreground whitespace-nowrap">
                      {plan ? `${plan.amount} ${plan.currency}` : "—"}
                    </td>
                    <td className="text-right px-3 py-2 tabular-nums font-medium text-foreground whitespace-nowrap">
                      {plan?.currency === "UAH" && plan.amount > 0 ? formatUah(plan.amount) : "—"}
                    </td>
                    {/* Факт */}
                    <td className="text-right px-3 py-2 tabular-nums text-muted-foreground border-l border-border/40 whitespace-nowrap">
                      {facts[0]?.date ?? "—"}
                    </td>
                    <td className="text-right px-3 py-2 tabular-nums text-muted-foreground whitespace-nowrap">
                      {facts.length > 0 ? `${facts.reduce((s, f) => s + f.amount, 0)} ${facts[0].currency}` : "—"}
                    </td>
                    <td className="text-right px-3 py-2 tabular-nums text-muted-foreground whitespace-nowrap">
                      {factTotalUah > 0 ? formatUah(factTotalUah) : "0 ₴"}
                    </td>
                  </tr>
                )
              })
            )}
          </tbody>
          <tfoot>
            <tr className="border-t border-border bg-muted/30 font-semibold">
              <td className="px-4 py-2 text-xs text-muted-foreground uppercase tracking-wide">Итого</td>
              <td className="border-l border-border/40" />
              <td />
              <td className="text-right px-3 py-2 tabular-nums text-foreground">{formatUah(totalPlanUah)}</td>
              <td className="border-l border-border/40" />
              <td />
              <td className="text-right px-3 py-2 tabular-nums text-muted-foreground">{formatUah(totalFactUah)}</td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  )
}