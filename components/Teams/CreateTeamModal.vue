<template>
  <div id="CreateTeamModal">
    <div class="modal-body">
      <Loading v-if="loading" />

      <!-- Free user, maxxed out teams -->
      <section class="inner-container" v-if="!loading && !isPro && !isAllowed">
        <div class="empty">
          <h3>Free teams are limited</h3>
          <p>You're a manager and already have one free team. If you need more, you must upgrade.</p>
          <nuxt-link class="button green large" to="/subscriptions" @click="useModal().reset()">Upgrade</nuxt-link>
        </div>
      </section>

      <!-- Pro user or free user with no teams -->
      <form class="inner-container" @submit.prevent="createTeam" v-if="isAllowed">
        <div class="form-block">
            <div class="form-details">
              <h3>Team Details</h3>
              <p class="details">Your team's basic details.</p>
            </div>
            <div class="form-content">
              <div class="form-input">
                <label for="name">Name</label>
                <input v-model="team.name" id="name" type="text" placeholder="Input your team's name" />
                <span class="form-required" v-if="formErrors.name != ''">{{ formErrors.name }}</span>
              </div>
            </div>
        </div>
      </form>
    </div>
    
    <div class="buttons" v-if="isAllowed">
      <button @click="handleCreateTeam(team)" class="primary wide">Create</button>
    </div>
  </div>
</template>

<script setup>

// Deliverables composable
import useTeam from '~/composables/useTeam';
const { createTeam, fetchOwnedTeams } = useTeam();

// Group composable
import useGroup from '~/composables/useGroup';
const { fetchGroupId, GroupData, GroupError } = useGroup();

const loading = ref(false);
const user = useSupabaseUser();

const PlanStatus = ref('')
const ownedTeams = ref(0);

// Pull subscription status from the middleware auth.js
const subscriptionStatus = useState('subscriptionStatus');
PlanStatus.value = subscriptionStatus.value.status

// Set some sane defaults for the team object
const team = reactive({
  name: '',
  group_id: '',
  details: {
    "ready": false
  }
})

const isPro = computed(() => {
  if (PlanStatus.value == 'pro') {
    return true;
  } else {
    return false;
  }
})

const isAllowed = computed(() => {
  // Pro user always allowed
  if (isPro.value) {
    console.log('Pro user, allowed');
    return true;
  }

  // Free user, no teams, allowed
  if (isPro.value && ownedTeams.value < 2) {
    return true;
  }

  // Free user, already has one team, not allowed
  if (isPro.value == 'free' && ownedTeams.value > 1) {
    return false;
  }
})

const GroupId = ref('')

// Get the current user's group ID
onMounted(async () => {
  try {
    await fetchGroupId(user.value.id);
    GroupId.value = GroupData.value.id;
    team.group_id = GroupData.value.id;
    ownedTeams.value = await fetchOwnedTeams(GroupData.value.id);
  } catch (error) {
    console.error('Error fetching group ID:', error);
  }
});

// Form validation
import { useVuelidate } from '@vuelidate/core'
import { required } from '@vuelidate/validators'

const rules = {
  team: {
    name: { required },
  }
}

const formErrors = ref({
  name: '',
})

const $v = useVuelidate(rules, { team })

$v.value.$touch()

function handleCreateTeam (team) {

  if ($v.value.$invalid) {
    console.log('Form is invalid');

    clearErrors();

    console.log(formErrors.value);

    // Process validation errors
    $v.value.$errors.forEach(error => {
      processError(error);
    });
    return
  } else {
    // First we need to create the team
    createTeam(team, user.value.id, user.value.email);

  }

}

function processError (error) {
  formErrors.value[error.$property] = error.$property + ' is required';
}

function clearErrors () {
  formErrors.value = {
    name: '',
  };
}

</script>

<style lang="scss" scoped>

@use 'assets/variables' as *;

#CreateTeamModal {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: space-between;
  width: 100%;

  .modal-body {
    width: 100%;

    p {
      margin: 0;
    }
  }

  .buttons {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    gap: $spacing-sm;
    border-top: 1px solid rgba($black, 0.1);
    width: 100%;
    padding: $spacing-md;

    .modal-confirmation {
      font-size: $font-size-xs;
      color: $red;
    }
  }
}

</style>