<template>
  <div id="CreateDeliverableModal">
    <div class="modal-body">

      <Loading v-if="loading" class="loading" type="small" />
      
      <form v-if="!loading" @submit.prevent="createDeliverable(deliverable)">
        <section class="form-row">
          <div class="inner-container">
            <div class="form-block">
              <div class="form-content-full">

                <div class="form-input">
                  <label for="name">Name</label>
                  <input v-model="deliverable.title" id="name" type="text" placeholder="Input your deliverables's title" />
                  <span class="form-required" v-if="formErrors.title != ''">{{ formErrors.title }}</span>
                </div>
                <div class="form-input">
                  <label for="description">Description</label>
                  <input v-model="deliverable.description" id="description" type="text" placeholder="Quickly summarize your deliverable" />
                </div>

                <div class="form-input">
                  <label for="type">Type</label>
                  <select v-model="deliverable.content.type" id="type" @change="onChange(deliverable)">
                    <option value="content">Internal Editor</option>
                    <option value="link">External Link</option>
                    <!-- <option value="file">External File</option> -->
                  </select>
                </div>

                <span v-if="deliverable.type == 'content'" class="notification info">
                  <p>The internal editor allows your team to work entirely within Vewrite, ensuring the most smooth process.</p>
                </span>

                <!-- If the deliverable is an internal document -->
                <div class="form-input" v-if="deliverable.content.type == 'content'">
                  <label for="content-requirements">Requirements for this deliverable</label>
                  <textarea v-model="deliverable.content.requirements" id="content-requirements" type="text" placeholder="Input the stakeholder's requirements for this deliverable" />
                </div>
                
                <!-- If the deliverable has an external link -->
                <div class="form-input" v-if="deliverable.content.type == 'link'">
                  <label for="link-requirements">Link to external requirements</label>
                  <input v-model="deliverable.content.requirements" id="link-requirements" type="text" placeholder="Paste a link" />
                </div>

              </div>
            </div>
          </div>
          <div class="inner-container">

            <div class="form-block due-date">
              <div class="form-details">
                <p><Icon name="solar:calendar-linear" size="1.15rem" /> Select Due Date</p>
              </div>
              <div class="form-content">
                <Dropdown>
                  <template v-slot:trigger>
                    {{ buttonDate }}
                  </template>
                  <template v-slot:menu>
                    <VDatePicker :attributes="deliverable.attrs" v-model="deliverable.due_date" />
                  </template>
                </Dropdown>
              </div>
              <span class="form-required" v-if="formErrors.due_date != ''">{{ formErrors.due_date }}</span>
            </div>

            <!-- Team assignment -->
            <section class="team-assignment">

              <section class="form-required" v-if="missingRoles">Role selection required</section>

              <div class="members">
                <div class="members-title">Team member role assignment</div>
                <div class="member" v-if="project && !membersError" v-for="member in project.project_members" :key="member.user_id">
                  <section class="member-details" v-if="member.user_id" >
                    <Avatar :uuid="member.user_id" :hasName="true" size="large" />
                    <div class="role-selector">
                      <div class="single-role" v-if="RolesData" v-for="role in RolesData" :key="role.id" @click="setDeliverableRole(member, role)" :class="{ selected: role_assignments[role.name] == member.user_id }">
                        {{ role.name }}
                      </div>
                    </div>  
                  </section>
                  <section class="member-details" v-else>
                    <div class="member-invited">
                      <div class="icon-email">
                        <Icon name="fluent:mail-unread-20-regular" size="2rem" />
                      </div>
                      {{ member.email }}
                    </div>
                    <span class="pending">Invitation pending</span>
                  </section>
                </div>
                <div class="role-error notification error" v-if="membersError">
                  <h4>Not enough users ready to work</h4> 
                  <ul>
                    <li>Add more users at the project level</li>
                    <li>Ensure that any pending users are signed up to Vewrite</li>
                  </ul>
                </div>
              </div>
            </section>
          </div>

        </section>
        
      </form>
          
    </div>
    
    <div class="buttons">
      <button @click="handleCreateDeliverable(deliverable, projectId)" class="primary large" :disabled="membersError">Create</button>
    </div>
  </div>
</template>

<script setup>

import { ref, onMounted } from 'vue';
import { defineProps, defineEmits } from 'vue';

const props = defineProps(['team']);
const emit = defineEmits(['update']);

const role_assignments = ref({
  Writer: null,
  Reviewer: null
});

const setDeliverableRole = (member, role) => {
  // Remove the previous role assignment for the user
  for (const [roleName, userId] of Object.entries(role_assignments.value)) {
    if (userId === member.user_id) {
      role_assignments.value[roleName] = null;
    }
  }

  // Assign the new role to the member
  role_assignments.value[role.name] = member.user_id;
}

import useDeliverables from '~/composables/useDeliverables';
const { createDeliverable, useSelectedDate, formatDate } = useDeliverables();

// state passed from deliverable calendar
const selectedDeliverableDate = useSelectedDate();
console.log(selectedDeliverableDate.value);

