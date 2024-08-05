<template>
    <main id="AccountContent">
        <form class="form-widget inner-container" @submit.prevent="updateProfile">
            
            <div class="form-group">
                <h3>Avatar</h3>
                <Avatar v-model:path="avatar_path" @upload="updateProfile" />
            </div>

            <div class="form-group">
                <h3>User details</h3>
            
                <div>
                    <label for="email">Email</label>
                    <input id="email" type="text" :value="user.email" disabled />
                </div>
                <div>
                    <label for="username">Name</label>
                    <input id="username" type="text" v-model="username" />
                </div>
                <div>
                    <label for="website">Website</label>
                    <input id="website" type="website" v-model="website" />
                </div>

                <div class="form-group-footer">
                    <button type="submit" class="button block primary" :disabled="loading">
                        <span v-if="loading">Loading...</span>
                        <span v-else>Update</span>
                    </button>
                </div>
            </div>
        </form>
    </main>
</template>

<script setup>
const supabase = useSupabaseClient()

const loading = ref(true)
const username = ref('')
const website = ref('')
const avatar_path = ref('')


loading.value = true
const user = useSupabaseUser();
let { data } = await supabase
    .from('profiles')
    .select(`username, website, avatar_url`)
    .eq('id', user.value.id)
    .single()
if (data) {
    username.value = data.username
    website.value = data.website
    avatar_path.value = data.avatar_url
}
loading.value = false

async function updateProfile() {
    try {
        loading.value = true
        const user = useSupabaseUser();
        const updates = {
            id: user.value.id,
            username: username.value,
            website: website.value,
            avatar_url: avatar_path.value,
            updated_at: new Date(),
        }
        let { error } = await supabase.from('profiles').upsert(updates, {
            returning: 'minimal', // Don't return the value after inserting
        })
        if (error) throw error
    } catch (error) {
        alert(error.message)
    } finally {
        loading.value = false
    }
}

async function signOut() {
    try {
        loading.value = true
        let { error } = await supabase.auth.signOut()
        if (error) throw error
        user.value = null
    } catch (error) {
        alert(error.message)
    } finally {
        loading.value = false
    }
}
</script>

<style lang="scss" scoped>

@import 'assets/_variables.scss';

#AccountContent {
    padding: $spacing-md;
}


</style>