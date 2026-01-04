<script setup lang="ts">
import { useListStore } from '@/stores/lists'
import { computed, onMounted, ref, nextTick } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import type { List, ListItem as ListItemType } from '@/types'
import IconoCerrar from './icons/iconoCerrar.vue'
import IconoPapelera from './icons/iconoPapelera.vue'
import IconoCrear from './icons/iconoCrear.vue'
import ListItem from './listItem.vue'

const route = useRoute()
const router = useRouter()
//list y store
const listId = computed(() => route.params.id as string | undefined)
const list = ref<List>()
const listStore = useListStore()
const items = computed(() => listStore.getListItems(listId.value as string))

//title
const title = ref('')
const isEditingTitle = ref(false)
const titleInput = ref<HTMLInputElement>()
const draggedItem = ref<ListItemType | null>(null)

const onDragStart = (item: ListItemType) => {
  draggedItem.value = item
}

const onDragEnter = (item: ListItemType) => {
  if (draggedItem.value === null || draggedItem.value.id === item.id) return

  const reorderedItems = items.value.filter((i): i is ListItemType => i !== null && i !== undefined)
  const fromIndex = reorderedItems.findIndex((i) => i.id === draggedItem.value!.id)
  const toIndex = reorderedItems.findIndex((i) => i.id === item.id)

  const movedItem = reorderedItems.splice(fromIndex, 1)[0]
  reorderedItems.splice(toIndex, 0, movedItem) //nose que hacer coin esto
  listStore.reorderListItems(listId.value as string, reorderedItems)
}

const onDragEnd = () => {
  draggedItem.value = null
}

const startEditingTitle = async () => {
  isEditingTitle.value = true
  await nextTick()
  titleInput.value?.focus()
  titleInput.value?.select()
}

const saveTitle = async () => {
  const newTitle = title.value.trim()

  if (listId.value) {
    await listStore.updateList(listId.value, { title: newTitle })
  }

  isEditingTitle.value = false
}

const handleTitleKeydown = () => {
  saveTitle()
}

const closeModal = () => {
  document.startViewTransition(() => router.push('/'))
}
const handleBackdropClick = () => {
  closeModal()
}
const handleDeleteList = async () => {
  if (window.confirm('¿Estás seguro de que deseas eliminar esta lista?')) {
    await listStore.deleteList(listId.value as string)
    closeModal()
  }
}

const handleAddIitem = async () => {
  await listStore.createListItem(listId.value as string, '') //no consigo q esto salga por defecto
}

onMounted(async () => {
  const id = listId.value
  if (typeof id === 'string' && id.length > 0) {
    await listStore.fetchListItems(id)
    title.value = list.value?.title || ''
  }
})
</script>

<template>
  <div
    v-if="listId"
    class="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
    @click="handleBackdropClick"
  >
    <div
      class="bg-dark-card border border-dark-border rounded-lg shadow-2xl w-full max-w-2xl max-h-[85vh] min-h-[500px] flex flex-col"
      :style="{ viewTransitionName: `card-${listId}` }"
      @click.stop
    >
      <div class="flex items-center justify-between p-4 border-b border-dark-border">
        <div v-if="!isEditingTitle" class="flex-1 mr-4">
          <button
            type="button"
            @click="startEditingTitle"
            class="block text-2xl font-semibold text-white cursor-pointer hover:text-gray-300 transition-colors empty:bg-dark-bg border-none text-left p-0 m-0 w-full empty:rounded-lg empty:h-[44px]"
          >
            {{ title || 'nueva planificacion' }}
          </button>
        </div>
        <input
          v-else
          :id="`title-input-${listId}`"
          ref="titleInput"
          v-model="title"
          @blur="saveTitle"
          @keydown.enter="handleTitleKeydown"
          class="block flex-1 mr-4 text-2xl font-semibold bg-dark-hover text-white px-2 py-1 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          type="text"
          placeholder="nueva planificacion"
        />
        <div>
          <button
            @click="handleDeleteList"
            class="p-2 text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
            type="button"
          >
            <span class="sr-only">Borrar</span>
            <IconoPapelera />
          </button>
          <button
            @click="closeModal"
            class="p-2 text-gray-400 hover:text-white hover:bg-dark-hover rounded-lg transition-colors"
          >
            <IconoCerrar />
          </button>
        </div>
      </div>

      <div class="flex-1 overflow-y-auto p-4" flex flex-col justify-between>
        <div class="space-y-2">
          <TransitionGroup name="list">
            <ListItem
              v-for="item in items"
              :key="item.id"
              :listId="listId"
              :item="item"
              :is-dragging="draggedItem?.id === item.id"
              @dragstart="onDragStart(item)"
              @dragenter="onDragEnter(item)"
              @dragend="onDragEnd"
              @dragover.prevent
            />
          </TransitionGroup>
        </div>
      </div>

      <button
        @click="handleAddIitem"
        class="mt-4 w-full py-3 text-gray-400 hover:text-white hover:bg-dark-hover rounded-lg transition-colors flex items-center justify-center gap-2 border border-dashed border-gray-600 hover:border-gray-400"
      >
        <IconoCrear />
        Nuevo palto
      </button>
    </div>
  </div>
</template>

<style scoped>
.list-move,
.list-enter-active,
.list-leave-active {
  transition: all 0.3s ease;
}

.list-enter-from {
  opacity: 0;
  transform: translateX(-30px);
}

.list-leave-to {
  opacity: 0;
  transform: translateX(30px);
}
</style>
