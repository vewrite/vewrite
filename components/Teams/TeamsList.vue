<template>
  <main id="Teams">

    <Loading v-if="loading" />

    <div class="search-bar" v-if="!loading">
      <input type="text" placeholder="Search teams" v-model="searchQuery" />
      <div class="list-buttons">
        <button :class="['list-icon', viewMode == 'grid' ? 'active' : '']" @click="listToggle">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M10.5 18L10.5 15C10.5 14.1716 9.82843 13.5 9 13.5L5 13.5C4.17157 13.5 3.5 14.1716 3.5 15L3.5 18C3.5 18.8284 4.17157 19.5 5 19.5L9 19.5C9.82843 19.5 10.5 18.8284 10.5 18Z" stroke="black" stroke-opacity="0.3" stroke-linecap="round"/>
            <path d="M20.5 18L20.5 15C20.5 14.1716 19.8284 13.5 19 13.5L15 13.5C14.1716 13.5 13.5 14.1716 13.5 15L13.5 18C13.5 18.8284 14.1716 19.5 15 19.5L19 19.5C19.8284 19.5 20.5 18.8284 20.5 18Z" stroke="black" stroke-opacity="0.3" stroke-linecap="round"/>
            <path d="M10.5 9L10.5 6C10.5 5.17157 9.82843 4.5 9 4.5L5 4.5C4.17157 4.5 3.5 5.17157 3.5 6L3.5 9C3.5 9.82843 4.17157 10.5 5 10.5L9 10.5C9.82843 10.5 10.5 9.82843 10.5 9Z" stroke="black" stroke-opacity="0.3" stroke-linecap="round"/>
            <path d="M20.5 9L20.5 6C20.5 5.17157 19.8284 4.5 19 4.5L15 4.5C14.1716 4.5 13.5 5.17157 13.5 6L13.5 9C13.5 9.82843 14.1716 10.5 15 10.5L19 10.5C19.8284 10.5 20.5 9.82843 20.5 9Z" stroke="black" stroke-opacity="0.3" stroke-linecap="round"/>
          </svg>
        </button>
        <button :class="['list-icon', viewMode == 'list' ? 'active' : '']" @click="listToggle">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M4 5H20" stroke="black" stroke-opacity="0.3" stroke-linecap="round"/>
            <path d="M4 19H20" stroke="black" stroke-opacity="0.3" stroke-linecap="round"/>
            <path d="M4 12H20" stroke="black" stroke-opacity="0.3" stroke-linecap="round"/>
          </svg>
        </button>
      </div>
    </div>

    <!-- Empty state -->
    <div class="empty-state" v-if="TeamsData && TeamsData.length === 0 && !loading">
      <img src="/images/clients-empty-state.svg" alt="No teams found" />
      <h3>You haven’t created a team yet</h3>
      <p>That’s ok, It’s easy and we’ll do it together</p>
    </div>

    <!-- Team list -->
    <div :class="['teams-list', viewMode]" v-if="!loading && TeamsData.length > 0">
      <router-link :to="'/team/' + team.id" class="team-card" v-for="team in filteredTeams" :key="team.id">  
        <span class="notification error" v-if="TeamsError">{{ TeamsError }}</span>
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

const viewMode = ref('grid');

const listToggle = () => {
  viewMode.value = viewMode.value === 'grid' ? 'list' : 'grid';
};

// Team composable
import useTeam from '~/composables/useTeam';
const { fetchTeams, deleteTeam, TeamsData, TeamsError } = useTeam();

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
    return TeamsData.value
  }
  return TeamsData.value.filter(team =>
    team.name.toLowerCase().includes(searchQuery.value.toLowerCase())
  )
})

</script>

<style lang="scss" scoped>

@use 'assets/variables' as *;

@keyframes cardAppear {
  0% {
    opacity: 0;
    transform: scale(0.9);
  }
  100% {
    opacity: 1;
    transform: scale(1);
  }
}

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
    width: 100%;
    overflow-y: auto;
    height: calc(100% - 60px);

    &.grid {
      display: grid;
      grid-template-columns: repeat(5, 1fr);
      gap: $spacing-sm;
      width: 100%;
      padding: $spacing-sm;
      align-content: flex-start;

      @media (max-width: 1800px) {
        grid-template-columns: repeat(4, 1fr);
      }

      @media (max-width: 1600px) {
        grid-template-columns: repeat(3, 1fr);
      }

      @media (max-width: 1200px) {
        grid-template-columns: repeat(2, 1fr);
      }

      @media (max-width: 768px) {
        grid-template-columns: 1fr;
      }

      .team-card {
        padding: $spacing-md;
        background-color: $white;
        border-radius: $br-md;
        border: $border;
        text-decoration: none;
        color: $black;
        position: relative;
        overflow: hidden;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        transition: border, transform 0.18s ease;
        animation: cardAppear 0.2s ease;
        animation-fill-mode: forwards;
        animation-delay: 0s;
        opacity: 0;
        transform: scale(0.9);
        box-shadow: $soft-shadow;

        $project-cards: ();

        @for $i from 0 through 60 {
          &:nth-child(#{$i}) {
            animation-delay: #{$i * .1}s;
          }
        }

        &:hover {
          border: 1px solid rgba($brand, 1);
          transform: scale(1.05);
        }

        .team-info {
          display: flex;
          flex-direction: row-reverse;
          align-items: flex-start;
          gap: $spacing-sm;
          justify-content: space-between;

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
                right: 0px;
                top: 0px;
                display: block;
              }

              &:nth-child(2) {
                z-index: 2;
                right: 15px;
                top: 0px;
                display: block;
              }

              &:nth-child(3) {
                z-index: 1;
                right: 30px;
                top: 0px;
                display: block;
              }
            }
          }

          p {
            font-size: $font-size-sm;
            font-weight: bold;
            margin: 0;
            text-wrap: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
          }
        }

        .team-stats {
          display: flex;
          flex-direction: row;
          align-items: center;
          justify-content: space-between;
          gap: $spacing-sm;
          color: $gray-dark;

          svg {
            display: none;
          }

          .team-details {
            display: flex;
            flex-direction: row;
            align-items: center;
            gap: $spacing-xs;
          }
        }

        p {
          font-size: $font-size-sm;
        }

        
      }
    }

    &.list {
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      flex-direction: column;
      gap: $spacing-xxs;
      padding: $spacing-sm;

      .team-card {
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: space-between;
        gap: $spacing-xxs;
        text-decoration: none;
        width: 100%;
        padding: $spacing-sm;
        background-color: $white;
        border: $border;
        border-radius: $br-md;
        transition: border, transform 0.18s ease;
        animation: cardAppear 0.2s ease;
        animation-fill-mode: forwards;
        animation-delay: 0s;
        opacity: 0;
        transform: scale(0.9);
        box-shadow: $soft-shadow;

        $project-cards: ();

        @for $i from 0 through 60 {
          &:nth-child(#{$i}) {
            animation-delay: #{$i * .1}s;
          }
        }

        &:hover {
          border: 1px solid $brand;

          p {
            color: $brand;
          }
        }

        .team-info {
          display: flex;
          flex-direction: row-reverse;
          align-items: center;
          justify-content: space-between;
          gap: $spacing-sm;
          width: 100%;

          .members-image {
            width: 70px;
          }

          p {
            font-size: $font-size-sm;
            font-weight: bold;
            margin: 0;
          }

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
            gap: $spacing-md;
            text-wrap: nowrap;
          }
        }
        
        p {
          color: $black;
          margin: 0;
        }
      }
    }


  }
}

</style>