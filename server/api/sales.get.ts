import type { ISalesData, TPeriod } from "~/types"
import { CATEGORIES } from "~/types"

export default defineEventHandler(async (event) => {
  try {
    const query = getQuery(event)
    
    // Валидация параметров
    if (!query.period || !query.start || !query.end) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Missing required parameters: period, start, end'
      })
    }

    const { period, start, end } = query as { 
      period: TPeriod;
      start: string;
      end: string;
    }

    // Проверяем валидность дат
    const startDate = new Date(start)
    const endDate = new Date(end)

    if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Invalid date format. Use YYYY-MM-DD'
      })
    }

    if (startDate > endDate) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Start date cannot be after end date'
      })
    }

    const salesData = generateSalesData(startDate, endDate)

    return salesData
  } catch (error) {
    console.error('API Error:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Internal Server Error'
    })
  }
})

function generateSalesData(startDate: Date, endDate: Date): ISalesData[] {
  const salesData: ISalesData[] = []
  // дата-счётчик
  const currentDate = new Date(startDate)

  // Базовые диапазоны сумм для каждой категории
  const categoryRanges = {
    'Электроника': { min: 500, max: 3000 },
    'Одежда': { min: 200, max: 1200 },
    'Книги': { min: 100, max: 600 },
    'Другое': { min: 50, max: 400 }
  }

  // Генерируем данные для каждого дня в диапазоне
  while (currentDate <= endDate) {
    const dateString = currentDate.toISOString().split('T')[0]
    
    // Для каждой категории решаем, генерировать ли данные
    for (const category of CATEGORIES) {
      // 70% вероятность что категория будет иметь продажи в этот день
      if (Math.random() < 0.7) {
        const range = categoryRanges[category]
        const amount = Math.floor(
          range.min + Math.random() * (range.max - range.min)
        )
        
        salesData.push({
          date: dateString,
          amount,
          category
        })
      }
    }
    
    // Переходим к следующему дню
    currentDate.setDate(currentDate.getDate() + 1)
  }

  return salesData
}
