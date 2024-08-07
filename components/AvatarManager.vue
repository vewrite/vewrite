<template>
    <div class="user-avatar">
        <img v-if="src" :src="src" alt="Avatar" :class="['avatar', 'image', size]" />
        <div v-else class="avatar no-image" :class="size" />

        <div>
            <label class="block" for="single">
                {{ uploading ? "Uploading ..." : "Select an image" }}
            </label>
            <input type="file" id="single" accept="image/*"
                @change="uploadAvatar" :disabled="uploading" />
            <!-- <button v-if="path" class="button block" @click="clearAvatar">Remove</button> -->
        </div>
    </div>
</template>

<script setup>
const props = defineProps(['path', 'size'])
const { path, size } = toRefs(props)

const emit = defineEmits(['update:path', 'upload'])

const supabase = useSupabaseClient()

const uploading = ref(false)
const src = ref("")
const files = ref()

const downloadImage = async () => {
    try {
        const { data, error } = await supabase.storage
            .from("avatars")
            .download(path.value)
        if (error) throw error
        src.value = URL.createObjectURL(data)
    } catch (error) {
        console.error("Error downloading image: ", error.message)
    }
}

const uploadAvatar = async (evt) => {
    files.value = evt.target.files
    try {
        uploading.value = true
        if (!files.value || files.value.length === 0) {
            throw new Error("You must select an image to upload.")
        }
        const file = files.value[0]
        const fileExt = file.name.split(".").pop()
        const fileName = `${Math.random()}.${fileExt}`
        const filePath = `${fileName}`
        let { error: uploadError } = await supabase.storage
            .from("avatars")
            .upload(filePath, file)
        if (uploadError) throw uploadError
        emit("update:path", filePath)
        emit("upload")
    } catch (error) {
        alert(error.message)
    } finally {
        uploading.value = false
    }
}

const clearAvatar = async () => {
    try {
        await supabase.storage.from("avatars").remove([path.value])
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
</script>

<style lang="scss" scoped>

@import 'assets/_variables.scss';

.user-avatar {
    display: flex;
    flex-direction: row;
    align-items: flex-start;
    justify-content: flex-start;
    gap: $spacing-sm;
    width: 100%;

    div {
        width: 100%;
    }

    label {
        margin: $spacing-xs 0 $spacing-xs 0;
    }

    input {
        width: 100%;
    }
}

.avatar {
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