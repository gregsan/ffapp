"use client"

import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
  DialogFooter,
} from "@/components/ui/dialog"
import { Camera } from "lucide-react"
import { FUNDS } from "@/lib/budget-data"
import { cn } from "@/lib/utils"

type TransactionType = "income" | "expense"

const INCOME_CHANNELS = ["Мультисерч", "KIVI USD", "KIVI HUF"]
const CURRENCIES = ["UAH", "EUR", "USD", "HUF"]

interface AddTransactionModalProps {
  open: boolean
  onClose: () => void
  defaultType?: TransactionType
}

export function AddTransactionModal({ open, onClose, defaultType }: AddTransactionModalProps) {
  const [type, setType] = useState<TransactionType>(defaultType ?? "expense")
  const [selectedFund, setSelectedFund] = useState(FUNDS[0].id)

  const categoriesForFund = FUNDS.find((f) => f.id === selectedFund)?.rows ?? []

  const today = new Date().toISOString().split("T")[0]

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent showCloseButton={false} className="p-0 gap-0 max-w-md bg-card">
        {/* Header */}
        <DialogHeader className="flex-row items-center justify-between px-5 py-4 border-b border-border">
          <DialogTitle className="text-[15px] font-semibold text-foreground">
            Добавить транзакцию
          </DialogTitle>
          <DialogClose asChild>
            <button className="rounded-md p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors">
              <span className="sr-only">Закрыть</span>
              ✕
            </button>
          </DialogClose>
        </DialogHeader>

        <div className="p-5 space-y-4">
          {/* Type selector */}
          {!defaultType && (
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => setType("income")}
                className={cn(
                  "py-2.5 rounded-lg border text-sm font-medium transition-colors",
                  type === "income"
                    ? "bg-primary text-primary-foreground border-primary"
                    : "bg-card border-border text-muted-foreground hover:border-primary/50 hover:text-foreground"
                )}
              >
                Приход
              </button>
              <button
                onClick={() => setType("expense")}
                className={cn(
                  "py-2.5 rounded-lg border text-sm font-medium transition-colors",
                  type === "expense"
                    ? "bg-primary text-primary-foreground border-primary"
                    : "bg-card border-border text-muted-foreground hover:border-primary/50 hover:text-foreground"
                )}
              >
                Расход
              </button>
            </div>
          )}

          {type === "income" ? (
            <IncomeForm today={today} />
          ) : (
            <ExpenseForm
              today={today}
              selectedFund={selectedFund}
              setSelectedFund={setSelectedFund}
              categories={categoriesForFund.map((r) => r.name)}
            />
          )}

          {/* Camera button */}
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

        {/* Footer */}
        <DialogFooter className="px-5 py-4 border-t border-border sm:flex-row">
          <DialogClose asChild>
            <button className="px-4 py-2 rounded-md border border-border bg-card text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground transition-colors">
              Отмена
            </button>
          </DialogClose>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-md bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-opacity"
          >
            Сохранить
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

function IncomeForm({ today }: { today: string }) {
  return (
    <div className="space-y-3">
      <FormField label="Канал">
        <select className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-ring">
          {INCOME_CHANNELS.map((c) => (
            <option key={c}>{c}</option>
          ))}
        </select>
      </FormField>
      <div className="grid grid-cols-2 gap-3">
        <FormField label="Сумма">
          <input
            type="number"
            placeholder="0"
            className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-ring"
          />
        </FormField>
        <FormField label="Валюта">
          <select className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-ring">
            {CURRENCIES.map((c) => (
              <option key={c}>{c}</option>
            ))}
          </select>
        </FormField>
      </div>
      <FormField label="Дата">
        <input
          type="date"
          defaultValue={today}
          className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-ring"
        />
      </FormField>
    </div>
  )
}

function ExpenseForm({
  today,
  selectedFund,
  setSelectedFund,
  categories,
}: {
  today: string
  selectedFund: string
  setSelectedFund: (id: string) => void
  categories: string[]
}) {
  return (
    <div className="space-y-3">
      <FormField label="Фонд">
        <select
          value={selectedFund}
          onChange={(e) => setSelectedFund(e.target.value)}
          className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-ring"
        >
          {FUNDS.map((f) => (
            <option key={f.id} value={f.id}>
              {f.name}
            </option>
          ))}
        </select>
      </FormField>
      <FormField label="Категория">
        <select className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-ring">
          {categories.length > 0 ? (
            categories.map((c) => (
              <option key={c}>{c}</option>
            ))
          ) : (
            <option>Нет категорий</option>
          )}
        </select>
      </FormField>
      <div className="grid grid-cols-2 gap-3">
        <FormField label="Сумма">
          <input
            type="number"
            placeholder="0"
            className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-ring"
          />
        </FormField>
        <FormField label="Валюта">
          <select className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-ring">
            {CURRENCIES.map((c) => (
              <option key={c}>{c}</option>
            ))}
          </select>
        </FormField>
      </div>
      <FormField label="Дата">
        <input
          type="date"
          defaultValue={today}
          className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-ring"
        />
      </FormField>
    </div>
  )
}

function FormField({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <label className="block text-xs font-medium text-muted-foreground">{label}</label>
      {children}
    </div>
  )
}
