<template>
    <form class="row flex flex-center" @submit.prevent="handleLogin">
        <div class="col-6 form-widget">
            <h2 class="header">Sign in</h2>
            <p class="description">Sign in via magic link with your email below</p>
            <div class="form-group">
                <div class="form-input">
                    <label for="email">Your email address</label>
                    <input class="inputField" type="email" placeholder="you@home.com" v-model="email" />
                </div>
            </div>
            <div>
                <input type="submit" class="button block" :value="loading ? 'Loading' : 'Send magic link'"
                    :disabled="loading" />
            </div>
        </div>
    </form>
</template>

<script setup>

const supabase = useSupabaseClient()

const loading = ref(false)
const email = ref("")
const handleLogin = async () => {
    try {
        loading.value = true
        const { error } = await supabase.auth.signIn({ email: email.value })
        if (error) throw error
        alert("Check your email for the login link!")
    } catch (error) {
        alert(error.error_description || error.message)
    } finally {
        loading.value = false
    }
}
</script>
