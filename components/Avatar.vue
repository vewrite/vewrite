<template>
  <section class="avatar-component" v-if="ProfileData">
    
    <!-- Avatar image icon -->
    <section class="avatar-wrap" @mouseover="handleHover" @mouseleave="handleHover" ref="avatarWrap">
      <span :class="['user-avatar', size]">
        <Loading v-if="loading" type="small" />
        <img :src="src" alt="" :class="size" v-else />
      </span>
      <div class="user-details" v-if="hasName">
        <div class="username">{{ ProfileData.username }}</div>
        <div class="secondarytext" v-if="secondarytext">{{ secondarytext }}</div>
      </div>
    </section>

    <!-- Avatar popup -->
    <section class="avatar-popup" v-if="hover" >
      <div class="avatar-popup-content">
        <img :src="src" :alt="ProfileData.username" />
        <div class="avatar-popup-text">
          <h3>{{ ProfileData.username }}</h3>
          <p>{{ ProfileData.bio }}</p>
        </div>
      </div>
    </section>

  </section>
</template>

<script setup>

import { ref, onMounted, watch } from 'vue'

const props = defineProps(['uuid', 'size', 'hasName', 'secondarytext'])
const supabase = useSupabaseClient()
const loading = ref(true)
const src = ref("")
const path = ref("")
const hover = ref(false)

const avatarWrap = ref(null)

function handleHover() {

  // first, I'm going to hide any other popups
  // then I'm going to set the hover to true
  document.querySelectorAll('.avatar-popup').forEach(popup => {
    // Only hide popups that aren't children of this component
    if (!avatarWrap.value.contains(popup)) {
      popup.style.display = 'none';
    }
  });


  // I'm going to want to get the avatar wrap x and y position
  // and set the popup to that position

  const rect = avatarWrap.value.getBoundingClientRect()
  const x = rect.x + window.scrollX
  const y = rect.y + window.scrollY
  const width = rect.width
  const height = rect.height
  const top = rect.top + window.scrollY
  const bottom = rect.bottom + window.scrollY
  const left = rect.left + window.scrollX
  const right = rect.right + window.scrollX

  // now I need to set the popup to that position

  // I'm going to set the popup to the x and y position
  
  const popupLeftPosition = x + width / 2 - 110
  const popupTopPosition = y - 60

  avatarWrap.value.style.top = `${popupTopPosition}px`
  avatarWrap.value.style.left = `${popupLeftPosition}px`

  hover.value = !hover.value
}

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

.avatar-component {
  position: relative;

  .avatar-popup {
    position: fixed;
    width: 220px;
    background: rgba($white, 0.5);
    backdrop-filter: blur(5px);
    border-radius: $br-lg;
    box-shadow: $soft-shadow;
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 10000;
    padding: $spacing-sm;

    .avatar-popup-content {
      display: flex;
      flex-direction: column;
      align-items: center;
      text-align: center;

      img {
        width: 52px;
        height: 52px;
        border-radius: $br-lg;
        margin-bottom: $spacing-sm;
      }

      h3 {
        font-size: $font-size-lg;
        font-weight: bold;
        margin-bottom: $spacing-xs;
      }

      p {
        font-size: $font-size-sm;
        color: rgba($black, 0.7);
      }
    }
    
  }
}

.avatar-wrap {
  display: flex;
  flex-direction: row;
  gap: $spacing-xs;
  align-items: center;

  .user-details {
    display: flex;
    flex-direction: column;

    .username {
      font-weight: normal;
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
  font-size: 0;
  outline: $border;
  outline-offset: -1px;
  overflow: hidden;

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