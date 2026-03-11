"use client"

import { useState } from "react"
import { FUNDS, formatUah, formatNumber } from "@/lib/budget-data"
import { cn } from "@/lib/utils"

type AllocationMap = Record<string, number>

const initialAllocations: AllocationMap = Object.fromEntries(
  FUNDS.map((f) => [f.id, 0])
)

function FillBar({ pct }: { pct: number }) {
  const color =
    pct >= 80
      ? "bg-success"
      : pct >= 40
      ? "bg-warning"
      : "bg-destructive"

  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 h-1.5 rounded-full bg-muted overflow-hidden">
        <div
          className={cn("h-full rounded-full transition-all", color)}
          style={{ width: `${Math.min(pct, 100)}%` }}
        />
      </div>
      <span className="text-xs tabular-nums text-muted-foreground w-8 text-right">{pct}%</span>
    </div>
  )
}

export function FundAllocation() {
  const [allocations, setAllocations] = useState<AllocationMap>(initialAllocations)

  const mandatory = FUNDS.filter((f) => f.mandatory)
  const secondary = FUNDS.filter((f) => !f.mandatory)

  function handleChange(id: string, value: string) {
    const num = Number(value.replace(/\D/g, "")) || 0
    setAllocations((prev) => ({ ...prev, [id]: num }))
  }

  function FundRow({ fund }: { fund: (typeof FUNDS)[0] }) {
    const allocated = allocations[fund.id] ?? 0
    const pct = fund.limit > 0 ? Math.round((allocated / fund.limit) * 100) : 0

    return (
      <tr className="border-b border-border/40 last:border-b-0">
        <td className="px-4 py-2.5">
          <div className="flex items-center gap-2">
            <span className="text-[13px] font-medium text-foreground">{fund.name}</span>
            {fund.mandatory && (
              <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium bg-warning/15 text-warning-foreground border border-warning/30">
                обяз.
              </span>
            )}
          </div>
          <span className="text-[11px] text-muted-foreground">{fund.nameRu}</span>
        </td>
        <td className="px-4 py-2.5 text-right tabular-nums text-[13px] text-muted-foreground whitespace-nowrap">
          {fund.limit > 0 ? formatUah(fund.limit) : "—"}
        </td>
        <td className="px-4 py-2.5">
          <input
            type="text"
            inputMode="numeric"
            value={allocated > 0 ? formatNumber(allocated) : ""}
            onChange={(e) => handleChange(fund.id, e.target.value)}
            placeholder="0"
            className="w-28 rounded-md border border-input bg-background px-2 py-1 text-sm tabular-nums text-right focus:outline-none focus:ring-1 focus:ring-ring"
          />
        </td>
        <td className="px-4 py-2.5 min-w-[140px]">
          <FillBar pct={pct} />
        </td>
      </tr>
    )
  }

  return (
    <div className="rounded-lg border border-border bg-card overflow-hidden">
      <div className="px-4 py-3 border-b border-border">
        <h2 className="text-sm font-semibold text-foreground">Распределение прихода по фондам</h2>
        <p className="text-xs text-muted-foreground mt-0.5">Распределите полученные средства по фондам</p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-muted/40">
              <th className="text-left px-4 py-2 text-xs font-medium text-muted-foreground">Фонд</th>
              <th className="text-right px-4 py-2 text-xs font-medium text-muted-foreground">Лимит</th>
              <th className="text-right px-4 py-2 text-xs font-medium text-muted-foreground">Выделено</th>
              <th className="text-left px-4 py-2 text-xs font-medium text-muted-foreground min-w-[140px]">Наполнение</th>
            </tr>
          </thead>
          <tbody>
            {/* Mandatory first */}
            {mandatory.map((f) => (
              <FundRow key={f.id} fund={f} />
            ))}
            {/* Separator */}
            <tr>
              <td colSpan={4} className="px-4 py-1.5 bg-muted/30">
                <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/60">
                  Дополнительные фонды
                </p>
              </td>
            </tr>
            {secondary.map((f) => (
              <FundRow key={f.id} fund={f} />
            ))}
          </tbody>
        </table>
      </div>

      <div className="px-4 py-3 border-t border-border flex justify-end">
        <button className="px-4 py-2 rounded-md bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-opacity">
          Сохранить распределение
        </button>
      </div>
    </div>
  )
}
