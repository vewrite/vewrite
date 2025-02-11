<template>
  <main id="Reset">
    <Logo />
    <h1>Reset your Password</h1>
    <div class="notification success" v-if="success">{{ success }}</div>
    <div class="notification error" v-if="errorMessage">{{ errorMessage }}</div>
    
    <!-- Get the user's email address and send a code to their email address -->
    <section  class="reset-step" v-if="step === 1">
      <form @submit.prevent="sendResetEmail">
        <div class="form-group">
          <div class="form-input">
            <label for="email">Your email address</label>
            <input class="inputField" type="email" placeholder="hello@email.com" v-model="email" />
          </div>
        </div>
        <input type="submit" class="button large primary" @click="sendResetEmail" :value="loading ? 'Sending reset link' : 'Reset password'" :disabled="loading" />
      </form>
    </section>

  </main>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'nuxt/app'

definePageMeta({
  middleware: ["auth"],
  layout: "auth",
})

const supabase = useSupabaseClient()
const user = useSupabaseUser()
const router = useRouter()

const email = ref('')
const errorMessage = ref(null)
const success = ref(null)
const loading = ref(false)
const password = ref('')
const confirmPassword = ref('')
const code = ref('')
const step = ref(1)

async function sendResetEmail() {
  loading.value = true
  try {
    const { data, error } = await supabase.auth.resetPasswordForEmail(email.value)
    
    if (error) { errorMessage.value = error.message; return }

    console.log(data)
    success.value = 'Reset link sent to email - make sure to check your spam/junk if you do not see them'
    step.value = 2
    loading.value = false

  } catch (error) {
    console.error('Error:', error.message)
    errorMessage.value = error.message
    loading.value = false
  }
}

async function resetPassword() {
  loading.value = true

  if (password.value !== confirmPassword.value) {
    error.value = 'Passwords do not match'
    loading.value = false
    return
  }

  try {

    success.value = null
    errorMessage.value = null

    const { data, error } = await supabase.auth.updateUser({ 
      email: user.value.email,
      password: password.value,
      nonce: code.value
    })

    if (error) { errorMessage.value = error.message; return }

    console.log(data)
    success.value = 'Password successfully set'
    loading.value = false
    router.push('/')

  } catch (error) {
    console.error('Error:', error.message)
    errorMessage.value = error.message
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

  .reset-step {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: $spacing-md;
    width: 100%;
    max-width: 540px;
    border: $border;
    border-radius: $br-xl;
    background-color: rgba($black, 0.025);
    padding: $spacing-lg;
  }

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