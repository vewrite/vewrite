<template>
  <div id="CreateClientModal">
    <div class="modal-body">
      <Loading v-if="loading" />
      <form class="inner-container" @submit.prevent="createClient">

        <!-- Free user, maxxed out teams -->
        <section class="inner-container" v-if="!loading && !isPro && !isAllowed">
          <div class="empty">
            <h3>Free clients are limited</h3>
            <p>You're a manager and already have one free client. If you need more, you must upgrade.</p>
            <nuxt-link class="button green large" to="/subscriptions" @click="useModal().reset()">Upgrade</nuxt-link>
          </div>
        </section>

        <!-- Pro user or free user with no teams -->
        <div class="form-block" v-if=" !loading && isAllowed">
            <div class="form-details">
              <h3>Client Details</h3>
              <p class="details">Your client's basic details.</p>
            </div>
            <div class="form-content">
              <div class="form-input">
                <label for="name">Name</label>
                <input v-model="client.name" id="name" type="text" placeholder="Input your client's name" />
                <span class="form-required" v-if="formErrors.name != ''">{{ formErrors.name }}</span>
              </div>
            </div>
        </div>

        <div class="form-block" v-if=" !loading && isAllowed">
            <div class="form-details">
              <h3>Client Logo</h3>
              <p class="details">Make your client identifiable. If this is a company, use their logo!</p>
            </div>
            <div class="form-content">
              <ImageManager size="medium" table="logos" v-model:path="logo_url" @update:logo_url="logoUrlUpdate" /> 
              <span class="form-required" v-if="formErrors.logo_url != ''">{{ formErrors.logo_url }}</span>
            </div>
        </div>

      </form>
          
    </div>
    
    <div class="buttons" v-if=" !loading && isAllowed">
      <button @click="handleCreateClient(client)" class="primary wide">Create</button>
    </div>
  </div>
</template>

<script setup>

// Deliverables composable
import useClient from '~/composables/useClient';
const { createClient, fetchClientsOwnedBy } = useClient();

const loading = ref(false);
const logo_url = ref('')

// Get the current user
const user = useSupabaseUser();

const PlanStatus = ref('')
const ownedClients = ref(0);

// Pull subscription status from the middleware auth.js
const subscriptionStatus = useState('subscriptionStatus');
PlanStatus.value = subscriptionStatus.value.status

// Set some sane defaults for the client object
const client = reactive({
  name: '',
  created_at: new Date(),
  updated_at: new Date(),
  created_by: user.value.id,
  logo_url: logo_url.value,
})

const isPro = computed(() => {
  if (PlanStatus.value == 'pro') {
    console.log('Pro user');
    return true;
  } else {
    console.log('Free user');
    return false;
  }
})

const isAllowed = computed(() => {
  // Free user, no clients, allowed
  if (ownedClients.value == 0) {
    console.log(ownedClients.value);
    return true;
  } else { // Free user, already has one project, not allowed
    return false;
  }

  
})

function logoUrlUpdate(filePath) {
  client.logo_url = filePath;
  console.log('Logo URL updated:', filePath);
}

onMounted(async () => {
  try {
    ownedClients.value = await fetchClientsOwnedBy(user.value.id);
    loading.value = false;
  } catch (error) {
    console.error('Error fetching clients:', error.message);
    loading.value = false;
  }
})

// Form validation
import { useVuelidate } from '@vuelidate/core'
import { required } from '@vuelidate/validators'

const rules = {
  client: {
    name: { required },
    logo_url: { required },
  }
}

const formErrors = ref({
  name: '',
})

const $v = useVuelidate(rules, { client })

$v.value.$touch()

function handleCreateClient (client) {

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
    createClient(client);
  }

}

function processError (error) {
  formErrors.value[error.$property] = error.$property + ' is required';
}

function clearErrors () {
  formErrors.value = {
    name: '',
    logo_url: '',
  };
}

</script>

<style lang="scss" scoped>

@use 'assets/variables' as *;

#CreateClientModal {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: space-between;
  height: 100%;
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