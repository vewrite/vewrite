<template>
  <div id="FirstTime">
    <Loading type="small" v-if="loading" /> 
    <div class="onboarding-form" v-else>

      <Logo class="logo" />

      <!-- Next, we will be creating a profile for this user in the database by first setting what type of user they are. -->
      <div class="onboarding-step" v-if="invitedProjects">

        <!-- Initial check for if this user is in the database in invited_profiles. If so, they need to create an account -->
        <div class="onboarding-header" v-if="invitedProjects.length > 0">        
          <p class="center" v-if="invitedProjects.length == 1">Welcome! You've been invited to join a project on Vewrite.</p>
          <p class="center" v-if="invitedProjects.length > 1">Welcome! You've been invited to join these projects on Vewrite.</p>
          <section class="projects-approval-wrapper" v-if="invitedProjects && invitedProjects.length > 0">
            <div class="projects-approval-row" v-for="project in invitedProjects" :key="project.id">
              <p>{{ project.name }}</p>
            </div>
          </section>
        </div>
    
        <div class="onboarding-header">
          <p class="center">First, we'd like to know what kind of user you are.</p>
          <div class="select-persona">
            <div class="selector" @click="setPersona('writer')" :class="{ 'selected': defaultUser.persona === 'writer' }">
              <h2>Writer</h2>
              <p class="define">Work on projects and get your writing done fast</p>
            </div>
            <div class="selector" @click="setPersona('manager')" :class="{ 'selected': defaultUser.persona === 'manager' }">
              <h2>Manager</h2>
              <p class="define">Create projects, deliverables, and track your team's success</p>
            </div>
          </div>
        </div>

        <div class="onboarding-header">
          <p class="center">Next, we'd like to get to know you a little better.</p>
          <form @submit.prevent="handleOnboardUserDetails">
            <div class="form-group">
                <div class="form-input">
                    <label for="username">Name</label>
                    <input v-model="defaultUser.username" id="username" type="text" placeholder="What's your name?" />
                    <span class="form-required" v-if="formErrors.due_date != ''">{{ formErrors.username }}</span>
                </div>
                <div class="form-input">
                    <label for="name">Your website</label>
                    <input v-model="defaultUser.website" id="website" type="text" placeholder="Do you have a website?" />
                </div>
                <button type="submit" class="button block large wide primary" :disabled="loading">
                  <span v-if="loading">Updating...</span>
                  <span v-else>Get Started</span>
                </button>
                <section class="errors">
                  <section class="notification warning" v-if="formErrors.persona">{{ formErrors.persona }}</section>
                </section>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>

import { useUser } from '@/stores/user'
const userStore = useUser()

import useProfile from '~/composables/useProfile'
const { updateProfile} = useProfile()

const emit = defineEmits(['closeOnboarding'])

const supabase = useSupabaseClient()
const user = useSupabaseUser()
const loading = ref(false)
const invitedProjects = ref([])

const defaultUser = ref({
  id: user.value.id,
  email: user.value.email,
  username: '',
  first_time: true,
  avatar_url: '',
  updated_at: new Date(),
  website: '',
  persona: 'writer',
  subscription: {
    "status": "free"
  }
})

/* 

1. Get the users from the database
2. Check invited_profiles for that email address
3. If they are in invited_profiles, allow them to review the projects they've been invited to. Add that to projects ref array

*/

onMounted(async () => {
  try {
    await checkInvitedProfiles(user.value.email)

  } catch (error) {
    console.error(error)
  }

  defaultUser.value.persona = 'manager'
})

async function checkInvitedProfiles(email) {
  const { data, error } = await supabase
    .from('invited_profiles')
    .select('*')
    .eq('email', email)

  const { data: projectsData, error: projectsError } = await supabase
    .from('projects')
    .select('*')
    .in('id', data.map(d => d.project_id))

  if (error) throw error
  if (projectsError) throw projectsError

  invitedProjects.value = projectsData
}

const setPersona = (persona) => {
  defaultUser.value.persona = persona;
};

