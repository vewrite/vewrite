<template>
  <div id="FirstTime">
    <div class="onboarding-form">
      <h1>Welcome to Vewrite</h1>
      <p>Let's get started by creating your first project</p>
      <button @click="nextStep">Next</button>
    </div>
    <div class="onboarding-imagery">
      images
    </div>
  </div>
</template>

<script setup>

// User store
import { useUser } from '@/stores/user'
const userStore = useUser()
const supabase = useSupabaseClient()
const user = useSupabaseUser()

// First time users will see this onboarding screen
// After they see it, we should set in the database that they have seen it
// and then they will see the main screen

const nextStep = async () => {
  // Set the user's firstTime to false
  userStore.setFirstTime(false)
  
  // Update the user in the database
  const { data, error } = await supabase
    .from('profiles')
    .update({ firstTime: false })
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
  perspective: 1000em;

  .onboarding-form {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    width: 50%;
    height: 100%;
    background-color: $white;
    color: $black;
  }

  .onboarding-imagery {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    width: 50%;
    height: 100%;
    background-color: $purple;
    color: $white;
  }
}

</style>