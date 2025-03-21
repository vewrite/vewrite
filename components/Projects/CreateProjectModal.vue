<template>
  <div id="CreateProjectModal">
    <div class="modal-body">

      <Loading v-if="loading" class="loader" type="small" />
      
      <!-- No teams -->
      <!-- <section class="inner-container" v-if="!loading && !hasReadyTeams">
        <div class="empty">
          <h3>No Ready Teams Found</h3>
          <p>You do not have a team to assign a project to. You must first add a team to Vewrite, and add at least two team members.</p>
          <nuxt-link class="button primary" to="/teams" @click="useModal().reset()">Manage your teams</nuxt-link>
        </div>
      </section> -->

      <!-- No clients -->
      <section class="inner-container" v-if="!loading && !hasClients">
        <div class="empty">
          <h3>No Clients Found</h3>
          <p>You do not have a client to assign a project to. You must first add a client to Vewrite.</p>
          <nuxt-link class="button primary" to="/clients" @click="useModal().reset()">Add a client</nuxt-link>
        </div>
      </section>

      <!-- Free user, maxxed out projects -->
      <section class="inner-container" v-if="!loading && !isPro && !isAllowed">
        <div class="empty">
          <h3>Free projects are limited</h3>
          <p>You're a manager and already have one free project. If you need more, you must upgrade.</p>
          <nuxt-link class="button green large" to="/subscriptions" @click="useModal().reset()">Upgrade</nuxt-link>
        </div>
      </section>

      <!-- Has clients and teams -->
      <form v-if="!loading && hasReadyTeams && hasClients && isAllowed" @submit.prevent="createProject(project)">

        <!-- {{ProfileData}} -->

        <section class="form-row">
          <div class="inner-container">

            <h3>Project Details</h3>

            <div class="form-block">
              <div class="form-content-full">

                <!-- isPro or freeLimitedProject -->
                <div class="form-input" v-if="isAllowed">
                  <label for="name">Name</label>
                  <input v-model="project.name" id="name" type="text" placeholder="Your project's name" />
                  <span class="form-required" v-if="formErrors.name != ''">{{ formErrors.name }}</span>
                </div>
                <div class="form-input" v-if="isAllowed">
                  <label for="description">Description</label>
                  <input v-model="project.description" id="description" type="text" placeholder="Summarize your project and its objectives" />
                </div>

                <!-- Removed for Removing Teams - Single Project page #145 -->
                <!-- <div class="form-block">
                  <div class="form-details">
                    <h4>Team</h4>
                    <p class="details">Assign a team who will work on this project.</p>
                  </div>
                  <div class="form-content">
                    <div class="form-input">
                      <label for="team">Assigned team</label>
                      <select v-model="project.assigned_team" id="team">
                        <option v-for="team in readyTeamsData" :key="team.assigned_team" :value="team.id">{{ team.name }}</option>
                      </select>
                      <span class="form-required" v-if="formErrors.assigned_team != ''">{{ formErrors.assigned_team }}</span>
                    </div>
                  </div>
                </div> -->

                <h3>Select client</h3>

                <div class="form-block">
                  <div class="form-content clients">
                    <div class="form-group">
                      <span class="form-required" v-if="formErrors.client_id != ''">{{ formErrors.client_id }}</span>
                      <section id="ClientSelect">
                        <div class="client-select" v-for="client in clients">
                          <input type="radio" :id="client.client_id" name="drone" :value="client.client_id" v-model="project.client_id" />
                          <label :for="client.client_id">
                            <div class="image-wrapper">
                              <img :src="client.logo_url" alt="Client avatar" />
                            </div>
                            {{ client.name }}
                          </label>
                        </div>
                      </section>
                    </div>
                  </div>
                </div>

                <!-- For now we'll default to the standard workflow -->
                <!-- <div class="form-block">
                  <div class="form-content">
                    <div class="form-input">
                        <label for="client">Workflow</label>
                        <select v-model="project.workflow" id="client">
                          <option v-for="workflow in workflows" :value="workflow.id">{{ workflow.name }}</option>
                        </select>
                        <span class="form-required" v-if="formErrors.workflow != ''">{{ formErrors.workflow }}</span>
                    </div>
                  </div>
                </div> -->
              </div>
            </div>
          </div>
          <div class="inner-container">

            <h3>Project Members</h3>

            <section class="team-assignment">

              <!-- <section class="form-required" v-if="missingRoles">Role selection required</section> -->
            
              <!-- {{newMember}} -->

              <!-- Input to add a new member to the team -->
              <div class="form-input add-member" v-if="isAllowed">
                <label for="newMember">Invite member</label>
                <input v-model="newMember.email" id="newMember" type="text" placeholder="Email address" autocomplete="off" @input="handleInput" />
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
                <div class="button primary" @click="inviteToVewrite(member.email)">
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
                  <Avatar :uuid="member.user_id" :hasName="true" size="large" />
                  <section>
                    <span class="member-role">{{ member.role }} </span>
                    <div class="button red" @click="removeMember(member)" v-if="member.user_id != user.id">
                      <Icon name="fluent:dismiss-20-filled" size="1.5rem" /> 
                    </div>
                  </section>
                </div>
              </div>

              <div class="notification info">
                You must add at least one more team member to create this project.
              </div>

            </section>
          </div>
        </section>
      </form>
          
    </div>
    
    <div class="buttons" v-if="!loading && hasReadyTeams && hasClients && isAllowed">
      <button @click="handleCreateProject(project)" class="primary large">Create</button>
    </div>
  </div>
