<script setup lang="ts">
import { RouterLink } from 'vue-router'
const handleCreateList = () => {
  console.log('Crear nueva lista de comidas')
}
</script>

<template>
  <header class="border-b border-dark-border bg-dark-card">
    <div class="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
      <div class="flex items-center justify-between">
        <RouterLink to="/" class="text-2xl font-bold">Organiza tu alimentacion</RouterLink>
        <button
          @click="handleCreateList"
          class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          Añadir comida
        </button>
      </div>
    </div>
  </header>
</template>

<style scoped></style>
