// stores/wizardbar.ts
import { defineStore } from 'pinia'

export const useModal = defineStore('modal', {
  state: () => ({
    visible: 0,
    content: '',
    type: '',
    header: ''
  }),
  actions: {
    toggleVisibility() {
      this.visible = !this.visible
    },
    setType(type) {
      this.type = type
    },
    setHeader(content) {
      this.header = content
    },
    setContent(content) {
      this.content = content
      // console.log(this.$state);
    }
  },
})