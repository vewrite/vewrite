<template>
  <div id="Sidebar" :class="collapsed ? 'collapsed' : ''">
    <div class="button clear toggle-sidebar" @click="toggleSidebar">
      <Icon name="fluent:chevron-double-left-16-regular" size="1rem" v-if="!collapsed" />
      <Icon name="fluent:chevron-double-right-16-regular" size="1rem" v-if="collapsed" />
    </div>
    <div class="sidebar-header">
      <svg width="96" height="19" viewBox="0 0 96 19" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path fill-rule="evenodd" clip-rule="evenodd" d="M64.8734 17.3642V17.963H72.0301V17.3642C71.0036 17.3642 70.4049 17.1741 70.2338 16.7939V5.13228C69.7966 5.13228 68.8842 5.34137 67.4966 5.75955C66.109 6.15873 65.2346 6.35832 64.8734 6.35832V7.01411C65.0825 7.01411 65.6813 7.05213 66.6697 7.12816V16.7939C66.4986 17.1741 65.8999 17.3642 64.8734 17.3642ZM66.9834 2.82275C67.4586 3.1459 67.9243 3.30747 68.3805 3.30747C68.8557 3.30747 69.3024 3.1459 69.7206 2.82275C70.1578 2.4806 70.3764 2.10994 70.3764 1.71076C70.3764 1.23555 70.1388 0.836371 69.6636 0.513227C69.2074 0.171076 68.7511 0 68.2949 0C67.8197 0 67.3635 0.171076 66.9263 0.513227C66.5081 0.855379 66.2991 1.22604 66.2991 1.62522C66.2991 2.08142 66.5272 2.4806 66.9834 2.82275ZM78.3617 1.28326V5.4176H80.8138V6.27297H78.3617V15.34C78.3617 15.9293 78.4662 16.3855 78.6753 16.7086C78.8844 17.0127 79.2741 17.1648 79.8443 17.1648C80.1865 17.1648 80.5286 17.0032 80.8708 16.6801C81.2319 16.3379 81.4791 15.8722 81.6121 15.283L82.2964 15.6251C81.8972 17.3739 80.7567 18.2483 78.8749 18.2483C77.3923 18.2483 76.3088 17.9156 75.6245 17.2503C74.9592 16.566 74.6265 15.454 74.6265 13.9144V6.27297H72.6306V5.4176C73.7521 5.4176 74.7311 4.99941 75.5674 4.16304C76.4038 3.30766 76.822 2.34774 76.822 1.28326H78.3617ZM86.9899 11.0914C87.0279 12.7451 87.3986 14.1707 88.1019 15.3682C88.8242 16.5658 89.7366 17.1645 90.8391 17.1645C92.4929 17.1645 93.8235 16.5373 94.8309 15.2827L95.5152 15.6249C94.964 16.5373 94.2416 17.2026 93.3482 17.6207C92.4739 18.0389 91.3143 18.248 89.8697 18.248C89.1284 18.248 88.4061 18.1435 87.7027 17.9344C86.9994 17.7063 86.2961 17.3451 85.5928 16.8509C84.9085 16.3377 84.3478 15.5868 83.9106 14.5984C83.4924 13.61 83.2833 12.4314 83.2833 11.0628C83.2833 9.4091 83.863 8.01198 85.0226 6.87148C86.2011 5.71197 87.7217 5.13221 89.5846 5.13221C91.6185 5.13221 93.1962 5.71197 94.3177 6.87148C95.4392 8.01198 95.9999 9.41861 95.9999 11.0914H86.9899ZM87.0184 10.2075H92.2077C92.0937 8.85786 91.8561 7.8219 91.4949 7.09958C91.1528 6.35825 90.592 5.98759 89.8127 5.98759C89.1284 5.98759 88.5106 6.33924 87.9594 7.04256C87.4271 7.72686 87.1135 8.78183 87.0184 10.2075ZM52.4549 17.9629V17.3641C53.4814 17.3641 54.0802 17.174 54.2512 16.7939V7.12809C53.2248 7.05206 52.626 7.01404 52.4549 7.01404V6.35825C52.8161 6.35825 53.6905 6.15866 55.0781 5.75949C56.4657 5.3413 57.3781 5.13221 57.8153 5.13221V6.32974C58.8038 5.53139 59.7447 5.13221 60.6381 5.13221C62.9951 5.13221 64.1736 5.70246 64.1736 6.84297C64.1736 7.29917 64.0311 7.66033 63.7459 7.92645C63.4798 8.19256 63.1472 8.32562 62.748 8.32562C62.3108 8.32562 61.9782 8.21157 61.7501 7.98347C61.522 7.75537 61.3794 7.49876 61.3224 7.21363C61.2653 6.92851 61.1513 6.67189 60.9802 6.44379C60.8281 6.21569 60.6 6.10164 60.2959 6.10164C59.5736 6.10164 58.7467 6.50081 57.8153 7.29917V16.7939C57.9864 17.174 58.5852 17.3641 59.6116 17.3641V17.9629H52.4549ZM40.1259 9.80851L43.3764 17.9631H45.7714L50.362 6.47253C50.552 6.1684 51.1318 6.01633 52.1012 6.01633V5.41757H47.4252V6.01633C48.2235 6.01633 48.7557 6.12088 49.0219 6.32997L45.7714 14.4846L42.3784 6.13038C42.6255 6.05435 43.0247 6.01633 43.576 6.01633V5.41757H37.0466V6.01633C38.073 6.01633 38.6718 6.20642 38.8429 6.58658L39.4416 8.06924L36.8755 14.4846L33.4825 6.13038C33.7296 6.05435 34.1288 6.01633 34.68 6.01633V5.41757H28.1506V6.01633C29.1771 6.01633 29.7758 6.20642 29.9469 6.58658L34.4804 17.9631H36.8755L40.1259 9.80851ZM18.9941 11.0914C19.0321 12.7451 19.4027 14.1707 20.106 15.3682C20.8284 16.5658 21.7408 17.1645 22.8433 17.1645C24.497 17.1645 25.8276 16.5373 26.835 15.2827L27.5193 15.6249C26.9681 16.5373 26.2458 17.2026 25.3524 17.6207C24.478 18.0389 23.3185 18.248 21.8738 18.248C21.1325 18.248 20.4102 18.1435 19.7069 17.9344C19.0036 17.7063 18.3002 17.3451 17.5969 16.8509C16.9126 16.3377 16.3519 15.5868 15.9147 14.5984C15.4965 13.61 15.2874 12.4314 15.2874 11.0628C15.2874 9.4091 15.8672 8.01198 17.0267 6.87148C18.2052 5.71197 19.7259 5.13221 21.5887 5.13221C23.6226 5.13221 25.2003 5.71197 26.3218 6.87148C27.4433 8.01198 28.004 9.41861 28.004 11.0914H18.9941ZM19.0226 10.2075H24.2119C24.0978 8.85786 23.8602 7.8219 23.4991 7.09958C23.1569 6.35825 22.5962 5.98759 21.8168 5.98759C21.1325 5.98759 20.5147 6.33924 19.9635 7.04256C19.4312 7.72686 19.1176 8.78183 19.0226 10.2075ZM1.7963 6.58658L6.32981 17.9631H8.72487L13.2584 6.58658C13.4104 6.20642 14.0092 6.01633 15.0547 6.01633V5.41757H10.3786V6.01633C11.177 6.01633 11.7092 6.12088 11.9753 6.32997L8.72487 14.4846L5.33186 6.13038C5.57897 6.05435 5.97815 6.01633 6.52939 6.01633V5.41757H0V6.01633C1.02646 6.01633 1.62522 6.20642 1.7963 6.58658Z" fill="#2F7CF5"/>
      </svg>
    </div>
    <div class="sidebar-content">
      <div class="link-group">
        <div class="title">Work</div>
        <router-link to="/projects" class="link"><Icon name="fluent:folder-16-regular" size="1.5rem" /> Projects</router-link>
        <router-link to="/workflows" class="link"><Icon name="fluent:flow-16-regular" size="1.5rem" /> Workflows</router-link>
      </div>
      <div class="link-group">
        <div class="title">People</div>
        <router-link to="/teams" class="link"><Icon name="fluent:people-16-regular" size="1.5rem" /> Teams</router-link>
        <!-- <router-link to="/members" class="link">Members</router-link> -->
      </div>
      <div class="link-group">
        <div class="title">Business</div>
        <router-link to="/clients" class="link"><Icon name="fluent:star-16-regular" size="1.5rem" /> Clients</router-link>
        <!-- <router-link to="/payments" class="link">Payments</router-link> -->
        <!-- <router-link to="/invoices" class="link">Invoices</router-link> -->
        <!-- <router-link to="/analytics" class="link">Analytics</router-link> -->
      </div>
    </div>
    <div class="user-section">
      <User />
    </div>
  </div>
