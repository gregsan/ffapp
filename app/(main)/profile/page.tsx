"use client"

import { useState } from "react"
import { User, Mail, Send } from "lucide-react"

export default function ProfilePage() {
  const [telegramInput, setTelegramInput] = useState("")
  const [linked, setLinked] = useState(false)

  function handleLink() {
    if (telegramInput.trim()) setLinked(true)
  }

  return (
    <div className="px-6 py-5 space-y-6 max-w-lg">
      <div>
        <h1 className="text-lg font-semibold text-foreground">Профиль</h1>
        <p className="text-xs text-muted-foreground mt-0.5">Управление аккаунтом</p>
      </div>

      {/* Avatar + user info */}
      <div className="rounded-lg border border-border bg-card p-5 flex items-center gap-4">
        <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
          <User className="w-7 h-7 text-primary" />
        </div>
        <div>
          <p className="font-semibold text-foreground">Мария Иванова</p>
          <p className="text-sm text-muted-foreground flex items-center gap-1.5 mt-0.5">
            <Mail className="w-3.5 h-3.5" />
            maria@example.com
          </p>
        </div>
      </div>

      {/* Telegram section */}
      <div className="rounded-lg border border-border bg-card p-5 space-y-4">
        <div className="flex items-center gap-2">
          <Send className="w-4 h-4 text-primary" />
          <h2 className="text-sm font-semibold text-foreground">Telegram</h2>
          {linked && (
            <span className="ml-auto inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium bg-success/15 text-success border border-success/30">
              Привязан
            </span>
          )}
        </div>

        <p className="text-xs text-muted-foreground leading-relaxed">
          Привяжите Telegram для получения уведомлений о транзакциях и напоминаний о предстоящих платежах.
        </p>

        {linked ? (
          <div className="flex items-center justify-between py-2.5 px-3.5 rounded-md bg-muted border border-border">
            <span className="text-sm font-medium text-foreground">@{telegramInput}</span>
            <button
              onClick={() => { setLinked(false); setTelegramInput("") }}
              className="text-xs text-destructive hover:underline"
            >
              Отвязать
            </button>
          </div>
        ) : (
          <div className="flex gap-2">
            <input
              type="text"
              value={telegramInput}
              onChange={(e) => setTelegramInput(e.target.value)}
              placeholder="@username или ID"
              className="flex-1 rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-ring"
            />
            <button
              onClick={handleLink}
              disabled={!telegramInput.trim()}
              className="px-4 py-2 rounded-md bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-opacity disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Привязать
            </button>
          </div>
        )}
      </div>

      {/* Account section */}
      <div className="rounded-lg border border-border bg-card p-5 space-y-3">
        <h2 className="text-sm font-semibold text-foreground">Аккаунт</h2>
        <div className="space-y-2">
          <div className="space-y-1">
            <label className="text-xs font-medium text-muted-foreground">Имя</label>
            <input
              type="text"
              defaultValue="Мария Иванова"
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-ring"
            />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-medium text-muted-foreground">Email</label>
            <input
              type="email"
              defaultValue="maria@example.com"
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-ring"
            />
          </div>
        </div>
        <div className="flex justify-end pt-1">
          <button className="px-4 py-2 rounded-md bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-opacity">
            Сохранить
          </button>
        </div>
      </div>
    </div>
  )
}
