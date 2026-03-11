"use client"

import { useState } from "react"
import { CURRENCY_RATES } from "@/lib/budget-data"
import { Pencil, Check } from "lucide-react"

export function CurrencyRates() {
  const [editing, setEditing] = useState(false)
  const [rates, setRates] = useState(CURRENCY_RATES)

  return (
    <div className="flex flex-wrap items-center gap-x-6 gap-y-2 rounded-lg border border-border bg-card px-4 py-3">
      <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide shrink-0">Курсы валют</p>

      {editing ? (
        <>
          <RateInput label="1 EUR =" suffix="HUF" value={rates.eurHuf} onChange={(v) => setRates((r) => ({ ...r, eurHuf: v }))} />
          <RateInput label="1 EUR =" suffix="UAH" value={rates.eurUah} onChange={(v) => setRates((r) => ({ ...r, eurUah: v }))} />
          <RateInput label="1 USD =" suffix="UAH" value={rates.usdUah} onChange={(v) => setRates((r) => ({ ...r, usdUah: v }))} />
          <button
            onClick={() => setEditing(false)}
            className="flex items-center gap-1.5 text-xs font-medium text-primary hover:underline"
          >
            <Check className="w-3.5 h-3.5" />
            Сохранить
          </button>
        </>
      ) : (
        <>
          <RateDisplay label="1 EUR" value={`${rates.eurHuf} HUF`} />
          <RateDisplay label="1 EUR" value={`${rates.eurUah} UAH`} />
          <RateDisplay label="1 USD" value={`${rates.usdUah} UAH`} />
          <button
            onClick={() => setEditing(true)}
            className="flex items-center gap-1.5 text-xs font-medium text-primary hover:underline"
          >
            <Pencil className="w-3 h-3" />
            Изменить
          </button>
        </>
      )}
    </div>
  )
}

function RateDisplay({ label, value }: { label: string; value: string }) {
  return (
    <span className="text-sm text-foreground tabular-nums">
      <span className="text-muted-foreground">{label} = </span>
      <span className="font-medium">{value}</span>
    </span>
  )
}

function RateInput({
  label,
  suffix,
  value,
  onChange,
}: {
  label: string
  suffix: string
  value: number
  onChange: (v: number) => void
}) {
  return (
    <span className="flex items-center gap-1.5 text-sm">
      <span className="text-muted-foreground">{label} =</span>
      <input
        type="number"
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-20 rounded-md border border-input bg-background px-2 py-1 text-sm tabular-nums focus:outline-none focus:ring-1 focus:ring-ring"
      />
      <span className="text-muted-foreground">{suffix}</span>
    </span>
  )
}
