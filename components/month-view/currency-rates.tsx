"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { Pencil, Check } from "lucide-react"

type Rates = { eurHuf: number; eurUah: number; usdUah: number }

export function CurrencyRates({ monthId }: { monthId: string }) {
  const [editing, setEditing] = useState(false)
  const [rates, setRates] = useState<Rates>({ eurHuf: 0, eurUah: 0, usdUah: 0 })

  useEffect(() => {
    const supabase = createClient()

    async function fetchRates() {
      const { data } = await supabase
        .from("exchange_rates")
        .select("currency, rate_to_eur")
        .eq("month_id", monthId)

      if (data) {
        const map: Record<string, number> = {}
        data.forEach((r) => { map[r.currency] = r.rate_to_eur })
        setRates({
          eurHuf: map["HUF"] ?? 0,
          eurUah: map["UAH"] ?? 0,
          usdUah: map["UAH"] && map["USD"] ? map["UAH"] / map["USD"] : 0,
        })
      }
    }

    fetchRates()
  }, [monthId])

  async function saveRates() {
    const supabase = createClient()
    await supabase.from("exchange_rates").upsert(
      [
        { month_id: monthId, currency: "HUF", rate_to_eur: rates.eurHuf },
        { month_id: monthId, currency: "UAH", rate_to_eur: rates.eurUah },
        { month_id: monthId, currency: "USD", rate_to_eur: rates.eurUah / rates.usdUah },
      ],
      { onConflict: "month_id,currency" }
    )
    setEditing(false)
  }

  return (
    <div className="flex flex-wrap items-center gap-x-6 gap-y-2 rounded-lg border border-border bg-card px-4 py-3">
      <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide shrink-0">
        Курсы валют
      </p>

      {editing ? (
        <>
          <RateInput label="1 EUR =" suffix="HUF" value={rates.eurHuf} onChange={(v) => setRates((r) => ({ ...r, eurHuf: v }))} />
          <RateInput label="1 EUR =" suffix="UAH" value={rates.eurUah} onChange={(v) => setRates((r) => ({ ...r, eurUah: v }))} />
          <RateInput label="1 USD =" suffix="UAH" value={rates.usdUah} onChange={(v) => setRates((r) => ({ ...r, usdUah: v }))} />
          <button
            onClick={saveRates}
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