"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { cn } from "@/lib/utils"

function formatUah(val: number) {
  return new Intl.NumberFormat("uk-UA", {
    style: "currency",
    currency: "UAH",
    maximumFractionDigits: 0,
  }).format(val)
}

type Summary = {
  incomePlan: number
  incomeFact: number
  expensePlan: number
  expenseFact: number
}

export function SummaryCards() {
  const supabase = createClient()
  const [summary, setSummary] = useState<Summary>({
    incomePlan: 0,
    incomeFact: 0,
    expensePlan: 0,
    expenseFact: 0,
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchSummary() {
      const now = new Date()
      const from = new Date(now.getFullYear(), now.getMonth(), 1).toISOString()
      const to = new Date(now.getFullYear(), now.getMonth() + 1, 0).toISOString()

      // Fetch income
      const { data: incomeRows } = await supabase
        .from("income")
        .select("amount, type")
        .gte("date", from)
        .lte("date", to)

      // Fetch expenses
      const { data: expenseRows } = await supabase
        .from("expenses")
        .select("amount, type")
        .gte("date", from)
        .lte("date", to)

      const sum = (rows: { amount: number; type: string }[] | null, type: string) =>
        rows?.filter((r) => r.type === type).reduce((acc, r) => acc + r.amount, 0) ?? 0

      setSummary({
        incomePlan: sum(incomeRows, "plan"),
        incomeFact: sum(incomeRows, "fact"),
        expensePlan: sum(expenseRows, "plan"),
        expenseFact: sum(expenseRows, "fact"),
      })
      setLoading(false)
    }

    fetchSummary()
  }, [])

  const freeBalance = summary.incomeFact - summary.expenseFact

  const stats = [
    {
      label: "Приход",
      value: formatUah(summary.incomePlan),
      sub: formatUah(summary.incomeFact),
      subLabel: "факт",
    },
    {
      label: "Расход",
      value: formatUah(summary.expensePlan),
      sub: formatUah(summary.expenseFact),
      subLabel: "факт",
    },
    {
      label: "Свободный остаток",
      value: formatUah(freeBalance),
      highlight: true,
    },
  ]

  if (loading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="rounded-lg border border-border bg-card p-3.5 h-16 animate-pulse" />
        ))}
      </div>
    )
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
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
          <p className={cn(
            "text-[17px] font-semibold tabular-nums leading-tight",
            stat.highlight ? "text-accent-foreground" : "text-foreground"
          )}>
            {stat.value}
          </p>
          {stat.sub !== undefined && (
            <p className="text-xs tabular-nums text-muted-foreground">
              <span className="text-muted-foreground/70">{stat.subLabel}: </span>
              {stat.sub}
            </p>
          )}
        </div>
      ))}
    </div>
  )
}