<template>
  <div class="container" id="pushText">
    <textarea v-model="text" placeholder="Write something..."></textarea>
    <button @click="submit">Submit</button>
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
  } else {
    console.error("Ok");
  }

  console.log(user.value.id);

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

  console.log("text submitted successfully!");
}

</script>