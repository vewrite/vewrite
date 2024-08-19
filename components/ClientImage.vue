<template>
  <div class="user-logo">
      <img v-if="src" :src="src" alt="logo" :class="['logo', 'image', size]" />
      <div v-else class="logo no-image" :class="size" />
  </div>
</template>

<script setup>

const props = defineProps(['client', 'size', 'table'])
const { client, size, table } = toRefs(props)

const supabase = useSupabaseClient()

const src = ref("")

async function fetchClientLogo(client) {

  console.log("fetchClientLogo", client)

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
    fetchClientLogo(newClient[0].id);
  }
}, { immediate: true });

</script>

<style lang="scss" scoped>

@import 'assets/_variables.scss';

.user-logo {
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  justify-content: flex-start;
  gap: $spacing-sm;
  width: 100%;
  
  label {
      margin: $spacing-xs 0 $spacing-xs 0;
  }

  input {
      width: 100%;
  }
}

.logo {
  border-radius: 50%;
  background-color: $gray-light;
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
  position: relative;

  &.small {
      width: 40px;
      height: 40px;
      border-radius: $br-sm;
  }

  &.medium {
      width: 80px;
      height: 80px;
      border-radius: $br-md;
  }

  &.large {
      width: 120px;
      height: 120px;
      border-radius: $br-lg;
  }

  &.image {
      border: 1px solid $gray-light;
  }

  &.no-image {
      font-size: $font-size-lg;
      color: $gray-dark;
  }
}

</style>