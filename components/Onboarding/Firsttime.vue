<template>
  <div id="FirstTime">
    <div class="onboarding-form">

      {{defaultUser}}

      <!-- Initial check for if this user is in the database in invited_profiles -->
      <div class="onboarding-step" v-if="TeamsData && TeamsData.length > 0">        
        <h1>Hello!</h1>
        {{ user }}
        <h3>You've been invited to join a Vewrite team</h3>
        <!-- {{ TeamIds }} -->
        <section class="teams-approval-wrapper" v-if="TeamsData && TeamsData.length > 0">
          <div class="teams-approval-row" v-for="team in TeamsData" :key="team.id">
            <p>{{ team.name }}</p>
            <div class="teams-approval-buttons">
              <button class="button primary" @click="approveTeamMember(team.id, user.id, user.email)">Approve</button>
              <button class="button red" @click="rejectTeamMember(team.id, user.id, user.email)">Reject</button>
            </div>
          </div>
        </section>
        <!-- <Loading v-else /> -->
        {{ TeamsError }}
      </div>

      <!-- Next, we will be creating a profile for this user in the database by first setting what type of user they are. -->
      <div class="onboarding-step" v-if="onboardingStep === 1">
        <h2>How will you be using Vewrite?</h2>
          <div class="onboarding-header">
          <p>First, we'd like to know what kind of user you are.</p>
        </div>

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

        <h2>A few details about you</h2>
        <div class="onboarding-header">
          <p>Next, we'd like to get to know you a little better.</p>
          <form @submit.prevent="onboardUserDetails">
            <div class="form-group">
                <div class="form-input">
                    <label for="username">Name</label>
                    <input v-model="defaultUser.username" id="username" type="text" placeholder="What's your name?" />
                </div>
                <div class="form-input">
                    <label for="name">Your website</label>
                    <input v-model="defaultUser.website" id="website" type="text" placeholder="Do you have a website?" />
                </div>
                <button type="submit" class="button block large wide primary" :disabled="loading">
                  <span v-if="loading">Updating...</span>
                  <span v-else>Get Started</span>
                </button>
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

import useGroup from '~/composables/useGroup'
const { createGroup, fetchSingleGroup, GroupData, GroupError } = useGroup()

import useProfile from '~/composables/useProfile'
const { createProfile, updateProfile, fetchSingleProfile, fetchInvitedTeamsForThisProfile, TeamIds, ProfileData, ProfileError } = useProfile()

import useTeam from '~/composables/useTeam'
const { fetchInvitedTeams, approveTeamMember, rejectTeamMember, TeamsData, TeamsError } = useTeam()

const emit = defineEmits(['closeOnboarding'])

const supabase = useSupabaseClient()
const user = useSupabaseUser()
const loading = ref(false)
const onboardingStep = ref(1)

// const profile = ref({
//   email: user.value.email,
//   username: '',
//   website: '',
//   persona: ''
// })

const defaultUser = ref({
  id: user.value.id,
  email: user.value.email,
  username: '',
  firstTime: true,
  avatar_url: '',
  updated_at: new Date(),
  website: '',
  persona: '',
  subscription: {
    "status": "free",
    "order_id": "",
    "plan": "free",
    "current_period_start": ""
  }
})

/* 

1. Get the user from the database.
2. Ensure that the user's group is created
3. If the user was invited (email exists in invited_profiles), then we should allow the user to review those team invitations
4. Allow the user to set their persona
5. Allow the user to set their name and website
6. If they are not in the profiles table, I must create that first, then populate the user's profile with the data they've entered

*/

// First, let's check if the user is in the database
const checkUser = async () => {
  try {
    await fetchSingleProfile(user.value.id)
    console.log("Checking ProfileData", ProfileData.value)
  } catch (error) {
    console.error(error)
    console.error(ProfileError)
  }
}

async function init() {
  try {
    await checkUser()
  } catch (error) {
    console.error(error)
    console.error(ProfileError)
  }
}

onMounted(async () => {
  try {
    init();
    // await fetchSingleProfile(user.value.id)
    // await fetchInvitedTeamsForThisProfile(user.value.email)
    // await fetchInvitedTeams([TeamIds.value])
    // await createGroup(user.value.id)
    // if (checkUser()) {
    //   await fetchSingleGroup(user.value.id)
    //   await fetchTeams(GroupData.value.id)
    // } 
  } catch (error) {
    console.error(error)
  }
})

const setPersona = (persona) => {
  defaultUser.value.persona = persona;
};

// STEP 1 - set the user's persona
// const setPersona = async (persona) => {
//   // Set the user's persona
//   userStore.setPersona(persona)
  
//   // Update the user in the database
//   const { data, error } = await supabase
//     .from('profiles')
//     .update({ persona: persona })
//     .eq('id', userStore.uuid)

//   // go to next step
//   onboardingStep.value = 2

//   if (error) throw error
// }

async function onboardUserDetails() {
  // If there user is not in the database, create them
  if (!ProfileData.value) {
    await createProfile(defaultUser.value)
  } else {
    // Update the user's profile
    await updateProfile(defaultUser.value)
  }

  setFirstTime(false)
  emit('closeOnboarding')

}

async function setFirstTime(set) {
  // Set the user's firstTime to false
  userStore.setFirstTime(set)
  
  // Update the user in the database
  const { data, error } = await supabase
    .from('profiles')
    .update({ firstTime: set })
    .eq('id', user.value.id)

  if (error) throw error

  return data
}


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

  .teams-approval-wrapper {
    border: $border;
    border-radius: $br-md;
    padding: $spacing-sm;
    margin-top: $spacing-md;

    .teams-approval-row {
      display: flex;
      flex-direction: row;
      justify-content: space-between;

      p {
        margin: 0;
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

    .onboarding-step {
      max-width: 600px;
      width: 100%;
      position: relative;

      .prevStep {
        position: fixed;
        top: $spacing-md;
        left: $spacing-md;
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
        }

        p {
          font-size: $font-size-xs;
          opacity: 0.6;
          text-transform: none;
          max-width: 80%;
          margin: 0 0 $spacing-xxs 0;
        }

      }
    }
  }

}

</style>