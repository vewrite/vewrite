<template>
  <section class="deliverable-approved">
    
    <section class="download-bar">
      <button class="download" @click="downloadFile('html')">Download HTML</button>  
    </section>
  </section>
</template>

<script setup>

const props = defineProps(['deliverable']);

// download from nuxt's server/api -> /api/deliverables/export
// const downloadFile = async (type) => {
//   console.log('Downloading file in format:', type);
//   try {
//     const response = await $fetch(`/api/deliverable_content/export?id=${props.deliverable.id}&type=${type}`, {
//       responseType: 'blob',
//     });

//     if (!response) {
//       console.error('No response from server');
//       return;
//     }

//     if(type == 'html') {
//       const url = window.URL.createObjectURL(new Blob([response]));
//       const link = document.createElement('a');
//       link.href = url;
//       link.setAttribute('download', `vewrite-html-export-${props.deliverable.id}.html`);
//       document.body.appendChild(link);
//       link.click();
//       document.body.removeChild(link);
//     }

//   } catch (err) {
//     console.error('Error downloading file:', err);
//   }
// };

</script>

<style lang="scss" scoped>

@use 'assets/variables' as *;

.deliverable-approved {
  width: 100%;
  height: 100%;
  position: relative;

  .download-bar {
    position: absolute;
    bottom: $spacing-sm;
    right: $spacing-sm;
    width: 100%;
    display: flex;
    justify-content: flex-end;
    align-items: center;
  }
}

</style>