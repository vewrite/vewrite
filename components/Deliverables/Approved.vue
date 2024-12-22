<template>
  <section class="deliverable-approved">
    <button @click="downloadFile()">Download test</button>  
  </section>
</template>

<script setup>

const props = defineProps(['deliverable']);

// download from nuxt's server/api -> /api/deliverables/export
const downloadFile = async () => {
  try {
    const response = await $fetch(`/api/deliverable_content/export?id=${props.deliverable.id}`, {
      responseType: 'blob',
    });

    const url = window.URL.createObjectURL(new Blob([response]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `vewrite-export-${props.deliverable.id}.md`); // or the filename you want
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  } catch (err) {
    console.error('Error downloading file:', err);
  }
};

</script>

<style lang="scss" scoped>

@use 'assets/variables' as *;

.deliverable-approved {
  height: 100%;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}

</style>