</template>

<script setup>

import useProject from '~/composables/useProject';
const { createProject, fetchProjectsCreatedBy } = useProject();

import useClient from '~/composables/useClient';
const { fetchClients } = useClient();

import useWorkflow from '~/composables/useWorkflow';
const { fetchWorkflows } = useWorkflow();

import useTeam from '~/composables/useTeam';
const { fetchTeams, TeamsData, TeamsError } = useTeam();

import useGroup from '~/composables/useGroup';
const { fetchSingleGroup, GroupData, GroupError } = useGroup();

import useProfile from '~/composables/useProfile';
const { fetchProfileViaEmail, createInvitedProfile, ProfileData, ProfileError } = useProfile();

import { useModal } from '~/stores/modal'

const user = useSupabaseUser();

const PlanStatus = ref('')
const ownedProjects = ref(0);

// Pull subscription status from the middleware auth.js
const subscriptionStatus = useState('subscriptionStatus');
PlanStatus.value = subscriptionStatus.value.status

const readyTeamsData = computed(() => {
  return TeamsData.value.filter(team => team.details.ready === true);
})

// Loading state
const loading = ref(true);
const loadingbutton = ref(false);
// useModal().toggleLoading();

// Set some sane defaults for the workflow
const project = reactive({
  name: '',
  description: '',
  status: 1,
  client_id: 0,
  workflow: 1,
  created_at: new Date(),
  updated_at: new Date(),
  created_by: user.value.id,
  assigned_team: '', // Removed for Removing Teams - Single Project page #145
  project_members: [
    {
      user_id: user.value.id,
      role: 'owner',
      email: user.value.email,
    },
  ]
})

const newMember = ref(
  {
    user_id: '',
    role: 'member',
    email: '',
  }
);

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

function clearEmailData() {
  newMember.value.email = '';
  newMember.value.user_id = '';
}

function checkDuplicate(id) {
  return !project.project_members.some(member => member.user_id === id);
}

function handleAddProjectMember() {
  // Push newMember to project.project_members
  if(!ProfileData.value.id) {
    console.log('No user ID found');
    return;
  } else {
    project.project_members.push({
      user_id: ProfileData.value.id,
      role: 'member',
      email: ProfileData.value.email,
    });
    clearEmailData();
  }
}

