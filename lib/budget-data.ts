export const NAV_STRUCTURE = [
  {
    year: "2026",
    months: [
      { label: "Январь", slug: "january" },
      { label: "Февраль", slug: "february" },
      { label: "Март", slug: "march" },
      { label: "Апрель", slug: "april" },
      { label: "Май", slug: "may" },
      { label: "Июнь", slug: "june" },
    ],
  },
  {
    year: "2025",
    months: [
      { label: "Январь", slug: "january" },
      { label: "Февраль", slug: "february" },
      { label: "Март", slug: "march" },
      { label: "Апрель", slug: "april" },
      { label: "Май", slug: "may" },
      { label: "Июнь", slug: "june" },
      { label: "Июль", slug: "july" },
      { label: "Август", slug: "august" },
      { label: "Сентябрь", slug: "september" },
      { label: "Октябрель", slug: "october" },
      { label: "Ноябрь", slug: "november" },
      { label: "Декабрь", slug: "december" },
    ],
  },
]

export const MONTH_LABELS: Record<string, string> = {
  january: "Январь",
  february: "Февраль",
  march: "Март",
  april: "Апрель",
  may: "Май",
  june: "Июнь",
  july: "Июль",
  august: "Август",
  september: "Сентябрь",
  october: "Октябрь",
  november: "Ноябрь",
  december: "Декабрь",
}

export const SUMMARY = {
  openingBalance: 150,
  incomePlan: 149439,
  incomeFact: 0,
  expensePlan: 116869,
  expenseFact: 0,
  freeBalance: 32570,
  closingBalance: null,
}

export const CURRENCY_RATES = {
  eurHuf: 385.5,
  eurUah: 132.0,
  usdUah: 43.95,
}

export const INCOME_ROWS = [
  {
    id: 1,
    name: "Мультисерч",
    planDate: "03.03",
    planAmount: "44 000",
    planCurrency: "UAH",
    planUah: 44000,
    factDate: null,
    factAmount: null,
    factUah: 0,
  },
  {
    id: 2,
    name: "KIVI USD",
    planDate: "06.03",
    planAmount: "1 700",
    planCurrency: "USD",
    planUah: 74716,
    factDate: null,
    factAmount: null,
    factUah: 0,
  },
  {
    id: 3,
    name: "KIVI HUF",
    planDate: "11.03",
    planAmount: "232 750",
    planCurrency: "HUF",
    planUah: 30723,
    factDate: null,
    factAmount: null,
    factUah: 0,
  },
]

export type ExpenseRow = {
  id: number
  name: string
  planDate: string | null
  planAmount: string | null
  planCurrency: string
  planUah: number
  fundFill: number
  factDate: string | null
  factAmount: string | null
  factUah: number
  remaining: number
}

export type Fund = {
  id: string
  name: string
  nameRu: string
  mandatory: boolean
  limit: number
  allocated: number
  fill: number
  rows: ExpenseRow[]
}

