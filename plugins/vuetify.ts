import '@mdi/font/css/materialdesignicons.css'

import 'vuetify/styles'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'

export default defineNuxtPlugin((app) => {
  const { theme, toggleTheme, initTheme } = useTheme()

  initTheme()
  
  const vuetify = createVuetify({
    components,
    directives,
    theme: {
      defaultTheme: 'system',
      themes: {
        light: {
          colors: {
            primary: '#6366F1',
            secondary: '#8B5CF6',
            accent: '#06B6D4',
            background: '#f8fafc',
            surface: '#ffffff',
            success: '#10B981',
            error: '#EF4444',
            warning: '#F59E0B',
            info: '#3B82F6'
          }
        },
        dark: {
          colors: {
            primary: '#818cf8',
            secondary: '#a78bfa',
            accent: '#22d3ee',
            background: '#0f172a',
            surface: '#1e293b',
            success: '#34d399',
            error: '#f87171',
            warning: '#fbbf24',
            info: '#60a5fa'
          }
        },
      }
    }
  })

  app.vueApp.use(vuetify)
  
  return {
    provide: {
      theme: {
        current: theme,
        toggle: toggleTheme
      }
    }
  }
})