function removeMember(member) {
  console.log('Removing member:', member);
  project.project_members = project.project_members.filter(item => item.user_id !== member.user_id);
  // const indexToRemove = project.project_members.findIndex(user => user.user_id === member.user_id);
  // if (indexToRemove !== -1) {
  //   project.project_members.splice(indexToRemove, 1);
  // }
}

  // loadingbutton.value = true;
  // try {
  //   await addProjectMember(member);
  //   loadingbutton.value = false;
  // } catch (error) {
  //   console.error('Error adding project member:', error.message);
  //   loadingbutton.value = false;
  // }
// }

const clients = ref([]);
const workflows = ref([]);

onMounted(async () => {
  try {
    await fetchSingleGroup(user.value.id);
    await fetchTeams(GroupData.value.id);
    ownedProjects.value = await fetchProjectsCreatedBy(user.value.id);
    clients.value = await fetchClients(user.value.id);
    workflows.value = await fetchWorkflows(user.value.id);
  } catch (error) {
    console.error('Error fetching clients:', error.message);
  } finally {
    loading.value = false;
  }
})

const hasReadyTeams = computed(() => {
  return readyTeamsData.value.length > 0;
})

const hasClients = computed(() => {
  return clients.value.length > 0;
})

const isPro = computed(() => {
  if (PlanStatus.value == 'pro') {
    return true;
  } else {
    return false;
  }
})

const isAllowed = computed(() => {
  // Free user, already has one project, not allowed
  if (isPro || ownedProjects.value == 0) {
    return true;
  } else { // Free user, already has one team, not allowed
    return false;
  } 
})

// Form validation
import { useVuelidate } from '@vuelidate/core'
import { required } from '@vuelidate/validators'

const rules = {
  project: {
    name: { required },
    assigned_team: { required },
    client_id: { required },
    workflow: { required },
  }
}

const formErrors = ref({
  name: '',
  client_id: '',
})

const $v = useVuelidate(rules, { project })

$v.value.$touch()

function handleCreateProject (project) {

  if ($v.value.$invalid) {
    console.log('Form is invalid');

    clearErrors();

    console.log(formErrors.value);

    // Process validation errors
    $v.value.$errors.forEach(error => {
      processError(error);
    });
    return
  } else {
    createProject(project);
  }

}

function processError (error) {
  formErrors.value[error.$property] = error.$property + ' is required';
}

function clearErrors () {
  formErrors.value = {
    name: '',
    client_id: '',
  };
}

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

#CreateProjectModal {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  width: 100%;

  .modal-body {
    width: 100%;
    min-height: 320px;

    .loader {
      height: 280px;
    }

    h3 {
      margin: $spacing-md 0 $spacing-sm 0;
    }

    .inner-container {
      gap: 0;
    }

    .clients {
      width: 100%;
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
        min-height: 168px;
        max-height: 168px;
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

    p {
      margin: 0;
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

#ClientSelect {
  padding: $spacing-sm;
  border: 1px solid rgba($brand, 0.15);
  background-color: $white;
  border-radius: $br-md;
  max-height: 320px;
  overflow-y: auto;

  .client-select {
    display: flex;
    align-items: center;
    border: 1px solid rgba($brand, 0);
    border-radius: $br-md;
    padding: $spacing-xxs;

    &:hover {
      background-color: rgba($brand, 0.05);
    }

    .image-wrapper {
        width: 80px;
        min-height: 54px;
        height: 54px;
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

    input[type="radio"] {
      margin-right: 0.5rem;
      width: 18px;
      height: 18px;
    }

    label {
      display: flex;
      flex-direction: row;
      gap: $spacing-sm;
      align-items: center;
      cursor: pointer;
      justify-content: flex-start;
      font-size: $font-size-xs;
      color: $black;
      padding: 0 $spacing-sm;
      width: 100%;
    }

    &:hover {

      label {
        background: transparent;
      }
    }
  }
}

</style>