"use client"

import { useState } from "react"
import { SETTINGS_FUNDS, SETTINGS_CATEGORIES } from "@/lib/budget-data"
import { cn } from "@/lib/utils"
import { Plus, Trash2 } from "lucide-react"

export default function SettingsPage() {
  const [activeFund, setActiveFund] = useState<number | null>(null)

  const groupedCategories = SETTINGS_FUNDS.map((fund) => ({
    fund,
    categories: SETTINGS_CATEGORIES.filter((c) => c.fundId === fund.id),
  }))

  return (
    <div className="px-6 py-5 space-y-6 max-w-3xl">
      <div>
        <h1 className="text-lg font-semibold text-foreground">Настройки</h1>
        <p className="text-xs text-muted-foreground mt-0.5">Управление фондами и категориями</p>
      </div>

      {/* Section 1 — Funds */}
      <section>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-semibold text-foreground">Фонды</h2>
          <button className="flex items-center gap-1.5 text-xs font-medium text-primary hover:underline">
            <Plus className="w-3.5 h-3.5" />
            Добавить фонд
          </button>
        </div>

        <div className="rounded-lg border border-border bg-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/40">
                  <th className="text-left px-4 py-2.5 text-xs font-medium text-muted-foreground">Название</th>
                  <th className="text-right px-4 py-2.5 text-xs font-medium text-muted-foreground">Лимит</th>
                  <th className="text-center px-4 py-2.5 text-xs font-medium text-muted-foreground">Валюта</th>
                  <th className="text-center px-4 py-2.5 text-xs font-medium text-muted-foreground">День оплаты</th>
                  <th className="text-center px-4 py-2.5 text-xs font-medium text-muted-foreground">Обязательный</th>
                  <th className="w-10" />
                </tr>
              </thead>
              <tbody>
                {SETTINGS_FUNDS.map((fund, i) => (
                  <tr
                    key={fund.id}
                    className={cn(
                      "border-b border-border/40 last:border-b-0",
                      fund.mandatory && "border-l-2 border-l-warning",
                      i % 2 === 1 && "bg-muted/15"
                    )}
                  >
                    <td className="px-4 py-2.5">
                      <div className="flex flex-col">
                        <span className="font-medium text-foreground">{fund.name}</span>
                        <span className="text-[11px] text-muted-foreground">{fund.nameRu}</span>
                      </div>
                    </td>
                    <td className="text-right px-4 py-2.5 tabular-nums text-foreground">
                      {fund.limit > 0 ? fund.limit.toLocaleString("ru") : "—"}
                    </td>
                    <td className="text-center px-4 py-2.5 text-muted-foreground">{fund.currency}</td>
                    <td className="text-center px-4 py-2.5 text-muted-foreground">
                      {fund.dueDay != null ? `${fund.dueDay}-е` : "—"}
                    </td>
                    <td className="text-center px-4 py-2.5">
                      <div
                        className={cn(
                          "inline-flex w-8 h-4 rounded-full transition-colors relative cursor-default",
                          fund.mandatory ? "bg-primary" : "bg-muted"
                        )}
                      >
                        <div
                          className={cn(
                            "absolute top-0.5 w-3 h-3 rounded-full bg-white shadow transition-transform",
                            fund.mandatory ? "translate-x-4" : "translate-x-0.5"
                          )}
                        />
                      </div>
                    </td>
                    <td className="px-2 py-2.5">
                      <button className="p-1.5 rounded-md text-muted-foreground hover:bg-muted hover:text-destructive transition-colors">
                        <Trash2 className="w-3.5 h-3.5" />
                        <span className="sr-only">Удалить</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Section 2 — Categories */}
      <section>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-semibold text-foreground">Категории</h2>
          <button className="flex items-center gap-1.5 text-xs font-medium text-primary hover:underline">
            <Plus className="w-3.5 h-3.5" />
            Добавить категорию
          </button>
        </div>

        <div className="space-y-3">
          {groupedCategories.map(({ fund, categories }) => (
            <div key={fund.id} className="rounded-lg border border-border bg-card overflow-hidden">
              <div
                className={cn(
                  "flex items-center gap-2 px-4 py-2.5 bg-muted/40 border-b border-border cursor-pointer select-none",
                  fund.mandatory && "border-l-2 border-l-warning"
                )}
                onClick={() => setActiveFund(activeFund === fund.id ? null : fund.id)}
              >
                <span className="text-xs font-semibold text-foreground uppercase tracking-wide">{fund.name}</span>
                {fund.mandatory && (
                  <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium bg-warning/15 text-warning-foreground border border-warning/30">
                    обязательный
                  </span>
                )}
                <span className="ml-auto text-xs text-muted-foreground">{categories.length} кат.</span>
              </div>

              {(activeFund === null || activeFund === fund.id) && (
                <ul className="divide-y divide-border/40">
                  {categories.length === 0 ? (
                    <li className="px-4 py-3 text-sm text-muted-foreground">Нет категорий</li>
                  ) : (
                    categories.map((cat) => (
                      <li key={cat.id} className="flex items-center justify-between px-4 py-2.5">
                        <span className="text-[13px] text-foreground">{cat.name}</span>
                        <button className="p-1.5 rounded-md text-muted-foreground hover:bg-muted hover:text-destructive transition-colors">
                          <Trash2 className="w-3.5 h-3.5" />
                          <span className="sr-only">Удалить</span>
                        </button>
                      </li>
                    ))
                  )}
                </ul>
              )}
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
