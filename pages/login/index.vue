<template>
  <main id="Login">
    <section id="LoginWrapper" class="max-width sm">
      <svg width="150" height="30" viewBox="0 0 150 30" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M135.922 18.1981C135.981 20.782 136.56 23.0096 137.659 24.8807C138.788 26.7518 140.214 27.6874 141.936 27.6874C144.52 27.6874 146.599 26.7073 148.173 24.7471L149.243 25.2817C148.381 26.7073 147.253 27.7468 145.857 28.4002C144.491 29.0536 142.679 29.3804 140.422 29.3804C139.263 29.3804 138.135 29.217 137.036 28.8903C135.937 28.5339 134.838 27.9696 133.739 27.1974C132.67 26.3954 131.793 25.2223 131.11 23.6778C130.457 22.1334 130.13 20.2919 130.13 18.1535C130.13 15.5695 131.036 13.3865 132.848 11.6045C134.689 9.79276 137.065 8.88689 139.976 8.88689C143.154 8.88689 145.619 9.79276 147.371 11.6045C149.124 13.3865 150 15.5844 150 18.1981H135.922ZM135.966 16.817H144.075C143.897 14.7082 143.525 13.0895 142.961 11.9609C142.426 10.8026 141.55 10.2234 140.332 10.2234C139.263 10.2234 138.298 10.7729 137.437 11.8718C136.605 12.941 136.115 14.5894 135.966 16.817Z" fill="#1864DA"/>
          <path d="M122.44 2.87251V9.33241H126.272V10.6689H122.44V24.8362C122.44 25.7569 122.604 26.4697 122.93 26.9746C123.257 27.4498 123.866 27.6874 124.757 27.6874C125.292 27.6874 125.826 27.435 126.361 26.9301C126.925 26.3955 127.311 25.6678 127.519 24.7471L128.588 25.2817C127.965 28.0141 126.183 29.3804 123.242 29.3804C120.926 29.3804 119.233 28.8606 118.163 27.8211C117.124 26.7519 116.604 25.0144 116.604 22.6086V10.6689H113.486V9.33241C115.238 9.33241 116.768 8.679 118.074 7.37217C119.381 6.03564 120.035 4.53575 120.035 2.87251H122.44Z" fill="#1864DA"/>
          <path d="M101.365 28.9349V27.9993C102.969 27.9993 103.904 27.7023 104.172 27.1083V12.0055C102.627 11.8867 101.692 11.8273 101.365 11.8273V10.8026C101.929 10.8026 103.296 10.4908 105.464 9.86704C107.632 9.21362 109.057 8.88691 109.741 8.88691V27.1083C110.008 27.7023 110.943 27.9993 112.547 27.9993V28.9349H101.365ZM106.845 6.03565C106.132 6.03565 105.404 5.78319 104.662 5.27828C103.949 4.74367 103.593 4.11995 103.593 3.40714C103.593 2.78342 103.919 2.20426 104.573 1.66965C105.256 1.13504 105.969 0.867729 106.711 0.867729C107.424 0.867729 108.137 1.13504 108.85 1.66965C109.592 2.17456 109.963 2.79827 109.963 3.54079C109.963 4.16451 109.622 4.74367 108.939 5.27828C108.285 5.78319 107.587 6.03565 106.845 6.03565Z" fill="#1864DA"/>
          <path d="M81.9608 28.9348V27.9993C83.5647 27.9993 84.5002 27.7023 84.7675 27.1083V12.0055C83.1637 11.8867 82.2281 11.8273 81.9608 11.8273V10.8026C82.5251 10.8026 83.8914 10.4907 86.0595 9.86701C88.2277 9.21359 89.6533 8.88689 90.3364 8.88689V10.758C91.8808 9.5106 93.351 8.88689 94.747 8.88689C98.4298 8.88689 100.271 9.77791 100.271 11.5599C100.271 12.2728 100.049 12.8371 99.603 13.2529C99.1872 13.6687 98.6674 13.8766 98.0437 13.8766C97.3606 13.8766 96.8409 13.6984 96.4844 13.342C96.128 12.9856 95.9053 12.5846 95.8162 12.1391C95.7271 11.6936 95.5489 11.2926 95.2816 10.9362C95.044 10.5798 94.6876 10.4016 94.2123 10.4016C93.0837 10.4016 91.7917 11.0253 90.3364 12.2728V27.1083C90.6037 27.7023 91.5393 27.9993 93.1431 27.9993V28.9348H81.9608Z" fill="#1864DA"/>
          <path d="M67.7753 28.9349L62.6965 16.1933L57.6177 28.9349H53.8754L46.7918 11.159C46.5245 10.565 45.5889 10.268 43.9851 10.268V9.33242H54.1873V10.268C53.3259 10.268 52.7022 10.3274 52.3161 10.4462L57.6177 23.4996L61.6273 13.4757L60.6917 11.159C60.4244 10.565 59.4888 10.268 57.885 10.268V9.33242H68.0872V10.268C67.2259 10.268 66.6021 10.3274 66.216 10.4462L71.5176 23.4996L76.5964 10.7581C76.1806 10.4313 75.349 10.268 74.1016 10.268V9.33242H81.4079V10.268C79.8932 10.268 78.9873 10.5056 78.6903 10.9808L71.5176 28.9349H67.7753Z" fill="#1864DA"/>
          <path d="M29.6781 18.1981C29.7375 20.782 30.3166 23.0096 31.4156 24.8807C32.5442 26.7518 33.9698 27.6874 35.6925 27.6874C38.2764 27.6874 40.3555 26.7073 41.9296 24.7471L42.9988 25.2817C42.1375 26.7073 41.0089 27.7468 39.613 28.4002C38.2467 29.0536 36.435 29.3804 34.1777 29.3804C33.0194 29.3804 31.8908 29.217 30.7919 28.8903C29.6929 28.5339 28.594 27.9696 27.4951 27.1974C26.4259 26.3954 25.5497 25.2223 24.8666 23.6778C24.2132 22.1334 23.8864 20.2919 23.8864 18.1535C23.8864 15.5695 24.7923 13.3865 26.6041 11.6045C28.4455 9.79276 30.8216 8.88689 33.7322 8.88689C36.9102 8.88689 39.3753 9.79276 41.1277 11.6045C42.88 13.3865 43.7562 15.5844 43.7562 18.1981H29.6781ZM29.7226 16.817H37.8309C37.6527 14.7082 37.2814 13.0895 36.7171 11.9609C36.1825 10.8026 35.3064 10.2234 34.0886 10.2234C33.0194 10.2234 32.0541 10.7729 31.1928 11.8718C30.3612 12.941 29.8711 14.5894 29.7226 16.817Z" fill="#1864DA"/>
          <path d="M9.89032 28.9349L2.80671 11.159C2.53941 10.565 1.60384 10.268 0 10.268V9.33242H10.2022V10.268C9.34086 10.268 8.71715 10.3274 8.33104 10.4462L13.6326 23.4996L18.7114 10.7581C18.2956 10.4313 17.464 10.268 16.2166 10.268V9.33242H23.5229V10.268C21.8894 10.268 20.9538 10.565 20.7162 11.159L13.6326 28.9349H9.89032Z" fill="#1864DA"/>
      </svg>
      <section id="LoginForm" class="form-group">
        <div class="login-buttons">
          <button class="button large" @click="signInWithGithub">
            <Icon name="grommet-icons:github" size="2rem" />
            Login with GitHub
          </button>
          <!-- <button class="button large">
            <Icon name="grommet-icons:google" size="2rem" />
            Login with Google
          </button> -->
        </div>
        <p class="or-select">Or</p>
        <form class="magic-link-form" @submit.prevent="signInWithMagicLink">
          <div v-if="notification == ''">
              <p class="description">Access the app via magic link with just your email.</p>
              <div class="form-group">
                  <div class="form-input">
                      <label for="email">Your email address</label>
                      <input class="inputField" type="email" placeholder="you@home.com" v-model="email" />
                  </div>
              </div>
              <input type="submit" class="button primary" @click="reset" :value="loading ? 'Sending magic link' : 'Send magic link'" :disabled="loading" />
          </div>
          <div v-if="errorbox">
              <p class="notification error">{{ errorbox }}</p>
          </div>
          <div v-if="!notification == ''">
              <p class="notification success">{{ notification }}</p>
          </div>
        </form>
      </section>
    </section>
    <section id="LoginImage"></section>
  </main>
