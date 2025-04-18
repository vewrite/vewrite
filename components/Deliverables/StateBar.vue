<template>
  <section class="state-buttons">

    <!-- Project just started (43) -->
    <div v-if="props.StateData[0].state_type === 1">
      <button class="button primary" @click="handleState(DeliverableData.workflow_state, DeliverableData.id, 44)">Get started</button>
    </div>
    
    <!-- Is in research state (44) -->
    <div v-if="props.StateData[0].state_type === 7 && route.meta.roles.writer == user.id">
      <button class="button primary" @click="handleState(DeliverableData.workflow_state, DeliverableData.id, 45)">Start outline</button>
    </div>
    
    <!-- Is in outline state (45) -->
    <div v-if="props.StateData[0].state_type === 3 && route.meta.roles.writer == user.id">
      <button class="button" @click="handleState(DeliverableData.workflow_state, DeliverableData.id, 44)">Back to research</button>
      <button class="button primary" @click="handleState(DeliverableData.workflow_state, DeliverableData.id, 46)">Send for review</button>
    </div>
    <div class="notification warning" v-if="props.StateData[0].state_type === 3 && route.meta.roles.reviewer == user.id && !isSolo"> 
      Waiting for writer to finish.
    </div>

    <!-- Is in outline review state (46) -->
    <div v-if="props.StateData[0].state_type === 2 && route.meta.roles.reviewer == user.id">
      <button class="button" @click="handleState(DeliverableData.workflow_state, DeliverableData.id, 45)">
        <span v-if="isSolo">Back to writing</span>
        <span v-else>Send back to writer</span>
      </button>
      <button class="button primary" @click="approvalModal(DeliverableData.workflow_state, DeliverableData.id, 47, DeliverableData.role_assignments.Writer)">Approve outline</button>
    </div>
    <div class="notification warning" v-if="props.StateData[0].state_type === 2 && route.meta.roles.writer == user.id && !isSolo"> 
      Waiting for reviewer to finish.
    </div>

    <!-- Is in Writing state (47) -->
    <div v-if="props.StateData[0].state_type === 4 && route.meta.roles.writer == user.id"> 
      <button class="button primary" @click="handleState(DeliverableData.workflow_state, DeliverableData.id, 48)">Send for review</button>
    </div>
    <div class="notification warning" v-if="props.StateData[0].state_type === 4 && route.meta.roles.reviewer == user.id && !isSolo"> 
      Waiting for writer to finish.
    </div>

    <!-- Is in draft review state (48) -->
    <div v-if="props.StateData[0].state_type === 5 && route.meta.roles.reviewer == user.id">
      <button class="button" @click="handleState(DeliverableData.workflow_state, DeliverableData.id, 47)">
        <span v-if="isSolo">Back to writing</span>
        <span v-else>Send back to writer</span>
      </button>
      <button class="button primary" @click="approvalModal(DeliverableData.workflow_state, DeliverableData.id, 49, DeliverableData.role_assignments.Writer)">Approve draft</button>
    </div>
    <div class="notification warning" v-if="props.StateData[0].state_type === 5 && route.meta.roles.writer == user.id && !isSolo"> 
      Waiting for reviewer to finish.
    </div>
    
    <!-- Is approved (49) -->
    <div v-if="props.StateData[0].state_type === 6 && isContent">
      <Dropdown primary="true">
        <template v-slot:trigger>
          Download Deliverable
        </template>
        <template v-slot:menu>
          <div class="dropdown-item" @click="downloadFile('markdown')">Markdown</div>
          <div class="dropdown-item" @click="downloadFile('asciidoc')">Asciidoc</div>
          <div class="dropdown-item" @click="downloadFile('html')">Html</div>
        </template>
      </Dropdown>
    </div>
    <div class="notification warning" v-if="props.StateData[0].state_type === 6 && !isContent"> 
      This deliverable is an external link.
    </div>

  </section>
</template>

<script setup>

import { convertToAsciidoc } from '~/utils/asciidocConverter'

const props = defineProps(['StateData', 'DeliverableData', 'isSolo']);
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

const isContent = computed(() => {
  if(props.DeliverableData.content.type == 'content') {
    return true;
  } else { // Is a link
    return false;
  }
});

async function notifyUser(userId, deliverable, projectId) {
  const response = await $fetch(`/api/email/notifyUser?project_id=${projectId}&deliverable_id=${deliverable.id}&user_id=${userId}`);

  if (!response) {
    console.error('No response from server');
    console.error('Error inviting user:', inviteError);
    return;
  }
}

async function handleState(stateId, deliverableId, stateType) {

  loading.value = true;

  try {    
    await updateDeliverableWorkflowState(deliverableId, stateType);

    console.log('stateId:', stateId);

    // Here we will handle assignments to the writer and reviewer
    if(stateType == 43 || stateType == 44 || stateType == 45 || stateType == 47) {
      if(!isSolo){
        await notifyUser(props.DeliverableData.role_assignments.Writer, props.DeliverableData, props.DeliverableData.project);
      }
      // Get the assigned writer
      let userId = props.DeliverableData.role_assignments.Writer;
      await assignToRole(deliverableId, userId);
      deliverableStore.setDeliverableState(props.DeliverableData.id, stateType);
    
    // Here we will handle assignments to the reviewer
    } else if(stateType == 46 || stateType == 48 || stateType == 49) {
      if(!isSolo){
        await notifyUser(props.DeliverableData.role_assignments.Reviewer, props.DeliverableData, props.DeliverableData.project);
      }

      // Need to migrate this to an approval system
      let userId = props.DeliverableData.role_assignments.Reviewer;
      await assignToRole(deliverableId, userId);
      deliverableStore.setDeliverableState(props.DeliverableData.id, stateType);
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

    if(type == 'asciidoc') {

      const markdown = await response.text();
      const asciidocContent = convertToAsciidoc(markdown);
      
      const blob = new Blob([asciidocContent], { type: 'text/plain' })
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')

      link.href = url
      link.setAttribute('download', `vewrite-asciidoc-export-${props.DeliverableData.id}.adoc`)
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)

      // const markdown = await response.text();
      // const html = turndownService.turndown(markdown);
      // const url = window.URL.createObjectURL(new Blob([html], {type: 'text/html'}));
      // const link = document.createElement('a');
      // link.href = url;
      // link.setAttribute('download', `vewrite-asciidoc-export-${props.DeliverableData.id}.adoc`);
      // document.body.appendChild(link);
      // link.click();
      // document.body.removeChild(link);
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