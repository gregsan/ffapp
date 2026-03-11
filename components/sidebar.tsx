"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useState } from "react"
import { ChevronRight, Settings, User, Wallet, ChevronDown } from "lucide-react"
import { cn } from "@/lib/utils"
import { NAV_STRUCTURE } from "@/lib/budget-data"
import { ThemeToggle } from "@/components/theme-toggle"

export function Sidebar() {
  const pathname = usePathname()
  const [expandedYears, setExpandedYears] = useState<Record<string, boolean>>({
    "2026": true,
    "2025": false,
  })

  function toggleYear(year: string) {
    setExpandedYears((prev) => ({ ...prev, [year]: !prev[year] }))
  }

  return (
    <aside className="flex flex-col h-full bg-sidebar border-r border-sidebar-border">
      {/* Logo */}
      <div className="flex items-center gap-2.5 px-4 h-14 border-b border-sidebar-border shrink-0">
        <div className="w-7 h-7 rounded-md bg-primary flex items-center justify-center shrink-0">
          <Wallet className="w-4 h-4 text-primary-foreground" />
        </div>
        <span className="font-semibold text-sidebar-foreground tracking-tight text-[15px]">Бюджет</span>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-3 px-2">
        <p className="px-2 mb-1 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/60">
          Периоды
        </p>
        <ul className="space-y-0.5">
          {NAV_STRUCTURE.map((yearGroup) => {
            const isExpanded = expandedYears[yearGroup.year]
            const isYearActive = pathname.startsWith(`/${yearGroup.year}`)

            return (
              <li key={yearGroup.year}>
                {/* Year row */}
                <div className="flex items-center">
                  <Link
                    href={`/year/${yearGroup.year}`}
                    className={cn(
                      "flex-1 flex items-center gap-1.5 px-2 py-1.5 rounded-md text-sm font-medium transition-colors",
                      "text-sidebar-foreground/80 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                      pathname === `/year/${yearGroup.year}` && "bg-sidebar-accent text-sidebar-accent-foreground"
                    )}
                  >
                    {yearGroup.year}
                  </Link>
                  <button
                    onClick={() => toggleYear(yearGroup.year)}
                    className="p-1.5 rounded-md hover:bg-sidebar-accent text-muted-foreground hover:text-sidebar-accent-foreground transition-colors"
                    aria-label={isExpanded ? "Свернуть" : "Развернуть"}
                  >
                    <ChevronDown
                      className={cn("w-3.5 h-3.5 transition-transform", isExpanded && "rotate-0", !isExpanded && "-rotate-90")}
                    />
                  </button>
                </div>

                {/* Months */}
                {isExpanded && (
                  <ul className="ml-3 mt-0.5 space-y-0.5 border-l border-sidebar-border pl-2">
                    {yearGroup.months.map((month) => {
                      const href = `/${yearGroup.year}/${month.slug}`
                      const isActive = pathname === href
                      return (
                        <li key={month.slug}>
                          <Link
                            href={href}
                            className={cn(
                              "flex items-center gap-1.5 px-2 py-1.5 rounded-md text-[13px] transition-colors",
                              "text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                              isActive &&
                                "bg-sidebar-primary text-sidebar-primary-foreground font-medium hover:bg-sidebar-primary hover:text-sidebar-primary-foreground"
                            )}
                          >
                            {isActive && <ChevronRight className="w-3 h-3 shrink-0" />}
                            {month.label}
                          </Link>
                        </li>
                      )
                    })}
                  </ul>
                )}
              </li>
            )
          })}
        </ul>
      </nav>

      {/* Bottom links */}
      <div className="shrink-0 border-t border-sidebar-border px-2 py-3 space-y-0.5">
        <div className="flex items-center justify-end px-2 pb-1">
          <ThemeToggle />
        </div>
        <Link
          href="/settings"
          className={cn(
            "flex items-center gap-2.5 px-2 py-2 rounded-md text-sm transition-colors",
            "text-sidebar-foreground/80 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
            pathname === "/settings" && "bg-sidebar-accent text-sidebar-accent-foreground font-medium"
          )}
        >
          <Settings className="w-4 h-4 shrink-0" />
          Настройки
        </Link>
        <Link
          href="/profile"
          className={cn(
            "flex items-center gap-2.5 px-2 py-2 rounded-md text-sm transition-colors",
            "text-sidebar-foreground/80 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
            pathname === "/profile" && "bg-sidebar-accent text-sidebar-accent-foreground font-medium"
          )}
        >
          <User className="w-4 h-4 shrink-0" />
          Профиль
        </Link>
      </div>
    </aside>
  )
}
