// stores/wizardbar.ts
import { defineStore } from 'pinia'

export const useWizardBar = defineStore('wizardbar', {
  state: () => ({
    currentStep: 1,
  }),
  actions: {
    nextStep(totalSteps) {
      if (this.currentStep < totalSteps) {
        this.currentStep++
      }
    },
    prevStep() {
      if (this.currentStep > 1) {
        this.currentStep--
      }
    },
  },
})