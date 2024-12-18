<template>
  <AppPanel>
    <template v-slot:header>
      <div></div>
    </template>
    <template v-slot:body>
      <main class="subscriptions">
        <section class="subscribe-intro">
          <h1>Write better content</h1>
          <p>With Vewrite you and your team can be more effective, efficient, and profitable.</p>
        </section>
        <p class="notification info" v-if="status">{{ status }}</p>
        <section class="subscribe-options">
          <div class="subscribe-option">
            <h2>Free</h2>
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
            <h2>Pro</h2>
            <p><span class="cost">$29/m</span> for the Project Manager</p>
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
              </ul>
            </div>
            <div id="paypal-checkout" v-if="!status"></div>
          </div>
        </section>
        
      </main>
    </template>
  </AppPanel>
</template>

<script setup>

definePageMeta({
  layout: 'default',
  middleware: ['auth'],
});

import AppPanel from '~/components/AppPanel.vue';

const config = useRuntimeConfig();
const status = ref(null);

onMounted(() => {
  const script = document.createElement('script');
  script.src = 'https://www.paypal.com/sdk/js?client-id=' + config.public.paypal.clientId + '&vault=true' + '&intent=subscription';
  script.async = true;
  script.onload = () => {
    window.paypal.Buttons({
      style: {
          shape: 'pill',
          color: 'white',
          layout: 'horizontal',
          label: 'paypal',
          size: 'responsive',
          tagline: false
      },
      createSubscription: function(data, actions) {
        return actions.subscription.create({
          'plan_id': 'P-49U09457TT932483JM5Q5CSQ'
        });
      },
      onApprove: function(data, actions) {
        status.value = 'You have successfully created subscription ' + data.subscriptionID;
      }
    }).render('#paypal-checkout');
  };
  document.body.appendChild(script);
});

</script>

<style scoped lang="scss">

@use 'assets/variables' as *;

.subscriptions {
  padding: $spacing-md;
  display: flex;
  flex-direction: column;
  gap: $spacing-md;

  .subscribe-intro {
    text-align: center;

    h1 {
      font-size: $font-size-xxl;
      margin-bottom: $spacing-xxs;
    }

    p {
      color: rgba($black, 0.5);
    }
  }

  .subscribe-options {
    display: flex;
    justify-content: center;
    width: 100%;
    max-width: 600px;
    border-radius: $br-xl;
    overflow: hidden;
    margin: 0 auto;
    box-shadow: $big-shadow;

    .subscribe-option {
      padding: $spacing-md $spacing-lg;
      text-align: center;
      width: 50%;
      color: $black;

      &.pro {
        color: $white;
        border-left: $border;
        background: linear-gradient(to top, $brand, $brand-light);

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
            color: $white;

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
        margin: 0 0 $spacing-xs;
      }

      p {
        margin-bottom: $spacing-md;
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

            span {
              &:first-child {
                font-weight: bold;
              }
            }
          }
        }
      }
    }
  }
}

</style>