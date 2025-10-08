<template>
  <v-card class="sales-chart">
    <v-card-title class="d-flex align-center">
      <span>Динамика продаж по категориям</span>
      <v-spacer></v-spacer>
      <v-chip variant="outlined" size="small">
        Всего: {{ totalSales }} ₽
      </v-chip>
    </v-card-title>
    
    <v-card-text class="pa-0">
      <div class="chart-container" :class="{ 'chart-loading': isLoading }">
        <!-- skeleton loader -->
        <ChartSkeleton v-if="isLoading" />
        
        <!-- Empty state -->
        <div v-else-if="!hasData" class="chart-empty">
          <v-icon size="64" class="mb-2">mdi-chart-line</v-icon>
          <div class="text-h6">Нет данных для отображения</div>
          <div class="text-caption">Выберите другой период</div>
        </div>
        
        <!-- Chart with animations -->
        <div v-else class="chart-wrapper">
          <Line 
            :data="chartData"
            :options="chartOptions"
            :key="chartKey"
            class="chart-element"
          />
        </div>
      </div>
    </v-card-text>
  </v-card>
</template>

<script setup lang="ts">
import { useTheme } from 'vuetify'
import { Line } from 'vue-chartjs'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
  type ChartOptions
} from 'chart.js'

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
)

interface Props {
  chartData: any
  isLoading: boolean
  hasData: boolean
}

const props = defineProps<Props>()
const theme = useTheme()

const chartKey = ref(0)

watch(() => theme.global.name.value, () => {
  chartKey.value++
})

watch(() => props.chartData, () => {
  chartKey.value++
})

const totalSales = computed(() => {
  if (!props.chartData?.datasets) return 0
  return props.chartData.datasets
    .flatMap((dataset: any) => dataset.data)
    .reduce((sum: number, value: number) => sum + value, 0)
    .toLocaleString('ru-RU')
})

const chartOptions = computed<ChartOptions<'line'>>(() => {
  const isDark = theme.global.name.value === 'dark'
  const textColor = isDark ? '#e2e8f0' : '#374151'
  const gridColor = isDark ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.1)'
  const tooltipBg = isDark ? 'rgba(30, 41, 59, 0.95)' : 'rgba(99, 102, 241, 0.95)'
  
  return {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      mode: 'index',
      intersect: false
    },
    plugins: {
      legend: {
        position: 'top',
        labels: {
          usePointStyle: true,
          color: textColor
        }
      },
      tooltip: {
        backgroundColor: tooltipBg,
        titleColor: 'white',
        bodyColor: 'white',
        titleFont: {
          size: 16
        },
        bodyFont: {
          size: 14
        },
        padding: 12,
        displayColors: true,
        callbacks: {
          // формирование строк в тултипах
          label: function(context) {
            const label = context.dataset.label || ''
            const value = context.parsed.y.toLocaleString('ru-RU')
            return ` ${label}: ${value} ₽`
          }
        }
      }
    },
    scales: {
      x: {
        grid: {
          color: gridColor
        },
        ticks: {
          color: textColor
        }
      },
      y: {
        beginAtZero: true,
        grid: {
          color: gridColor
        },
        ticks: {
          color: textColor,
          callback: function(value) {
            // форматируем числа для подписей чекпойнтов
            return value.toLocaleString('ru-RU') + ' ₽'
          }
        }
      }
    },
    animation: {
      duration: 1000,
      easing: 'easeOutQuart',
    },
    elements: {
      point: {
        radius: 4,
        hoverRadius: 8,
        hoverBackgroundColor: isDark ? '#1e293b' : 'white',
        hoverBorderWidth: 3,
      },
      line: {
        tension: 0.3,
        borderWidth: 3,
      }
    },
  }
})
</script>

<style scoped>
.sales-chart {
  height: 100%;
  overflow: hidden;
}

.chart-container {
  height: 400px;
  position: relative;
  padding: 16px;
  transition: all 0.5s ease-in-out;
}

.chart-wrapper {
  height: 100%;
  position: relative;
  animation: chartSlideIn 0.8s ease-out;
}

.chart-element {
  animation: chartFadeIn 1.2s ease-out;
}

.chart-loading {
  opacity: 0.9;
  transition: opacity 0.3s ease;
}

.chart-empty {
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: rgba(var(--v-theme-on-surface), var(--v-medium-emphasis-opacity));
}

@keyframes chartSlideIn {
  0% {
    opacity: 0;
    transform: translateY(30px);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes chartFadeIn {
  0% {
    opacity: 0;
  }
  60% {
    opacity: 0.6;
  }
  100% {
    opacity: 1;
  }
}

@keyframes fadeIn {
  0% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
}

@media (max-width: 768px) {
  .chart-container {
    height: 300px;
  }
  
  @keyframes chartSlideIn {
    0% {
      opacity: 0;
      transform: translateY(20px);
    }
    100% {
      opacity: 1;
      transform: translateY(0);
    }
  }
}

</style>