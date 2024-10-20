<template>
  <div :class="['client-logo-wrapper', 'client-logo', 'image', size]">
    <Loading v-if="loading" type="small" />
    <!-- <img v-if="!loading" :src="src" alt="logo" :class="['client-logo', 'image', size]" /> -->
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
    .eq('id', client)
    .single()

  if (error) {
    console.error('Error fetching client:', error.message)
    return null
  }

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
    fetchClientLogo(newClient.id);
  }
}, { immediate: true });

</script>

<style lang="scss" scoped>

@import 'assets/_variables.scss';

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

  &.small {
      width: 30px;
      height: 30px;
      border-radius: $br-sm;
  }

  &.medium {
      width: 60px;
      height: 60px;
      border-radius: $br-md;
  }

  &.large {
      width: 120px;
      height: 120px;
      border-radius: $br-lg;
  }

  &.no-image {
      font-size: $font-size-lg;
      color: $gray-dark;
  }
}

</style>