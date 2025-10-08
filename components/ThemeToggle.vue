<template>
  <v-btn
    :icon="themeIcon"
    size="small"
    @click="toggleTheme"
    :title="themeTitle"
  >
    <v-icon :icon="themeIcon" />
  </v-btn>
</template>

<script setup lang="ts">
import { useTheme } from 'vuetify'

const theme = useTheme()

const themeIcon = computed(() => 
  theme.global.name.value === 'light' ? 'mdi-weather-night' : 'mdi-weather-sunny'
)

const themeTitle = computed(() => 
  theme.global.name.value === 'light' ? 'Тёмная тема' : 'Светлая тема'
)

const toggleTheme = () => {
  const nextTheme = theme.global.name.value === 'light' ? 'dark' : 'light'
  theme.change(nextTheme) 
}
</script>
