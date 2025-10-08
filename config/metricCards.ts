import type { MetricCardConfig } from '~/types'

// Конфигурация карточек метрик
export const metricCards: MetricCardConfig[] = [
  { 
    title: 'Общий доход', 
    key: 'totalRevenue', 
    format: 'currency' as const,
    trend: 12.5,
    variant: 'primary' as const,
    icon: 'mdi-cash'
  },
  { 
    title: 'Количество заказов', 
    key: 'totalOrders', 
    format: 'number' as const,
    trend: -8.3,
    variant: 'secondary' as const,
    icon: 'mdi-shopping'
  },
  { 
    title: 'Средний чек', 
    key: 'averageOrder', 
    format: 'currency' as const,
    trend: 3.7,
    variant: 'default' as const,
    icon: 'mdi-receipt'
  },
  { 
    title: 'Уникальные пользователи', 
    key: 'uniqueUsers', 
    format: 'number' as const,
    trend: 15.2,
    variant: 'default' as const,
    icon: 'mdi-account-group'
  }
]
