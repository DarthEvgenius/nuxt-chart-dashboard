<template>
  <v-app>
    <v-main>
      <v-container fluid class="pa-4 pa-md-6 dashboard-container">
        <!-- Заголовок и фильтры -->
        <v-row class="mb-4">
          <v-col cols="12">
            <v-card class="pa-4">
              <v-row align="start" class="flex-wrap">
                <v-col cols="11" md="6">
                  <div class="d-flex align-center">
                    <h1 class="text-h4 text-primary font-weight-bold">
                      Аналитический дашборд
                    </h1>
                  </div>

                  <div class="text-caption text-medium-emphasis mt-1">
                    Обзор продаж и пользовательской активности
                  </div>
                </v-col>

                <v-col cols="12" md="5" order="2" order-md="0">
                  <PeriodFilters />
                </v-col>

                <v-col cols="1" class="flex">
                  <ThemeToggle />
                </v-col>
                
              </v-row>
            </v-card>
          </v-col>
        </v-row>

        <!-- Состояние загрузки/ошибки -->
        <v-row v-if="dashboardStore.error" class="mb-4">
          <v-col cols="12">
            <v-alert type="error" variant="tonal" rounded="lg">
              <div class="d-flex align-center">
                <v-icon icon="mdi-alert-circle" class="mr-2" />
                {{ dashboardStore.error }}
                <v-btn 
                  variant="text" 
                  color="error" 
                  class="ml-auto"
                  @click="dashboardStore.refresh()"
                >
                  Повторить
                </v-btn>
              </div>
            </v-alert>
          </v-col>
        </v-row>

        <!-- Карточки с метриками -->
        <v-row class="mb-6">
          <v-col 
            v-for="(metric, index) in metricCards" 
            :key="metric.title"
            cols="12" 
            sm="6" 
            md="3"
          >
            <MetricCard
              :title="metric.title"
              :value="dashboardStore.metrics[metric.key]"
              :format="metric.format"
              :loading="dashboardStore.isLoading"
              :trend="metric.trend"
              :variant="metric.variant"
              :icon="metric.icon"
              :delay="index * 100"
            />
          </v-col>
        </v-row>

        <!-- Основной график -->
        <v-row class="flex-grow-1">
          <v-col cols="12">
            <SalesChart
              v-memo="[
                dashboardStore.chartData,
                dashboardStore.isLoading,
                dashboardStore.hasData
              ]"
              :chart-data="dashboardStore.chartData"
              :is-loading="dashboardStore.isLoading"
              :has-data="dashboardStore.hasData"
            />
          </v-col>
        </v-row>

        <!-- Дополнительная информация -->
        <v-row v-if="!dashboardStore.isLoading && dashboardStore.hasData" class="mt-4">
          <v-col cols="12" md="6">
            <v-card variant="outlined">
              <v-card-text class="text-center">
                <div class="text-caption text-medium-emphasis">
                  Всего записей за период
                </div>

                <div class="text-h6 font-weight-bold">
                  {{ dashboardStore.salesData.length }} продаж
                </div>
              </v-card-text>
            </v-card>
          </v-col>
          
          <v-col cols="12" md="6">
            <v-card variant="outlined">
              <v-card-text class="text-center">
                <div class="text-caption text-medium-emphasis">
                  Активные категории
                </div>
                <div class="text-h6 font-weight-bold">
                  {{ dashboardStore.categories.length }} из {{ totalCategories }}
                </div>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </v-main>
  </v-app>
</template>

<script setup lang="ts">
import { metricCards } from '~/config/metricCards'
import { CATEGORIES } from '~/types'

const dashboardStore = useDashboardStore()

const totalCategories = CATEGORIES.length // Всего категорий в системе


// Загрузка данных при монтировании уже происходит в store
// Но на случай если нужно переопределить
// onMounted(() => {
//   if (!dashboardStore.hasData && !dashboardStore.isLoading) {
//     dashboardStore.fetchData()
//   }
// })
</script>

<style scoped>
.dashboard-container {
  min-height: 100vh;
  background-color: #f8fafc;
}

/* Адаптивные стили */
@media (max-width: 960px) {
  .dashboard-container {
    padding: 16px;
  }
}

@media (max-width: 600px) {
  .dashboard-container {
    padding: 12px;
  }
}

</style>