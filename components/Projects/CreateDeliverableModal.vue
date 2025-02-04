<template>
  <div id="CreateDeliverableModal">
    <div class="modal-body">
      <Loading class="loading" v-if="loading" type="small" />
      <form v-if="!loading" @submit.prevent="createDeliverable(deliverable)">
        <section class="form-row">
          <div class="inner-container">
            <div class="form-block">
              <div class="form-content-full">

                <div class="form-input">
                  <label for="name">Name</label>
                  <input v-model="deliverable.title" id="name" type="text" placeholder="Input your deliverables's title" />
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
            </div>

            <!-- Team assignment -->
            <section class="team-assignment">
              <div class="members">
                <div class="members-title">Team member role assignment</div>
                <div class="member" v-if="TeamMembersData" v-for="member in TeamMembersData" :key="member.id">
                  <Avatar :uuid="member.user_id" :hasName="true" size="large" />
                  <div class="role-selector">
                    <div class="single-role" v-if="RolesData" v-for="role in RolesData" :key="role.id" @click="setDeliverableRole(member, role)" :class="{ selected: role_assignments[role.name] == member.user_id }">
                      {{ role.name }}
                    </div>
                  </div>
                </div>
              </div>
            </section>
          </div>

        </section>
        
      </form>
          
    </div>
    
    <div class="buttons">
      <button @click="createDeliverable(deliverable, projectId)" class="primary large">Create</button>
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
const { createDeliverable } = useDeliverables();

import useProject from '~/composables/useProject';
const { getProjectDetails } = useProject();

import useTeamMembers from '~/composables/useTeamMembers';
const { fetchTeamMembers, TeamMembersData } = useTeamMembers();

import useRoles from '~/composables/useRoles';
const { fetchRoles, RolesData } = useRoles();

const project = ref({});

// Get the project id from the route
import { useRoute } from 'vue-router';
const route = useRoute();
const projectId = route.params.id;

const loading = ref(false);

// Set some sane defaults for the deliverable
const deliverable = reactive({
  title: 'Deliverable title',
  description: 'Quickly summarize your deliverable',
  created_at: new Date(),
  updated_at: new Date(),
  project: projectId,
  due_date: new Date(),
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
  assigned_to: '',
})

const buttonDate = computed(() => {
  return deliverable.due_date.toDateString();
})

function onChange (value) {
  console.log(value)
}

async function init() {
  try {
    await fetchTeamMembers(project.value.assigned_team);
    await fetchRoles();
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
      height: 147px;
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

        .member {
          display: flex;
          flex-direction: row;
          justify-content: space-between;
          align-items: center;
          gap: $spacing-xs;
          border-bottom: $border;
          padding: $spacing-sm;

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