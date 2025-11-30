<script setup lang="ts">
import type { List } from '@/types'
import { computed } from 'vue'
import { useRoute } from 'vue-router'

const props = defineProps<{
  list: List
}>()

const route = useRoute()
const isActive = computed(() => route.name === 'list' && route.params.id === props.list.id)

const previewText = computed(() => '')

const statusText = computed(() => 'x/total')
</script>

<template>
  <button
    class="bg-dark-card border border-dark-border rounded-lg p-4 hover:bg-dark-hover cursor-pointer transition-all duration-200 hover:shadow-lg hover:shadow-black/20"
  >
    <h3 class="text-lg font-semibold text-white mb-2 truncate">
      {{ list.title }}
    </h3>

    <div class="text-sm text-gray-400 whitespace-pre-line line-clamp-4 mb-3 font-mono">
      {{ previewText }}
    </div>

    <div v-if="statusText" class="text-xs text-gray-500 font-medium">
      {{ statusText }}
    </div>
  </button>
</template>
