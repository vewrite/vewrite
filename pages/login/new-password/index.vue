<template>
  <main id="Reset">
    <Logo />

    {{supabase}}

    <h1 v-if="user">Let's reset the password for {{ user.email }}</h1>
    <div class="notification success" v-if="success">{{ success }}. Make sure to check your spam/junk if you do not see it.</div>
    <div class="notification warning" v-if="!matchingPasswords">Passwords do not match</div>
    <div class="notification error" v-if="error">{{ error }}</div>
    <form @submit.prevent="setPassword" v-if="!success">
      <div class="form-group">
        <div class="form-input">
          <label for="password">Password</label>
          <input class="inputField" type="password" placeholder="Password" v-model="password" />
        </div>
        <div class="form-input">
          <label for="password">Confirm password</label>
          <input class="inputField" type="password" placeholder="Confirm Password" v-model="confirmPassword" />
        </div>
      </div>
      <input type="submit" class="button large primary" @click="resetPassword" :value="loading ? 'Working' : 'Reset Password'" :disabled="loading" />
    </form>
  </main>
</template>

<script setup>
import { ref } from 'vue'

definePageMeta({
  middleware: ["auth"],
  layout: "auth",
})

const supabase = useSupabaseClient()
const user = ref(supabase.auth.user())

const password = ref('')
const confirmPassword = ref('')

const error = ref(null)
const success = ref(null)
const loading = ref(false)

const matchingPasswords = computed(() => password.value === confirmPassword.value)

async function setPassword() {
  loading.value = true
  try {
    // Reauthenticate the user
    const { error: reauthError } = await supabase.auth.reauthenticate({
      email: user.value.email
    })

    if (reauthError) { error.value = reauthError.message; return }
    
    const { data, error } = await supabase.auth.api.updateUser({ password: password })

    if (error) { error.value = error.message; return }

    console.log(data)
    success.value = 'Password successfully set'
    loading.value = false

  } catch (error) {
    console.error('Error:', error.message)
    error.value = error.message
    loading.value = false
  }
  

}

</script>

<style scoped lang="scss">
  
@use 'assets/variables' as *;

#Reset {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: $spacing-md;
  margin-bottom: $spacing-lg;
  width: 100%;

  form {
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 400px;

    .form-group {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: $spacing-sm;
      width: 100%;
    }
  }
}


</style>