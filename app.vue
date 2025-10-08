<template>
  <NuxtLayout>
    <v-app>
      <NuxtPage />
    </v-app>
  </NuxtLayout>
</template>

<style>
/* Глобальные переходы для плавной смены темы */
.v-application {
  transition: background-color 0.3s ease, color 0.3s ease;
}

.v-theme-provider {
  min-height: 100vh;
}
</style>
