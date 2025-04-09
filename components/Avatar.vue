<template>
  <section class="avatar-component" v-if="ProfileData" ref="avatarComponent" @mouseover="handleHover" @mouseleave="handleHover">
    
    <!-- Avatar image icon -->
    <section class="avatar-wrap" ref="avatarWrap">
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
    <section class="avatar-popup" v-if="hover && avatar == true" @mouseleave="handleHover" ref="avatarPopup">
      <div class="avatar-popup-content">
        <div class="avatar-popup-top">
          <!-- <img :src="src" :alt="ProfileData.username" /> -->
          <p v-if="ProfileData.username">{{ ProfileData.username }}</p>
        </div>
        <div class="avatar-popup-bottom">
          <div class="popup-row" v-if="ProfileData.email">
            <p>Email:</p>
            <p>{{ ProfileData.email }}</p>
          </div>
          <div class="popup-row" v-if="ProfileData.website">
            <p>Website:</p>
            <a :href="ProfileData.website" >{{ ProfileData.website }}</a>
          </div>
          <div class="popup-row" v-if="ProfileData.persona">
            <p>Persona:</p>
            <p>{{ ProfileData.persona }}</p>
          </div>
          <div class="popup-row" v-if="ProfileData.subscription">
            <p>Subscription:</p>
            <p>{{ ProfileData.subscription.status }}</p>
          </div>
        </div>
      </div>
    </section>

  </section>
</template>

<script setup>

import { ref, onMounted, watch } from 'vue'

const props = defineProps(['uuid', 'size', 'hasName', 'secondarytext', 'avatar'])
const supabase = useSupabaseClient()
const loading = ref(true)
const src = ref("")
const path = ref("")
const hover = ref(false)

const avatarWrap = ref(null)

function handleHover() {

  const hoverState = avatarWrap.value.contains(event.target) || avatarWrap.value === event.target

  if (hoverState) {
    // show the popup for this component
    hover.value = true
  } else {
    // If the user hovers over the popup, I want to keep it open
    const popup = document.querySelector('.avatar-popup')
    if (popup && popup.contains(event.target)) {
      hover.value = true
    } else {
      hover.value = false
    }
  }

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

@keyframes scaleBounce {
  0% {
    transform: scale(0.5);
    opacity: 0;
  }
  60% {
    transform: scale(1.005);
    opacity: 1;
  }
  100% {
    transform: scale(1);
  }
}

.avatar-component {
  position: relative;

  .avatar-popup {
    position: fixed;
    width: 280px;
    background: rgba($white, 0.75);
    backdrop-filter: blur(6px);
    border-radius: $br-lg;
    box-shadow: $big-shadow;
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 10000;
    animation: scaleBounce 0.4s ease;
    transform-origin: top left;

    .avatar-popup-content {
      display: flex;
      flex-direction: column;
      align-items: center;
      text-align: center;
      width: 100%;

      .avatar-popup-top {
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: flex-start;
        background: rgba($brand, 0.85);
        width: 100%;
        padding: $spacing-sm $spacing-md;
        border-radius: $br-lg $br-lg 0 0;

        p {
          margin: 0;
          font-size: $font-size-sm;
          color: $white;
          font-weight: bold;
        }

        img {
          width: 24px;
          height: 24px;
          border-radius: $br-lg;
          margin-bottom: $spacing-xs;
        }
      }

      .avatar-popup-bottom {
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        justify-content: flex-start;
        width: 100%;
        padding: $spacing-md;
        gap: $spacing-xxs;

        .popup-row {
          display: flex;
          flex-direction: row;
          justify-content: space-between;
          width: 100%;

          p {
            margin: 0;
            color: $black;
            font-weight: normal;

            &:first-child {
              font-weight: bold;
            }
          }
        }
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