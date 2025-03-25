<template>
  <header>
    <section class="left">
      <div class="button clear toggle-mobile" @click="toggleMobile">
        <Icon name="material-symbols-light:menu" size="1.5rem" />
      </div>
      <svg width="98" height="22" viewBox="0 0 98 22" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M92.9627 5.73975C93.8662 5.73975 94.6399 5.92541 95.2835 6.29675C95.9395 6.6557 96.447 7.17557 96.806 7.85634C97.1649 8.52474 97.3444 9.34167 97.3444 10.3071V11.4954H90.6975C90.7223 12.4114 90.976 13.1231 91.4588 13.6306C91.9415 14.1257 92.6099 14.3732 93.464 14.3732C94.12 14.3732 94.7017 14.3113 95.2092 14.1876C95.7291 14.0514 96.2613 13.8596 96.806 13.612V15.4872C96.3109 15.7224 95.7972 15.8957 95.2649 16.0071C94.7327 16.1185 94.0952 16.1742 93.3526 16.1742C92.3747 16.1742 91.5021 15.9885 90.7347 15.6172C89.9796 15.2335 89.3855 14.6579 88.9523 13.8905C88.5314 13.1231 88.321 12.17 88.321 11.0312C88.321 9.8801 88.5129 8.91464 88.8966 8.13484C89.2927 7.34267 89.8373 6.74853 90.5304 6.35244C91.2236 5.94398 92.0343 5.73975 92.9627 5.73975ZM92.9627 7.46644C92.3438 7.46644 91.8363 7.67068 91.4402 8.07914C91.0565 8.47523 90.8275 9.06936 90.7532 9.86154H95.0793C95.0793 9.39118 94.9988 8.97653 94.8379 8.61757C94.6894 8.25862 94.4604 7.98012 94.1509 7.78208C93.8415 7.57165 93.4454 7.46644 92.9627 7.46644Z" fill="#0D1E38"/>
        <path d="M85.2715 14.2989C85.5685 14.2989 85.8532 14.2742 86.1255 14.2247C86.3978 14.1628 86.6516 14.0947 86.8868 14.0204V15.7657C86.6392 15.8771 86.3174 15.9699 85.9213 16.0442C85.5252 16.1308 85.1105 16.1741 84.6773 16.1741C84.1079 16.1741 83.5881 16.0813 83.1177 15.8957C82.6598 15.6976 82.2884 15.3634 82.0037 14.8931C81.7314 14.4227 81.5953 13.7667 81.5953 12.925V7.6892H80.2399V6.66804L81.7252 5.8511L82.4679 3.71594H83.9347V5.92537H86.7939V7.6892H83.9347V12.9064C83.9347 13.3768 84.0584 13.7295 84.306 13.9647C84.5535 14.1875 84.8754 14.2989 85.2715 14.2989Z" fill="#0D1E38"/>
        <path d="M78.3812 5.92535V15.9885H76.0418V5.92535H78.3812ZM77.2115 2.04492C77.5581 2.04492 77.8613 2.13776 78.1213 2.32342C78.3812 2.49671 78.5112 2.81234 78.5112 3.27032C78.5112 3.71592 78.3812 4.03774 78.1213 4.23578C77.8613 4.42145 77.5581 4.51428 77.2115 4.51428C76.8525 4.51428 76.5431 4.42145 76.2832 4.23578C76.0356 4.03774 75.9118 3.71592 75.9118 3.27032C75.9118 2.81234 76.0356 2.49671 76.2832 2.32342C76.5431 2.13776 76.8525 2.04492 77.2115 2.04492Z" fill="#0D1E38"/>
        <path d="M73.1556 5.73975C73.3041 5.73975 73.4774 5.74593 73.6754 5.75831C73.8735 5.77069 74.0406 5.79545 74.1767 5.83258L73.9725 8.00488C73.8611 7.98012 73.7126 7.96155 73.5269 7.94918C73.3536 7.92442 73.1989 7.91204 73.0627 7.91204C72.6914 7.91204 72.3325 7.97393 71.9859 8.09771C71.6517 8.20911 71.3484 8.3824 71.0761 8.61757C70.8162 8.84037 70.6058 9.13125 70.4449 9.49021C70.2963 9.84916 70.2221 10.2762 70.2221 10.7713V15.9885H67.8827V5.92541H69.6836L70.0178 7.67068H70.1292C70.3273 7.31172 70.5748 6.9899 70.8719 6.70521C71.169 6.40814 71.5093 6.17297 71.8931 5.99968C72.2891 5.82639 72.71 5.73975 73.1556 5.73975Z" fill="#0D1E38"/>
        <path d="M59.6005 11.6625C59.5386 11.4273 59.4643 11.1364 59.3777 10.7898C59.291 10.4309 59.1982 10.0595 59.0992 9.67583C59.0125 9.29212 58.9259 8.93935 58.8392 8.61753C58.765 8.29571 58.7155 8.04815 58.6907 7.87486H58.6164C58.5793 8.04815 58.5236 8.29571 58.4493 8.61753C58.3751 8.93935 58.2946 9.29212 58.208 9.67583C58.1213 10.0595 58.0285 10.4309 57.9295 10.7898C57.8428 11.1488 57.7686 11.4458 57.7067 11.681L56.537 15.9885H53.9748L51.1526 5.9068H53.5106L54.7546 10.7156C54.8412 11.0374 54.9217 11.4025 54.9959 11.811C55.0826 12.2195 55.1569 12.6155 55.2187 12.9993C55.2806 13.3706 55.324 13.6738 55.3487 13.909H55.423C55.4477 13.7481 55.4787 13.5377 55.5158 13.2778C55.5529 13.0054 55.5963 12.7269 55.6458 12.4423C55.7077 12.1452 55.7634 11.8729 55.8129 11.6253C55.8748 11.3778 55.9243 11.1859 55.9614 11.0498L57.4096 5.9068H59.9718L61.3643 11.0498C61.4262 11.2726 61.4943 11.5634 61.5685 11.9224C61.6428 12.2813 61.7109 12.6403 61.7728 12.9993C61.8347 13.3582 61.8718 13.6553 61.8842 13.8904H61.9584C61.9832 13.68 62.0265 13.3953 62.0884 13.0364C62.1503 12.6651 62.2245 12.269 62.3112 11.8481C62.3978 11.4273 62.4907 11.0498 62.5897 10.7156L63.8522 5.9068H66.1731L63.3138 15.9885H60.7145L59.6005 11.6625Z" fill="#0D1E38"/>
        <path d="M46.0928 5.73975C46.9964 5.73975 47.77 5.92541 48.4137 6.29675C49.0697 6.6557 49.5772 7.17557 49.9361 7.85634C50.2951 8.52474 50.4746 9.34167 50.4746 10.3071V11.4954H43.8277C43.8525 12.4114 44.1062 13.1231 44.5889 13.6306C45.0717 14.1257 45.7401 14.3732 46.5941 14.3732C47.2501 14.3732 47.8319 14.3113 48.3394 14.1876C48.8593 14.0514 49.3915 13.8596 49.9361 13.612V15.4872C49.441 15.7224 48.9273 15.8957 48.3951 16.0071C47.8628 16.1185 47.2254 16.1742 46.4827 16.1742C45.5049 16.1742 44.6323 15.9885 43.8648 15.6172C43.1098 15.2335 42.5157 14.6579 42.0824 13.8905C41.6616 13.1231 41.4512 12.17 41.4512 11.0312C41.4512 9.8801 41.643 8.91464 42.0267 8.13484C42.4228 7.34267 42.9674 6.74853 43.6606 6.35244C44.3538 5.94398 45.1645 5.73975 46.0928 5.73975ZM46.0928 7.46644C45.4739 7.46644 44.9665 7.67068 44.5704 8.07914C44.1867 8.47523 43.9577 9.06936 43.8834 9.86154H48.2094C48.2094 9.39118 48.129 8.97653 47.9681 8.61757C47.8195 8.25862 47.5905 7.98012 47.2811 7.78208C46.9717 7.57165 46.5756 7.46644 46.0928 7.46644Z" fill="#0D1E38"/>
        <path d="M34.2306 15.9885L30.4059 5.92535H32.8753L34.8805 11.7367C34.9671 11.9719 35.0476 12.2318 35.1218 12.5165C35.1961 12.7888 35.258 13.0611 35.3075 13.3334C35.3694 13.5934 35.4065 13.8224 35.4189 14.0204H35.4932C35.5179 13.81 35.5612 13.5748 35.6231 13.3149C35.685 13.0426 35.7531 12.7703 35.8274 12.4979C35.914 12.2256 35.9945 11.9719 36.0687 11.7367L38.0739 5.92535H40.5433L36.7186 15.9885H34.2306Z" fill="#0D1E38"/>
        <path d="M21.0884 1.38745C22.4157 2.15372 22.8704 3.85082 22.1041 5.17804L13.7794 19.5969C13.0131 20.9241 11.316 21.3788 9.98883 20.6125V20.6125C8.66161 19.8463 8.20687 18.1492 8.97314 16.822L17.2979 2.40314C18.0641 1.07592 19.7612 0.621182 21.0884 1.38745V1.38745Z" fill="url(#paint0_linear_29_63)"/>
        <path fill-rule="evenodd" clip-rule="evenodd" d="M5.45472 2.40317C4.68845 1.07596 2.99134 0.62122 1.66413 1.38749C0.336913 2.15376 -0.117824 3.85086 0.648445 5.17808L8.97315 19.5969C9.73942 20.9241 11.4365 21.3789 12.7637 20.6126C13.3104 20.297 13.7091 19.8234 13.9354 19.2828L16.7482 14.4242C16.3782 14.7942 15.4163 15.6452 14.5283 16.0891C13.993 16.3568 13.4307 15.9655 12.9875 15.4504L5.45472 2.40317Z" fill="url(#paint1_linear_29_63)"/>
        <defs>
        <linearGradient id="paint0_linear_29_63" x1="22.853" y1="5.82196" x2="6.75856" y2="14.7017" gradientUnits="userSpaceOnUse">
        <stop offset="0.0897277" stop-color="#C3D5AD"/>
        <stop offset="0.776664" stop-color="#BFCDFF"/>
        </linearGradient>
        <linearGradient id="paint1_linear_29_63" x1="2.31873" y1="9.15189" x2="9.53348" y2="21.084" gradientUnits="userSpaceOnUse">
        <stop stop-color="#9AB1FD"/>
        <stop offset="1" stop-color="#6C8DFB"/>
        </linearGradient>
        </defs>
      </svg>
      <PlanStatus />
    </section>
    <section class="right">
      <Dropdown class="help-dropdown">
        <template v-slot:trigger>
          <Icon name="solar:help-linear" size="1.5rem" />
        </template>
        <template v-slot:menu>
          <a href="https://vewrite.com/support" class="dropdown-item"><Icon name="fluent:chat-help-20-regular" size="1.5rem" /> Support</a>
          <a href="https://docs.vewrite.com/" class="dropdown-item"><Icon name="fluent:document-20-regular" size="1.5rem" /> Documentation</a>
          <a href="https://vewrite.com/company/mission" class="dropdown-item"><Icon name="fluent:star-20-regular" size="1.5rem" /> Our Mission</a>
          <a href="https://github.com/vewrite/vewrite/discussions/categories/ideas" class="dropdown-item"><Icon name="fluent:lightbulb-20-regular" size="1.5rem" /> Suggest a Feature</a>
        </template>
      </Dropdown>
      <User />
    </section>
  </header>

  <section id="MobileNav">
    <nav :class="menu ? 'active' : ''">
      <div class="sidebar-content">
        <div class="link-group">
          <router-link @click="toggleMobile" to="/projects" class="link"><Icon name="fluent:folder-16-regular" size="1.5rem" /> Projects</router-link>
          <!-- <router-link @click="toggleMobile" to="/workflows" class="link"><Icon name="fluent:flow-16-regular" size="1.5rem" /> Workflows</router-link> -->
          <router-link v-if="personaState == 'manager'" @click="toggleMobile" to="/clients" class="link"><Icon name="fluent:star-16-regular" size="1.5rem" /> Clients</router-link>
        </div>
      </div>
    </nav>
    <div @click="toggleMobile" class="blur" :class="menu ? 'active' : ''"></div>
  </section>

