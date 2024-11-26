<template>
  <AppPanel>
    <template v-slot:header>
      <router-link to="/teams/" class="button">
        <Icon name="fluent:chevron-left-16-regular" size="1rem" />
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
      <div class="object-overview" v-if="TeamData && !loading">
        <div class="object-summary">
          <input class="object-title-input" v-model="team.name" @input="updateTeamWithDebounce(team.id, $event.target.value)" />
          <span>Click to edit</span>
        </div>
      </div>
      <div class="team-management" v-if="!loading && TeamData">

          <div class="add-member-box max-width lg">
            <div class="form-input">
              <label for="email">Email</label>
              <input v-model="member.email" id="email" type="email" placeholder="Add a team member via email address" autocomplete="off" @input="handleInput" />
            </div>
            <span class="notification error" v-if="TeamMembersError">{{ TeamMembersError }}</span>
          </div>
          
          <!-- CASE: We find an email address match -->
          <div class="profile-result max-width lg" v-if="ProfileData && ProfileData.id" :class="ProfileData && ProfileData.id ? 'active' : ''">
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
          <div class="profile-result max-width lg" v-if="ProfileData && !ProfileData.id" :class="ProfileData && !ProfileData.id ? 'active' : ''">
            <div class="profile-info">
              {{ ProfileData.email }}
              <div class="profile-deny">Unknown user email</div>
            </div>
            <div class="button primary" @click="inviteToVewrite(member.email)">
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path fill-rule="evenodd" clip-rule="evenodd" d="M7.23233 1.20415C7.23233 0.914077 6.99718 0.678925 6.7071 0.678925C6.41702 0.678925 6.18187 0.914077 6.18187 1.20415V6.62122L0.764822 6.62122C0.474747 6.62122 0.239594 6.85637 0.239594 7.14644C0.239593 7.43652 0.474747 7.67167 0.764822 7.67167L6.18187 7.67167L6.18187 13.0887C6.18187 13.3788 6.41702 13.614 6.7071 13.614C6.99718 13.614 7.23233 13.3788 7.23233 13.0887L7.23233 7.67167L12.6494 7.67167C12.9395 7.67167 13.1746 7.43652 13.1746 7.14645C13.1746 6.85637 12.9395 6.62122 12.6494 6.62122L7.23233 6.62122V1.20415Z" fill="#fff"/>
              </svg>
              Invite to team
            </div>
          </div>

          <section class="members-table">

            <section v-if="teamMembers.length > 0" class="members-list max-width lg">
              <h4>Current team members</h4>
              <div class="member-wrap">
                <div class="member" v-for="member in teamMembers" :key="member.user_id">
                  <ProfileCard :uuid="member.user_id" type="list" :team="TeamData.id">
                    <template v-slot:actions>
                      <div class="button red" @click="deleteTeamMember(member.user_id)">
                        <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path fill-rule="evenodd" clip-rule="evenodd" d="M11.5 6C11.5 6.27614 11.2761 6.5 11 6.5L1 6.5C0.723858 6.5 0.5 6.27614 0.5 6C0.5 5.72386 0.723858 5.5 1 5.5L11 5.5C11.2761 5.5 11.5 5.72386 11.5 6Z" fill="#FF0000"/>
                        </svg>
                        Remove
                      </div>  
                    </template>
                  </ProfileCard>
                </div>
              </div>
            </section>

            <section v-if="invitedMembers.length > 0" class="members-list max-width lg">
              <h4>Invited team members</h4>
              <div class="member-wrap invited-members">
                <div class="member" v-for="member in invitedMembers" :key="member.user_id">
                  {{ member.email }}
                  <div class="button red" @click="deleteInvitedMember(member.email, member.team_id)">
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path fill-rule="evenodd" clip-rule="evenodd" d="M11.5 6C11.5 6.27614 11.2761 6.5 11 6.5L1 6.5C0.723858 6.5 0.5 6.27614 0.5 6C0.5 5.72386 0.723858 5.5 1 5.5L11 5.5C11.2761 5.5 11.5 5.72386 11.5 6Z" fill="#FF0000"/>
                    </svg>
                    Remove
                  </div>  
                </div>
              </div>
            </section>

            <div class="empty-state" v-if="teamMembers.length == 0 && invitedMembers.length == 0">
              <h3>No members</h3>
              <p>You haven't invited anyone to this team yet</p>
            </div>

          </section>
        </div>

    </template>
  </AppPanel>
</template>

<script setup>

definePageMeta({
  layout: 'default',
  middleware: ['auth'],
});

import { useRoute } from 'vue-router';
import AppPanel from '~/components/AppPanel.vue';

const supabase = useSupabaseClient();
const loading = ref(true);
const route = useRoute();
const team = ref(null);
const teamId = route.params.id;

// console.log('Team ID is: ', teamId);

