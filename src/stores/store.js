import { defineStore } from "pinia";    
import { ref, computed } from 'vue'

export const storage = defineStore({
    id: 'storage',
    state: () => ({
        test : "TEST"
    })
})