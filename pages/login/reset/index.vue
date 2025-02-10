<template>
  <main id="Reset">
    <Logo />
    <h1>Reset Password</h1>
    <div class="notification success" v-if="success">{{ success }}. Make sure to check your spam/junk if you do not see it.</div>
    <form @submit.prevent="resetPassword" v-if="!success">
      <div class="form-group">
        <div class="form-input">
          <label for="email">Your email address</label>
          <input class="inputField" type="email" placeholder="john@example.com" v-model="email" />
        </div>
      </div>
      <input type="submit" class="button large primary" @click="resetPassword" :value="loading ? 'Sending email' : 'Reset Password'" :disabled="loading" />
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

const email = ref('')

const error = ref(null)
const success = ref(null)
const loading = ref(false)

async function resetPassword() {
  loading.value = true
  try {
    const { data, error } = await supabase.auth.api.resetPasswordForEmail(email.value)

    if (error) { error.value = error.message; return }

    console.log(data)
    success.value = 'Password recovery email sent'
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