<template>
  <section class="state-buttons">

    <!-- Project just started (43) -->
    <div v-if="props.StateData[0].state_type === 1">
      <button class="button primary large" @click="handleState(DeliverableData.workflow_state, DeliverableData.id, 44)">Get started</button>
    </div>
    
    <!-- Is in research state (44) -->
    <div v-if="props.StateData[0].state_type === 7 && route.meta.roles.writer == user.id">
      <button class="button primary large" @click="handleState(DeliverableData.workflow_state, DeliverableData.id, 45)">Start outline</button>
    </div>
    
    <!-- Is in outline state (45) -->
    <div v-if="props.StateData[0].state_type === 3 && route.meta.roles.writer == user.id">
      <button class="button large" @click="handleState(DeliverableData.workflow_state, DeliverableData.id, 44)">Back to research</button>
      <button class="button primary large" @click="handleState(DeliverableData.workflow_state, DeliverableData.id, 46)">Send for review</button>
    </div>
    <div class="notification warning" v-if="props.StateData[0].state_type === 3 && route.meta.roles.reviewer == user.id"> 
      Waiting for writer to finish.
    </div>

    <!-- Is in outline review state (46) -->
    <div v-if="props.StateData[0].state_type === 2 && route.meta.roles.reviewer == user.id">
      <button class="button large" @click="handleState(DeliverableData.workflow_state, DeliverableData.id, 45)">Send back to writer</button>
      <!-- <button class="button primary large" @click="handleState(DeliverableData.workflow_state, DeliverableData.id, 47)">Approve outline</button> -->
      <button class="button primary large" @click="approvalModal(DeliverableData.workflow_state, DeliverableData.id, 47, DeliverableData.role_assignments.Writer)">Approve outline</button>
    </div>
    <div class="notification warning" v-if="props.StateData[0].state_type === 2 && route.meta.roles.writer == user.id"> 
      Waiting for reviewer to finish.
    </div>

    <!-- Is in Writing state (47) -->
    <div v-if="props.StateData[0].state_type === 4 && route.meta.roles.writer == user.id"> 
      <button class="button primary large" @click="handleState(DeliverableData.workflow_state, DeliverableData.id, 48)">Send for review</button>
    </div>
    <div class="notification warning" v-if="props.StateData[0].state_type === 4 && route.meta.roles.reviewer == user.id"> 
      Waiting for writer to finish.
    </div>

    <!-- Is in draft review state (48) -->
    <div v-if="props.StateData[0].state_type === 5 && route.meta.roles.reviewer == user.id">
      <button class="button large" @click="handleState(DeliverableData.workflow_state, DeliverableData.id, 47)">Send back to writer</button>
      <!-- <button class="button primary large" @click="handleState(DeliverableData.workflow_state, DeliverableData.id, 49)">Approve draft</button> -->
      <button class="button primary large" @click="approvalModal(DeliverableData.workflow_state, DeliverableData.id, 49, DeliverableData.role_assignments.Writer)">Approve draft</button>
    </div>
    <div class="notification warning" v-if="props.StateData[0].state_type === 5 && route.meta.roles.writer == user.id"> 
      Waiting for reviewer to finish.
    </div>
    
    <!-- Is approved (49) -->
    <div v-if="props.StateData[0].state_type === 6">
      <button class="button primary" @click="downloadFile('markdown')">Download markdown</button>
      <button class="button primary" @click="downloadFile('html')">Download html</button>
    </div>

  </section>
</template>

<script setup>

const props = defineProps(['StateData', 'DeliverableData']);
const loading = ref(false);

const user = useSupabaseUser();

import { useRoute } from 'vue-router';
const route = useRoute();

import useDeliverables from '~/composables/useDeliverables';
const { updateDeliverableWorkflowState, assignToRole, approvalModal } = useDeliverables();

import { useDeliverableStore } from '~/stores/deliverable';
const deliverableStore = useDeliverableStore();

import TurnDownService from 'turndown';
const turndownService = new TurnDownService();

async function handleState(stateId, deliverableId, stateType) {

  loading.value = true;

  try {    
    await updateDeliverableWorkflowState(deliverableId, stateType);

    console.log('stateId:', stateId);

    // Here we will handle assignments to the writer and reviewer
    if(stateType == 43 || stateType == 44 || stateType == 45 || stateType == 47) {
      // Get the assigned writer
      let userId = props.DeliverableData.role_assignments.Writer;
      await assignToRole(deliverableId, userId);
    
    // Here we will handle assignments to the reviewer
    } else if(stateType == 46 || stateType == 48 || stateType == 49) {
      // Get the assigned reviewer

      // Need to migrate this to an approval system
      let userId = props.DeliverableData.role_assignments.Reviewer;
      await assignToRole(deliverableId, userId);
    }
    
    // Set the deliverable state in the store
    console.log('Setting deliverable state:', stateType);
    deliverableStore.setDeliverableState(deliverableId, stateType);
    
    loading.value = false;
  } catch (error) {
    console.error(error);
    loading.value = false;
  }
}

/* 

Standard workflow is:

[
  43, // Getting started (new), assigned to writer
  44, // Gathering information (research), assigned to writer
  45, // Outline (outline), assigned to writer
  46, // Outline Review (outline review), assigned to reviewer
  47, // Writing (writing), assigned to writer
  48, // Draft Review (writing review), assigned to reviewer
  49  // Approved (approved), assigned to reviewer
]

StateTypes reference:

1. new
2. outline review
3. outline
4. writing
5. draft review
6. approved
7. research
8. holding

Each state type has a different set of buttons that we should show at appropriate times

1. "Getting Started" should show "Get Started"
2. "Gathering Information" should show "Start Outline"
3. "Outline" should show "Send for Review" and "Back to Research"
4. "Review" should show "Approve Outline" and "Send back to Writer"
5. "Writing" should show "Send for Review"
6. "Review" should show "Approve Draft" and "Send back to Writer"
7. "Approved" should show "Download"

*/

async function downloadFile(type) {
  console.log('Downloading file in format:', type);
  try {
    const response = await $fetch(`/api/deliverables/export?id=${props.DeliverableData.id}&type=${type}`, {
      responseType: 'blob',
    });

    if (!response) {
      console.error('No response from server');
      return;
    }

    if(type == 'html') {
      const url = window.URL.createObjectURL(new Blob([response]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `vewrite-html-export-${props.DeliverableData.id}.html`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }

    if(type == 'markdown'){
      const markdown = await response.text();
      const html = turndownService.turndown(markdown);
      const url = window.URL.createObjectURL(new Blob([html], {type: 'text/html'}));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `vewrite-markdown-export-${props.DeliverableData.id}.md`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }

  } catch (err) {
    console.error('Error downloading file:', err);
  }
};

</script>

<style lang="scss" scoped>

@use 'assets/variables' as *;

.state-buttons div {
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  gap: $spacing-xs;

  button {
    align-self: flex-start;
  }
}

</style>