<template>
  <div id="CreateDeliverableModal">
    <div class="modal-body">
      <Loading v-if="loading" />
      <form class="inner-container" v-if="!loading" @submit.prevent="createDeliverable(deliverable)">

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
              <label for="name">Type</label>
              <select v-model="deliverable.type" id="type">
                <option value="markdown">Markdown</option>
                <option value="link">External Link</option>
                <option value="file">External File</option>
              </select>
            </div>

            <span v-if="deliverable.type == 'markdown'" class="notification info">
              <p>Markdown is a lightweight markup language with plain-text-formatting syntax. It is often used to format readme files, for writing messages in online discussion forums, and to create rich text using a plain text editor.</p>
            </span>

            <!-- If the deliverable has an external link -->
            <div class="form-input" v-if="deliverable.type == 'link'">
              <label for="link">External Link</label>
              <input v-model="deliverable.link" id="link" type="text" placeholder="Input your deliverables's link" />
            </div>

            <!-- If a file is being uploaded -->
            <div class="form-input" v-if="deliverable.type == 'file'">
              <label for="file">External File</label>
              <input v-model="deliverable.file" id="file" type="text" placeholder="Input your deliverables's link" />
            </div>
          </div>
        </div>

        <div class="form-block">
          <div class="form-details">
            <h4>Due Date</h4>
            <p class="details">Select a reasonable duraction for this deliverable.</p>
          </div>
          <div class="form-content">
            <VDatePicker :attributes="deliverable.attrs" v-model="deliverable.due_date" />
          </div>
        </div>
      </form>
          
    </div>
    
    <div class="buttons">
      <button @click="createDeliverable(deliverable)" class="primary">Create</button>
    </div>
  </div>
</template>

<script setup>

// Project composable
// import useProject from '~/composables/useProject';
// const { deleteProject, getProjectDetails, projectData, projectError } = useProject();

// Deliverables composable
import useDeliverables from '~/composables/useDeliverables';
const { createDeliverable } = useDeliverables();

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
  status: 0,
  workflow_state: 1,
  type: 'markdown',
  due_date: new Date(),
  markdown: '# Hello World',
  link: '',
  file: '',
})

</script>

<style lang="scss" scoped>

@import 'assets/_variables.scss';

#CreateDeliverableModal {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  height: 100%;
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
    justify-content: space-between;
    align-items: center;
    gap: $spacing-sm;
    border-top: 1px solid rgba($black, 0.1);
    width: 100%;
    padding: $spacing-md;

    .modal-confirmation {
      font-size: $font-size-sm;
      color: $red;
    }
  }
}

</style>