export const useTheme = () => {
  const theme = ref('light')
  
  // Инициализация темы
  const initTheme = () => {
    if (import.meta.client && typeof localStorage !== 'undefined') {
      theme.value = localStorage.getItem('dashboard-theme') || 'light'
    }
  }
  
  // Переключение темы
  const toggleTheme = () => {
    theme.value = theme.value === 'light' ? 'dark' : 'light'
    if (import.meta.client && typeof localStorage !== 'undefined') {
      localStorage.setItem('dashboard-theme', theme.value)
    }
  }
  
  return {
    theme: readonly(theme),
    toggleTheme,
    initTheme
  }
}