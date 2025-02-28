<template>
  <section class="persona">{{ personaState }}</section>
  <section class="plan-status topbar-plan">
    <span v-if="PlanStatus == 'free' && personaState == 'manager'" class="free">
      <!-- <section v-if="PlanStatus == 'free'">Using the free plan</section> -->
      <nuxt-link to="/subscriptions" v-if="PlanStatus == 'free'" class="button green small">Upgrade</nuxt-link>
    </span>
    <span v-else-if="PlanStatus == 'pro'" class="pro">Pro</span>
  </section>
</template>

<script setup>

import { computed } from 'vue';

// Pull subscription status from the middleware auth.js
const subscriptionStatus = useState('subscriptionStatus');
const personaState = useState('personaState');

// Create a computed property that will update automatically when subscriptionStatus changes
const PlanStatus = computed(() => {
  console.log('Subscription has updated, updating PlanStatus to:', subscriptionStatus.value);
  return subscriptionStatus.value;
});

</script>

<style lang="scss" scoped>

@use 'assets/variables' as *;

.plan-status {
  font-size: $font-size-xs;

  @media (max-width: 960px) {
    display: none;
  }

  .free {
    color: rgba($black, 0.5);
    border-radius: $br-md;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    gap: $spacing-sm;

    section {
      height: 100%;
      display: flex;
      gap: $spacing-xs;
      align-content: center;
      justify-content: center;
      font-size: $font-size-xxs;
    }
  }

  .pro {
    border: .7px solid $brand;
    border-radius: $br-xl;
    color: $brand;
    padding: $spacing-xxxs $spacing-xs;
  }
  
}

.persona {
  color: rgba($black, 0.5);
  text-transform: capitalize;
}

</style>