<template>
  <main id="Login">
    <section id="LoginWrapper" class="max-width sm">
      <section class="login-top">
        <svg width="151" height="46" viewBox="0 0 151 46" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M144.376 15.8563C145.639 15.8563 146.721 16.1158 147.621 16.6349C148.538 17.1366 149.247 17.8633 149.749 18.8149C150.251 19.7493 150.501 20.8912 150.501 22.2408V23.9018H141.21C141.245 25.1822 141.599 26.177 142.274 26.8864C142.949 27.5785 143.883 27.9246 145.077 27.9246C145.994 27.9246 146.807 27.8381 147.517 27.665C148.243 27.4747 148.987 27.2065 149.749 26.8605V29.4818C149.057 29.8105 148.339 30.0527 147.595 30.2085C146.851 30.3642 145.96 30.442 144.921 30.442C143.555 30.442 142.335 30.1825 141.262 29.6634C140.207 29.1271 139.376 28.3225 138.77 27.2498C138.182 26.177 137.888 24.8448 137.888 23.253C137.888 21.6439 138.156 20.2943 138.693 19.2042C139.246 18.0969 140.008 17.2664 140.977 16.7127C141.945 16.1417 143.079 15.8563 144.376 15.8563ZM144.376 18.2699C143.511 18.2699 142.802 18.5554 142.248 19.1264C141.712 19.6801 141.392 20.5106 141.288 21.6179H147.335C147.335 20.9604 147.223 20.3808 146.998 19.879C146.79 19.3773 146.47 18.988 146.037 18.7111C145.605 18.417 145.051 18.2699 144.376 18.2699Z" fill="#0D1E38"/>
            <path d="M133.625 27.8208C134.04 27.8208 134.438 27.7862 134.819 27.717C135.2 27.6305 135.554 27.5354 135.883 27.4315V29.8712C135.537 30.0269 135.087 30.1566 134.534 30.2605C133.98 30.3816 133.4 30.4421 132.795 30.4421C131.999 30.4421 131.272 30.3124 130.615 30.0528C129.974 29.776 129.455 29.3088 129.057 28.6513C128.677 27.9939 128.486 27.0768 128.486 25.9003V18.5815H126.592V17.154L128.668 16.0121L129.706 13.0274H131.757V16.1159H135.753V18.5815H131.757V25.8743C131.757 26.5318 131.93 27.0249 132.276 27.3537C132.622 27.6651 133.071 27.8208 133.625 27.8208Z" fill="#0D1E38"/>
            <path d="M123.994 16.116V30.1827H120.724V16.116H123.994ZM122.359 10.6917C122.843 10.6917 123.267 10.8215 123.63 11.081C123.994 11.3232 124.175 11.7644 124.175 12.4046C124.175 13.0275 123.994 13.4774 123.63 13.7542C123.267 14.0137 122.843 14.1435 122.359 14.1435C121.857 14.1435 121.424 14.0137 121.061 13.7542C120.715 13.4774 120.542 13.0275 120.542 12.4046C120.542 11.7644 120.715 11.3232 121.061 11.081C121.424 10.8215 121.857 10.6917 122.359 10.6917Z" fill="#0D1E38"/>
            <path d="M116.689 15.8563C116.897 15.8563 117.139 15.8649 117.416 15.8822C117.692 15.8995 117.926 15.9341 118.116 15.986L117.831 19.0226C117.675 18.988 117.468 18.962 117.208 18.9447C116.966 18.9101 116.749 18.8928 116.559 18.8928C116.04 18.8928 115.538 18.9793 115.054 19.1523C114.587 19.3081 114.163 19.5503 113.782 19.879C113.419 20.1905 113.125 20.5971 112.9 21.0988C112.692 21.6006 112.588 22.1975 112.588 22.8896V30.1825H109.318V16.1158H111.836L112.303 18.5554H112.459C112.735 18.0536 113.081 17.6038 113.497 17.2058C113.912 16.7906 114.388 16.4618 114.924 16.2196C115.478 15.9774 116.066 15.8563 116.689 15.8563Z" fill="#0D1E38"/>
            <path d="M97.7409 24.1355C97.6544 23.8068 97.5506 23.4002 97.4295 22.9157C97.3083 22.414 97.1786 21.8949 97.0402 21.3585C96.919 20.8222 96.7979 20.329 96.6768 19.8792C96.573 19.4293 96.5038 19.0833 96.4692 18.8411H96.3654C96.3135 19.0833 96.2356 19.4293 96.1318 19.8792C96.028 20.329 95.9155 20.8222 95.7944 21.3585C95.6733 21.8949 95.5435 22.414 95.4051 22.9157C95.284 23.4175 95.1802 23.8327 95.0937 24.1615L93.4586 30.1827H89.877L85.9321 16.09H89.2282L90.9671 22.8119C91.0882 23.2618 91.2007 23.7722 91.3045 24.3432C91.4256 24.9141 91.5294 25.4678 91.6159 26.0042C91.7024 26.5232 91.763 26.9471 91.7976 27.2759H91.9014C91.936 27.051 91.9793 26.7568 92.0312 26.3935C92.0831 26.0128 92.1436 25.6235 92.2128 25.2256C92.2994 24.8103 92.3772 24.4297 92.4464 24.0836C92.5329 23.7376 92.6021 23.4694 92.654 23.2791L94.6784 16.09H98.26L100.206 23.2791C100.293 23.5905 100.388 23.9971 100.492 24.4989C100.596 25.0006 100.691 25.5024 100.777 26.0042C100.864 26.5059 100.916 26.9212 100.933 27.2499H101.037C101.072 26.9558 101.132 26.5578 101.219 26.0561C101.305 25.537 101.409 24.9833 101.53 24.3951C101.651 23.8068 101.781 23.2791 101.919 22.8119L103.684 16.09H106.928L102.932 30.1827H99.2981L97.7409 24.1355Z" fill="#0D1E38"/>
            <path d="M78.8596 15.8563C80.1226 15.8563 81.204 16.1158 82.1037 16.6349C83.0207 17.1366 83.7301 17.8633 84.2319 18.8149C84.7337 19.7493 84.9845 20.8912 84.9845 22.2408V23.9018H75.6932C75.7278 25.1822 76.0825 26.177 76.7573 26.8864C77.4321 27.5785 78.3664 27.9246 79.5603 27.9246C80.4773 27.9246 81.2905 27.8381 81.9999 27.665C82.7266 27.4747 83.4706 27.2065 84.2319 26.8605V29.4818C83.5398 29.8105 82.8218 30.0527 82.0778 30.2085C81.3338 30.3642 80.4427 30.442 79.4046 30.442C78.0377 30.442 76.8179 30.1825 75.7452 29.6634C74.6897 29.1271 73.8592 28.3225 73.2536 27.2498C72.6654 26.177 72.3712 24.8448 72.3712 23.253C72.3712 21.6439 72.6394 20.2943 73.1758 19.2042C73.7294 18.0969 74.4907 17.2664 75.4597 16.7127C76.4286 16.1417 77.5619 15.8563 78.8596 15.8563ZM78.8596 18.2699C77.9944 18.2699 77.2851 18.5554 76.7314 19.1264C76.195 19.6801 75.8749 20.5106 75.7711 21.6179H81.8182C81.8182 20.9604 81.7058 20.3808 81.4808 19.879C81.2732 19.3773 80.9531 18.988 80.5206 18.7111C80.088 18.417 79.5343 18.2699 78.8596 18.2699Z" fill="#0D1E38"/>
            <path d="M62.2779 30.1825L56.9315 16.1158H60.3833L63.1863 24.2392C63.3074 24.5679 63.4199 24.9313 63.5237 25.3292C63.6275 25.7099 63.714 26.0905 63.7832 26.4712C63.8697 26.8345 63.9216 27.1546 63.9389 27.4314H64.0427C64.0773 27.1373 64.1379 26.8086 64.2244 26.4452C64.3109 26.0646 64.4061 25.6839 64.5099 25.3033C64.631 24.9226 64.7435 24.5679 64.8473 24.2392L67.6503 16.1158H71.102L65.7557 30.1825H62.2779Z" fill="#0D1E38"/>
            <path d="M42.8173 3.66516C45.5159 5.22316 46.4405 8.67378 44.8825 11.3723L27.9564 40.6892C26.3984 43.3877 22.9478 44.3123 20.2492 42.7543V42.7543C17.5507 41.1963 16.6261 37.7457 18.1841 35.0471L35.1102 5.73029C36.6682 3.03174 40.1188 2.10715 42.8173 3.66516V3.66516Z" fill="url(#paint0_linear_1_21)"/>
            <path d="M11.0305 5.73019C9.47246 3.03165 6.02184 2.10706 3.3233 3.66506C0.624759 5.22307 -0.29983 8.67368 1.25817 11.3722L18.1843 40.6891C19.7423 43.3876 23.1929 44.3122 25.8914 42.7542C27.0038 42.112 27.8148 41.1481 28.2747 40.0479L33.9923 30.1719C33.2401 30.9242 31.2842 32.6544 29.4787 33.5571C28.391 34.101 27.2487 33.3069 26.3478 32.2606L11.0305 5.73019Z" fill="url(#paint1_linear_1_21)"/>
            <defs>
            <linearGradient id="paint0_linear_1_21" x1="46.4051" y1="12.6816" x2="13.6813" y2="30.7361" gradientUnits="userSpaceOnUse">
            <stop offset="0.0897277" stop-color="#C3D5AD"/>
            <stop offset="0.776664" stop-color="#BFCDFF"/>
            </linearGradient>
            <linearGradient id="paint1_linear_1_21" x1="4.65419" y1="19.4519" x2="19.3236" y2="43.7125" gradientUnits="userSpaceOnUse">
            <stop stop-color="#9AB1FD"/>
            <stop offset="1" stop-color="#6C8DFB"/>
            </linearGradient>
            </defs>
        </svg>

        <section class="toggle-form">
          <div class="toggle-item" id="LoginToggle" :class="{ active: form == 'login' }" @click="formToggle('login')">
            <span class="title">Login</span>
          </div>
          <div class="toggle-item" id="SignUpToggle" :class="{ active: form == 'signup' }" @click="formToggle('signup')">
            <span class="title">Sign Up</span>
          </div>
          <div class="toggle-item" id="SignUpToggle" :class="{ active: form == 'magic' }" @click="formToggle('magic')">
            <span class="title">Magic Link</span>
          </div>
        </section>

      </section>


      <section class="login-center">

        <!-- Login -->
        <section id="LoginForm" class="form-group" v-if="form == 'login'">
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
            <div v-if="errorbox">
                <p class="notification error">{{ errorbox }}</p>
            </div>
            <div v-if="!notification == ''">
                <p class="notification success">{{ notification }}</p>
            </div>
            <div v-if="notification == ''">
                <p class="description">Access the app via magic link with your email address and password.</p>
                <div class="form-group">
                    <div class="form-input">
                        <label for="email">Your email address</label>
                        <input class="inputField" type="email" placeholder="john@example.com" v-model="email" />
                    </div>
                </div>
                <div class="form-group">
                    <div class="form-input password">
                        <label for="password">Your password</label>
                        <input class="inputField" type="password" placeholder="••••••••" v-model="password" />
                    </div>
                </div>
                <input type="submit" class="button large primary" @click="reset" :value="loading ? 'Logging in' : 'Log in'" :disabled="loading" />
                <!-- <div class="form-group">
                    <div class="form-input">
                        <label for="email">Your email address</label>
                        <input class="inputField" type="email" placeholder="you@home.com" v-model="email" />
                    </div>
                </div>
                <input type="submit" class="button large primary" @click="reset" :value="loading ? 'Sending magic link' : 'Send magic link'" :disabled="loading" /> -->
            </div>
          </form>
        </section>

        <!-- Signup -->
        <section id="SignUpForm" class="form-group" v-if="form == 'signup'">
          <form class="sign-up-form" @submit.prevent="signUp">
            <div>
                <div class="signup-buttons">
                  <button class="button large" @click="signInWithGithub">
                    <Icon name="grommet-icons:github" size="2rem" />
                    Sign up with GitHub
                  </button>
                  <!-- <button class="button large">
                    <Icon name="grommet-icons:google" size="2rem" />
                    Login with Google
                  </button> -->
                </div>
                <p class="or-select">Or</p>
                <div class="form-group">
                  <div v-if="errorbox">
                      <p class="notification error">{{ errorbox }}</p>
                  </div>
                  <div v-if="!notification == ''">
                      <p class="notification success">{{ notification }}</p>
                  </div>
                  <p class="description">Sign up for an account to access the app.</p>
                    <div class="form-input">
                        <label for="email">Your email address</label>
                        <input class="inputField" type="email" placeholder="john@example.com" v-model="email" />
                    </div>
                </div>
                <div class="form-group">
                    <div class="form-input password">
                        <label for="password">Your password</label>
                        <input class="inputField" type="password" placeholder="••••••••" v-model="password" />
                    </div>
                </div>
                <input type="submit" class="button large primary" @click="reset" :value="loading ? 'Signing up' : 'Sign up'" :disabled="loading" />
            </div>
          </form>
        </section>


        <!-- Magic -->
        <section id="MagicLink" class="form-group" v-if="form == 'magic'">
          <form class="magic-link-form" @submit.prevent="signInWithMagicLink">
            <div v-if="errorbox">
                <p class="notification error">{{ errorbox }}</p>
            </div>
            <div v-if="!notification == ''">
                <p class="notification success">{{ notification }}</p>
            </div>
            <div v-if="notification == ''">
                <p class="description">Access the app via magic link with just your email.</p>
                <div class="form-group">
                    <div class="form-input">
                        <label for="email">Your email address</label>
                        <input class="inputField" type="email" placeholder="you@home.com" v-model="email" />
                    </div>
                </div>
                <input type="submit" class="button large primary" @click="reset" :value="loading ? 'Sending magic link' : 'Send magic link'" :disabled="loading" />
            </div>
          </form>
        </section>
      </section>

      <section class="login-bottom">
        <p class="copyright-and-terms">© 2021 All rights reserved. <a href="#">Terms of Service</a> and <a href="#">Privacy Policy</a></p>
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
const password = ref('');
const form = ref('login');