</template>

<script setup>

import User from '~/components/TopBar/User.vue'
import PlanStatus from '~/components/TopBar/PlanStatus.vue'

// Pull personaState from the middleware auth.js
const personaState = useState('personaState');

const menu = ref(false)

function toggleMobile() {
  menu.value = !menu.value
}

</script>

<style lang="scss" scoped>

@use 'assets/variables' as *;

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes scaleBounce {
  0% {
    transform: scale(0.9);
    opacity: 0;
  }
  60% {
    transform: scale(1.005);
    opacity: 1;
  }
  100% {
    transform: scale(1);
  }
}

header {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding: $spacing-sm;
  width: 100%;

  @media (max-width: 960px) {
    padding: $spacing-sm $spacing-sm 0 $spacing-sm;
  }

  .left {
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: $spacing-xs;

    .topbar-plan {
      border-left: $border;
      padding-left: $spacing-sm;
    }

    svg {
      margin-left: $spacing-sm;

      @media (max-width: 960px) {
        margin-left: 0;
      }
    }
    
    .toggle-mobile {
      display: none;

      @media (max-width: 960px) {
        color: $black;
        padding: $spacing-xs 0;
        min-height: 40px;
        display: flex;
        cursor: pointer;
      }
    }
  }

  .right {
    display: flex;
    flex-direction: row;
    align-items: center;
  }
}

