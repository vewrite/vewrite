<template>
  <aside id="WizardBar">
    <div>
      <button v-if="wizardBar.currentStep > 1" class="" @click="prevStep">Back</button>
    </div>
    <div class="wizard-steps">
      {{ wizardBar.currentStep }} of {{ totalSteps }}
    </div>
    <!-- <button class="primary" @click="nextStep">Next</button> -->

    <div>
      <button v-if="wizardBar.currentStep < totalSteps" class="" @click="nextStep">Next</button>
    </div>
  </aside>
</template>

<script setup>

import { useWizardBar } from '@/stores/wizardbar'

// Define the props
const props = defineProps({
  totalSteps: {
    type: Number,
    required: true
  }
})

const wizardBar = useWizardBar()
const totalSteps = computed(() => props.totalSteps)

// Example usage: Ensure currentStep does not exceed totalSteps
const nextStep = () => {
  wizardBar.nextStep(totalSteps.value)
}

const prevStep = () => {
  wizardBar.prevStep()
}

</script>

<style lang="scss" scoped>

@import 'assets/_variables.scss';

#WizardBar {
  position: absolute;
  bottom:0;
  width: 100%;
  padding: $spacing-md;
  background-color: rgba($white,0.1);
  backdrop-filter: blur(10px);
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  border-top: 1px solid rgba($black, 0.1);
}

</style>