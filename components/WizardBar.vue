<template>
  <aside id="WizardBar">
    <div>
      <button v-if="wizardBar.currentStep > 1" class="" @click="prevStep">
        <svg width="12" height="10" viewBox="0 0 12 10" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path fill-rule="evenodd" clip-rule="evenodd" d="M5.35356 1.35355C5.54882 1.15829 5.54882 0.841705 5.35356 0.646443C5.1583 0.451181 4.84172 0.451181 4.64645 0.646443L1.35356 3.93934C0.767773 4.52512 0.767774 5.47487 1.35356 6.06066L4.64645 9.35355C4.84172 9.54881 5.1583 9.54881 5.35356 9.35355C5.54882 9.15829 5.54882 8.84171 5.35356 8.64644L2.20711 5.5L11.5 5.5C11.7761 5.5 12 5.27614 12 5C12 4.72385 11.7761 4.5 11.5 4.5L2.20711 4.5L5.35356 1.35355Z" fill="black"/>
        </svg>
        Back
      </button>
    </div>
    <div class="wizard-steps">
      <div v-for="step in totalSteps" :key="step" :class="['wizard-step', { 'active': wizardBar.currentStep === step }]">
        <span class="step-num">{{ step }}</span>
        <span class="step-label">{{ props.labels[step - 1] }}</span>
      </div>
    </div>
    <div>
      <button v-if="wizardBar.currentStep < totalSteps" class="primary" @click="nextStep">Next</button>
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
  },
  labels: {
    type: Array,
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
  height: 85px;
  padding: $spacing-md;
  background-color: $white;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  border-top: 1px solid rgba($brand, 0.1);

  .wizard-steps {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    display: flex;
    gap: $spacing-sm;
    align-items: center;
    justify-content: center;
    pointer-events: none;

    .wizard-step {
      border: 1px solid rgba($black, 0);
      background: $white;
      border-radius: $br-lg;
      padding: $spacing-xxs $spacing-xs;
      transition: all 0.3s ease-in-out;

      .step-num {
        padding: 0 $spacing-xs 0 0;
        margin: 0 $spacing-xs 0 0;
        border-right: 1px solid rgba($black, 0.3);
        color: $black;
        font-size: $font-size-xs;
      }

      .step-label {
        color: $black;
        font-size: $font-size-xs;
      }

      &.active {
        background-color: rgba($brand, 0.1);
        border: 1px solid rgba($brand, 0.1);

        .step-num {
          color: $brand;
        }
        .step-label {
          color: $brand;
        }
      }
    }
  }
}

</style>