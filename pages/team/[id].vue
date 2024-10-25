<template>
  <AppPanel>
    <template v-slot:header>
      <router-link to="/teams/" class="button">Back</router-link>
      <!-- <div class="button red" @click="deleteTeamModal(team.id)">Delete team</div> -->
      <Dropdown>
        <template v-slot:trigger>
          ⋮
        </template>
        <template v-slot:menu>
          <div class="dropdown-item" @click="deleteTeamModal(team.id)">Delete team</div>
        </template>
      </Dropdown>
    </template>
    <template v-slot:body>
      <Loading v-if="loading" />
      <div class="team-overview max-width md" v-if="TeamData && !loading">
        <div class="team-summary">
          <input class="team-title-input" v-model="team.name" @input="updateTeamWithDebounce(team.id, $event.target.value)" />
          <span>Click to edit</span>
        </div>
      </div>
      <div class="team-management inner-container" v-if="!loading && TeamData">
        <div class="max-width md">
          <div v-if="TeamMembersData.length > 0">{{ TeamMembersData }}</div>
          <div class="button" @click="addTeamMembersModal()">
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path fill-rule="evenodd" clip-rule="evenodd" d="M7.23233 1.20415C7.23233 0.914077 6.99718 0.678925 6.7071 0.678925C6.41702 0.678925 6.18187 0.914077 6.18187 1.20415V6.62122L0.764822 6.62122C0.474747 6.62122 0.239594 6.85637 0.239594 7.14644C0.239593 7.43652 0.474747 7.67167 0.764822 7.67167L6.18187 7.67167L6.18187 13.0887C6.18187 13.3788 6.41702 13.614 6.7071 13.614C6.99718 13.614 7.23233 13.3788 7.23233 13.0887L7.23233 7.67167L12.6494 7.67167C12.9395 7.67167 13.1746 7.43652 13.1746 7.14645C13.1746 6.85637 12.9395 6.62122 12.6494 6.62122L7.23233 6.62122V1.20415Z" fill="#1759D5"/>
            </svg>
          </div>
        </div>
      </div>  

    </template>
  </AppPanel>
</template>

<script setup>
import { useRoute } from 'vue-router';
import AppPanel from '~/components/AppPanel.vue';

const supabase = useSupabaseClient();
const loading = ref(true);
const route = useRoute();
const team = ref(null);
const teamMembers = ref(null);
const teamId = route.params.id;

console.log('Team ID is: ', teamId);

import useTeam from '~/composables/useTeam';
const { fetchSingleTeam, updateTeam, TeamData, deleteTeamModal } = useTeam();

import useTeamMembers from '~/composables/useTeamMembers';
const { fetchTeamMembers, addTeamMembersModal, deleteTeamMember, TeamMembersData } = useTeamMembers();

// Fetch the team data when the component is mounted
onMounted(async () => {
  try {
    // Team
    await fetchSingleTeam(teamId);
    team.value = TeamData.value[0];

    // Team members
    await fetchTeamMembers(teamId);
    teamMembers.value = TeamMembersData.value[0];

    loading.value = false;
  } catch (error) {
    alert(error.message);
  }
});

// Manual debounce function
function debounce(func, wait) {
  let timeout;
  return function(...args) {
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(this, args), wait);
  };
}

// Debounced save function
const debouncedSaveTeam = debounce(() => updateTeam(TeamData.value), 1000);

// Update deliverable function
function updateTeamWithDebounce() {
  debouncedSaveTeam();
}



</script>

<style lang="scss" scoped>

@import 'assets/_variables.scss';

.team-overview {
  padding: $spacing-sm 0;
  border-radius: $br-md;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  gap: $spacing-md;
  margin: 0 auto;

  .team-summary {
    display: flex;
    flex-direction: column;
    gap: 2px;
    width: 100%;
    position: relative;

    .team-title-input {
      font-family: $font-family-secondary;
      font-size: $font-size-lg;
      font-weight: 500;
      background-color: transparent;
      width: 100%;
      padding: $spacing-xs;
      border: 1px solid rgba($brand, 0.1);
      background: rgba($white, 0.9);

      &:focus,
      &:active {
        border: 1px solid $brand;
        background: $white;
      }
    }

    span {
      position: absolute;
      right: $spacing-sm;
      top: 0;
      line-height: 54px;
      opacity: 0.25;
      font-size: $font-size-xs;
      pointer-events: none;
    }

  }
}

.team-management {
  display: flex;
  flex-direction: column;
  gap: $spacing-sm;
  width: 100%;
  padding: $spacing-md;
  border-radius: $br-md;
  background-color: $white;
  height: 100%;
}

</style>