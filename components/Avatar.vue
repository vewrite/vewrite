<template>
  <router-link to="/" class="user-avatar">
    <Loading v-if="loading" type="small" />
    <img :src="src" alt="" v-else />
  </router-link>
</template>

<script setup>

const props = defineProps(['uuid', 'size'])
const supabase = useSupabaseClient()
const loading = ref(false)
const src = ref("")
const path = ref("")

import useProfile from '~/composables/useProfile'
const { fetchProfileImage, ProfileData, ProfileError } = useProfile()

const downloadImage = async (path) => {
    try {
        const { data, error } = await supabase.storage
            .from("avatars")
            .download(path)
        if (error) throw error
        src.value = URL.createObjectURL(data)
    } catch (error) {
        console.error("Error downloading image: ", error.message)
    }
}

onMounted(async () => {
  try {
    await fetchProfileImage(props.uuid)
    downloadImage(ProfileData.value.avatar_url)  
  } catch (error) {
    console.error("Error downloading image: ", error.message)
  }
});

watch(path, () => {
    if (path.value) {
        downloadImage()
    }
})

</script>

<style lang="scss" scoped>

@import 'assets/_variables.scss';

.user-avatar {
  display: block;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  overflow: hidden;
  font-size: 0;
  border: 1px solid $gray-light;

  img {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    background-color: $gray-light;
    border: 0;
    outline: 0;
    margin: -1px;
    object-fit: cover;
    text-indent: -9999px;
  }
}

</style>