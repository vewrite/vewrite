<template>
  <div id="CreateTeamModal">
    <div class="modal-body">
      <Loading v-if="loading" />
      {{ GroupError }}
      <form class="inner-container" @submit.prevent="createTeam">

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
    
    <div class="buttons">
      <button @click="handleCreateTeam(team)" class="primary wide">Create</button>
    </div>
  </div>
</template>

<script setup>

// Deliverables composable
import useTeam from '~/composables/useTeam';
const { createTeam } = useTeam();

// Group composable
import useGroup from '~/composables/useGroup';
const { fetchGroupId, GroupData, GroupError } = useGroup();

const loading = ref(false);
const user = useSupabaseUser();

// Set some sane defaults for the team object
const team = reactive({
  name: '',
  group_id: '',
})

const GroupId = ref('')

console.log('User is:', user.value.id);

// Get the current user's group ID
onMounted(async () => {
  try {
    await fetchGroupId(user.value.id);
    GroupId.value = GroupData.value.id; // Access GroupData.value.id
    team.group_id = GroupData.value.id; // Set team.group_id
  } catch (error) {
    console.error('Error fetching group ID:', error);
  }
});

function logoUrlUpdate(filePath) {
  team.logo_url = filePath;
  console.log('Logo URL updated:', filePath);
}

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