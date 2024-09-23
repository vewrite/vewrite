<template>
    <div class="auth">
        <div class="auth-form">
            {{ user }}
            <form class="magic-link-form" @submit.prevent="handleLogin">
                <svg class="logo" width="256" height="52" viewBox="0 0 256 52" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M230.158 31.72C230.211 36.2 231.491 40.1733 233.998 43.64C236.558 47.0533 239.411 48.76 242.558 48.76C247.198 48.76 250.931 47 253.758 43.48L255.678 44.44C254.131 47 252.104 48.8667 249.598 50.04C247.144 51.2133 243.891 51.8 239.838 51.8C237.811 51.8 235.864 51.5067 233.998 50.92C232.131 50.28 230.291 49.2667 228.478 47.88C226.664 46.44 225.224 44.3333 224.158 41.56C223.091 38.7867 222.558 35.48 222.558 31.64C222.558 26.9467 223.998 23 226.878 19.8C229.811 16.6 233.864 15 239.038 15C244.691 15 248.904 16.6 251.678 19.8C254.451 22.9467 255.838 26.92 255.838 31.72H230.158ZM230.238 29.24H247.998C247.678 25.4 246.851 22.4667 245.518 20.44C244.238 18.4133 241.971 17.4 238.718 17.4C236.851 17.4 235.038 18.4933 233.278 20.68C231.571 22.8667 230.558 25.72 230.238 29.24Z" fill="#8D00FB"/>
                    <path d="M207.509 4.2V15.8H214.389V18.2H207.509V43.64C207.509 45.2933 207.803 46.5733 208.389 47.48C208.976 48.3333 210.069 48.76 211.669 48.76C212.629 48.76 213.589 48.3067 214.549 47.4C215.563 46.44 216.256 45.1333 216.629 43.48L218.549 44.44C217.429 49.3467 214.229 51.8 208.949 51.8C202.869 51.8 199.829 48.8667 199.829 43V18.2H194.229V15.8C196.736 15.8 199.003 14.76 201.029 12.68C203.056 10.6 204.069 7.77333 204.069 4.2H207.509Z" fill="#8D00FB"/>
                    <path d="M174.183 51V49.32C177.063 49.32 178.743 48.7867 179.223 47.72V20.68C175.916 20.4133 174.236 20.28 174.183 20.28V18.44C175.196 18.44 177.17 17.88 180.103 16.76C183.09 15.5867 185.196 15 186.423 15V47.72C186.903 48.7867 188.583 49.32 191.463 49.32V51H174.183ZM182.583 9.88C181.41 9.88 180.37 9.45333 179.463 8.59999C178.61 7.69333 178.183 6.54666 178.183 5.16C178.183 3.93333 178.556 2.86666 179.303 1.95999C180.103 1.05333 181.116 0.599991 182.343 0.599991C183.516 0.599991 184.556 1.05333 185.463 1.95999C186.37 2.86666 186.823 4.01333 186.823 5.39999C186.823 6.62666 186.423 7.69333 185.623 8.59999C184.823 9.45333 183.81 9.88 182.583 9.88Z" fill="#8D00FB"/>
                    <path d="M142.621 51V49.32C145.501 49.32 147.181 48.7867 147.661 47.72V20.68C144.354 20.4133 142.674 20.28 142.621 20.28V18.44C143.634 18.44 145.607 17.88 148.541 16.76C151.527 15.5867 153.634 15 154.861 15V18.52C157.527 16.1733 160.167 15 162.781 15C165.181 15 167.181 15.4533 168.781 16.36C170.434 17.2667 171.261 18.28 171.261 19.4C171.261 21.32 170.194 22.28 168.061 22.28C166.941 22.28 165.927 21.5333 165.021 20.04C164.114 18.4933 163.074 17.72 161.901 17.72C159.821 17.72 157.474 18.8667 154.861 21.16V47.72C155.341 48.7867 157.021 49.32 159.901 49.32V51H142.621Z" fill="#8D00FB"/>
                    <path d="M94.4794 15.8V17.48C92.9327 17.48 91.8127 17.5867 91.1194 17.8L100.639 41.24L107.839 23.24L106.159 19.08C105.679 18.0133 103.999 17.48 101.119 17.48V15.8H116.639V17.48C115.093 17.48 113.973 17.5867 113.279 17.8L122.799 41.24L131.919 18.36C131.173 17.7733 129.679 17.48 127.439 17.48V15.8H140.559V17.48C137.679 17.48 136.026 17.9867 135.599 19L122.799 51H118.879L109.759 28.12L100.639 51H96.7194L83.9994 19.08C83.5194 18.0133 81.8394 17.48 78.9594 17.48V15.8H94.4794Z" fill="#8D00FB"/>
                    <path d="M51.1731 31.72C51.2265 36.2 52.5065 40.1733 55.0131 43.64C57.5731 47.0533 60.4265 48.76 63.5731 48.76C68.2131 48.76 71.9465 47 74.7731 43.48L76.6931 44.44C75.1465 47 73.1198 48.8667 70.6131 50.04C68.1598 51.2133 64.9065 51.8 60.8531 51.8C58.8265 51.8 56.8798 51.5067 55.0131 50.92C53.1465 50.28 51.3065 49.2667 49.4931 47.88C47.6798 46.44 46.2398 44.3333 45.1731 41.56C44.1065 38.7867 43.5731 35.48 43.5731 31.64C43.5731 26.9467 45.0131 23 47.8931 19.8C50.8265 16.6 54.8798 15 60.0531 15C65.7065 15 69.9198 16.6 72.6931 19.8C75.4665 22.9467 76.8531 26.92 76.8531 31.72H51.1731ZM51.2531 29.24H69.0131C68.6931 25.4 67.8665 22.4667 66.5331 20.44C65.2531 18.4133 62.9865 17.4 59.7331 17.4C57.8665 17.4 56.0531 18.4933 54.2931 20.68C52.5865 22.8667 51.5731 25.72 51.2531 29.24Z" fill="#8D00FB"/>
                    <path d="M17.72 4.2V5.88C15.2667 5.88 13.72 6.2 13.08 6.84L25.32 40.36L37.08 7.32C36.5467 6.36 34.8933 5.88 32.12 5.88V4.2H45.24V5.88C42.2533 5.88 40.6267 6.30666 40.36 7.16L24.68 51H20.84L5.32001 7.56C4.89335 6.44 3.18668 5.88 0.200012 5.88V4.2H17.72Z" fill="#8D00FB"/>
                </svg>

                <div v-if="notification == ''">
                    <p class="description">Access the app via magic link. Enter your email below.</p>
                    <div class="form-group">
                        <div class="form-input">
                            <label for="email">Your email address</label>
                            <input class="inputField" type="email" placeholder="you@home.com" v-model="email" />
                        </div>
                    </div>
                    <input type="submit" class="button primary" @click="reset" :value="loading ? 'Loading' : 'Send magic link'"
                        :disabled="loading" />
                </div>
                <div v-if="errorbox">
                    <p class="notification error">{{ errorbox }}</p>
                </div>
                <div v-if="!notification == ''">
                    <p class="notification success">{{ notification }}</p>
                </div>
                
                
            </form>
        </div>
        <div class="auth-image"></div>
    </div>
</template>

<script setup>

const supabase = useSupabaseClient()

const loading = ref(false)
const email = ref("")
const notification = ref("")
const errorbox = ref("")

const reset = () => {
    errorbox.value = ""
    notification.value = ""
}

const handleLogin = async () => {
    try {
        loading.value = true
        const { error } = await supabase.auth.signIn({ email: email.value })
        if (error) throw error
        notification.value = "Check your email for the magic link"
    } catch (error) {
        // alert(error.error_description || error.message)
        errorbox.value = error.error_description || error.message
    } finally {
        loading.value = false
    }
}
</script>

<style lang="scss" scoped>

@import 'assets/_variables.scss';

.auth {
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    height: 100%;
    width: 100%;

    .auth-form {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        width: 60%;
        height: 100%;

        .magic-link-form {
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;

            svg {
                margin-bottom: 2rem;
            }

            
            .form-group,
            .form-input,
            input {
                width: 100%;
            }

            .error {
                margin-top: $spacing-md;
            }
        }
    }

    .auth-image {
        width: 40%;
        height: 100%;
        color: $white;
        background: $brand url('/images/on-board-main.jpg') center center no-repeat;
        background-size: cover;
    }
}


</style>