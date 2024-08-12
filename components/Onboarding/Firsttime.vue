<template>
  <div id="FirstTime">
    <div class="onboarding-form">
      <div class="onboarding-step" v-if="onboardingStep == 1">
        <h1>Hello!</h1>
        <h2>How will you be using Vewrite?</h2>
          <div class="onboarding-header">
          <p>Let's get started by learning about who you are. You can change this from your settings in the future if you find that you require more or less functionality.</p>
        </div>
        <div class="select-persona">
          <button class="large" @click="setPersona('talent')">
            <svg width="44" height="44" viewBox="0 0 44 44" fill="none" xmlns="http://www.w3.org/2000/svg">
              <g clip-path="url(#clip0_159_236)">
              <rect width="44" height="44" fill="white"/>
              <circle cx="22" cy="22" r="21.5" stroke="black" stroke-opacity="0.3" stroke-linecap="round"/>
              <path fill-rule="evenodd" clip-rule="evenodd" d="M10.2897 28.641C10.1041 28.8283 10 29.0813 10 29.3449V33C10 33.5523 10.4477 34 11 34H14.6498C14.9166 34 15.1723 33.8934 15.3601 33.7039L29.0326 19.9071C29.4201 19.5161 29.4187 18.8854 29.0294 18.4961L25.377 14.8436C24.9852 14.4519 24.3496 14.4533 23.9596 14.8469L10.2897 28.641ZM33.6 15.3333C34.1333 14.8 34.1333 14 33.6 13.4667L30.5333 10.4C30 9.86667 29.2 9.86667 28.6667 10.4L26.9738 12.0929C26.5832 12.4834 26.5832 13.1166 26.9738 13.5071L30.5859 17.1192C30.9918 17.5251 31.6554 17.5067 32.0382 17.0789L33.6 15.3333Z" stroke="black" stroke-opacity="0.3" stroke-linecap="round"/>
              </g>
              <defs>
              <clipPath id="clip0_159_236">
              <rect width="44" height="44" fill="white"/>
              </clipPath>
              </defs>
            </svg>
            <h2>Talent</h2>
            <p class="define">Have access to the Talent Marketplace and work on projects</p>
          </button>
          <button class="large" @click="setPersona('manager')">
            <svg width="44" height="44" viewBox="0 0 44 44" fill="none" xmlns="http://www.w3.org/2000/svg">
              <g clip-path="url(#clip0_159_233)">
              <rect width="44" height="44" fill="white"/>
              <circle cx="22" cy="22" r="21.5" stroke="black" stroke-opacity="0.3" stroke-linecap="round"/>
              <path d="M33 32C33.5523 32 34 31.5524 33.9805 31.0005C33.9626 30.494 33.9283 29.9005 33.8625 29.4875C33.75 28.8062 32.8063 27.9062 28.7938 26.4312C24.8438 24.9812 25.0875 25.6875 25.0875 23.0187C25.0875 21.2875 25.9688 22.2938 26.5312 19.0063C26.75 17.7125 26.925 18.575 27.4 16.5C27.65 15.4125 27.2312 15.3313 27.2812 14.8125C27.3313 14.2937 27.3813 13.8313 27.475 12.7688C27.5875 11.4563 26.3688 8 22 8C17.6312 8 16.4125 11.4562 16.5312 12.775C16.625 13.8312 16.675 14.3 16.725 14.8188C16.775 15.3375 16.3562 15.4188 16.6062 16.5063C17.0812 18.575 17.2563 17.7125 17.475 19.0125C18.0375 22.3 18.9187 21.2937 18.9187 23.025C18.9187 25.7 19.1625 24.9937 15.2125 26.4375C11.2 27.9062 10.25 28.8125 10.1438 29.4937C10.075 29.9035 10.0391 30.495 10.0204 31.0005C9.99996 31.5524 10.4477 32 11 32H22H33Z" stroke="black" stroke-opacity="0.3" stroke-linecap="round"/>
              </g>
              <defs>
              <clipPath id="clip0_159_233">
              <rect width="44" height="44" fill="white"/>
              </clipPath>
              </defs>
            </svg>
            <h2>Manager</h2>
            <p class="define">Create projects, deliverables, and track your team's success</p>
          </button>
        </div>
      </div>
      <div class="onboarding-step" v-if="onboardingStep == 2">
        <button class="prevStep" @click="prevStep">Back</button>
        <h1>Great!</h1>
        <h2>Let's get personal</h2>
        <div class="onboarding-header">
          <p>Now that we know who you are, let's get to know you a little better.</p>
          <form @submit.prevent="onboardUserDetails">
            <div class="form-group">
                <div class="form-input">
                    <label for="username">Name</label>
                    <input v-model="user.username" id="username" type="text" placeholder="What's your name?" />
                </div>
                <div class="form-input">
                    <label for="name">Your website</label>
                    <input v-model="user.website" id="website" type="text" placeholder="Do you have a website?" />
                </div>
                <button type="submit" class="button block primary" :disabled="loading">
                  <span v-if="loading">Updating...</span>
                  <span v-else>Get Started</span>
                </button>
            </div>
          </form>
        </div>
      </div>
    </div>
    <div class="onboarding-tips"></div>
  </div>
