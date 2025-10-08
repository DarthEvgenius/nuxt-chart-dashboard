import '@mdi/font/css/materialdesignicons.css'
import 'vuetify/styles'
import { createVuetify, type ThemeDefinition } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'


const lightTheme: ThemeDefinition = {
  dark: false,
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
}

const darkTheme: ThemeDefinition = {
  dark: true,
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
}

export default defineNuxtPlugin((app) => {  
  const vuetify = createVuetify({
    components,
    directives,
    theme: {
      defaultTheme: 'light',
      themes: {
        light: lightTheme,
        dark: darkTheme,
      }
    },
    defaults: {
      VCard: {
        rounded: 'lg',
        elevation: 2
      },
      VBtn: {
        rounded: 'lg'
      }
    }
  })

  app.vueApp.use(vuetify)
})