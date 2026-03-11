"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"

export type Rates = Record<string, number> // { UAH: 132, HUF: 385.5, USD: 1.08 }

export function useCurrencyRates(monthId: string | null) {
  const [rates, setRates] = useState<Rates>({})
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!monthId) return
    const supabase = createClient()

    async function fetch() {
      const { data } = await supabase
        .from("exchange_rates")
        .select("currency, rate_to_eur")
        .eq("month_id", monthId)

      if (data) {
        const map: Rates = {}
        data.forEach((r) => { map[r.currency] = r.rate_to_eur })
        setRates(map)
      }
      setLoading(false)
    }

    fetch()
  }, [monthId])

  return { rates, loading }
}

// Конвертация любой валюты в UAH через EUR
export function convertToUah(amount: number, currency: string, rates: Rates): number {
  if (currency === "UAH") return amount
  if (!rates["UAH"] || !rates[currency]) return amount // fallback — без конвертации
  return amount * (rates["UAH"] / rates[currency])
}
