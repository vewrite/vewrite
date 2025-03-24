<template>
  <section class="avatar-wrap">
    <span :class="['user-avatar', size]">
      <Loading v-if="loading" type="small" />
      <img :src="src" alt="" :class="size" v-else />
    </span>
    <div class="user-details" v-if="hasName && ProfileData">
      <div class="username">{{ ProfileData.username }}</div>
      <div class="secondarytext" v-if="secondarytext">{{ secondarytext }}</div>
    </div>
  </section>
</template>

<script setup>

const props = defineProps(['uuid', 'size', 'hasName', 'secondarytext'])
const supabase = useSupabaseClient()
const loading = ref(true)
const src = ref("")
const path = ref("")

import useProfile from '~/composables/useProfile'
const { fetchSingleProfile, ProfileData } = useProfile()

const downloadImage = async (path) => {
    try {
        const { data, error } = await supabase.storage
            .from("avatars")
            .download(path)
        
        if (error) throw error

        src.value = URL.createObjectURL(data)
        
        loading.value = false
        
    } catch (error) {
        console.error("Error downloading image: ", error.message)
    }
}

onMounted(async () => {
  try {
    await fetchSingleProfile(props.uuid)
    if (ProfileData.value.avatar_url !== '') {
      downloadImage(ProfileData.value.avatar_url)  
    } else {
      src.value = '/images/avatar-placeholder.png'
      loading.value = false
    }
    
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

@use 'assets/variables' as *;

.avatar-wrap {
  display: flex;
  flex-direction: row;
  gap: $spacing-xs;
  align-items: center;

  .user-details {
    display: flex;
    flex-direction: column;

    .username {
      font-weight: bold;
    }

    .secondarytext {
      font-size: $font-size-xs;
      color: rgba($black, 0.5);
    }
  }
}

.user-avatar {
  display: block;
  width: 40px;
  height: 40px;
  border-radius: $br-lg;
  overflow: hidden;
  font-size: 0;
  outline: $border;
  outline-offset: -1px;

  &.small {
    width: 32px;
    height: 32px;

    img {
      width: 32px;
      height: 32px;
    }
  }

  &.tiny {
    width: 24px;
    height: 24px;
    border-radius: $br-md;

    img {
      width: 24px;
      height: 24px;
    }
  }

  img {
    width: 42px;
    height: 42px;
    background-color: $gray-light;
    border: 0;
    outline: 0;
    margin: -1px;
    object-fit: cover;
    text-indent: -9999px;

    &.small {
      width: 32px;
      height: 32px;
    }
  }
}

</style>