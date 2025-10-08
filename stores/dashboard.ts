import { defineStore } from "pinia"
import type { ISalesData, IMetrics, TPeriod, TCategory } from "@/types"
import { CHART_CONFIG, getCategoryColor } from "~/config/chart"
import { isCategory } from "~/types"


export const useDashboardStore = defineStore('dashboard', () => {
  // State
  const selectedPeriod = ref<TPeriod>('week')

  const dateRange = ref<{ start: string; end: string }>({
    start: getWeekAgo(),
    end: getToday(),
  })

  const salesData = ref<ISalesData[]>([])
  
  const metrics = ref<IMetrics>({
    totalRevenue: 0,
    totalOrders: 0,
    averageOrder: 0,
    uniqueUsers: 0,
  })

  const isLoading = ref(true)
  const error = ref<string | null>(null)

  // кэш для chartData
  let chartCache: any = null
  let lastSalesDataHash = ''

  const createDataHash = (data: ISalesData[]) => {
    return data.length + '_' + data.reduce((sum, item) => sum + item.amount, 0)
  }
  
  // Getters
  const chartData = computed(() => {
    if (salesData.value.length === 0) {
      chartCache = null

      return {
        labels: [],
        datasets: []
      }
    }

    // Проверяем кэш
    const currentHash = createDataHash(salesData.value)
    if (chartCache && lastSalesDataHash === currentHash) {
      return chartCache
    }

    // список уникальных дат и категорий из полученного списка
    const dates = [...new Set(salesData.value.map(item => item.date))].sort()
    const categories = [...new Set(salesData.value.map(item => item.category))]

    // dataset для каждой категории
    const datasets = categories.map(category => {
      const color = getCategoryColor(category)

      return {
        label: category,
        data: dates.map(date => {
          return salesData.value
            .filter(item => item.date === date && item.category === category)
            // на основе этой суммы автоматически рассчитывается ось Y на графике
            .reduce((sum, item) => sum + item.amount, 0)
        }),
        borderColor: color,
        borderWidth: 2,
        backgroundColor: addColorOpacity(color),
        tension: CHART_CONFIG.options.tension,
        fill: CHART_CONFIG.options.fill,
        pointRadius: CHART_CONFIG.options.pointRadius,
        pointHoverRadius: CHART_CONFIG.options.pointHoverRadius,
        pointBackgroundColor: color,
        pointBorderColor: '#ffffff',
        pointBorderWidth: 2
      }
    })
    

    const result = {
      // даты для оси Х в графике
      labels: dates,
      datasets,
    }

    // Сохраняем в кэш
    chartCache = result
    lastSalesDataHash = currentHash
    
    return result
  })

  // человеко-читаемый формат дат
  const formattedDateRange = computed(() => {
    try {
      const start = new Date(dateRange.value.start)
      const end = new Date(dateRange.value.end)
      
      return {
        start: start.toLocaleDateString('ru-RU'),
        end: end.toLocaleDateString('ru-RU')
      }
    } catch {
      return {
        start: dateRange.value.start,
        end: dateRange.value.end
      }
    }
  })

  // проверка наличия данных
  const hasData = computed(() => salesData.value.length > 0)

  // список уникальных категорий
  const categories = computed(() => {
    return [...new Set(salesData.value.map(item => item.category))] as TCategory[]
  })

  
  // Actions
  const fetchData = async () => {
    // isLoading.value = true
    error.value = null

    try {
      const data = await $fetch<ISalesData[]>('/api/sales', {
        query: {
          period: selectedPeriod.value,
          start: dateRange.value.start,
          end: dateRange.value.end
        }
      })
      
      const validatedData = validateSalesData(data)
      
      salesData.value = validatedData
      calculateMetrics(validatedData)
    } catch (err) {
      error.value = 'Ошибка загрузки данных'
      console.error('Ошибка загрузки данных:', err)
    } finally {
      isLoading.value = false
    }
  }

  function calculateMetrics(data: ISalesData[]) {
      const totalRevenue = data.reduce((sum, item) => sum + item.amount, 0)
      const totalOrders = data.length
      const averageOrder = totalOrders > 0 ? totalRevenue / totalOrders : 0
      
      // Mock расчет уникальных пользователей (в реальном приложении это было бы из API)
      const uniqueDates = new Set(data.map(item => item.date)).size
      
      const uniqueUsers = uniqueDates * 150

      metrics.value = {
        totalRevenue,
        totalOrders,
        averageOrder: Math.round(averageOrder),
        uniqueUsers
      }
    }

  function validateSalesData (data: any[]): ISalesData[] {
      return data.filter(item => {
        const isValid = 
          typeof item.date === 'string' &&
          typeof item.amount === 'number' &&
          isCategory(item.category)
        
        if (!isValid) {
          console.warn('Invalid data item:', item)
        }
        
        return isValid
      }) as ISalesData[]
    }
  
  // установка периода с автоматической загрузкой
  const setPeriod = (period: TPeriod) => {
    selectedPeriod.value = period
    const today = getToday()
    
    switch (period) {
      case 'today':
        dateRange.value = { start: today, end: today }
        break
      case 'week':
        dateRange.value = { start: getWeekAgo(), end: today }
        break
      case 'month':
        dateRange.value = { start: getMonthAgo(), end: today }
        break
      case 'custom':
        // Для custom диапазон устанавливается через date picker
        // Здесь не меняем даты, ожидаем ручной ввод
        break
    }
    
    // Автоматически загружаем данные при смене периода
    isLoading.value = true
    fetchData()
  }

  // ручная установка дат
  const setDateRange = (start: string, end: string) => {
    dateRange.value = { start, end }
    selectedPeriod.value = 'custom'
    fetchData()
  }
  
  const resetMetrics = () => {
    metrics.value = {
      totalRevenue: 0,
      totalOrders: 0,
      averageOrder: 0,
      uniqueUsers: 0
    }
  }

  const refresh = () => {
    fetchData()
  }

  // Инициализация при создании store
  onMounted(() => {
    fetchData()
  })

  // Watch для реактивного обновления при изменении dateRange (для custom периода)
  watch(dateRange, () => {
    if (selectedPeriod.value === 'custom') {
      fetchData()
    }
  }, { deep: true })

  return {
    // State
    selectedPeriod,
    dateRange,
    salesData,
    metrics,
    isLoading,
    error,
    
    // Getters
    chartData,
    formattedDateRange,
    hasData,
    categories,
    
    // Actions
    setPeriod,
    setDateRange,
    fetchData,
    refresh,
    validateSalesData
  }
})