</template>

<script setup>

import User from '@/components/Sidebar/User.vue'

const collapsed = ref(false)

function toggleSidebar() {
  collapsed.value = !collapsed.value
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

#Sidebar {
  height: 100%;
  border-radius: 0;
  min-width: 300px;
  transition: all 0.2s ease;
  position: relative;
  background: $brand-dark linear-gradient(180deg, $brand-dark 50%, $brand 100%);
  box-shadow: inset -30px 10px 40px rgba($brand, 0.25);
  margin: 0;
  padding-right: $spacing-sm;

  &.collapsed {
    min-width: 88px;

    .toggle-sidebar {
      color: rgba($white, 0.85);

      &:hover {
        color: $white;
      }
    }

    .sidebar-header { 
      display: none;
    }

    .user-section {
      display: none;
    }

    .sidebar-content {
      padding: $spacing-md $spacing-sm $spacing-xs $spacing-xs;
      opacity: 0;

      .link-group {

        .title {
          text-align: center;
        }

        .link {
          font-size: 0;
          gap: 0;
          align-items: center;
          justify-content: center;
          margin-bottom: $spacing-xxs;
        }
      }

      .link {
        font-size: 0;
        gap: 0;
        align-items: center;
        justify-content: center;
      }
    }

  }

  @media (max-width: 1024px) {
    min-width: 260px;
  }

  @media (max-width: 960px) {
    display: none;
  }

  .sidebar-header {
    color: $white;
    padding: $spacing-sm;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    height: 54px;

    svg {
      animation: fadeIn 0.8s ease forwards;
      opacity: 0;
    }

  }

  .toggle-sidebar {
    height: 100%;
    background-color: rgba($brand, 0.4);
    border-left: 1px solid rgba($white, 0.1);
    color: rgba($white, 0.75);
    position: absolute;
    right: 0;
    top: 0;
    bottom: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    pointer-events: all;
    padding: 0;
    z-index: 1000;
    border-radius: 0 $br-lg $br-lg 0;

    &:hover {
      color: $white;
    }
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
      margin-bottom: $spacing-md;

      a {
        display: flex;
        flex-direction: row;
        align-items: center;
        gap: $spacing-xs;
        padding: $spacing-xxs $spacing-xs;
        border-radius: $br-md;
        transition: background-color 0.18s ease;
        color: rgba($white, 0.85);
        font-size: $font-size-sm;
        font-family: $font-family-main;
        font-weight: 400;
        text-decoration: none;

        &:hover,
        &.router-link-active,
        &.router-link-exact-active {
          background-color: rgba($brand, 1);
          color: $white;

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
        color: lighten($brand,20%);
        margin-bottom: $spacing-xs;
      }
    }
  }

  .user-section {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    padding: $spacing-sm;
    position: absolute;
    bottom: 0;
    width: 100%;

    .tier-type {
      display: flex;
      flex-direction: row;
      align-items: center;
      gap: $spacing-xs;
      margin-bottom: $spacing-xs;
      justify-content: space-between;
      width: 100%;
      background-color: rgba($mint, 0.25);
      padding: $spacing-xs;
      border-radius: $br-lg;

      p {
        font-size: $font-size-sm;
        font-family: $font-family-main;
        font-weight: 400;
        color: $mint-dark;
        margin: 0 0 0 $spacing-sm;
      }

      button {
        width: auto;
        display: inline-block;
      }
    }

    .button.user {
      width: 100%;
      flex-direction: row;
      justify-content: space-between;
      padding: $spacing-xs $spacing-sm;
    }

    p.user {
      margin:0 0 0 $spacing-sm;
      text-transform: capitalize;
    }

    .user-identity {
      display: flex;
      flex-direction: row;
      align-items: center;
    }
  }
}

</style>