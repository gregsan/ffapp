"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import {
  Dialog, DialogContent, DialogHeader,
  DialogTitle, DialogClose, DialogFooter,
} from "@/components/ui/dialog"
import { Camera } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { cn } from "@/lib/utils"

type TransactionType = "income" | "expense"
const CURRENCIES = ["UAH", "EUR", "USD", "HUF"]

// Типы для данных из Supabase
type Fund = { id: string; name: string }
type Category = { id: string; name: string; fund_id: string }
type IncomeSource = { id: string; name: string; default_currency: string }

interface AddTransactionModalProps {
  open: boolean
  onClose: () => void
  defaultType?: TransactionType
}

export function AddTransactionModal({ open, onClose, defaultType }: AddTransactionModalProps) {
  const [type, setType] = useState<TransactionType>(defaultType ?? "expense")
  const [funds, setFunds] = useState<Fund[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [incomeSources, setIncomeSources] = useState<IncomeSource[]>([])
  const [selectedFund, setSelectedFund] = useState<string>("")
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState("")

  // Поля формы прихода
  const [incomeSourceId, setIncomeSourceId] = useState("")
  const [incomeAmount, setIncomeAmount] = useState("")
  const [incomeCurrency, setIncomeCurrency] = useState("UAH")
  const [incomeDate, setIncomeDate] = useState(today())

  // Поля формы расхода
  const [categoryId, setCategoryId] = useState("")
  const [expenseAmount, setExpenseAmount] = useState("")
  const [expenseCurrency, setExpenseCurrency] = useState("UAH")
  const [expenseDate, setExpenseDate] = useState(today())

  const params = useParams()
  const supabase = createClient()

  // Загружаем справочники при открытии модала
  useEffect(() => {
    if (!open) return

    if (defaultType) setType(defaultType)

    async function loadData() {
      const [fundsRes, categoriesRes, sourcesRes] = await Promise.all([
        supabase.from("funds").select("id, name").order("sort_order"),
        supabase.from("categories").select("id, name, fund_id").order("sort_order"),
        supabase.from("income_sources").select("id, name, default_currency").order("sort_order"),
      ])

      if (fundsRes.data) {
        setFunds(fundsRes.data)
        setSelectedFund(fundsRes.data[0]?.id ?? "")
      }
      if (categoriesRes.data) setCategories(categoriesRes.data)
      if (sourcesRes.data) {
        setIncomeSources(sourcesRes.data)
        setIncomeSourceId(sourcesRes.data[0]?.id ?? "")
        setIncomeCurrency(sourcesRes.data[0]?.default_currency ?? "UAH")
      }
    }

    loadData()
  }, [open, defaultType])

  // Фильтруем категории по выбранному фонду
  const filteredCategories = categories.filter(c => c.fund_id === selectedFund)

  // Когда меняется фонд — сбрасываем категорию
  function handleFundChange(fundId: string) {
    setSelectedFund(fundId)
    setCategoryId("")
  }

  // Получаем или создаём запись месяца в БД
  async function getOrCreateMonth() {
    const year = Number(params.year)
    const monthNames: Record<string, number> = {
      january: 1, february: 2, march: 3, april: 4,
      may: 5, june: 6, july: 7, august: 8,
      september: 9, october: 10, november: 11, december: 12,
    }
    const month = monthNames[String(params.month).toLowerCase()]

    // Ищем существующий месяц
    const { data: existing } = await supabase
      .from("months")
      .select("id")
      .eq("year", year)
      .eq("month", month)
      .single()

    if (existing) return existing.id

    // Получаем family_id текущего пользователя
    const { data: memberData } = await supabase
      .from("family_members")
      .select("family_id")
      .single()

    if (!memberData) return null

    // Создаём месяц с family_id
    const { data: created } = await supabase
      .from("months")
      .insert({ year, month, family_id: memberData.family_id })
      .select("id")
      .single()

    return created?.id
  }


  async function handleSave() {
    setSaving(true)
    setError("")

    const monthId = await getOrCreateMonth()
    if (!monthId) {
      setError("Ошибка определения месяца")
      setSaving(false)
      return
    }

    if (type === "income") {
      const { error } = await supabase.from("income").insert({
        month_id: monthId,
        source_id: incomeSourceId,
        type: "fact",
        amount: Number(incomeAmount),
        currency: incomeCurrency,
        date: incomeDate,
      })
      if (error) { setError("Ошибка сохранения"); setSaving(false); return }
    } else {
      const { error } = await supabase.from("expenses").insert({
        month_id: monthId,
        fund_id: selectedFund,
        category_id: categoryId || null,
        type: "fact",
        amount: Number(expenseAmount),
        currency: expenseCurrency,
        date: expenseDate,
      })
      if (error) { setError("Ошибка сохранения"); setSaving(false); return }
    }

    setSaving(false)
    onClose()
  }

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent showCloseButton={false} className="p-0 gap-0 max-w-md bg-card">
        <DialogHeader className="flex-row items-center justify-between px-5 py-4 border-b border-border">
          <DialogTitle className="text-[15px] font-semibold text-foreground">
            Добавить транзакцию
          </DialogTitle>
          <DialogClose asChild>
            <button className="rounded-md p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors">
              ✕
            </button>
          </DialogClose>
        </DialogHeader>

        <div className="p-5 space-y-4">
          {!defaultType && (
            <div className="grid grid-cols-2 gap-2">
              {(["income", "expense"] as TransactionType[]).map((t) => (
                <button
                  key={t}
                  onClick={() => setType(t)}
                  className={cn(
                    "py-2.5 rounded-lg border text-sm font-medium transition-colors",
                    type === t
                      ? "bg-primary text-primary-foreground border-primary"
                      : "bg-card border-border text-muted-foreground hover:border-primary/50 hover:text-foreground"
                  )}
                >
                  {t === "income" ? "Приход" : "Расход"}
                </button>
              ))}
            </div>
          )}

          {type === "income" ? (
            <div className="space-y-3">
              <FormField label="Канал">
                <select
                  value={incomeSourceId}
                  onChange={e => setIncomeSourceId(e.target.value)}
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-ring"
                >
                  {incomeSources.map(s => (
                    <option key={s.id} value={s.id}>{s.name}</option>
                  ))}
                </select>
              </FormField>
              <div className="grid grid-cols-2 gap-3">
                <FormField label="Сумма">
                  <input
                    type="number"
                    placeholder="0"
                    value={incomeAmount}
                    onChange={e => setIncomeAmount(e.target.value)}
                    className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-ring"
                  />
                </FormField>
                <FormField label="Валюта">
                  <select
                    value={incomeCurrency}
                    onChange={e => setIncomeCurrency(e.target.value)}
                    className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-ring"
                  >
                    {CURRENCIES.map(c => <option key={c}>{c}</option>)}
                  </select>
                </FormField>
              </div>
              <FormField label="Дата">
                <input
                  type="date"
                  value={incomeDate}
                  onChange={e => setIncomeDate(e.target.value)}
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-ring"
                />
              </FormField>
            </div>
          ) : (
            <div className="space-y-3">
              <FormField label="Фонд">
                <select
                  value={selectedFund}
                  onChange={e => handleFundChange(e.target.value)}
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-ring"
                >
                  {funds.map(f => (
                    <option key={f.id} value={f.id}>{f.name}</option>
                  ))}
                </select>
              </FormField>
              <FormField label="Категория">
                <select
                  value={categoryId}
                  onChange={e => setCategoryId(e.target.value)}
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-ring"
                >
                  <option value="">— выберите —</option>
                  {filteredCategories.map(c => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </FormField>
              <div className="grid grid-cols-2 gap-3">
                <FormField label="Сумма">
                  <input
                    type="number"
                    placeholder="0"
                    value={expenseAmount}
                    onChange={e => setExpenseAmount(e.target.value)}
                    className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-ring"
                  />
                </FormField>
                <FormField label="Валюта">
                  <select
                    value={expenseCurrency}
                    onChange={e => setExpenseCurrency(e.target.value)}
                    className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-ring"
                  >
                    {CURRENCIES.map(c => <option key={c}>{c}</option>)}
                  </select>
                </FormField>
              </div>
              <FormField label="Дата">
                <input
                  type="date"
                  value={expenseDate}
                  onChange={e => setExpenseDate(e.target.value)}
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-ring"
                />
              </FormField>
            </div>
          )}

          {error && <p className="text-sm text-red-500">{error}</p>}

          <button
            disabled
            className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg border border-dashed border-border bg-muted/40 text-sm text-muted-foreground cursor-not-allowed"
          >
            <Camera className="w-4 h-4" />
            Распознать чек
            <span className="ml-1 px-1.5 py-0.5 rounded text-[10px] font-medium bg-muted text-muted-foreground border border-border">
              скоро
            </span>
          </button>
        </div>

        <DialogFooter className="px-5 py-4 border-t border-border sm:flex-row">
          <DialogClose asChild>
            <button className="px-4 py-2 rounded-md border border-border bg-card text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground transition-colors">
              Отмена
            </button>
          </DialogClose>
          <button
            onClick={handleSave}
            disabled={saving}
            className="px-4 py-2 rounded-md bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-opacity disabled:opacity-50"
          >
            {saving ? "Сохраняем..." : "Сохранить"}
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

function today() {
  return new Date().toISOString().split("T")[0]
}

function FormField({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <label className="block text-xs font-medium text-muted-foreground">{label}</label>
      {children}
    </div>
  )
}