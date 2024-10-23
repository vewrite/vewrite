<template>
  <AppPanel>
    <template v-slot:header>
      <router-link to="/teams/" class="button">Back</router-link>
      <div></div>
    </template>
    <template v-slot:body>
      <Loading v-if="loading" />
      <div class="team-overview" v-if="TeamData && !loading">
        <div class="team-summary">
          <input class="team-title-input" v-model="team.name" @input="updateTeamWithDebounce(team.id, $event.target.value)" />
          <!-- <h2>{{ TeamData[0].name }}</h2> -->
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
const teamId = route.params.id;

console.log('Team ID is: ', teamId);

import useTeam from '~/composables/useTeam';
const { fetchSingleTeam, updateTeam, TeamData } = useTeam();

// Fetch the team data when the component is mounted
onMounted(async () => {
  try {
    await fetchSingleTeam(teamId);
    team.value = TeamData.value[0];
    console.log('Team data:', team.value);
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
  width: calc(100%);
  padding: $spacing-md;
  border-radius: $br-md;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  gap: $spacing-md;
  height: 140px;

  .team-summary {
    display: flex;
    flex-direction: column;
    gap: 2px;
    width: 50%;

    .team-title-input {
      font-family: $font-family-secondary;
      font-size: $font-size-lg;
      font-weight: 500;
      margin: 0 -0.85rem;
      background-color: transparent;
      width: 100%;
      padding: $spacing-xs;

      &:focus,
      &:active {
        border: 1px solid $brand;
        background: $white;
      }
    }

  }
}

</style>