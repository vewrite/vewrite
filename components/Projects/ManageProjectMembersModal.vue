<template>
  <div id="ManageProjectMembersModal">
    <div class="modal-body">

      <Loading v-if="loading" class="loading" type="small" />
      
      <form v-if="!loading" @submit.prevent="updateProjectMembers(projectId)">
        <section class="form-row">
          <div class="inner-container">
            <div class="form-block">
              <div class="form-content-full">
                <section class="team-assignment">

                  <!-- Input to add a new member to the team -->
                  <div class="form-input add-member">
                    <label for="newMember">Invite member</label>
                    <input v-model="newMember.email" id="newMember" type="text" placeholder="Email address" autocomplete="off" @input="debounceInput" />
                    <div class="form-hint">
                      <Icon name="fluent:person-20-regular" size="2rem" /> 
                      Add member
                    </div>
                  </div>

                  <!-- CASE: We find an email address match -->
                  <div class="profile-result max-width lg" v-if="ProfileData && ProfileData.id && newMember.email != '' &  newMember.email != ' ' " :class="ProfileData && ProfileData.id ? 'active' : ''">
                    <div class="profile-info">
                      <div class="profile-image">
                        <Avatar :uuid="ProfileData.id" size="large" />
                      </div>
                      <p>{{ ProfileData.username }}</p>
                    </div>
                    <div class="button primary" @click="handleAddProjectMember(newMember)" v-if="checkDuplicate(ProfileData.id)">
                      <Loading v-if="loadingbutton" type="button" />
                      <section v-else>
                        <Icon name="fluent:add-circle-20-regular" size="2rem" /> 
                        Add to team
                      </section>
                    </div>
                    <div class="profile-deny" v-else>Already added to this team</div>
                  </div>

                  <!-- CASE: We don't find an email address match -->
                  <div class="profile-result max-width lg" v-if="ProfileData && !ProfileData.id && newMember.email != '' &  newMember.email != ' ' " :class="ProfileData && !ProfileData.id ? 'active' : ''">
                    <div class="profile-info">
                      {{ ProfileData.email }}
                      <div class="profile-deny">Unknown user email</div>
                    </div>
                    <div class="button primary" @click="inviteToVewrite(newMember.email)">
                      <Loading v-if="loadingbutton" type="button" />
                      <section v-else>
                        <Icon name="fluent:add-circle-20-regular" size="2rem" /> 
                        Invite to project
                      </section>
                    </div>
                  </div>

                  <!-- List of project members -->
                  <div class="members">
                    <!-- <div class="members-title">Project team members</div> -->
                    <div class="member" v-if="project" v-for="member in project.project_members" :key="member.id">
                      <Avatar v-if="member.user_id" :uuid="member.user_id" :hasName="true" size="large" />
                      <section v-else class="invited-member">
                        <div class="icon-email">
                          <Icon name="fluent:mail-unread-20-regular" size="2rem" />
                        </div>
                        <p>{{ member.email }}</p>
                      </section>
                      <section>
                        <span class="member-role">{{ member.role }} </span>
                        <div class="button red" @click="removeMember(member)" v-if="member.user_id != user.id">
                          <Icon name="fluent:dismiss-20-filled" size="1.5rem" /> 
                        </div>
                      </section>
                    </div>
                  </div>
                </section>
              </div>
            </div>
          </div>
        </section>
      </form>
    </div>
    
    <div class="buttons">
      <button @click="updateProjectMembers(project.id, project.project_members)" class="primary large">Update</button>
    </div>
  </div>
</template>

<script setup>

import { ref, onMounted } from 'vue';

import useProject from '~/composables/useProject';
const { getProjectDetails, updateProjectMembers } = useProject();

import useProfile from '~/composables/useProfile';
const { fetchProfileViaEmail, createInvitedProfile, ProfileData, ProfileError } = useProfile();

const project = ref({});

// Get the project id from the route
import { useRoute } from 'vue-router';
const route = useRoute();
const projectId = route.params.id;
const user = useSupabaseUser();

const loading = ref(false);
const loadingbutton = ref(false);

const newMember = ref(
  {
    user_id: '',
    role: 'member',
    email: '',
  }
);

function clearEmailData() {
  newMember.value.email = '';
  newMember.value.user_id = '';
}

async function handleInput(event) {
  newMember.value.email = event.target.value;
  if (newMember.value.email === '') {
    clearEmailData();
  } else {
    try {
      await fetchProfileViaEmail(newMember.value.email);
      newMember.value.user_id = ProfileData.value.id;
      console.log('ProfileData:', ProfileData.value);
    } catch (error) {
      console.error('Error fetching profile:', error.message);
    }
  }
}

