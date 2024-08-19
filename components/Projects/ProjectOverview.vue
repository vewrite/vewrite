<template>
  <aside class="project-overview">
    <div class="client-summary">
      <ClientImage :client="client" size="md" table="logos" />
    </div>
    <!-- {{ client }} -->
    <!-- <img :src="client.logo_url" :alt="client.name" /> -->
    <!-- {{ project }} -->
    <!-- {{ deliverables }} -->
    <!-- <div>
      <h3>{{ project.name }}</h3>
      <p>{{ project.description }}</p>
    </div> -->
    <!-- {{ creator }} -->
  </aside>
</template>

<script setup>

// Supabase
// const supabase = useSupabaseClient();
// const user = useSupabaseUser();

const loading = ref(true);

const props = defineProps(['project', 'creator', 'client', 'deliverables'])
const { client } = toRefs(props)

// async function fetchClientLogo(client) {

//   console.log("fetchClientLogo", client)

//   // get one logo based on the client id
//   const { data, error } = await supabase
//     .from('clients')
//     .select('logo_url')
//     .eq('id', client)
//     .single()

//   if (error) {
//     console.error('Error fetching client:', error.message)
//     return null
//   }

//   const logoBlob = await downloadImage(data.logo_url);
//   return URL.createObjectURL(logoBlob);

// }

// const downloadImage = async (path) => {
//   try {
//     const { data, error } = await supabase.storage
//           .from('logos')
//           .download(path)
//       if (error) throw error
//       return data
//   } catch (error) {
//       console.error("Error downloading image: ", error.message)
//   }
// }

// // Watch for changes to the client prop
// watch(() => props.client, (newClient) => {
//   if (newClient) {
//     fetchClientLogo(newClient[0].id);
//     console.log("newClient", newClient)
//   }
// }, { immediate: true });

</script>

<style lang="scss" scoped>

@import 'assets/_variables.scss';

.project-overview {
  width: 100%;
  margin: $spacing-md;
  padding: $spacing-md;
  background-color: rgba($white-dark, 0.25);
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  gap: $spacing-md;
}

</style>