import useProfile from '~/composables/useProfile';
const { fetchProfileViaEmail, createInvitedProfile, ProfileData, ProfileError } = useProfile();

import useTeam from '~/composables/useTeam';
const { fetchSingleTeam, updateTeam, TeamData, deleteTeamModal } = useTeam();

import useTeamMembers from '~/composables/useTeamMembers';
const { fetchTeamMembers, fetchInvitedTeamMembers, addTeamMember, deleteTeamMember, deleteInvitedMember, InvitedTeamMembersData, InvitedTeamMembersError, TeamMembersData, TeamMembersError } = useTeamMembers();

const teamMembers = ref([]);
const invitedMembers = ref([]);

const member = reactive({
  email: '',
  team_id: teamId,
  user_id: null
})

// TODO - this will need to be improved to deal with multiple team invitations
const invited_profile = reactive({
  email: member.email,
  team_id: teamId,
})

const inviteToVewrite = async (email) => {
  console.log('Inviting user by email:', member.email);
  
  invited_profile.email = email;

  try {
    const { error } = await supabase.auth.signIn({ 
      email: email 
    })

    await createInvitedProfile(invited_profile);

    if (error) throw error
  } catch (error) {
    console.error('Error inviting user:', error.message);
  }
}

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
    const members_subscription = supabase
      .from('team_members')
      .on('UPDATE', payload => {
        console.log('Team member updated:', payload.new);
        teamMembers.value = teamMembers.value.map(member => {
          if (member.user_id === payload.new.user_id) {
            return payload.new;
          }
          return member;
        });
      })
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

    const invited_subscription = supabase
      .from('invited_profiles')
      .on('INSERT', payload => {
        console.log('New invited member:', payload.new);
        console.log('Invited members:', invitedMembers.value);
        invitedMembers.value.push(payload.new);
        // Reset the search input ProfileData
        ProfileData.value = null;
      })
      .on('DELETE', payload => {
        console.log('Deleted invited member:', payload.old);
        invitedMembers.value = invitedMembers.value.filter(member => member.id !== payload.old.id);
      })
      .subscribe();

    onUnmounted(() => {
      supabase.removeSubscription(members_subscription);
      supabase.removeSubscription(invited_subscription);
    });
    
    await fetchSingleTeam(teamId);
    team.value = TeamData.value;

    // Team members
    teamMembers.value = await fetchTeamMembers(teamId);
    invitedMembers.value = await fetchInvitedTeamMembers(teamId);

    loading.value = false;
  } catch (error) {
    console.error(error);
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

@use 'assets/variables' as *;

.team-management {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  width: 100%;
  border-radius: $br-md;
  height: 100%;
  position: relative;
  padding: 0 $spacing-sm;

  .add-member-box {
    background: $white;
    border: $border;
    border-radius: $br-lg;
    width: 100%;
    box-shadow: $soft-shadow;
    margin: $spacing-sm auto 0;
    z-index: 1;

    h4 {
      margin: $spacing-md $spacing-md 0;
      color: $brand;
    }
    
    .form-input {
      margin: $spacing-sm;
      width: calc(100% - $spacing-sm * 2);
    }
  }

  @keyframes showResult {
    0% {
      top: -6rem;
    }
    100% {
      top: -3rem;
    }
  }

  .profile-result {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    background: rgba($brand, 0.05) linear-gradient(to bottom, rgba($brand, 0.5) 0%, rgba($brand, 0) 50%);
    overflow: hidden;
    padding: 0 $spacing-sm $spacing-sm $spacing-sm;
    border-radius: 0 0 $br-lg $br-lg;
    top: -8rem;
    z-index: 0;
    position: relative;
    transition: all 0.3s ease;

    &.active {
      animation: showResult 0.45s ease forwards;
      padding: $spacing-lg $spacing-sm $spacing-sm $spacing-sm;
    }

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

  .members-table {
    width: 100%;
  }

  .members-list {
    display: flex;
    flex-direction: column;
    gap: 0;
    width: 100%;

    h4 {
      margin-bottom: -15px;
      font-size: $font-size-sm;
      color: rgba($black, 0.65);
      padding: $spacing-sm $spacing-sm $spacing-md $spacing-sm;
      background: rgba($gray-light, 0.25);
      border-radius: $br-lg $br-lg 0 0;
    }

    .member-wrap {
      border-radius: $br-lg;
      border: $border;
      background: $white;
      box-shadow: $soft-shadow;

      &.invited-members {
        
        .member {
          display: flex;
          flex-direction: row;
          justify-content: space-between;
          padding: $spacing-sm;
        }
      }

      .member {
        border-bottom: $border;

        &:last-child {
          border-bottom: 0;

          .profile-card {
            border-radius: 0 0 $br-sm $br-sm;
          }
        }
      }
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