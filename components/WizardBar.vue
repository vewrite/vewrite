<template>
  <aside id="WizardBar">
    <button class="" @click="prevStep">Back</button>
    <div class="wizard-steps">
      {{ wizardBar.currentStep }}
    </div>
    <button class="primary" @click="nextStep">Next</button>
  </aside>
</template>

<script setup>

import { useWizardBar } from '@/stores/wizardbar'

const wizardBar = useWizardBar()

const { nextStep, prevStep } = wizardBar

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