async function onboardUserDetails() {
  try {
    loading.value = true
    await updateProfile(defaultUser.value)
    await setFirstTime(false)
    emit('closeOnboarding')
  } catch (error) {
    console.error(error)
  } finally {
    loading.value = false
  }
}

const handleOnboardUserDetails = () => {

  clearErrors();
  
  if ($v.value.$invalid) {
    $v.value.$errors.forEach(error => {
      processError(error);
    });
  } else {
    onboardUserDetails()
  }

}

function processError (error) {
  formErrors.value[error.$property] = error.$property + ' is required';
}

function clearErrors () {
  formErrors.value = {
    username: '',
    persona: defaultUser.value.persona,
  };
}

async function setFirstTime(set) {
  // Set the user's firstTime to false
  userStore.setFirstTime(set)
  
  // Update the user in the database
  const { data, error } = await supabase
    .from('profiles')
    .update({ first_time: set })
    .eq('id', user.value.id)

  if (error) throw error

  return data
}

// Form validation
import { useVuelidate } from '@vuelidate/core'
import { required } from '@vuelidate/validators'

const rules = {
  defaultUser: {
    username: { required },
    persona: { required }
  }
}

const formErrors = ref({
  username: '',
  persona: ''
})

const $v = useVuelidate(rules, { defaultUser })

$v.value.$touch()

</script>

<style lang="scss" scoped>

@use 'assets/variables' as *;

#FirstTime {
  display: flex;
  flex-direction: row;
  height: 100vh;
  width: 100vw;
  display: fixed;
  top: 0;
  left: 0;
  z-index: 1000;
  overflow-x: hidden;
  overflow-y: auto;

  @media (max-width: 600px) {
    height: fit-content;
    width: 100%;
    padding: $spacing-md 0;
  }

  .projects-approval-wrapper {
    border: $border;
    border-radius: $br-md;
    padding: $spacing-sm;
    margin-top: $spacing-md;
    background: rgba($brand, 0.1);

    .projects-approval-row {
      display: flex;
      flex-direction: row;
      justify-content: center;

      p {
        margin: 0;
        font-weight: bold;
        font-size: $font-size-md;
      }

      .teams-approval-buttons {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
        gap: $spacing-sm;
      }
    }
  }

  .onboarding-form {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: $spacing-lg;
    width: 100%;
    height: 100%;

    h1 {
      margin-top: 0;
      margin-bottom: $spacing-xs;
    }

    h2 {
      margin-top: 0;
      opacity: 0.8;
    }

    .errors {
      margin-top: $spacing-xs;
    }

    .onboarding-step {
      max-width: 600px;
      width: 100%;
      position: relative;
      display: flex;
      flex-direction: column;
      gap: $spacing-lg;
      padding: 0 $spacing-md;

      .password-capture {
        .notification {
          margin-bottom: $spacing-sm;
        }
      }
    }

    .select-persona {
      display: flex;
      flex-direction: row;
      justify-content: center;
      align-items: center;
      margin: $spacing-md 0 $spacing-lg;
      padding: $spacing-xs;
      background: rgba($brand, 0.1);
      gap: 0;
      border-radius: $br-xl;
      cursor: pointer;

      .selector {
        width: 50%;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        text-align: center;
        padding: $spacing-md $spacing-sm;
        border: $border;
        background: $white;
        outline: none;
        border-radius: 0;

        &.selected {
          background: $brand;
          color: $white;
        }

        &:first-child {
          border-radius: $br-lg 0 0 $br-lg;
          border-right: none;
        }

        &:last-child {
          border-radius: 0 $br-lg $br-lg 0;
          border-left: none;
        }

        h2 {
          margin: 0;
          font-size: $font-size-lg;

          @media (max-width: 600px) {
            font-size: $font-size-sm;
            font-weight: bold;
          }
        }

        p {
          font-size: $font-size-xs;
          opacity: 0.6;
          text-transform: none;
          max-width: 80%;
          margin: 0 0 $spacing-xxs 0;

          @media (max-width: 600px) {
            display: none;
          }
        }

      }
    }
  }

}

</style>