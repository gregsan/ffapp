"use client"

import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts"
import { CHART_DATA } from "@/lib/budget-data"

const COLORS = [
  "#3b82f6", // blue
  "#22c55e", // green
  "#f59e0b", // amber
  "#ef4444", // red
  "#8b5cf6", // violet
  "#6b7280", // gray
  "#06b6d4", // cyan
  "#f97316", // orange
]

const RADIAN = Math.PI / 180

function CustomLabel({
  cx, cy, midAngle, innerRadius, outerRadius, percent, name, value,
}: {
  cx: number; cy: number; midAngle: number; innerRadius: number; outerRadius: number; percent: number; name: string; value: number
}) {
  if (value === 0) return null
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5
  const x = cx + radius * Math.cos(-midAngle * RADIAN)
  const y = cy + radius * Math.sin(-midAngle * RADIAN)

  return (
    <text
      x={x}
      y={y}
      fill="white"
      textAnchor="middle"
      dominantBaseline="central"
      fontSize={11}
      fontWeight={600}
    >
      {`${value}%`}
    </text>
  )
}

export function ExpenseChart() {
  const data = CHART_DATA.filter((d) => d.value > 0)

  return (
    <div className="rounded-lg border border-border bg-card">
      <div className="px-4 py-3 border-b border-border">
        <h2 className="text-sm font-semibold text-foreground">Расходы по фондам</h2>
        <p className="text-xs text-muted-foreground mt-0.5">Плановое распределение</p>
      </div>
      <div className="p-4">
        <ResponsiveContainer width="100%" height={280}>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={70}
              outerRadius={110}
              paddingAngle={2}
              dataKey="value"
              labelLine={false}
              label={CustomLabel as unknown as boolean}
            >
              {data.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                  stroke="transparent"
                />
              ))}
            </Pie>
            <Tooltip
              formatter={(value: number) => [`${value}%`, ""]}
              contentStyle={{
                fontSize: 12,
                borderRadius: 8,
                border: "1px solid var(--border)",
                background: "var(--card)",
                color: "var(--card-foreground)",
              }}
            />
            <Legend
              iconType="circle"
              iconSize={8}
              formatter={(value) => (
                <span style={{ fontSize: 12, color: "var(--muted-foreground)" }}>{value}</span>
              )}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
