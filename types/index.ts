// Основной тип категорий
export type TCategory = 
  | 'Электроника'
  | 'Одежда' 
  | 'Книги'
  | 'Другое'

// Константа с доступными категориями для runtime проверок
export const CATEGORIES: TCategory[] = [
  'Электроника',
  'Одежда', 
  'Книги',
  'Другое'
]

// Type Guard для проверки категорий
export const isCategory = (value: string): value is TCategory => {
  return CATEGORIES.includes(value as TCategory)
}

// Вспомогательный тип для данных
export interface ISalesData {
  date: string // YYYY-MM-DD
  amount: number
  category: TCategory
}

export type TPeriod = 'today' | 'week' | 'month' | 'custom'

export interface IMetrics {
  totalRevenue: number
  totalOrders: number
  averageOrder: number
  uniqueUsers: number
}

export type MetricKey = keyof IMetrics
