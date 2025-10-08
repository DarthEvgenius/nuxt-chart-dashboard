<template>
  <div class="chart-skeleton">
    <div class="skeleton-header">
      <div class="skeleton-title shimmer"></div>

      <div class="skeleton-legend">
        <div
          v-for="i in legendItems"
          :key="i"
          class="skeleton-legend-item"
        >
          <div
            class="skeleton-legend-color shimmer"
            :style="getAnimationDelay(i * 100)"
          ></div>

          <div
            class="skeleton-legend-text shimmer"
            :style="getAnimationDelay(i * 100)"
          ></div>
        </div>
      </div>
    </div>

    <div class="skeleton-chart-area">
      <div class="skeleton-y-axis">
        <div
          v-for="i in yAxisLabels"
          :key="i"
          class="skeleton-y-label shimmer"
          :style="getAnimationDelay(i * 100)"
        ></div>
      </div>

      <div class="skeleton-graph">
        <div
          v-for="i in lines"
          :key="i"
          class="skeleton-line-container"
          :style="getAnimationDelay(i * 100)"
        >
          <div 
            class="skeleton-line shimmer"
          ></div>
        </div>

        <div class="skeleton-x-axis">
          <div
            v-for="i in xAxisLabels"
            :key="i"
            class="skeleton-x-label shimmer"
            :style="getAnimationDelay(i * 100)"
          ></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  legendItems?: number
  yAxisLabels?: number
  xAxisLabels?: number
  lines?: number
}

withDefaults(defineProps<Props>(), {
  legendItems: 4,
  yAxisLabels: 6,
  xAxisLabels: 8,
  lines: 4
})

</script>

<style scoped>
.chart-skeleton {
  height: 100%;
  padding: 16px;
  position: relative;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  gap: 16px;
  transform: scale(1.02);
  transform-origin: center;
  transition: transform 0.3s ease;
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

/* Эффект мерцания */
.shimmer {
  animation: skeletonWave 2s infinite;
  background-size: 200% 100%;
}

/* Keyframe анимации */
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

@media (max-width: 768px) {
  .skeleton-legend {
    flex-wrap: wrap;
    gap: 8px;
  }
  
  .skeleton-legend-item {
    flex: 0 0 calc(50% - 8px);
  }
}

@keyframes skeletonShimmer {
  0% {
    left: -100%;
  }
  100% {
    left: 100%;
  }
}

</style>