import useProject from '~/composables/useProject';
const { getProjectDetails } = useProject();

import useRoles from '~/composables/useRoles';
const { fetchRoles, RolesData } = useRoles();

const project = ref({});
const missingRoles = ref(false);

// Get the project id from the route
import { useRoute } from 'vue-router';
const route = useRoute();
const projectId = route.params.id;

const loading = ref(false);
const membersError = ref(false);

// computed property for selected date
// first check if selectedDeliverableDate is set
// if not, use the current date
const selectedDate = computed(() => {
  return selectedDeliverableDate.value ? selectedDeliverableDate.value : new Date();
})

// Set some sane defaults for the deliverable
const deliverable = reactive({
  title: '',
  description: '',
  created_at: new Date(),
  updated_at: new Date(),
  project: projectId,
  due_date: selectedDate.value,
  workflow_state: '43',
  content: {
    type: 'content',
    hasRequirements: true,
    hasOutline: true,
    hasResearch: true,
    hasDraft: true,
    requirements: '',
    outline: '',
    research: '',
    draft: ''
  },
  role_assignments: role_assignments,
  assigned_to: role_assignments.value.Writer,
})

const buttonDate = computed(() => {
  return deliverable.due_date.toDateString();
})

function onChange (value) {
  console.log(value)
}

function checkMemberRequirements() {
  if (!project.value || !project.value.project_members) {
    membersError.value = true;
    return;
  }
  
  // Count members with user_id
  const validMembersCount = project.value.project_members.filter(member => member.user_id).length;
  
  // Set error if less than 2 valid members
  membersError.value = validMembersCount < 2;
}

async function init() {
  try {
    await fetchRoles();
    checkMemberRequirements();
  } catch (error) {
    console.error('Error fetching data:', error.message);
  }
}

onMounted(async () => {
  loading.value = true;
  try {
    project.value = await getProjectDetails(projectId);
    await init();
    loading.value = false;
  } catch (error) {
    console.error('Error fetching data:', error.message);
    loading.value = false;
  }
  loading.value = false;
})

// Form validation
import { useVuelidate } from '@vuelidate/core'
import { required } from '@vuelidate/validators'

const rules = {
  deliverable: {
    title: { required },
    due_date: { required }
  }
}

const formErrors = ref({
  title: '',
  due_date: ''
})

const $v = useVuelidate(rules, { deliverable })

$v.value.$touch()

const handleCreateDeliverable = (deliverable, projectId) => {
  
  clearErrors();

  if (!role_assignments.value.Writer || !role_assignments.value.Reviewer) {
    console.log('Missing roles');
    missingRoles.value = true;
  }

  if ($v.value.$invalid) {
    $v.value.$errors.forEach(error => {
      processError(error);
    });
  }

  if(!missingRoles.value && !$v.value.$invalid) {
    createDeliverable(deliverable, projectId);
  }


}

function processError (error) {
  formErrors.value[error.$property] = error.$property + ' is required';
}

function clearErrors () {
  missingRoles.value = false;
  formErrors.value = {
    title: '',
    due_date: ''
  };
}

</script>

<style lang="scss" scoped>

@use 'assets/variables' as *;

#CreateDeliverableModal {
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

  .due-date {
    border: $border;
    margin-bottom: $spacing-sm;
    padding: $spacing-sm;
    border-radius: $br-lg;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    font-size: $font-size-xs;
    color: rgba($black, 0.65);
    background: rgba($gray-light, 0.25);
    min-height: 72px;
  }

  .team-assignment {
    display: flex;
    flex-direction: column;
    width: 100%;
    border: $border;
    border-radius: $br-lg;
    min-height: 300px;
    max-height: 300px;
    overflow-y: auto;
    background: rgba($gray-light, .25);
    position: relative;

    .form-required {
      top: .9rem;
      z-index: 10;
    }

    .members {
      display: flex;
      flex-direction: column;
      border-radius: $br-lg;
      position: relative;

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

      .role-error {
        margin: $spacing-sm;
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        justify-content: flex-start;
        gap: $spacing-xxs;

        h4 {
          margin: 0;
          text-align: left;
        }
      }

      .member {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
        gap: $spacing-xs;
        border-bottom: $border;
        padding: $spacing-sm;

        .member-details {
          display: flex;
          flex-direction: row;
          justify-content: space-between;
          align-items: center;
          gap: $spacing-xs;
          width: 100%;

          .member-invited {
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

          .pending {
            color: rgba($black, 0.5);
            font-size: $font-size-xs;
          }
        }

        .role-selector {
          display: flex;
          flex-direction: row;
          align-items: center;
          overflow: hidden;
          gap: $spacing-xs;
          cursor: pointer;

          .single-role {
            background: rgba($black, 0.05);
            padding: $spacing-xxs $spacing-sm;
            border-radius: $br-lg;

            &.selected {
              background: rgba($brand, 0.15);
              color: $brand;
            }
          }
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