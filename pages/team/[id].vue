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
        <div class="team-members-empty max-width md" v-if="TeamMembersData && TeamMembersData.length === 0">
          <p>No team members found</p>
        </div>
        <div class="max-width md" v-else>
          {{ TeamMembersData }}
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
const { fetchTeamMembers, addTeamMember, deleteTeamMember, TeamMembersData } = useTeamMembers();

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

      &:focus,
      &:active {
        border: 1px solid $brand;
        background: $white;
      }
    }

    span {
      position: absolute;
      right: $spacing-xs;
      top: 0;
      line-height: 54px;
      opacity: 0.25;
      font-size: $font-size-sm;
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