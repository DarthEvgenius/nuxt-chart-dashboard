<template>
  <v-app>
    <v-main>
      <v-container>
        <h1>API Test Page</h1>
        
        <v-row>
          <v-col cols="12" md="6">
            <v-card>
              <v-card-title>Test Sales API</v-card-title>
              <v-card-text>
                <v-select
                  v-model="testPeriod"
                  :items="periods"
                  label="Period"
                ></v-select>
                
                <v-text-field
                  v-model="testStart"
                  label="Start Date"
                  type="date"
                ></v-text-field>
                
                <v-text-field
                  v-model="testEnd"
                  label="End Date"
                  type="date"
                ></v-text-field>
                
                <v-btn @click="testSalesApi" color="primary" :loading="loading">
                  Test Sales API
                </v-btn>
                
                <v-btn @click="testFixedApi" color="secondary" class="ml-2">
                  Test Fixed Data
                </v-btn>
              </v-card-text>
            </v-card>
          </v-col>
          
          <v-col cols="12" md="6">
            <v-card>
              <v-card-title>API Response</v-card-title>
              <v-card-text>
                <div v-if="loading">Loading...</div>
                <div v-else-if="error" class="text-error">{{ error }}</div>
                <pre v-else>{{ response }}</pre>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>

        <v-row v-if="response && Array.isArray(response)">
          <v-col cols="12">
            <v-card>
              <v-card-title>Data Summary</v-card-title>
              <v-card-text>
                <p>Total records: {{ response.length }}</p>
                <p>Date range: {{ getDateRange(response) }}</p>
                <p>Categories: {{ getCategories(response) }}</p>
                <p>Total amount: {{ getTotalAmount(response) }} ₽</p>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </v-main>
  </v-app>
</template>

<script setup lang="ts">
const testPeriod = ref<'today' | 'week' | 'month' | 'custom'>('week')
const testStart = ref(new Date().toISOString().split('T')[0])
const testEnd = ref(new Date().toISOString().split('T')[0])
const response = ref<any>(null)
const loading = ref(false)
const error = ref<string>('')

const periods = [
  { title: 'Today', value: 'today' },
  { title: 'Week', value: 'week' },
  { title: 'Month', value: 'month' },
  { title: 'Custom', value: 'custom' }
]

const testSalesApi = async () => {
  loading.value = true
  error.value = ''
  
  try {
    response.value = await $fetch('/api/sales', {
      query: {
        period: testPeriod.value,
        start: testStart.value,
        end: testEnd.value
      }
    })
  } catch (err: any) {
    error.value = err.data?.statusMessage || err.message
  } finally {
    loading.value = false
  }
}

const testFixedApi = async () => {
  loading.value = true
  error.value = ''
  
  try {
    response.value = await $fetch('/api/sales/test')
  } catch (err: any) {
    error.value = err.data?.statusMessage || err.message
  } finally {
    loading.value = false
  }
}

const getDateRange = (data: any[]) => {
  if (!data.length) return 'No data'
  const dates = data.map(item => item.date).sort()
  return `${dates[0]} - ${dates[dates.length - 1]}`
}

const getCategories = (data: any[]) => {
  return [...new Set(data.map(item => item.category))].join(', ')
}

const getTotalAmount = (data: any[]) => {
  return data.reduce((sum, item) => sum + item.amount, 0)
}

// Устанавливаем разумные даты по умолчанию
onMounted(() => {
  const today = new Date()
  const weekAgo = new Date()
  weekAgo.setDate(today.getDate() - 7)
  
  testStart.value = weekAgo.toISOString().split('T')[0]
  testEnd.value = today.toISOString().split('T')[0]
})
</script>