const debounceInput = debounce(handleInput, 250);

// Manual debounce function
function debounce(func, wait) {
  let timeout;
  return function(...args) {
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(this, args), wait);
  };
}

function checkDuplicate(id) {
  return !project.value.project_members.some(member => member.user_id === id);
}

function removeMember(member) {
  console.log('Removing member:', member);
  project.value.project_members = project.value.project_members.filter(item => item.user_id !== member.user_id);
}

function inviteToVewrite(email) {
  project.value.project_members.push({
    user_id: '',
    role: 'invited',
    email: email,
  });
  clearEmailData();
}

function handleAddProjectMember() {
  // Push newMember to project.project_members
  if(!ProfileData.value.id) {
    console.log('No user ID found');
    return;
  } else {
    project.value.project_members.push({
      user_id: ProfileData.value.id,
      role: 'member',
      email: ProfileData.value.email,
    });
    console.log('Adding member to project:', project.value);
    clearEmailData();
  }
}

onMounted(async () => {
  loading.value = true;
  try {
    project.value = await getProjectDetails(projectId);
    loading.value = false;
  } catch (error) {
    console.error('Error fetching data:', error.message);
    loading.value = false;
  }
  loading.value = false;
})

</script>

<style lang="scss" scoped>

@use 'assets/variables' as *;

@keyframes showResult {
  0% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
}

#ManageProjectMembersModal {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  width: 100%;

  .modal-body {
    width: 100%;

    .loading {
      margin: $spacing-lg auto;
    }

    p {
      margin: 0;
    }

    #content-requirements {
      height: 180px;
      margin-bottom: 0;
    }
  }

  .team-assignment {
    display: flex;
    flex-direction: column;
    width: 100%;
    position: relative;
    
    .form-input {
      margin:0;
      border-radius: $br-md $br-md 0 0;

      &.add-member {
        height: 52px;
      }
    }

    .profile-result {
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: space-between;
      overflow: hidden;
      padding: $spacing-sm;
      border-radius: 0 0 $br-lg $br-lg;
      z-index: 10;
      position: absolute;
      top: 51px;
      left: 0;
      width: 100%;
      background: $white;
      box-shadow: $big-shadow;
      transition: all 0.3s ease;
      opacity: 0;

      &.active {
        animation: showResult 0.45s ease forwards;
      }

      .profile-info {
        display: flex;
        flex-direction: row;
        align-items: center;
        gap: $spacing-sm;

        p {
          font-size: $font-size-xs;
          margin: 0;
        }
      }

      .profile-deny {
        font-size: $font-size-xs;
        color: $gray-dark;
      }
    }

    .form-required {
      top: .9rem;
      z-index: 10;
    }

    .members {
      display: flex;
      flex-direction: column;
      border-radius: $br-lg;
      border: $border;
      border-top: 0;
      border-radius: 0 0 $br-md $br-md;
      height: 100%;
      min-height: 200px;
      max-height: 300px;
      overflow-y: auto;
      background: rgba($gray-light, .25);
      position: relative;
      margin-bottom: $spacing-sm;

      .members-title {
        font-size: $font-size-xs;
        color: rgba($black, 0.65);
        padding: $spacing-sm;
        background: linear-gradient(to bottom, rgba($white, 1), rgba($white, 0.85));
        backdrop-filter: blur(5px);
        position: sticky;
        top: 0;
        z-index: 1;
      }

      .member {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
        gap: $spacing-xs;
        border-bottom: $border;
        padding: $spacing-sm;

        .invited-member {
          display: flex;
          flex-direction: row;
          align-items: center;
          gap: $spacing-xs;

          .icon-email {
            width: 42px;
            height: 42px;
            border-radius: $br-lg;
            background: $white;
            border: $border;
            color: $gray-dark;
            display: flex;
            justify-content: center;
            align-items: center;

          }
        }

        section {
          display: flex;
          flex-direction: row;
          align-items: center;
          gap: $spacing-xs;
        }

        .member-role {
          text-transform: capitalize;
          padding: $spacing-xxs $spacing-sm;
          border-radius: $br-xl;
          border: $border;
          background: $white;
        }

        &:last-child {
          border-bottom: none;
        }
      }
    }
  }

  .buttons {
    display: flex;
    flex-direction: row;
    justify-content: flex-end;
    align-items: center;
    gap: $spacing-sm;
    border-top: 1px solid rgba($black, 0.1);
    width: 100%;
    padding: $spacing-md;

    .modal-confirmation {
      font-size: $font-size-xs;
      color: $red;
    }
  }
}

</style>