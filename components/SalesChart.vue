<template>
  <v-card class="sales-chart" elevation="2" rounded="lg">
    <v-card-title class="d-flex align-center">
      <span>Динамика продаж по категориям</span>
      <v-spacer></v-spacer>
      <v-chip variant="outlined" size="small">
        {{ totalSales }} ₽
      </v-chip>
    </v-card-title>
    
    <v-card-text class="pa-0">
      <div class="chart-container" :class="{ 'chart-loading': isLoading }">
        <!-- Улучшенный Skeleton loader -->
        <div v-if="isLoading" class="chart-skeleton">
          <div class="skeleton-header">
            <div class="skeleton-title shimmer"></div>
            <div class="skeleton-legend">
              <div v-for="i in 4" :key="i" class="skeleton-legend-item">
                <div class="skeleton-legend-color shimmer"></div>
                <div class="skeleton-legend-text shimmer"></div>
              </div>
            </div>
          </div>
          <div class="skeleton-chart-area">
            <div class="skeleton-y-axis">
              <div v-for="i in 6" :key="i" class="skeleton-y-label shimmer"></div>
            </div>
            <div class="skeleton-graph">
              <div v-for="i in 4" :key="i" class="skeleton-line-container">
                <div class="skeleton-line shimmer" :style="getLineStyle(i)"></div>
              </div>
              <div class="skeleton-x-axis">
                <div v-for="i in 8" :key="i" class="skeleton-x-label shimmer"></div>
              </div>
            </div>
          </div>
        </div>
        
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
const { $theme } = useNuxtApp()

const chartKey = ref(0)

watch(() => $theme.current.value, () => {
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

// Функция для генерации случайных стилей линий скелетона
const getLineStyle = (index: number) => {
  const heights = [65, 45, 80, 30, 60, 25, 70, 50]
  const delays = [0, 0.3, 0.6, 0.9, 1.2, 1.5, 1.8, 2.1]
  
  return {
    height: `${heights[index % heights.length]}%`,
    animationDelay: `${delays[index % delays.length]}s`
  }
}

// Улучшенные опции Chart.js с расширенными анимациями
const chartOptions = computed<ChartOptions<'line'>>(() => {
  const isDark = $theme.current.value === 'dark'
  const textColor = isDark ? '#e2e8f0' : '#374151'
  const gridColor = isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)'
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
          padding: 15,
          font: {
            size: 12
          },
          color: textColor
        }
      },
      tooltip: {
        backgroundColor: tooltipBg,
        titleColor: 'white',
        bodyColor: 'white',
        titleFont: {
          size: 13
        },
        bodyFont: {
          size: 13
        },
        padding: 12,
        cornerRadius: 8,
        displayColors: true,
        callbacks: {
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
          display: false
        },
        ticks: {
          font: {
            size: 11
          },
          color: textColor
        }
      },
      y: {
        beginAtZero: true,
        grid: {
          color: gridColor
        },
        ticks: {
          font: {
            size: 11
          },
          color: textColor,
          callback: function(value) {
            return value.toLocaleString('ru-RU') + ' ₽'
          }
        }
      }
    },
    // Расширенные настройки анимации
    animation: {
      duration: 2000,
      easing: 'easeOutQuart',
      onProgress: function(animation: any) {
        // Дополнительные callback'и для анимации
      },
      onComplete: function() {
        // Анимация завершена
      }
    },
    animations: {
      tension: {
        duration: 2000,
        easing: 'easeOutQuart',
        from: 0.8,
        to: 0.4
      },
      points: {
        duration: 1000,
        easing: 'easeOutBounce',
        from: 1,
        to: 0.5
      }
    },
    elements: {
      point: {
        radius: 4,
        hoverRadius: 8,
        hoverBackgroundColor: isDark ? '#1e293b' : 'white',
        hoverBorderWidth: 3,
        // Анимация точек
        animation: {
          duration: 1500,
          easing: 'easeOutElastic'
        }
      },
      line: {
        tension: 0.4,
        borderWidth: 3,
        // Анимация линий
        animation: {
          duration: 2000,
          easing: 'easeOutQuart'
        }
      }
    },
    transitions: {
      active: {
        animation: {
          duration: 500
        }
      }
    }
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

/* Улучшенный скелетон */
.chart-skeleton {
  height: 100%;
  padding: 16px;
  position: relative;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.skeleton-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 8px;
}

