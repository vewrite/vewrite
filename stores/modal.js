// stores/wizardbar.ts
import { defineStore } from 'pinia'

export const useModal = defineStore('modal', {
  state: () => ({
    visible: 0,
    content: '',
  }),
  actions: {
    toggleVisibility() {
      this.visible = !this.visible
    }
  },
})