export const FUNDS: Fund[] = [
  {
    id: "essentials",
    name: "Essentials",
    nameRu: "Основные расходы",
    mandatory: true,
    limit: 74769,
    allocated: 0,
    fill: 0,
    rows: [
      { id: 1, name: "Квартира", planDate: "15.03", planAmount: "350 000", planCurrency: "HUF", planUah: 46200, fundFill: 0, factDate: null, factAmount: null, factUah: 0, remaining: 46200 },
      { id: 2, name: "Коммуналка", planDate: "15.03", planAmount: "26 000", planCurrency: "HUF", planUah: 3432, fundFill: 0, factDate: null, factAmount: null, factUah: 0, remaining: 3432 },
      { id: 3, name: "Продукты", planDate: "03.03", planAmount: "20 000", planCurrency: "UAH", planUah: 20000, fundFill: 0, factDate: null, factAmount: null, factUah: 0, remaining: 20000 },
      { id: 4, name: "Быт химия", planDate: "10.03", planAmount: "2 000", planCurrency: "UAH", planUah: 2000, fundFill: 0, factDate: null, factAmount: null, factUah: 0, remaining: 2000 },
      { id: 5, name: "Налоги", planDate: "07.03", planAmount: null, planCurrency: "UAH", planUah: 1760, fundFill: 0, factDate: null, factAmount: null, factUah: 0, remaining: 1760 },
      { id: 6, name: "Подписки", planDate: "01.03", planAmount: null, planCurrency: "UAH", planUah: 1377, fundFill: 0, factDate: null, factAmount: null, factUah: 0, remaining: 1377 },
      { id: 7, name: "Транспорт", planDate: null, planAmount: null, planCurrency: "UAH", planUah: 0, fundFill: 0, factDate: null, factAmount: null, factUah: 0, remaining: 0 },
    ],
  },
  {
    id: "school",
    name: "School",
    nameRu: "Школа",
    mandatory: true,
    limit: 23892,
    allocated: 0,
    fill: 0,
    rows: [
      { id: 8, name: "Школа", planDate: "03.03", planAmount: "152 000", planCurrency: "HUF", planUah: 20064, fundFill: 0, factDate: null, factAmount: null, factUah: 0, remaining: 20064 },
      { id: 9, name: "Бассейн", planDate: "01.03", planAmount: "9 000", planCurrency: "HUF", planUah: 1188, fundFill: 0, factDate: null, factAmount: null, factUah: 0, remaining: 1188 },
      { id: 10, name: "Фонд класса", planDate: "01.03", planAmount: "20 000", planCurrency: "HUF", planUah: 2640, fundFill: 0, factDate: null, factAmount: null, factUah: 0, remaining: 2640 },
    ],
  },
  {
    id: "extracurricular",
    name: "Extracurricular",
    nameRu: "Кружки",
    mandatory: false,
    limit: 1848,
    allocated: 0,
    fill: 0,
    rows: [
      { id: 11, name: "Рисование", planDate: null, planAmount: "14 000", planCurrency: "HUF", planUah: 1848, fundFill: 0, factDate: null, factAmount: null, factUah: 0, remaining: 1848 },
    ],
  },
  {
    id: "beauty",
    name: "Beauty",
    nameRu: "Красота",
    mandatory: false,
    limit: 4100,
    allocated: 0,
    fill: 0,
    rows: [
      { id: 12, name: "Ногти", planDate: "15.03", planAmount: "1 100", planCurrency: "UAH", planUah: 1100, fundFill: 0, factDate: null, factAmount: null, factUah: 0, remaining: 1100 },
      { id: 13, name: "Аптека", planDate: null, planAmount: null, planCurrency: "UAH", planUah: 0, fundFill: 0, factDate: null, factAmount: null, factUah: 0, remaining: 0 },
      { id: 14, name: "Косметика / гигиена", planDate: "01.03", planAmount: "3 000", planCurrency: "UAH", planUah: 3000, fundFill: 0, factDate: null, factAmount: null, factUah: 0, remaining: 3000 },
    ],
  },
  {
    id: "entertainment",
    name: "Entertainment",
    nameRu: "Развлечения",
    mandatory: false,
    limit: 7000,
    allocated: 0,
    fill: 0,
    rows: [
      { id: 15, name: "Кафе / рестораны", planDate: null, planAmount: "5 000", planCurrency: "UAH", planUah: 5000, fundFill: 0, factDate: null, factAmount: null, factUah: 0, remaining: 5000 },
      { id: 16, name: "Досуг", planDate: null, planAmount: "2 000", planCurrency: "UAH", planUah: 2000, fundFill: 0, factDate: null, factAmount: null, factUah: 0, remaining: 2000 },
    ],
  },
  {
    id: "personal",
    name: "Personal",
    nameRu: "Личные",
    mandatory: false,
    limit: 3000,
    allocated: 0,
    fill: 0,
    rows: [
      { id: 17, name: "Одежда", planDate: null, planAmount: "2 000", planCurrency: "UAH", planUah: 2000, fundFill: 0, factDate: null, factAmount: null, factUah: 0, remaining: 2000 },
      { id: 18, name: "Прочее", planDate: null, planAmount: "1 000", planCurrency: "UAH", planUah: 1000, fundFill: 0, factDate: null, factAmount: null, factUah: 0, remaining: 1000 },
    ],
  },
  {
    id: "deposit",
    name: "Deposit",
    nameRu: "Депозит",
    mandatory: false,
    limit: 0,
    allocated: 0,
    fill: 0,
    rows: [],
  },
]

export const CHART_DATA = [
  { name: "Essentials", value: 64, color: "var(--color-chart-1)" },
  { name: "School", value: 20, color: "var(--color-chart-2)" },
  { name: "Entertainment", value: 6, color: "var(--color-chart-3)" },
  { name: "Beauty", value: 3, color: "var(--color-chart-4)" },
  { name: "Extracurricular", value: 2, color: "var(--color-chart-5)" },
  { name: "Others", value: 5, color: "var(--color-chart-6)" },
  { name: "Deposit", value: 0, color: "var(--color-chart-7)" },
  { name: "Personal", value: 0, color: "var(--color-chart-8)" },
]

