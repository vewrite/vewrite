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
      <router-link :to="'/team/' + team.id" class="team-card max-width md" v-for="team in filteredTeams" :key="team.id">
        
        <!-- {{ team }} -->
        <span class="notification error" v-if="TeamError">{{ TeamError }}</span>
        <span class="notification error" v-if="GroupError">{{ GroupError }}</span>
        <div class="team-info">
          <div class="members" v-if="team.members.length > 0">
            <div class="members-image" v-for="member in team.members" :key="member.id">
              <Avatar :uuid="member.user_id" size="large" />
            </div>
          </div>
          <div class="members-image" v-else>
            <img src="/images/team-default.svg" alt="Team avatar" />
          </div>
          <p>{{ team.name }}</p>
        </div>
        <div class="team-stats">
          <span class="team-details">
            <span>{{ team.members.length }} members</span>
            <span>{{ team.projects.length }} projects</span>
          </span>
          <svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-arrow-right" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
            <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
            <line x1="15" y1="8" x2="19" y2="12" />
            <line x1="15" y1="16" x2="19" y2="12" />
          </svg>
        </div>
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

// Team composable
import useTeam from '~/composables/useTeam';
const { fetchTeams, deleteTeam, TeamData, TeamError } = useTeam();

// Group composable
import useGroup from '~/composables/useGroup';
const { fetchGroupId, GroupData, GroupError } = useGroup();

onMounted(async () => {
  try {

    // Fetch group ID
    await fetchGroupId(user.value.id)

    const subscription = supabase
      .from('teams')
      .on('INSERT', payload => {
        console.log('New team:', payload.new);
        teams.value.push(payload.new);
        fetchTeams(GroupData.value.id);
      })
      .subscribe();

    onUnmounted(() => {
      supabase.removeSubscription(subscription);
    });

    await fetchTeams(GroupData.value.id)

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
    padding: $spacing-md $spacing-sm;

    .team-card {
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: space-between;
      gap: $spacing-sm;
      text-decoration: none;
      width: 100%;
      padding: $spacing-sm;
      border-radius: $br-md;
      transition: all 0.2s ease;
      border: 1px solid $gray-light;

      &:hover {
        border: 1px solid $brand;

        p {
          color: $brand;
        }
      }

      .team-info {
        display: flex;
        flex-direction: row;
        align-items: center;
        gap: $spacing-sm;

        .members {
          display: block;
          position: relative;
          width: 70px;
          height: 40px;

          .members-image {
            position: absolute;
            display: none;
            border-radius: $br-xl;

            .user-avatar {
              border: 2px solid $white;
            }

            &:nth-child(1) {
              z-index: 3;
              left: 0px;
              top: 0px;
              display: block;
            }

            &:nth-child(2) {
              z-index: 2;
              left: 15px;
              top: 0px;
              display: block;
            }

            &:nth-child(3) {
              z-index: 1;
              left: 30px;
              top: 0px;
              display: block;
            }
          }
        }
      }

      .team-stats {
        display: flex;
        flex-direction: row;
        align-items: center;
        gap: $spacing-sm;
        color: $gray-dark;

        .team-details {
          display: flex;
          flex-direction: row;
          align-items: center;
          gap: $spacing-xs;
        }
      }
      
      p {
        color: $black;
        margin: 0;
      }
    }
  }
}

</style>