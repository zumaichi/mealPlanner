<script setup lang="ts">
import { useListStore } from '@/stores/lists'
import { RouterView, useRouter } from 'vue-router'
import ListCard from '../components/ListCard.vue'
import { onMounted } from 'vue'

const router = useRouter()

const listStore = useListStore()

onMounted(() => {
  listStore.fetchLists()
})

const handleCreateList = () => {
  const newList = listStore.createList()

  if (newList) {
    document.startViewTransition(() => router.push(`/list/${newList.id}`))
  }

  console.log('Crear nueva lista de comidas')
}
const handledCardClick = (listId: string) => {
  document.startViewTransition(() => {
    router.push(`/list/${listId}`)
  })
}
</script>

<template>
  <div class="min-h-screen bg-dark-bg">
    <main>
      <div
        v-if="listStore.lists.length"
        class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
      >
        <ListCard
          v-for="list in listStore.lists"
          :key="list.id"
          :list="list"
          @click="handledCardClick(list.id)"
        />
      </div>
      <div v-if="!listStore.lists.length" class="text-center py-12">
        <p class="text-gray-400 text-lg mb-4">Empezar gestionar tu alimentación</p>
        <button
          @click="handleCreateList"
          class="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors duration-200 font-medium"
        >
          Añadir priemra comida
        </button>
      </div>
    </main>

    <RouterView />
  </div>
</template>

<style scoped></style>
