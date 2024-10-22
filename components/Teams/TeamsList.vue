<template>
  <main id="Teams">
    <Loading v-if="loading" />

    <div class="search-bar" v-if="!loading">
      <input type="text" placeholder="Search teams" v-model="searchQuery" />
    </div>

    <!-- Empty state -->
    <div class="empty-state" v-if="TeamData && TeamData.length === 0 && !loading">
      <img src="/images/clients-empty-state.svg" alt="No teams found" />
      <h3>You haven’t created a team yet</h3>
      <p>That’s ok, It’s easy and we’ll do it together</p>
    </div>

    <!-- Team list -->
    <div class="teams-list inner-container" v-if="!loading && TeamData.length > 0">
      <router-link :to="'/team/' + team.id" class="team-card" v-for="team in filteredTeams" :key="team.id">
      <!-- <div v-for="team in filteredTeams" :key="team.id"> -->
        <h3>{{ team.name }}</h3>
        <!-- <div class="button red" @click="deleteTeam(team.id)">Delete team</div> -->
      <!-- </div> -->
      </router-link>
    </div>
  </main>
</template>

<script setup>

import { onMounted, ref } from 'vue'

// Fetch teams
const supabase = useSupabaseClient()
const user = useSupabaseUser()
const teams = ref([])
const loading = ref(true)
const searchQuery = ref('')
const GroupId = '3b119f52-06e6-42a1-ad76-dd763d36126b'


// Team composable
import useTeam from '~/composables/useTeam';
const { fetchTeams, deleteTeam, TeamData } = useTeam();

onMounted(async () => {
  try {
    await fetchTeams(GroupId)
  } catch (error) {
    console.error('Failed to fetch teams:', error)
  } finally {
    loading.value = false
  }
  
})

const filteredTeams = computed(() => {
  if (!searchQuery.value) {
    return TeamData.value
  }
  return TeamData.value.filter(team =>
    team.name.toLowerCase().includes(searchQuery.value.toLowerCase())
  )
})

</script>

<style lang="scss" scoped>

@import 'assets/_variables.scss';

#Teams {
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 100%;

  .empty-state {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 100%;

    img {
      width: 200px;
    }

    h3 {
      font-size: $font-size-lg;
      font-family: $font-family-secondary;
      font-weight: 500;
      margin: $spacing-md 0 0;
    }

    p {
      font-size: $font-size-sm;
      font-weight: 400;
      margin: $spacing-sm 0 $spacing-md;
      color: $gray-dark;
    }

  }

  .teams-list {
    display: flex;
    flex-direction: column;
    gap: $spacing-sm;
    align-items: flex-start;
    width: 100%;
    overflow-y: auto;
    background-color: $white;
    height: calc(100% - 60px);
    padding: $spacing-sm;

    a {
      display: flex;
      flex-direction: row;
      align-items: center;
      gap: $spacing-sm;
      text-decoration: none;
      width: 100%;
      padding: $spacing-xxs;
      border-radius: $br-md;
      transition: all 0.2s ease;

      &:hover {
        background-color: rgba($brand, 0.05);
      }

      .image-wrapper {
        border-radius: $br-md;
        overflow: hidden;
        background-color: $gray-light;
        display: flex;
        justify-content: center;
        align-items: center;

        img {
          width: auto;
          height: 100%;
        }

      }
      
      h3 {
        font-size: $font-size-md;
        font-family: $font-family-main;
        font-weight: 500;
        color: $black;
        margin: 0;
      }
    }
  }
}

</style>