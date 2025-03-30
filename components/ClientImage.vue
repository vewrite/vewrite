<template>
  <div :class="['client-logo-wrapper', 'client-logo', 'image', size]">
    <Loading v-if="loading" type="small" />
    <div v-if="!loading" class="client-logo-bg" :class="size" :style="{ backgroundImage: `url(${src})` }" />
    <div v-if="!loading" class="client-logo-image" :class="size" :style="{ backgroundImage: `url(${src})` }" />
  </div>
</template>

<script setup>

const props = defineProps(['client', 'size', 'table'])

const supabase = useSupabaseClient()
const loading = ref(true)
const src = ref("")

async function fetchClientLogo(client) {

  // get one logo based on the client id
  const { data, error } = await supabase
    .from('clients')
    .select('logo_url')
    .eq('client_id', client)
    .single()

  if (error) {
    console.error('Error fetching client:', error.message)
    return null
  }

  if(data.logo_url === '') {
    const logoBlob = await fetch('/images/vewrite-personal-project.png').then(res => res.blob());
    src.value = URL.createObjectURL(logoBlob);
    loading.value = false
    return
  } else {
    const logoBlob = await downloadImage(data.logo_url);
    src.value = URL.createObjectURL(logoBlob);
    loading.value = false
  }

}

const downloadImage = async (path) => {
  try {
    const { data, error } = await supabase.storage
          .from('logos')
          .download(path)
      if (error) throw error
      return data
  } catch (error) {
      console.error("Error downloading image: ", error.message)
  }
}

// Watch for changes to the client prop
watch(() => props.client, (newClient) => {
  if (newClient) {
    fetchClientLogo(newClient);
  }
}, { immediate: true });

</script>

<style lang="scss" scoped>

@use 'assets/variables' as *;

.client-logo-wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
}

.client-logo {
  border-radius: $br-md;
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
  position: relative;
  background-size: contain;
  background-position: center;
  background-repeat: no-repeat;
  background-color: $gray-light;

  .client-logo-image {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background-size: contain;
      background-position: center;
      background-repeat: no-repeat;

      &.small {
          min-width: 54px;
          width: 54px;
          min-height: 54px;
          height: 54px;
          border-radius: $br-md;
      }

      &.medium {
          min-width: 60px;
          min-height: 60px;
          border-radius: $br-md;
      }

      &.large {
          min-width: 100px;
          min-height: 100px;
          border-radius: $br-lg;
      }
  }

  .client-logo-bg {
      position: absolute;
      top: -50%;
      left: -50%;
      width: 200%;
      height: 200%;
      background-size: cover;
      background-position: center;
      background-repeat: no-repeat;
      filter: blur(5px);
      mix-blend-mode: color;
  }

  &.small {
      min-width: 54px;
      min-height: 54px;
      border-radius: $br-md;
  }

  &.medium {
      min-width: 60px;
      min-height: 60px;
      border-radius: $br-md;
  }

  &.large {
      min-width: 100px;
      min-height: 100px;
      border-radius: $br-lg;
  }

  &.no-image {
      font-size: $font-size-lg;
      color: $gray-dark;
  }
}

</style>