"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { CalendarDays, Settings, User, BarChart2 } from "lucide-react"
import { cn } from "@/lib/utils"

const items = [
  { href: "/2026/march", label: "Март", icon: CalendarDays },
  { href: "/year/2026", label: "Год", icon: BarChart2 },
  { href: "/settings", label: "Настройки", icon: Settings },
  { href: "/profile", label: "Профиль", icon: User },
]

export function MobileNav() {
  const pathname = usePathname()

  return (
    <nav className="md:hidden flex items-center border-t border-border bg-background shrink-0 h-14">
      {items.map(({ href, label, icon: Icon }) => {
        const isActive = pathname === href
        return (
          <Link
            key={href}
            href={href}
            className={cn(
              "flex-1 flex flex-col items-center justify-center gap-0.5 py-2 text-[10px] font-medium transition-colors",
              isActive ? "text-primary" : "text-muted-foreground"
            )}
          >
            <Icon className="w-5 h-5" />
            {label}
          </Link>
        )
      })}
    </nav>
  )
}
