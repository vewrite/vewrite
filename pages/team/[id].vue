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
      <div class="team-overview" v-if="TeamData && !loading">
        <div class="team-summary">
          <input class="team-title-input" v-model="team.name" @input="updateTeamWithDebounce(team.id, $event.target.value)" />
          <span>Click to edit</span>
        </div>
      </div>
      <div class="team-management inner-container" v-if="!loading && TeamData">
        <div class="max-width md max-height">

          <div class="add-member-box">
            <div class="form-input">
              <label for="email">Email</label>
              <input v-model="member.email" id="email" type="email" placeholder="Input team member email address" @input="fetchProfileViaEmail(member.email)" />
            </div>

            <!-- TODO BUG - There's a bug here where you can add the same profile multiple times -->
            <div class="profile-result-header" v-if="ProfileData">
              <p>Profile found</p>
            </div>
            <div class="profile-result" v-if="ProfileData">
              <div class="profile-info">
                <div class="profile-image">
                  <Avatar :uuid="ProfileData.id" size="large" />
                </div>
                <p>{{ ProfileData.username }}</p>
              </div>
              <div class="button primary" @click="addTeamMember(member)">
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path fill-rule="evenodd" clip-rule="evenodd" d="M7.23233 1.20415C7.23233 0.914077 6.99718 0.678925 6.7071 0.678925C6.41702 0.678925 6.18187 0.914077 6.18187 1.20415V6.62122L0.764822 6.62122C0.474747 6.62122 0.239594 6.85637 0.239594 7.14644C0.239593 7.43652 0.474747 7.67167 0.764822 7.67167L6.18187 7.67167L6.18187 13.0887C6.18187 13.3788 6.41702 13.614 6.7071 13.614C6.99718 13.614 7.23233 13.3788 7.23233 13.0887L7.23233 7.67167L12.6494 7.67167C12.9395 7.67167 13.1746 7.43652 13.1746 7.14645C13.1746 6.85637 12.9395 6.62122 12.6494 6.62122L7.23233 6.62122V1.20415Z" fill="#fff"/>
                </svg>
                Add to team
              </div>
            </div>
            <span class="notification error" v-if="TeamMembersError">{{ TeamMembersError }}</span>
          </div>

          <section v-if="teamMembers.length > 0">
            <div class="members-list">
              <h3>Team members</h3>
              <div class="member" v-for="member in teamMembers" :key="member.user_id">
                <Profilecard :uuid="member.user_id">
                  <template v-slot:actions>
                    <div class="button red" @click="deleteTeamMember(member.user_id)">
                      <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path fill-rule="evenodd" clip-rule="evenodd" d="M11.5 6C11.5 6.27614 11.2761 6.5 11 6.5L1 6.5C0.723858 6.5 0.5 6.27614 0.5 6C0.5 5.72386 0.723858 5.5 1 5.5L11 5.5C11.2761 5.5 11.5 5.72386 11.5 6Z" fill="#FF0000"/>
                      </svg>
                      Remove
                    </div>  
                  </template>
                </Profilecard>
              </div>
            </div>
          </section>

          <div class="empty-state" v-else>
            <h3>No members</h3>
            <p>You haven't invited anyone to this team yet</p>
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
const teamId = route.params.id;

console.log('Team ID is: ', teamId);

import useProfile from '~/composables/useProfile';
const { fetchProfileViaEmail, ProfileData, ProfileError } = useProfile();

import useTeam from '~/composables/useTeam';
const { fetchSingleTeam, updateTeam, TeamData, deleteTeamModal } = useTeam();

import useTeamMembers from '~/composables/useTeamMembers';
const { fetchTeamMembers, addTeamMember, deleteTeamMember, TeamMembersData, TeamMembersError } = useTeamMembers();

// Set some sane defaults for the client object
const teamMembers = ref([]);

const member = reactive({
  email: '',
  team_id: teamId,
  user_id: null
})

watch(() => ProfileData.value, (value) => {
  if (value) {
    member.user_id = value.id;
  }
});

// Fetch the team data when the component is mounted
onMounted(async () => {
  try {
    const subscription = supabase
      .from('team_members')
      .on('INSERT', payload => {
        console.log('New team member:', payload.new);
        console.log('Team members:', teamMembers.value);
        teamMembers.value.push(payload.new);
        // Reset the search input ProfileData
        ProfileData.value = null;
      })
      .on('DELETE', payload => {
        console.log('Deleted team member:', payload.old);
        teamMembers.value = teamMembers.value.filter(member => member.id !== payload.old.id);
      })
      .subscribe();

    onUnmounted(() => {
      supabase.removeSubscription(subscription);
    });
    
    await fetchSingleTeam(teamId);
    team.value = TeamData.value[0];

    // Team members
    teamMembers.value = await fetchTeamMembers(teamId);

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
  padding: $spacing-sm;
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
  align-items: flex-start;
  gap: $spacing-sm;
  width: 100%;
  padding: $spacing-md;
  border-radius: $br-md;
  background-color: $white;
  height: 100%;

  .add-member-box {

    .profile-result-header {
      padding: $spacing-xxs $spacing-sm;
      background: rgba($mint, 0.2);
      margin-top: $spacing-sm;
      border-radius: $br-md $br-md 0 0;

      p {
        font-size: $font-size-xs;
        margin: 0;
        color: $mint;
      }
    }

    .profile-result {
      display: flex;
      flex-direction: row;
      padding: $spacing-sm;
      border-radius: 0 0 $br-md $br-md;
      align-items: center;
      justify-content: space-between;
      background: rgba($mint, 0.1);

      .profile-info {
        display: flex;
        flex-direction: row;
        align-items: center;
        gap: $spacing-sm;


        p {
          font-size: $font-size-sm;
          margin: 0;
        }
      }
    }

    .form-input {
      margin: 0;
    }
  }

  .members-list {
    margin-top: $spacing-md;
    border-top: 1px dashed rgba($black, 0.1);
    padding-top: $spacing-sm;
  }

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
}

</style>