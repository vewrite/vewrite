<template>
  <AppPanel>
    <template v-slot:header>
      <router-link to="/teams/" class="button">Back</router-link>
      <div class="app-panel-header" v-if="team">
        <Loading type="header" v-if="loading" />
        <span v-else>{{ team.name }}</span>
      </div>
      <div class="app-panel-header-buttons">
        <!-- <router-link :to="`/team/${teamId}/delete`" class="button primary">Delete</router-link> -->
      </div>
    </template>
    <template v-slot:body>
      <Loading v-if="loading" />
      <div class="team-overview" v-if="TeamData && !loading">
        <div class="team-summary">
          <h2>{{ TeamData[0].name }}</h2>
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

// Get the route object
const route = useRoute();

// Extract the team ID from the route parameters
const teamId = route.params.id;

console.log('Team ID is: ', teamId);

import useTeam from '~/composables/useTeam';
const { fetchSingleTeam, TeamData } = useTeam();

// Fetch the team data from supabase
const team = ref(null);
const creator = ref(null);

// Modal
import { useModal } from '~/stores/modal';
const modal = useModal();

// async function getteam(id) {
//   try {
//     const { data, error } = await supabase
//       .from('teams')
//       .select('*')
//       .eq('id', id)
//       .single();

//     if (error) throw error;

//     team.value = data;

//     // Cool, now go get the creator data
//     getCreator(team.value.created_by);

//   } catch (error) {
//     alert(error.message);
//   }
// }

// async function getCreator(uuid) {
//   try {
//     const { data, error } = await supabase
//       .from('profiles')
//       .select('username')
//       .eq('id', uuid)
//       .single();

//     if (error) throw error;

//     creator.value = data;
//   } catch (error) {
//     alert(error.message);
//   }
// }

// const edit = () => {
//   modal.visible = 1;
// };

// Fetch the team data when the component is mounted
onMounted(async () => {
  // getteam(teamId);
  // fetchSingleTeam(teamId);
  // team.value = fetchSingleTeam(teamId);
  // loading.value = false;

  try {
    await fetchSingleTeam(teamId);
    loading.value = false;
  } catch (error) {
    alert(error.message);
  }
});

</script>

<style scoped>
/* Your styles here */
</style>