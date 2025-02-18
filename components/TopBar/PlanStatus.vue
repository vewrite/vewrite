<template>
  <section class="plan-status">
    <span v-if="PlanStatus == 'free'" class="free">
      <section v-if="PlanStatus == 'free'">Using the free plan</section>
      <nuxt-link to="/subscriptions" v-if="PlanStatus == 'free'" class="button green small">Upgrade</nuxt-link>
    </span>
    <span v-else-if="PlanStatus == 'pro'" class="pro">Pro</span>
  </section>
  <section class="persona">{{ personaState }}</section>
</template>

<script setup>

const PlanStatus = ref('')

// Pull subscription status from the middleware auth.js
const subscriptionStatus = useState('subscriptionStatus');
PlanStatus.value = subscriptionStatus.value.status

// Pull personaState from the middleware auth.js
const personaState = useState('personaState');


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