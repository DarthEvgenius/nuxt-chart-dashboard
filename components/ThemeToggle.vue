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
const { $theme } = useNuxtApp()
const theme = useTheme()
console.log('theme:', theme.theme)

const themeIcon = computed(() => 
  $theme.current.value === 'light' ? 'mdi-weather-night' : 'mdi-weather-sunny'
)

const themeTitle = computed(() => 
  $theme.current.value === 'light' ? 'Тёмная тема' : 'Светлая тема'
)

const toggleTheme = () => {
  $theme.toggle()
}
</script>

<style scoped>
.theme-toggle {
  transition: all 0.3s ease;
}

.theme-toggle:hover {
  transform: rotate(15deg);
}
</style>