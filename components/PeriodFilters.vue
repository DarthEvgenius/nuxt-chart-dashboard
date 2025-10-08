<template>
  <div class="period-filters">
    <div class="d-flex flex-wrap align-center gap-2">
      <!-- Быстрые периоды -->
      <v-btn
        v-for="period in quickPeriods"
        :key="period.value"
        :variant="selectedPeriod === period.value ? 'flat' : 'outlined'"
        :color="selectedPeriod === period.value ? 'primary' : undefined"
        size="small"
        @click="setPeriod(period.value)"
        :loading="isLoading && selectedPeriod === period.value"
      >
        {{ period.title }}
      </v-btn>

      <!-- Кастомный диапазон -->
      <v-dialog v-model="customDialog" max-width="400">
        <template v-slot:activator="{ props: activatorProps }">
          <v-btn
            v-bind="activatorProps"
            variant="outlined"
            size="small"
            :color="selectedPeriod === 'custom' ? 'primary' : undefined"
          >
            Произвольный период
          </v-btn>
        </template>

        <v-card>
          <v-card-title>Выберите период</v-card-title>
          <v-card-text>
            <div class="d-flex flex-column gap-3">
              <v-text-field
                v-model="customStart"
                label="Начальная дата"
                type="date"
                density="compact"
              />
              <v-text-field
                v-model="customEnd"
                label="Конечная дата"
                type="date"
                density="compact"
              />
            </div>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn variant="text" @click="customDialog = false">
              Отмена
            </v-btn>
            <v-btn color="primary" @click="applyCustomRange">
              Применить
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>

      <!-- Текущий диапазон дат -->
      <div class="text-caption text-medium-emphasis ml-2">
        {{ formattedDateRange }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { TPeriod } from '~/types'

const dashboardStore = useDashboardStore()

const customDialog = ref(false)
const customStart = ref('')
const customEnd = ref('')

const quickPeriods = [
  { title: 'Сегодня', value: 'today' as TPeriod },
  { title: 'Неделя', value: 'week' as TPeriod },
  { title: 'Месяц', value: 'month' as TPeriod }
]

const selectedPeriod = computed(() => dashboardStore.selectedPeriod)
const isLoading = computed(() => dashboardStore.isLoading)

const formattedDateRange = computed(() => {
  const { start, end } = dashboardStore.formattedDateRange
  return `${start} - ${end}`
})

const setPeriod = (period: TPeriod) => {
  dashboardStore.setPeriod(period)
}

const applyCustomRange = () => {
  if (customStart.value && customEnd.value) {
    dashboardStore.setDateRange(customStart.value, customEnd.value)
    customDialog.value = false
  }
}

// Устанавливаем начальные значения для custom диапазона
watch(customDialog, (isOpen) => {
  if (isOpen) {
    customStart.value = dashboardStore.dateRange.start
    customEnd.value = dashboardStore.dateRange.end
  }
})
</script>

<style scoped>
.period-filters {
  width: 100%;
}

.gap-2 {
  gap: 8px;
}

.gap-3 {
  gap: 12px;
}

/* Адаптация для мобильных устройств в тёмной теме */
@media (max-width: 960px) {
  :deep(.v-theme--dark) .period-filters {
    background: transparent;
  }
}
</style>