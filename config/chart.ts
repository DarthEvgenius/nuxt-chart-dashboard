import type { TCategory } from '~/types'

export const CHART_CONFIG = {
  // Цвета для категорий
  colors: {
    'Электроника': '#6366F1',
    'Одежда': '#8B5CF6',
    'Книги': '#06B6D4',
    'Другое': '#10B981'
  } as Record<TCategory, string>,

  // Дефолтный цвет для неизвестных категорий
  defaultColor: '#6B7280',

  // Настройки графика
  options: {
    tension: 0.4,
    fill: true,
    pointRadius: 4,
    pointHoverRadius: 6
  },
}

export const getCategoryColor = (category: string): string => {
  return CHART_CONFIG.colors[category as TCategory] || CHART_CONFIG.defaultColor
}