</template>

<script setup>

definePageMeta({
  middleware: ["auth"],
  layout: "auth",
})

const loading = ref(false);
const notification = ref('');
const errorbox = ref('');
const email = ref('');

const supabase = useSupabaseClient();

const user = useSupabaseUser();

const reset = () => {
    errorbox.value = ""
    notification.value = ""
}

async function signInWithGithub() {
  const { data, error } = await supabase.auth.signIn(
    { provider: 'github'})
}

const signInWithMagicLink = async () => {
    try {
        loading.value = true
        const { error } = await supabase.auth.signIn({ 
          email: email.value,
          options: {
            redirectTo: '/confirm',
          } })
        if (error) throw error
        notification.value = "Check your email for the magic link"
    } catch (error) {
        errorbox.value = error.error_description || error.message
        console.log('Error:', error)
    } finally {
        loading.value = false
    }
}

</script>

<style scoped lang="scss">
  
@use 'assets/variables' as *;

#Login {
  display: flex;
  flex-direction: row;
  height: 100%;
  width: 100%;
}

#LoginWrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  width: 65vw;
}

#LoginForm {
  display: flex;
  flex-direction: column;
  gap: $spacing-sm;
  margin: $spacing-md 0;
  
  .login-buttons {
    display: flex;
    gap: $spacing-xs;

    button {
      width: 100%;
    }
  }
}

#LoginImage {
  background-color: $brand;
  // background-image: url('/assets/login-image.jpg');
  background-size: cover;
  background-position: center;
  width: 35vw;
}

</style>