</template>

<script setup>

// User store
import { useUser } from '@/stores/user'
const userStore = useUser()
const supabase = useSupabaseClient()
const user = useSupabaseUser()

const loading = ref(false)

const onboardingStep = ref(1);

// First time users will see this onboarding screen
// After they see it, we should set in the database that they have seen it
// and then they will see the main screen

const prevStep = () => {
  onboardingStep.value = onboardingStep.value - 1
}

const setPersona = async (persona) => {
  // Set the user's persona
  userStore.setPersona(persona)
  
  // Update the user in the database
  const { data, error } = await supabase
    .from('profiles')
    .update({ persona: persona })
    .eq('id', userStore.uuid)

  // go to next step
  onboardingStep.value = 2

  if (error) throw error
}

const onboardUserDetails = async () => {
  // Set the user's name and website
  setUserDetails(user)

  // Set the user's firstTime to false
  setFirstTime(false)

}

const setUserDetails = async (user) => {
  // Set the user's name and website
  userStore.setUsername(user.value.username)
  userStore.setWebsite(user.value.website)

  const { data, error } = await supabase
    .from('profiles')
    .update({ username: user.value.username, website: user.value.website })
    .eq('id', userStore.uuid)

  if (error) throw error
}

const setFirstTime = async (set) => {
  // Set the user's firstTime to false
  userStore.setFirstTime(set)
  
  // Update the user in the database
  const { data, error } = await supabase
    .from('profiles')
    .update({ firstTime: set })
    .eq('id', userStore.uuid)

  if (error) throw error
}

</script>

<style lang="scss" scoped>

@import 'assets/_variables.scss';

#FirstTime {
  display: flex;
  flex-direction: row;
  height: 100%;
  width: 100%;

  .onboarding-form {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    width: 60%;
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
      margin-top: 2rem;

      button {
        width: 50%;
        height: 240px;
        display: flex;
        flex-direction: column;

        h2 {
          margin-bottom: $spacing-xxs;
          font-size: $font-size-lg;
        }

        svg {
          margin: $spacing-sm 0 $spacing-xs 0;

          path,
          circle {
            stroke: $purple;
            stroke-opacity: 1;
          }

          * {
            transition: all 0.12s ease-in-out;
          }
        }

        p {
          font-size: $font-size-xs;
          color: rgba($black, 1);
          text-transform: none;
          max-width: 80%;
          margin: 0 auto $spacing-sm;
        }

        &:hover {
          svg path,
          svg circle {
            stroke: $white;
            stroke-opacity: 1;
          }

          svg circle {
            fill: $purple;
          }
        }

        &:first-child {
          // border-right: 1px solid $white;
          border-radius: $br-lg 0 0 $br-lg;

          &:hover {
            z-index: 1;
          }
        }

        &:last-child {
          // border-right: 1px solid $white;
          border-radius: 0 $br-lg $br-lg 0;
          margin-left: -1px;
        }
      }
    }
  }

  .onboarding-tips {
    width: 40%;
    height: 100%;
    color: $white;
    background: $purple url('/images/on-board-main.jpg') center center no-repeat;
    background-size: cover;
  }
}

</style>