export const SETTINGS_FUNDS = [
  { id: 1, name: "Essentials", nameRu: "Основные расходы", limit: 74769, currency: "UAH", mandatory: true, dueDay: 15 },
  { id: 2, name: "School", nameRu: "Школа", limit: 23892, currency: "UAH", mandatory: true, dueDay: 3 },
  { id: 3, name: "Extracurricular", nameRu: "Кружки", limit: 1848, currency: "UAH", mandatory: false, dueDay: null },
  { id: 4, name: "Beauty", nameRu: "Красота", limit: 4100, currency: "UAH", mandatory: false, dueDay: null },
  { id: 5, name: "Entertainment", nameRu: "Развлечения", limit: 7000, currency: "UAH", mandatory: false, dueDay: null },
  { id: 6, name: "Personal", nameRu: "Личные", limit: 3000, currency: "UAH", mandatory: false, dueDay: null },
  { id: 7, name: "Deposit", nameRu: "Депозит", limit: 0, currency: "UAH", mandatory: false, dueDay: null },
]

export const SETTINGS_CATEGORIES = [
  { id: 1, fundId: 1, name: "Квартира" },
  { id: 2, fundId: 1, name: "Коммуналка" },
  { id: 3, fundId: 1, name: "Продукты" },
  { id: 4, fundId: 1, name: "Быт химия" },
  { id: 5, fundId: 1, name: "Налоги" },
  { id: 6, fundId: 1, name: "Подписки" },
  { id: 7, fundId: 1, name: "Транспорт" },
  { id: 8, fundId: 2, name: "Школа" },
  { id: 9, fundId: 2, name: "Бассейн" },
  { id: 10, fundId: 2, name: "Фонд класса" },
  { id: 11, fundId: 3, name: "Рисование" },
  { id: 12, fundId: 4, name: "Ногти" },
  { id: 13, fundId: 4, name: "Аптека" },
  { id: 14, fundId: 4, name: "Косметика / гигиена" },
  { id: 15, fundId: 5, name: "Кафе / рестораны" },
  { id: 16, fundId: 5, name: "Досуг" },
  { id: 17, fundId: 6, name: "Одежда" },
  { id: 18, fundId: 6, name: "Прочее" },
]

// Year overview data
export type MonthSummary = {
  month: string
  monthRu: string
  slug: string
  incomePlan: number
  incomeFact: number
  expensePlan: number
  expenseFact: number
  balance: number
  hasData: boolean
}

export const YEAR_MONTHLY_DATA: MonthSummary[] = [
  { month: "Jan", monthRu: "Янв", slug: "january",   incomePlan: 145000, incomeFact: 145000, expensePlan: 112000, expenseFact: 108320, balance: 36680, hasData: true },
  { month: "Feb", monthRu: "Фев", slug: "february",  incomePlan: 148000, incomeFact: 148000, expensePlan: 115000, expenseFact: 117450, balance: 30550, hasData: true },
  { month: "Mar", monthRu: "Мар", slug: "march",     incomePlan: 149439, incomeFact: 0,       expensePlan: 116869, expenseFact: 0,       balance: 0,     hasData: false },
  { month: "Apr", monthRu: "Апр", slug: "april",     incomePlan: 149439, incomeFact: 0,       expensePlan: 116869, expenseFact: 0,       balance: 0,     hasData: false },
  { month: "May", monthRu: "Май", slug: "may",       incomePlan: 149439, incomeFact: 0,       expensePlan: 116869, expenseFact: 0,       balance: 0,     hasData: false },
  { month: "Jun", monthRu: "Июн", slug: "june",      incomePlan: 149439, incomeFact: 0,       expensePlan: 116869, expenseFact: 0,       balance: 0,     hasData: false },
]

export const YEAR_TOTALS = {
  incomePlan: YEAR_MONTHLY_DATA.reduce((s, m) => s + m.incomePlan, 0),
  incomeFact: YEAR_MONTHLY_DATA.reduce((s, m) => s + m.incomeFact, 0),
  expensePlan: YEAR_MONTHLY_DATA.reduce((s, m) => s + m.expensePlan, 0),
  expenseFact: YEAR_MONTHLY_DATA.reduce((s, m) => s + m.expenseFact, 0),
  savedFact: YEAR_MONTHLY_DATA.filter(m => m.hasData).reduce((s, m) => s + (m.incomeFact - m.expenseFact), 0),
}

export function formatUah(amount: number): string {
  return new Intl.NumberFormat("ru-UA", { maximumFractionDigits: 0 }).format(amount) + " ₴"
}

export function formatNumber(amount: number): string {
  return new Intl.NumberFormat("ru-UA", { maximumFractionDigits: 0 }).format(amount)
}