const formToggle = (type) => {
    form.value = type
}

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

const signUp = async () => {
    try {
        loading.value = true
        const { error } = await supabase.auth.signUp({ 
          email: email.value,
          password: password.value })
        if (error) throw error
        notification.value = "Check your email for the confirmation link"
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

#SignUpForm {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: $spacing-md;
  margin-bottom: $spacing-lg;
  width: 100%;
}

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
  justify-content: space-between;
  padding: $spacing-lg;
  height: 100%;
  width: 65vw;

  .login-top,
  .login-center,
  .login-bottom {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: $spacing-md;
    width: 100%;
  }

  .login-center {
    #SignUpForm, 
    #LoginForm {
      display: flex;
      flex-direction: column;
      gap: $spacing-md;
      width: 100%;

      .sign-up-form {
        width: 100%;

        .signup-buttons {
          display: flex;
          gap: $spacing-xs;
          align-self: center;

          button {
            margin: 0 auto;
          }
        }

        .description {
          text-align: center;
        }
      }
    }
  }

  .toggle-form {
    display: flex;
    flex-direction: row;
    margin-bottom: $spacing-md;
    width: 100%;
    background: rgba($brand, 0.025);
    padding: $spacing-xs;
    border-radius: $br-xl;

    .toggle-item {
      cursor: pointer;
      padding: $spacing-xs $spacing-md;
      transition: background-color 0.3s;
      background-color: $white;
      color: $black;
      font-weight: 600;
      text-align: center;
      width: 50%;
      border: $border; 

      &:first-child {
        border-top-left-radius: $br-lg;
        border-bottom-left-radius: $br-lg;
        border-right: none;
      }

      &:last-child {
        border-top-right-radius: $br-lg;
        border-bottom-right-radius: $br-lg;
        border-left: none;
      }

      &.active {
        background-color: $brand;
        color: $white;
      }
    }
  }
}

#LoginForm {
  display: flex;
  flex-direction: column;
  gap: $spacing-sm;
  margin: $spacing-md 0;
  width: 100%;
  
  .login-buttons {
    display: flex;
    gap: $spacing-xs;
    align-self: center;

    button {
      width: 100%;
    }
  }

  .description {
    text-align: center;
  }
}

#SignUpForm {
  display: flex;
  flex-direction: column;
  gap: $spacing-sm;
  margin: $spacing-md 0;
  width: 100%;

  .signup-buttons {
    display: flex;
    gap: $spacing-xs;
    align-self: center;

    button {
      margin: 0 auto;
    }
  }
}

#MagicLink {
  display: flex;
  flex-direction: column;
  gap: $spacing-sm;
  margin: $spacing-md 0;
  width: 100%;

  .magic-link-form {
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: $spacing-sm;

    .description {
      text-align: center;
    }
  }
}

#LoginImage {
  background-color: $black;
  // background-image: url('/assets/login-image.jpg');
  background-size: cover;
  background-position: center;
  width: 35vw;
}

</style>