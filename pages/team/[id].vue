<template>
  <AppPanel>
    <template v-slot:header>
      <router-link to="/teams/" class="button">
        <svg width="12" height="10" viewBox="0 0 12 10" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path fill-rule="evenodd" clip-rule="evenodd" d="M5.35356 1.35355C5.54882 1.15829 5.54882 0.841705 5.35356 0.646443C5.1583 0.451181 4.84172 0.451181 4.64645 0.646443L1.35356 3.93934C0.767773 4.52512 0.767774 5.47487 1.35356 6.06066L4.64645 9.35355C4.84172 9.54881 5.1583 9.54881 5.35356 9.35355C5.54882 9.15829 5.54882 8.84171 5.35356 8.64644L2.20711 5.5L11.5 5.5C11.7761 5.5 12 5.27614 12 5C12 4.72385 11.7761 4.5 11.5 4.5L2.20711 4.5L5.35356 1.35355Z" fill="black"/>
        </svg>
        Back
      </router-link>
      <Dropdown>
        <template v-slot:trigger>
          <svg width="2" height="10" viewBox="0 0 2 10" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path fill-rule="evenodd" clip-rule="evenodd" d="M2 1C2 1.55228 1.55228 2 1 2C0.447715 2 0 1.55228 0 1C0 0.447715 0.447715 0 1 0C1.55228 0 2 0.447715 2 1ZM2 5C2 5.55228 1.55228 6 1 6C0.447715 6 0 5.55228 0 5C0 4.44772 0.447715 4 1 4C1.55228 4 2 4.44772 2 5ZM1 10C1.55228 10 2 9.55229 2 9C2 8.44771 1.55228 8 1 8C0.447715 8 0 8.44771 0 9C0 9.55229 0.447715 10 1 10Z" fill="black"/>
          </svg>
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
            <h4>Add team members</h4>
            <div class="form-input">
              <label for="email">Email</label>
              <input v-model="member.email" id="email" type="email" placeholder="Input team member email address" @input="handleInput" />
            </div>

            <!-- CASE: We find an email address match -->
            <div class="profile-result" v-if="ProfileData && ProfileData.id">
              <div class="profile-info">
                <div class="profile-image">
                  <Avatar :uuid="ProfileData.id" size="large" />
                </div>
                <p>{{ ProfileData.username }}</p>
              </div>
              <div class="button primary" @click="addTeamMember(member)" v-if="checkDuplicate(ProfileData.id)">
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path fill-rule="evenodd" clip-rule="evenodd" d="M7.23233 1.20415C7.23233 0.914077 6.99718 0.678925 6.7071 0.678925C6.41702 0.678925 6.18187 0.914077 6.18187 1.20415V6.62122L0.764822 6.62122C0.474747 6.62122 0.239594 6.85637 0.239594 7.14644C0.239593 7.43652 0.474747 7.67167 0.764822 7.67167L6.18187 7.67167L6.18187 13.0887C6.18187 13.3788 6.41702 13.614 6.7071 13.614C6.99718 13.614 7.23233 13.3788 7.23233 13.0887L7.23233 7.67167L12.6494 7.67167C12.9395 7.67167 13.1746 7.43652 13.1746 7.14645C13.1746 6.85637 12.9395 6.62122 12.6494 6.62122L7.23233 6.62122V1.20415Z" fill="#fff"/>
                </svg>
                Add to team
              </div>
              <div class="profile-deny" v-else>Already added to this team</div>
            </div>

            <!-- CASE: We don't find an email address match -->
            <div class="profile-result" v-if="ProfileData && !ProfileData.id">
              <div class="profile-info">
                {{ ProfileData.email }}
                <div class="profile-deny">Unknown user email</div>
              </div>
              <div class="button primary" @click="addTeamMember(member)" v-if="checkDuplicate(ProfileData.id)">
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path fill-rule="evenodd" clip-rule="evenodd" d="M7.23233 1.20415C7.23233 0.914077 6.99718 0.678925 6.7071 0.678925C6.41702 0.678925 6.18187 0.914077 6.18187 1.20415V6.62122L0.764822 6.62122C0.474747 6.62122 0.239594 6.85637 0.239594 7.14644C0.239593 7.43652 0.474747 7.67167 0.764822 7.67167L6.18187 7.67167L6.18187 13.0887C6.18187 13.3788 6.41702 13.614 6.7071 13.614C6.99718 13.614 7.23233 13.3788 7.23233 13.0887L7.23233 7.67167L12.6494 7.67167C12.9395 7.67167 13.1746 7.43652 13.1746 7.14645C13.1746 6.85637 12.9395 6.62122 12.6494 6.62122L7.23233 6.62122V1.20415Z" fill="#fff"/>
                </svg>
                Invite to team
              </div>
            </div>

            <span class="notification error" v-if="TeamMembersError">{{ TeamMembersError }}</span>
          </div>

          <section v-if="teamMembers.length > 0">
            <div class="members-list">
              <h4>Current team members</h4>
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

function checkDuplicate(id) {
  return !teamMembers.value.some(member => member.user_id === id);
}

function handleInput(event) {
  const email = event.target.value;
  if (email === '') {
    clearProfileData();
  } else {
    fetchProfileViaEmail(email);
  }
}

function clearProfileData() {
  ProfileData.value = null;
  ProfileError.value = null;
}

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
  background-color: $white;
  border-bottom: $border;

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
  height: 100%;

  .add-member-box {
    border-radius: $br-lg;
    background: rgba($brand, 0) linear-gradient(to bottom, rgba($brand, 0.05) 40%, rgba($brand, 0.15) 100%);
    border: 1px solid rgba($brand, 0.15);
    transition: all 0.2s ease;

    &:active,
    &:focus,
    &:hover {
      border: 1px solid rgba($brand, 0.15);
    }

    .form-input {
      margin: $spacing-sm;
      width: calc(100% - $spacing-md);
    }

    h4 {
      margin: $spacing-sm $spacing-sm 0;
      color: $brand;
    }

    .profile-result {
      display: flex;
      flex-direction: row;
      padding: $spacing-sm $spacing-sm $spacing-xs $spacing-sm;
      align-items: center;
      justify-content: space-between;
      background-color: $white;
      border-top: $border;
      overflow: hidden;
      border-radius: 0 0 $br-lg $br-lg;
      margin-top: $spacing-sm;

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

      .profile-deny {
        font-size: $font-size-xs;
        color: $gray-dark;
      }
    }
  }

  .members-list {
    padding-top: $spacing-sm;
    display: flex;
    flex-direction: column;
    gap: $spacing-xxs;

    h4 {
      margin-bottom: $spacing-sm;
    }
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