import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

export const useCounterStore = defineStore({
  id: 'test',
  state: () => ({
    category: [
      {
        id: 1,
        name: "Education"
      },
      {
        id: 2,
        name: "Shopping"
      },
      {
        id: 3,
        name: "Work"
      }
    ],
  }),
  getters: {},
  actions: {
  },
  
})
