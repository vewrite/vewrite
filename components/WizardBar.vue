<template>
  <aside id="WizardBar">
    <div>
      <button v-if="wizardBar.currentStep > 1" class="" @click="prevStep">Back</button>
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
  border-top: 1px solid rgba($purple, 0.1);

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
        background-color: rgba($purple, 0.1);
        border: 1px solid rgba($purple, 0.1);

        .step-num {
          color: $purple;
        }
        .step-label {
          color: $purple;
        }
      }
    }
  }
}

</style>