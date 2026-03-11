"use client"

import { useState } from "react"
import { use } from "react"
import { MONTH_LABELS, FUNDS, formatUah } from "@/lib/budget-data"
import { SummaryCards } from "@/components/month-view/summary-cards"
import { CurrencyRates } from "@/components/month-view/currency-rates"
import { IncomeTable } from "@/components/month-view/income-table"
import { ExpenseTable } from "@/components/month-view/expense-table"
import { FundAllocation } from "@/components/month-view/fund-allocation"
import { ExpenseChart } from "@/components/month-view/expense-chart"
import { AddTransactionModal } from "@/components/add-transaction-modal"
import { MobileSummaryView } from "@/components/month-view/mobile-summary-view"
import { Plus } from "lucide-react"

interface PageProps {
  params: Promise<{ year: string; month: string }>
}

export default function MonthPage({ params }: PageProps) {
  const { year, month } = use(params)
  const monthLabel = MONTH_LABELS[month] ?? month
  const [modalOpen, setModalOpen] = useState(false)
  const [modalType, setModalType] = useState<"income" | "expense" | undefined>(undefined)

  function openModal(type?: "income" | "expense") {
    setModalType(type)
    setModalOpen(true)
  }

  const [refreshKey, setRefreshKey] = useState(0)

  function handleModalClose() {
    setModalOpen(false)
    setRefreshKey(k => k + 1) // триггерим перезагрузку
  }
  


  return (
    <>
      {/* Desktop & tablet layout */}
      <div className="px-6 py-5 space-y-5 hidden md:block">
        {/* Page heading */}
        <div>
          <h1 className="text-lg font-semibold text-foreground">
            {monthLabel} {year}
          </h1>
          <p className="text-xs text-muted-foreground mt-0.5">Семейный бюджет</p>
        </div>

        {/* Section 1 — Summary */}
        <SummaryCards />

        {/* Section 2 — Currency rates */}
        <CurrencyRates />

        {/* Section 3 — Income table */}
        <IncomeTable
          key={`income-${refreshKey}`}
          year={year}
          month={month}
          onAddIncome={() => openModal("income")}
        />


        {/* Section 4 — Expense table */}
        <ExpenseTable
          key={`expense-${refreshKey}`}
          year={year}
          month={month}
          onAddExpense={() => openModal("expense")}
        />

        {/* Section 5 & 6 — Fund allocation + chart (side by side on wide screens) */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">
          <div className="xl:col-span-2">
            <FundAllocation />
          </div>
          <div>
            <ExpenseChart />
          </div>
        </div>
      </div>

      {/* Mobile layout */}
      <div className="md:hidden">
        <MobileSummaryView onAdd={() => openModal(undefined)} />
      </div>

      {/* FAB on mobile */}
      <button
        onClick={() => openModal(undefined)}
        className="md:hidden fixed bottom-20 right-4 w-14 h-14 rounded-full bg-primary text-primary-foreground shadow-lg flex items-center justify-center z-40 hover:opacity-90 transition-opacity"
        aria-label="Добавить транзакцию"
      >
        <Plus className="w-6 h-6" />
      </button>

      {/* Modal */}
      <AddTransactionModal
        open={modalOpen}
        onClose={handleModalClose}
        defaultType={modalType}
      />

    </>
  )
}
