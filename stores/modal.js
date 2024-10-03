// stores/wizardbar.ts
import { defineStore } from 'pinia'

export const useModal = defineStore('modal', {
  state: () => ({
    visible: 0,
    content: '',
    type: '',
    header: '',
    workflowId: '',
    loading: 0
  }),
  actions: {
    toggleVisibility() {
      this.visible = !this.visible
    },
    toggleLoading() {
      this.loading = !this.loading
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
    },
    setWorkflowId(workflowId) {
      this.workflowId = workflowId
    },
    reset() {
      this.visible = 0
      this.content = ''
      this.type = ''
      this.header = ''
      this.loading = 0
      this.workflowId = ''
    }
  },
})