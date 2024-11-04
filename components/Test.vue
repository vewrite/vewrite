<template>
  <div class="container" id="pushText">
    <textarea v-model="text" placeholder="Write something..."></textarea>
    <button @click="submit">Submit</button>
  </div>
  <div class="container" id="viewText">
    <article v-for="item in listText" :key="item.id">
      {{ item.name }}
    </article>
  </div>  

</template>

<script setup>
const supabase = useSupabaseClient()
const user = useSupabaseUser();

const loading = ref(true)
const text = ref('')

loading.value = true

async function submit() {

  if (!text.value) {
    console.error("Invalid text");
    return
  }

  const { error } = await supabase
    .from('test')
    .upsert(
      { name: text.value, user_id: user.value.id },
      { set: { name: text.value } }
    )
    .eq("user_id", user.value.id);

  if (error) {
    console.error("Error submitting text:", error.message);
    return;
  }

  fetchText();
}

const listText = ref([]);

async function fetchText() {
  const { data, error } = await supabase
    .from('test')
    .select('name')
    .eq('user_id', user.value.id);

  if (error) {
    console.error("Error fetching text:", error.message);
    return;
  }

  listText.value = data;
}

fetchText();

</script>

<style lang="scss">

@use 'assets/variables' as *;

#pushText,
#viewText {
  width: 100%;
  margin: $spacing-md 0 0;
  padding: $spacing-md 0 0;

  article {
    padding: $spacing-sm;
    background-color: rgba($blue, 0.1);

    &:nth-child(odd) {
      background-color: rgba($blue, 0.05);
    }
  }
}


</style>