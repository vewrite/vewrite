<template>
  <section class="persona">{{ personaState }}</section>
  <section class="plan-status topbar-plan">
    <span v-if="checkPlanStatus == 'free' && personaState == 'manager'" class="free">
      <!-- <section v-if="PlanStatus == 'free'">Using the free plan</section> -->
      <nuxt-link to="/subscriptions" v-if="checkPlanStatus == 'free'" class="button primary">Upgrade</nuxt-link>
    </span>
    <span v-else-if="checkPlanStatus == 'pro'" class="pro">Pro</span>
  </section>
</template>

<script setup>
import { computed } from 'vue';

// Access shared state
const subscriptionStatus = useState('subscriptionStatus');
const personaState = useState('personaState');

// Computed property that depends on the state
const checkPlanStatus = computed(() => {
  // console.log('Current subscription status:', subscriptionStatus.value);
  if (subscriptionStatus.value && typeof subscriptionStatus.value === 'object') {
    return subscriptionStatus.value.status;
  }
  return 'free'; // Default value
});

// Function to update the state
function updateSubscriptionStatus(newStatus) {
  // This directly updates the shared state
  subscriptionStatus.value = { status: newStatus };
  // console.log('Updated subscription status to:', subscriptionStatus.value);
}

// You could also update the state based on an API call
async function fetchAndUpdateStatus() {
  try {
    const response = await fetch('/api/subscription/status');
    const data = await response.json();
    // Update the shared state with the fetched data
    subscriptionStatus.value = data;
  } catch (error) {
    console.error('Failed to fetch subscription status:', error);
  }
}

</script>

<style lang="scss" scoped>

@use 'assets/variables' as *;

.plan-status {

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