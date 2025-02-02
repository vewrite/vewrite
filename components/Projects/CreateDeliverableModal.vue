<template>
  <div id="CreateDeliverableModal">
    <div class="modal-body">
      <Loading v-if="loading" />
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

                <!-- If a file is being uploaded -->
                <!-- <div class="form-input" v-if="deliverable.type == 'file'">
                  <label for="file">External File</label>
                  <input v-model="deliverable.file" id="file" type="text" placeholder="Input your deliverables's link" />
                </div> -->
              </div>
            </div>
          </div>
          <div class="inner-container">

            <div class="form-block no-height">
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
            <TeamAssignment :team="project.assigned_team" />
          </div>

        </section>
        
      </form>
          
    </div>
    
    <div class="buttons">
      <button @click="createDeliverable(deliverable, projectId,)" class="primary large">Create</button>
    </div>
  </div>
</template>

<script setup>

import TeamAssignment from '~/components/Deliverables/TeamAssignment.vue';

// TODO - Add validation to the form

// Deliverables composable
import useDeliverables from '~/composables/useDeliverables';
const { createDeliverable } = useDeliverables();

// Project composable
import useProject from '~/composables/useProject';
const { getProjectDetails } = useProject();

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
  }
})

const buttonDate = computed(() => {
  return deliverable.due_date.toDateString();
})

function onChange (value) {
  console.log(value)
}

onMounted(async () => {
  loading.value = true;
  project.value = await getProjectDetails(projectId);
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

</style>