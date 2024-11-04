<template>
    <main id="AccountContent">

        <Loading v-if="loading" />

        <form class="inner-container" @submit.prevent="updateProfile" v-else>

            <div class="form-block">
                <div class="form-details">
                    <h3>User details</h3>
                    <p class="details">Update your user details.</p>
                </div>
                <div class="form-content">
                    <div class="form-group">
                        <div class="form-input">
                            <label for="email">Email</label>
                            <input id="email" type="text" :value="user.email" disabled />
                        </div>
                        <div class="form-input">
                            <label for="email">Email</label>
                            <input id="email" type="text" :value="user.email" disabled />
                        </div>
                        <div class="form-input">
                            <label for="username">Name</label>
                            <input id="username" type="text" v-model="username" />
                        </div>
                        <div class="form-input">
                            <label for="website">Website</label>
                            <input id="website" type="website" v-model="website" />
                        </div>
                    </div>                    
                </div>
            </div>

            <div class="form-block">
                <div class="form-details">
                    <h3>Avatar</h3>
                    <p class="details">Manage your profile picture.</p>
                </div>
                <div class="form-content">
                    <!-- BUG TODO - this breaks because the logo_url is passed and not avatar_path, must fix -->
                    <ImageManager size="medium" table="avatars" v-model:path="avatar_path" @upload="updateProfile" />
                </div>
            </div>

            <div class="form-block">
                <div class="form-details">
                    <p class="details">Update your account details.</p>
                </div>
                <div class="form-content">
                    <button type="submit" class="button block primary" :disabled="loading">
                        <span v-if="loading">Updating...</span>
                        <span v-else>Update</span>
                    </button>
                </div>
            </div> 

        </form>
    </main>
</template>

<script setup>

import { useRouter } from 'vue-router';

const supabase = useSupabaseClient()
const user = useSupabaseUser();

const loading = ref(true)
const username = ref('')
const website = ref('')
const avatar_path = ref('')
const router = useRouter()

let { data } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.value.id)
    .single()
if (data) {
    username.value = data.username
    website.value = data.website
    avatar_path.value = data.avatar_url
}
loading.value = false

// User store
import { useUser } from '@/stores/user'
const userStore = useUser()

async function updateProfile() {
    try {
        loading.value = true
        const user = useSupabaseUser();
        const updates = {
            // must include all user properties or this breaks
            username: username.value,
            id: user.value.id,
            tier: user.value.tier,
            firstTime: user.value.firstTime,
            website: website.value,
            persona: user.value.persona,
            avatar_url: avatar_path.value,
            updated_at: new Date(),
        }
        userStore.setUser(updates)
        let { error } = await supabase.from('profiles').upsert(updates, {
            returning: 'minimal', // Don't return the value after inserting
        })
        if (error) throw error
    } catch (error) {
        console.error(error)
    } finally {
        loading.value = false
    }
}

async function signOut() {
    try {
        loading.value = true
        let { error } = await supabase.auth.signOut()
        router.push('/');
        if (error) throw error
        user.value = null
    } catch (error) {
        console.error(error)
    } finally {
        loading.value = false
    }
}

</script>

<style lang="scss" scoped>

@use 'assets/variables' as *;

#AccountContent {
    padding: $spacing-md;
    background-color: $white;
    height: 100%;
}


</style>