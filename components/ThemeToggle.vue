<template>
  <v-btn
    :icon="themeIcon"
    variant="text"
    size="small"
    @click="toggleTheme"
    :title="themeTitle"
    class="theme-toggle"
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
  theme.global.name.value = theme.global.name.value === 'light' ? 'dark' : 'light'
}
</script>

<style scoped>
.theme-toggle {
  transition: transform 0.3s ease;
}

.theme-toggle:hover {
  transform: rotate(15deg);
}
</style>