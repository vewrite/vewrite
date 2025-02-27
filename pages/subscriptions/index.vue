<template>
  <AppPanel>
    <template v-slot:header>
      <div class="thanks">Thanks for using Vewrite!</div>
    </template>
    <template v-slot:body>
      {{ subscription }}
      <main class="subscriptions">
          {{ plan.name }}
          {{ plan.price }}
          {{ plan.interval }}
          <button @click="subscribe">Subscribe</button>
      </main>
      <!-- <main class="subscriptions">
        <section class="subscribe-intro">
          <svg width="61" height="58" viewBox="0 0 61 58" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M54.1735 3.94478C57.6037 5.92519 58.779 10.3114 56.7985 13.7415L35.2834 51.0069C33.303 54.4371 28.9168 55.6123 25.4866 53.6319V53.6319C22.0564 51.6515 20.8812 47.2654 22.8616 43.8352L44.3767 6.56981C46.3572 3.13963 50.7433 1.96436 54.1735 3.94478V3.94478Z" fill="url(#paint0_linear_1_4)"/>
            <path fill-rule="evenodd" clip-rule="evenodd" d="M13.7682 6.56997C11.7878 3.13979 7.40164 1.96452 3.97146 3.94494C0.541276 5.92535 -0.633991 10.3115 1.34643 13.7417L22.8616 51.0071C24.842 54.4372 29.2282 55.6125 32.6583 53.6321C34.0713 52.8163 35.1017 51.5923 35.6864 50.1951L42.9562 37.6382C42 38.5945 39.5138 40.7938 37.2188 41.9413C35.8353 42.633 34.3823 41.6219 33.2369 40.2907L13.7682 6.56997Z" fill="url(#paint1_linear_1_4)"/>
            <defs>
            <linearGradient id="paint0_linear_1_4" x1="58.734" y1="15.4057" x2="17.138" y2="38.3553" gradientUnits="userSpaceOnUse">
            <stop offset="0.0897277" stop-color="#C3D5AD"/>
            <stop offset="0.776664" stop-color="#BFCDFF"/>
            </linearGradient>
            <linearGradient id="paint1_linear_1_4" x1="5.66326" y1="24.012" x2="24.3097" y2="54.8504" gradientUnits="userSpaceOnUse">
            <stop stop-color="#9AB1FD"/>
            <stop offset="1" stop-color="#6C8DFB"/>
            </linearGradient>
            </defs>
          </svg>
          <h1>Write better content</h1>
          <p>With Vewrite, you and your team can be more effective, efficient, and profitable.</p>
        </section>
        <p class="notification info" v-if="status">{{ status }}</p>
        <section class="subscribe-options max-width md">
          <div class="subscribe-option">
            <h2>Free Plan</h2>
            <p>No cost to you or your team.</p>
            <div class="subscribe-details">
              <ul>
                <li>
                  <span>Custom Workflows</span>
                  <span>1</span>
                </li>
                <li>
                  <span>Clients</span>
                  <span>1</span>
                </li>
                <li>
                  <span>Active Projects</span>
                  <span>1</span>
                </li>
                <li>
                  <span>Teams</span>
                  <span>1</span>
                </li>
              </ul>
            </div>
          </div>
          <div class="subscribe-option pro">
            <h2>Pro Plan</h2>
            <p><span class="cost">$39/m</span> for the Manager, Writers are free.</p>
            <div class="subscribe-details">
              <ul>
                <li>
                  <span>Custom Workflows</span>
                  <span>Unlimited</span>
                </li>
                <li>
                  <span>Clients</span>
                  <span>Unlimited</span>
                </li>
                <li>
                  <span>Active Projects</span>
                  <span>Unlimited</span>
                </li>
                <li>
                  <span>Teams</span>
                  <span>Unlimited</span>
                </li>
                <li>
                  <span>Custom Workflows</span>
                  <span>Unlimited</span>
                </li>
                <li>
                  <span>Clients</span>
                  <span>Unlimited</span>
                </li>
                <li>
                  <span>Active Projects</span>
                  <span>Unlimited</span>
                </li>
                <li>
                  <span>Teams</span>
                  <span>Unlimited</span>
                </li>
              </ul>
            </div>
          </div>
        </section>
        <section class="subscribe-buttons max-width md">
          <div class="placeholder"></div>
          <div id="paypal-checkout" v-if="!status"></div>
        </section>
      </main> -->
    </template>
  </AppPanel>
</template>

<script setup>

definePageMeta({
  layout: 'default',
  middleware: ['auth'],
});

import AppPanel from '~/components/AppPanel.vue';

const user = useSupabaseUser();
const supabase = useSupabaseClient();
const config = useRuntimeConfig();
const status = ref(null);
const loading = ref(false);
const error = ref(null);
const route = useRoute();

const selectedPlan = ref(null);

// const plan = ref(
//   {
//     id: 'prod_Rpz8UNS0xGBpBx', 
//     name: 'Pro Plan',
//     price: '29.99',
//     interval: 'month',
//   }
// )

// For testing
const plan = ref(
  {
    id: 'price_1Qtn4bKf7vWAm6xvEKoGStjj',
    name: 'Pro Plan',
    price: '23.00',
    interval: 'month',
  }
)

import useProfile from '~/composables/useProfile';
const { setSubscriptionStatus, ProfileData, ProfileError } = useProfile();

import useSubscription from '~/composables/useSubscription';
const { verifySubscriptionStatus, subscription } = useSubscription();

async function subscribe() {
  loading.value = true;
  error.value = null;
  
  try {
    // Get the current session auth token
    const { data: sessionData } = await supabase.auth.getSession();
    const token = sessionData.session?.access_token;
    
    console.log('Making request to /api/stripe/create-checkout');
    
    const response = await fetch('/api/stripe/create-checkout', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        priceId: plan.value.id,
        userId: user.value.id
      })
    });
    
    console.log('Response status:', response.status);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('Error response:', errorText);
      throw new Error(`API error: ${response.status} - ${errorText}`);
    }
    
    const data = await response.json();
    console.log('Response data:', data);
    
    if (data.url) {
      window.location.href = data.url;
    } else {
      throw new Error('No checkout URL returned');
    }
  } catch (err) {
    console.error('Error starting checkout:', err);
    error.value = err.message || 'An error occurred while processing your request';
  } finally {
    loading.value = false;
  }
}