#MobileNav {
  display: none;

  @media (max-width: 960px) {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    width: 100%;

    .mobile-bar {
      display: flex;
      flex-direction: row;
      align-items: center;
      gap: $spacing-xs;
      padding: 0 $spacing-sm 0 0;
      height: 44px;
      width: 44px;
      position: fixed;
      bottom: $spacing-sm;
      left: $spacing-sm;
      z-index: 9999;
      background: $white;
      border: $border;
      border-radius: $br-md;
      justify-content: space-between;

      .toggle-sidebar {

        .menu-icon {
          display: block;
          width: 100%;
          height: 100%;
          position: relative;

          &.active {
            &::before {
              top: 12px;
              transform: rotate(45deg);
            }

            &::after {
              bottom: 11px;
              transform: rotate(-45deg);
            }
          }

          &::before,
          &::after {
            content: '';
            position: absolute;
            width: 16px;
            height: 1px;
            background: $black;
            transition: all 0.15s;
            left: 0;
            transform-origin: center center;
          }

          &::before {
            top: 4px;
          }

          &::after {
            bottom: 4px;
          }
        }

      }

    }

    nav {
      position: fixed;
      width: 100%;
      max-width: 300px;
      top: $spacing-sm;
      left: $spacing-sm;
      opacity: 0;
      box-shadow: $big-shadow;
      border-radius: $br-lg;
      background-color: rgba($white, 0.65);
      backdrop-filter: blur(20px);
      z-index: 9998;
      transition: all .3s ease;
      pointer-events: none;

      &.active {
        animation: scaleBounce 0.35s ease;
        animation-fill-mode: forwards;
        opacity: 1;
        pointer-events: all;
      }

      .sidebar-content {
        padding: $spacing-sm;
        display: flex;
        flex-direction: column;
        gap: 2px;
        height: calc(100% - 54px);
        overflow-y: auto;
        animation: fadeIn 0.8s ease forwards;
        opacity: 0;
        overflow: hidden;

        .link-group {
          display: flex;
          flex-direction: column;
          gap: 2px;
          margin-bottom: 0;

          a {
            display: flex;
            flex-direction: row;
            align-items: center;
            gap: $spacing-xs;
            padding: $spacing-xs $spacing-sm;
            border-radius: $br-md;
            transition: background-color 0.18s ease;
            color: $black;
            font-size: $font-size-xs;
            font-family: $font-family-main;
            text-decoration: none;

            &:hover,
            &.router-link-active,
            &.router-link-exact-active {
              background-color: rgba($brand, .1);
              color: $brand;

              .icon {
                transform: scale(1.15);
              }
            }
          }

          .title {
            font-size: $font-size-xxs;
            text-transform: uppercase;
            font-family: $font-family-main;
            font-weight: bold;
            color: rgba($brand,.6);
            margin-bottom: $spacing-xs;
          }
        }
      }
    }
  }

  .blur {
    position: fixed;
    top: 0px;
    left: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(120deg, rgba($brand,.25) 0%, rgba($mint,.1) 10%, rgba($mint,0) 65%);
    backdrop-filter: blur(3px);
    mask-image: linear-gradient(110deg, rgba(0,0,0,1) 35%, rgba(0,0,0,0) 55%);
    z-index: 9997;
    opacity: 0;
    pointer-events: none;
    transition: all .3s ease;

    &.active {
      opacity: 1;
      pointer-events: all;
    }
  }
  
}


</style>