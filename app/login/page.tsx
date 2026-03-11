"use client"

import { useState } from "react"
import Link from "next/link"
import { Wallet, Eye, EyeOff } from "lucide-react"

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="w-full max-w-sm space-y-8">
        {/* Logo */}
        <div className="flex flex-col items-center gap-3">
          <div className="w-11 h-11 rounded-xl bg-primary flex items-center justify-center">
            <Wallet className="w-6 h-6 text-primary-foreground" />
          </div>
          <div className="text-center">
            <h1 className="text-xl font-semibold text-foreground">Бюджет</h1>
            <p className="text-sm text-muted-foreground mt-0.5">Семейный бюджет</p>
          </div>
        </div>

        {/* Form */}
        <div className="rounded-xl border border-border bg-card p-6 space-y-4">
          <h2 className="text-[15px] font-semibold text-foreground">Вход в аккаунт</h2>

          <div className="space-y-1.5">
            <label htmlFor="email" className="block text-xs font-medium text-muted-foreground">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="maria@example.com"
              autoComplete="email"
              className="w-full rounded-md border border-input bg-background px-3 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-ring placeholder:text-muted-foreground/50"
            />
          </div>

          <div className="space-y-1.5">
            <label htmlFor="password" className="block text-xs font-medium text-muted-foreground">
              Пароль
            </label>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                autoComplete="current-password"
                className="w-full rounded-md border border-input bg-background px-3 py-2.5 text-sm pr-10 focus:outline-none focus:ring-1 focus:ring-ring placeholder:text-muted-foreground/50"
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                aria-label={showPassword ? "Скрыть пароль" : "Показать пароль"}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                className="w-4 h-4 rounded border-input accent-primary"
              />
              <span className="text-xs text-muted-foreground">Запомнить меня</span>
            </label>
            <button className="text-xs text-primary hover:underline">Забыли пароль?</button>
          </div>

          <Link
            href="/2026/march"
            className="block w-full py-2.5 rounded-md bg-primary text-primary-foreground text-sm font-medium text-center hover:opacity-90 transition-opacity"
          >
            Войти
          </Link>

          <p className="text-[11px] text-center text-muted-foreground">
            Аутентификация через{" "}
            <span className="font-medium text-foreground">Supabase Auth</span>
          </p>
        </div>
      </div>
    </div>
  )
}
