import vuetify, { transformAssetUrls } from 'vite-plugin-vuetify'

export default defineNuxtConfig({
  app: {
    head: {
      title: 'Дашборд'
    }
  },
  build: {
    transpile: ['vuetify'],
  },
  css: [
    'vuetify/styles/main.sass',
    '@mdi/font/css/materialdesignicons.min.css'
  ],
  imports: {
    // auto-imports for stores
    dirs: ['./stores']
  },
  modules: [
    '@pinia/nuxt',
    (_options, nuxt) => {
      nuxt.hooks.hook('vite:extendConfig', (config) => {
        // @ts-expect-error
        config.plugins.push(vuetify({ autoImport: true }))
      })
    },
  ],
  vite: {
    vue: {
      template: {
        transformAssetUrls,
      },
    },
  },
  compatibilityDate: '2025-07-15',
  devtools: { enabled: false }
})
