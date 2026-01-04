<script setup lang="ts">
import { useListStore } from '@/stores/lists'
import type { ListItem } from '@/types'
import { ref, watch } from 'vue'

const props = defineProps<{
  item: ListItem
  listId: string
  isDragging: boolean
}>()
const emit = defineEmits<{
  dragstart: [item: ListItem]
  dragenter: []
  dragend: []
  dragover: [e: DragEvent]
  newItem: [newItem: string]
}>()

const isEditing = ref(false)
const content = ref(props.item.content)

watch(
  () => props.item.content,
  (newContent) => {
    content.value = newContent
  },
)

const startEditing = () => {
  isEditing.value = true
}

const saveContent = async () => {
  if (content.value !== props.item.content) {
    await useListStore().updateListItem(props.item.id, props.listId, { content: content.value })
  }
  isEditing.value = false
}

const handleKeydown = async (event: KeyboardEvent) => {
  if (event.key === 'Enter') {
    event.preventDefault()
    await saveContent()
    isEditing.value = false
  } else if (event.key === 'Escape') {
    content.value = props.item.content
    isEditing.value = false
  }
}

const toggleChecked = async () => {
  await useListStore().updateListItem(props.item.id, props.listId, {
    isChecked: !props.item.isChecked,
  })
}
const deleteItem = async () => {
  await useListStore().deleteListItem(props.item.id, props.listId)
}
</script>

<template>
  <div
    :class="[
      'flex items-center gap-3 p-3 bg-dark-hover rounded-lg border border-transparent hover:border-dark-border transition-all cursor-move group',
      { 'opacity-50': isDragging },
    ]"
    :draggable="true"
    @dragstart="emit('dragstart', item)"
    @dragenter="emit('dragenter')"
    @dragend="emit('dragend')"
    @dragover="emit('dragover', $event)"
  >
    <button
      @click="toggleChecked"
      :class="[
        'flex-shrink-0 w-5 h-5 rounded border-2 transition-colors flex items-center justify-center',
        {
          'bg-blue-600 border-blue-600': item.isChecked,
          'border-gray-500 hover:border-gray-400': !item.isChecked,
        },
      ]"
    >
      <svg
        v-if="item.isChecked"
        class="w-3 h-3 text-white"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7" />
      </svg>
    </button>

    <button
      @click="startEditing"
      v-if="!isEditing"
      class="flex-1 cursor-text bg-transparent border-none text-left p-0 m0"
    >
      <span
        :class="['text-white transition-all', { 'line-through text-gray-500': item.isChecked }]"
      >
        {{ item.content || 'click para escribir' }}
      </span>
    </button>

    <input
      v-else
      v-model="content"
      @blur="saveContent"
      @keydown="handleKeydown"
      class="block flex-1 mr-4 bg-dark-hover text-white px-2 py-1 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
      placeholder="Introduce alimentos"
    />
    <button
      @click="deleteItem"
      class="flex-shrink-0 p-1 text-gray-500 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity"
    >
      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M6 18L18 6M6 6l12 12"
        />
      </svg>
    </button>
    <div class="flex-shrink-0 text-gray-600 cursor-move">
      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 8h16M4 16h16" />
      </svg>
    </div>
  </div>
</template>