.skeleton-title {
  width: 200px;
  height: 24px;
  border-radius: 6px;
  background: linear-gradient(90deg, #f0f0f0 25%, #e8e8e8 50%, #f0f0f0 75%);
  background-size: 200% 100%;
}

.skeleton-legend {
  display: flex;
  gap: 16px;
}

.skeleton-legend-item {
  display: flex;
  align-items: center;
  gap: 6px;
}

.skeleton-legend-color {
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background: linear-gradient(90deg, #f0f0f0 25%, #e8e8e8 50%, #f0f0f0 75%);
  background-size: 200% 100%;
}

.skeleton-legend-text {
  width: 60px;
  height: 12px;
  border-radius: 4px;
  background: linear-gradient(90deg, #f0f0f0 25%, #e8e8e8 50%, #f0f0f0 75%);
  background-size: 200% 100%;
}

.skeleton-chart-area {
  flex: 1;
  display: flex;
  gap: 12px;
  position: relative;
}

.skeleton-y-axis {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  width: 50px;
}

.skeleton-y-label {
  width: 40px;
  height: 12px;
  border-radius: 3px;
  background: linear-gradient(90deg, #f0f0f0 25%, #e8e8e8 50%, #f0f0f0 75%);
  background-size: 200% 100%;
}

.skeleton-graph {
  flex: 1;
  display: flex;
  flex-direction: column;
  position: relative;
}

.skeleton-line-container {
  flex: 1;
  position: relative;
  margin-bottom: 4px;
}

.skeleton-line {
  width: 100%;
  border-radius: 8px;
  background: linear-gradient(90deg, #f0f0f0 25%, #e8e8e8 50%, #f0f0f0 75%);
  background-size: 200% 100%;
  animation: skeletonWave 2s infinite;
  position: absolute;
  bottom: 0;
}

.skeleton-x-axis {
  display: flex;
  justify-content: space-between;
  margin-top: 8px;
  height: 20px;
}

.skeleton-x-label {
  width: 30px;
  height: 12px;
  border-radius: 3px;
  background: linear-gradient(90deg, #f0f0f0 25%, #e8e8e8 50%, #f0f0f0 75%);
  background-size: 200% 100%;
}

/* Эффект мерцания (shimmer) */
.shimmer {
  animation: skeletonWave 2s infinite;
  background-size: 200% 100%;
}

/* Keyframe анимации */
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

@keyframes skeletonWave {
  0% {
    background-position: -200% 0;
  }
  100% {
    background-position: 200% 0;
  }
}

@keyframes skeletonPulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.7;
  }
}

/* Анимация для смены темы */
:deep(.v-theme--dark) .skeleton-title,
:deep(.v-theme--dark) .skeleton-legend-color,
:deep(.v-theme--dark) .skeleton-legend-text,
:deep(.v-theme--dark) .skeleton-y-label,
:deep(.v-theme--dark) .skeleton-line,
:deep(.v-theme--dark) .skeleton-x-label {
  background: linear-gradient(90deg, #374151 25%, #4b5563 50%, #374151 75%);
}

/* Дополнительная анимация для всего скелетона */
.chart-skeleton::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(
    90deg,
    transparent,
    rgba(255, 255, 255, 0.4),
    transparent
  );
  animation: skeletonShimmer 2s infinite;
  z-index: 2;
}

:deep(.v-theme--dark) .chart-skeleton::before {
  background: linear-gradient(
    90deg,
    transparent,
    rgba(255, 255, 255, 0.1),
    transparent
  );
}

@keyframes skeletonShimmer {
  0% {
    left: -100%;
  }
  100% {
    left: 100%;
  }
}

/* Адаптивность */
@media (max-width: 768px) {
  .chart-container {
    height: 300px;
  }
  
  .skeleton-legend {
    flex-wrap: wrap;
    gap: 8px;
  }
  
  .skeleton-legend-item {
    flex: 0 0 calc(50% - 8px);
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

/* Улучшенная анимация для точек графика при hover */
:deep(.chartjs-render-monitor) {
  transition: all 0.3s ease;
}

:deep(.chartjs-render-monitor:hover) {
  filter: brightness(1.05);
}

/* Увеличиваем размер скелетона и добавляем глубину */
.chart-skeleton {
  transform: scale(1.02);
  transform-origin: center;
  transition: transform 0.3s ease;
}

.chart-loading .chart-skeleton {
  animation: skeletonPulse 2s ease-in-out infinite;
}

/* Задержки для последовательной анимации элементов скелетона */
.skeleton-y-label:nth-child(1) { animation-delay: 0.1s; }
.skeleton-y-label:nth-child(2) { animation-delay: 0.2s; }
.skeleton-y-label:nth-child(3) { animation-delay: 0.3s; }
.skeleton-y-label:nth-child(4) { animation-delay: 0.4s; }
.skeleton-y-label:nth-child(5) { animation-delay: 0.5s; }
.skeleton-y-label:nth-child(6) { animation-delay: 0.6s; }

.skeleton-legend-item:nth-child(1) .shimmer { animation-delay: 0.1s; }
.skeleton-legend-item:nth-child(2) .shimmer { animation-delay: 0.2s; }
.skeleton-legend-item:nth-child(3) .shimmer { animation-delay: 0.3s; }
.skeleton-legend-item:nth-child(4) .shimmer { animation-delay: 0.4s; }

.skeleton-x-label:nth-child(1) { animation-delay: 0.1s; }
.skeleton-x-label:nth-child(2) { animation-delay: 0.2s; }
.skeleton-x-label:nth-child(3) { animation-delay: 0.3s; }
.skeleton-x-label:nth-child(4) { animation-delay: 0.4s; }
.skeleton-x-label:nth-child(5) { animation-delay: 0.5s; }
.skeleton-x-label:nth-child(6) { animation-delay: 0.6s; }
.skeleton-x-label:nth-child(7) { animation-delay: 0.7s; }
.skeleton-x-label:nth-child(8) { animation-delay: 0.8s; }
</style>