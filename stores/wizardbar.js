// stores/wizardbar.ts
import { defineStore } from 'pinia'

export const useWizardBar = defineStore('wizardbar', {
  state: () => ({
    currentStep: 1,
  }),
  actions: {
    nextStep() {
      this.currentStep++
    },
    prevStep() {
      this.currentStep--
    },
  },
})