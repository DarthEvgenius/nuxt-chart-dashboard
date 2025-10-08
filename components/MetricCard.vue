<template>
  <v-card 
    :loading="loading" 
    class="metric-card"
    :class="[
      `metric-${variant}`,
      { 'metric-loading': loading }
    ]"
    :style="cardStyle"
  >
    <v-card-text class="pa-4">
      <div class="d-flex align-center justify-space-between">
        <div>
          <div class="text-caption text-medium-emphasis font-weight-medium">
            {{ title }}
          </div>
          <div class="text-h5 font-weight-bold mt-1" :class="valueColor">
            {{ formattedValue }}
          </div>
          
          <div 
            v-if="trend !== undefined" 
            class="text-caption mt-1 d-flex align-center"
            :class="trend > 0 ? 'text-success' : trend < 0 ? 'text-error' : 'text-medium-emphasis'"
          >
            <v-icon 
              :icon="trendIcon" 
              size="16" 
              class="mr-1"
            />
            {{ Math.abs(trend) }}%
            <span class="text-caption text-medium-emphasis ml-1">
              vs previous period
            </span>
          </div>
        </div>

        <div class="metric-icon" :class="iconColor">
          <v-icon :icon="icon" size="32" />
        </div>
      </div>
    </v-card-text>
  </v-card>
</template>

<script setup lang="ts">
interface Props {
  title: string
  value: number
  trend?: number
  loading?: boolean
  format?: 'currency' | 'number' | 'percent'
  variant?: 'default' | 'primary' | 'secondary'
  icon?: string
  delay?: number // Задержка анимации в ms
}

const props = withDefaults(defineProps<Props>(), {
  format: 'number',
  loading: false,
  variant: 'default',
  icon: 'mdi-chart-line',
  delay: 0
})

// Анимированное появление с задержкой
const cardStyle = computed(() => ({
  animationDelay: `${props.delay}ms`
}))

const formattedValue = computed(() => {
  switch (props.format) {
    case 'currency':
      return new Intl.NumberFormat('ru-RU', { 
        style: 'currency', 
        currency: 'RUB',
        maximumFractionDigits: 0
      }).format(props.value)
    case 'percent':
      return `${props.value}%`
    default:
      return props.value.toLocaleString('ru-RU')
  }
})

const valueColor = computed(() => {
  if (props.trend === undefined) return 'text-primary'
  return props.trend > 0 ? 'text-success' : props.trend < 0 ? 'text-error' : 'text-primary'
})

const trendIcon = computed(() => {
  if (props.trend === undefined) return 'mdi-minus'
  return props.trend > 0 ? 'mdi-arrow-up' : props.trend < 0 ? 'mdi-arrow-down' : 'mdi-minus'
})

const iconColor = computed(() => {
  switch (props.variant) {
    case 'primary':
      return 'text-primary'
    case 'secondary':
      return 'text-secondary'
    default:
      return 'text-accent'
  }
})
</script>

<style scoped>
.metric-card {
  transition: all 0.3s ease;
  height: 100%;
  animation: cardSlideIn 0.6s ease-out both;
  transform-origin: center bottom;
}

.metric-card:hover {
  transform: translateY(-4px) scale(1.02);
}

.metric-loading {
  opacity: 0.7;
  animation: pulse 2s infinite;
}

.metric-icon {
  opacity: 0.8;
  transition: all 0.3s ease;
}

.metric-card:hover .metric-icon {
  transform: scale(1.1);
  opacity: 1;
}

.metric-primary {
  border-left: 4px solid rgb(99, 102, 241);
}

.metric-secondary {
  border-left: 4px solid rgb(139, 92, 246);
}

/* Keyframe анимации для карточек */
@keyframes cardSlideIn {
  0% {
    opacity: 0;
    transform: translateY(20px) scale(0.95);
  }
  70% {
    transform: translateY(-5px) scale(1.01);
  }
  100% {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

@keyframes pulse {
  0% {
    opacity: 0.7;
  }
  50% {
    opacity: 0.4;
  }
  100% {
    opacity: 0.7;
  }
}


/* Задержки для последовательной анимации карточек */
.metric-card:nth-child(1) { animation-delay: 0ms; }
.metric-card:nth-child(2) { animation-delay: 100ms; }
.metric-card:nth-child(3) { animation-delay: 200ms; }
.metric-card:nth-child(4) { animation-delay: 300ms; }
</style>