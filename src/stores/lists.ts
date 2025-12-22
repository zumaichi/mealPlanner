import { ref } from 'vue'
import type { List } from '@/types'
import { defineStore } from 'pinia'

export const useListStore = defineStore('list', () => {
  const lists = ref<List[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  const createList = (title = 'Unlisted list') => {
    const maxPosition = Math.max(0, ...lists.value.map((list) => list.position))
    const newList: List = {
      id: crypto.randomUUID(),
      title,
      position: maxPosition + 1,
      createdAt: Date.now(),
    }

    lists.value.push(newList)
    return newList
  }

  const fetchLists = async () => {
    loading.value = true
    error.value = null
    try {
      const data = await getAllListsOrdered()
      lists.value = data || []
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'Failed to fetch lists'
    } finally {
      loading.value = false
    }
  }

  const fetchListsItem = (listId: string) => {
    return lists.value.find((list) => list.id === listId)
  }

  const updateList = (id: string, updates: { title?: string; position?: number }) => {
    const listUpdate = lists.value.find((list) => list.id === id)
    const listToUpdateIndex = lists.value.findIndex((list) => list.id === id)

    if (listUpdate == null || listToUpdateIndex === -1) return

    const newList: List = {
      ...listUpdate,
      ...updates,
    }

    lists.value.splice(listToUpdateIndex, 1, newList)
  }

  return {
    lists,
    loading,
    error,
    createList,
    fetchLists,
    fetchListsItem,
    updateList,
  }
})
