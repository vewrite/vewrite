import { defineStore } from 'pinia'

export const useModal = defineStore('modal', {
  state: () => ({
    visible: false,
    content: '',
    type: '',
    header: '',
    workflowId: '',
    loading: 0,
    props: [],
  }),
  actions: {
    toggleVisibility() {
      this.visible = !this.visible
      this.updateBodyClass()
    },
    toggleLoading() {
      this.loading = !this.loading
    },
    setType(type) {
      this.type = type
    },
    setProps(props) {
      this.props = props
    },
    setHeader(content) {
      this.header = content
    },
    setContent(content) {
      this.content = content
    },
    setWorkflowId(workflowId) {
      this.workflowId = workflowId
    },
    reset() {
      this.content = ''
      this.type = ''
      this.header = ''
      this.loading = 0
      this.workflowId = ''
      this.visible = false
    },
    updateBodyClass() {
      if (this.visible) {
        document.body.classList.add('no-scroll');
      } else {
        document.body.classList.remove('no-scroll');
      }
    }
  },
})