// Helper function to get auth token
async function getAuthToken() {
  const { data } = await useSupabaseClient().auth.getSession();
  return data.session?.access_token || '';
}

onMounted(() => {
  // verifySubscription();
  verifySubscriptionStatus();
});

// async function verifySubscription() {
//   loading.value = true;
//   error.value = null;
  
//   try {
//     // Get the session ID from the URL
//     const sessionId = route.query.session_id;
//     console.log('sessionId', sessionId);
//     const userId = user.value.id;
//     console.log('userId', userId);
    
//     if (!sessionId || !userId) {
//       throw new Error('Missing session ID or user ID');
//     }
    
//     // Verify the subscription with the server
//     const response = await fetch('/api/stripe/verify-subscription', {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json',
//         'Authorization': `Bearer ${await getAuthToken()}`
//       },
//       body: JSON.stringify({
//         sessionId,
//         userId
//       })
//     });
    
//     if (!response.ok) {
//       const errorData = await response.json();
//       throw new Error(errorData.message || 'Failed to verify subscription');
//     }
    
//     // Subscription verified successfully
//   } catch (err) {
//     console.error('Error verifying subscription:', err);
//     error.value = err.message;
//   } finally {
//     loading.value = false;
//   }
// }

// // Get auth token for API requests
// async function getAuthToken() {
//   const { data } = await useSupabaseClient().auth.getSession();
//   return data.session?.access_token || '';
// }

