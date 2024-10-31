<template>
  <div class="user-logo">
      <!-- <img v-if="src" :src="src" alt="logo" :class="['logo', 'image', size]" /> -->
      <!-- Use a background image for the logo inside the div -->
      <div v-if="src" class="logo image" :class="size" :style="{ backgroundImage: `url(${src})` }" />
      <div v-else class="logo no-image" :class="size" />

      <div>
          <label class="block" for="single">
              {{ uploading ? "Uploading ..." : "Select an image" }}
          </label>
          <input type="file" id="single" accept="image/*"
              @change="uploadlogo" :disabled="uploading" />
          <!-- <button v-if="path" class="button block" @click="clear">Remove</button> -->
      </div>
  </div>
</template>

<script setup>
const props = defineProps(['path', 'size', 'table'])
const { path, size, table } = toRefs(props)

const emit = defineEmits(['update:path', 'upload'])

const supabase = useSupabaseClient()

const uploading = ref(false)
const src = ref("")
const files = ref()

const downloadImage = async () => {
  try {
    console.log(table.value, path.value)  
    const { data, error } = await supabase.storage
          .from(table.value)
          .download(path.value)
      if (error) throw error
      src.value = URL.createObjectURL(data)
  } catch (error) {
      console.error("Error downloading image: ", error.message)
  }
}

const uploadlogo = async (evt) => {
  console.log(evt)
  files.value = evt.target.files
  try {
      uploading.value = true
      console.log("Uploading image ...")
      if (!files.value || files.value.length === 0) {
          throw new Error("You must select an image to upload.")
      }
      const file = files.value[0]
      const fileExt = file.name.split(".").pop()
      const fileName = `${Math.random()}.${fileExt}`
      const filePath = `${fileName}`
      let { error: uploadError } = await supabase.storage
          .from(table.value)
          .upload(filePath, file)
      if (uploadError) throw uploadError
      console.log("Image uploaded successfully.")
      console.log(filePath)
      emit("update:path", filePath)
      emit("update:logo_url", filePath)
      emit("upload")
  } catch (error) {
      console.error("Error uploading image: ", error.message)
  } finally {
      uploading.value = false
  }
}

const clearlogo = async () => {
  try {
      await supabase.storage.from(table.value).remove([path.value])
      emit("update:path", "")
  } catch (error) {
      console.error("Error removing image: ", error.message)
  }
}

downloadImage()

watch(path, () => {
  if (path.value) {
      downloadImage()
  }
})

watch(() => props.logo_url, (newValue) => {
  logo_url.value = newValue;
});
</script>

<style lang="scss" scoped>

@import 'assets/_variables.scss';

.user-logo {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;
  gap: 0;
  width: 100%;
  border: 1px solid $gray-light;
  background-color: $white;
  padding: $spacing-xs $spacing-xs;
  border-radius: $br-md;
  
  label {
      margin: 0 0 $spacing-xxs 0;
  }

  input {
      width: 100%;
  }
}

.logo {
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
  position: relative;
  background-size: cover;
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

  &.image {
      border: 1px solid $gray-light;
  }

  &.no-image {
      font-size: $font-size-lg;
      color: $gray-dark;
  }
}

</style>