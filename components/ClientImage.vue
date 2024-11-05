<template>
  <div :class="['client-logo-wrapper', 'client-logo', 'image', size]">
    <Loading v-if="loading" type="small" />
    <div v-if="!loading" class="client-logo image" :class="size" :style="{ backgroundImage: `url(${src})` }" />
  </div>
</template>

<script setup>

// ClientImage component
// expects a client object with an id!

const props = defineProps(['client', 'size', 'table'])
const { client, size, table } = toRefs(props)

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

  console.log('Client logo:', data.logo_url)

  const logoBlob = await downloadImage(data.logo_url);
  src.value = URL.createObjectURL(logoBlob);
  loading.value = false

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
    console.log('New client:', newClient);
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

  &.small {
      width: 42px;
      height: 42px;
      border-radius: $br-md;
  }

  &.medium {
      width: 60px;
      height: 60px;
      border-radius: $br-md;
  }

  &.large {
      width: 100px;
      height: 100px;
      border-radius: $br-lg;
  }

  &.no-image {
      font-size: $font-size-lg;
      color: $gray-dark;
  }
}

</style>