onMounted(() => {
  // const script = document.createElement('script');
  // script.src = 'https://www.paypal.com/sdk/js?client-id=' + config.public.paypal.clientId + '&vault=true' + '&intent=subscription';
  // script.async = true;
  // script.onload = () => {
  //   window.paypal.Buttons({
  //     style: {
  //         shape: 'pill',
  //         color: 'white',
  //         layout: 'horizontal',
  //         label: 'paypal',
  //         size: 'responsive',
  //         tagline: false
  //     },
  //     createSubscription: function(data, actions) {
  //       return actions.subscription.create({
  //         'plan_id': 'P-49U09457TT932483JM5Q5CSQ'
  //       });
  //     },
  //     onApprove: function(data, actions) {
  //       setSubscriptionStatus(user.value.id ,'active', data.subscriptionID);
  //       status.value = 'You have successfully created subscription ' + data.subscriptionID;
  //     }
  //   }).render('#paypal-checkout');
  // };
  // document.body.appendChild(script);
});

</script>

<style scoped lang="scss">

@use 'assets/variables' as *;

.thanks {
  text-align: center;
  width: 100%;
  opacity: 0.15;
}

.subscriptions {
  display: flex;
  flex-direction: column;
  gap: $spacing-md;
  position: relative;

  .subscribe-intro {
    text-align: center;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    padding: $spacing-md $spacing-sm 0;
    gap: $spacing-xxs;
    border-radius: $br-lg;

    h1 {
      font-size: $font-size-xxl;
      margin-bottom: $spacing-xxs;
    }

    p {
      color: rgba($black, 0.85);
    }
  }

  .subscribe-options {
    display: flex;
    justify-content: center;
    width: 100%;
    overflow: hidden;
    margin: 0 auto;

    @media (max-width: 600px) {
      flex-direction: column;
    }

    .subscribe-option {
      padding: 0 $spacing-md $spacing-lg;
      text-align: center;
      width: 50%;
      color: $black;
      display: flex;
      flex-direction: column;

      @media (max-width: 600px) {
        width: 100%;
      }

      &.pro {
        color: $black;

        h2 {
          background: linear-gradient(150deg, rgba($mint, 0.35), rgba($mint, 1));
        }

        .cost {
          padding: $spacing-xxxs $spacing-xxs;
          margin-right: $spacing-xxxs;
          border-radius: $br-md;
          border: 1px solid rgba($mint, 1);
          color: $mint;
          font-weight: bold;
        }

        .subscribe-details {
          ul li {
            color: $black;

            span {
              &:last-child {
                color: $mint;
              }
            }
          }
        }
      }

      h2 {
        font-size: $font-size-xl;
        margin: 0 auto $spacing-xs;
        background: linear-gradient(150deg, rgba($brand, 0.35), rgba($brand, 1));
        border-radius: $br-xxl;
        padding: $spacing-xxxs $spacing-md;
        align-self: center;
        color: $white;
        text-shadow: 0px 1px 1px rgba($black, 0.25);
      }

      p {
        margin-bottom: $spacing-md;
        line-height: 30px;
      }

      .subscribe-details {
        margin-bottom: $spacing-md;

        p {
          font-weight: bold;
          margin-bottom: $spacing-xs;
        }

        ul {
          list-style: none;
          padding: 0;

          li {
            display: flex;
            justify-content: space-between;
            padding: $spacing-xs 0;
            color: $black;
            border-bottom: $border;

            &:last-child {
              border: none;
            }
          }
        }
      }
    }
  }

  .subscribe-buttons {
    position: sticky;
    bottom: 0;
    margin: 0 auto;
    width: 100%;
    display: grid;
    grid-template-columns: 1fr 1fr;
    background: rgba($white, 1);
    mask-image: linear-gradient(to top, rgba(0, 0, 0, 1) 80%, rgba(0, 0, 0, 0));

    @media (max-width: 600px) {
      grid-template-columns: 1fr;
    }

    .placeholder {
      width: 100%;
      padding: $spacing-md;

      @media (max-width: 600px) {
        display: none;
      }
    }

    #paypal-checkout {
      background: rgba($white, 0.2);
      backdrop-filter: blur(10px);
      padding: $spacing-md;
    }
  }
}

</style>