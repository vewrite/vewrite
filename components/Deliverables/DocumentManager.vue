<template>

  <section class="document-content">

    <section class="documents" ref="stateDetails">

      <!-- Requirements -->
      <!-- Always editable by the PM -->
      <div :class="['tiptap-wrap max-width xl', currentState == 1 ? 'current' : '', { 'collapsed': !sections.requirements }]" v-if="props.DeliverableData && props.DeliverableData.content.hasRequirements && stateShowsRequirements">
        <div class="type-label" @click="toggleSection('requirements')">
          <Icon name="fluent:chevron-up-16-regular" size="1.5rem" v-if="!sections.requirements" />
          <Icon name="fluent:chevron-down-16-regular" size="1.5rem" v-if="sections.requirements" />
          Requirements
          <span class="current-state" v-if="currentState == 1">Current State</span>
        </div>
        <div class="tiptap-content">
          <span class="notification warning" v-if="noRequirements">It looks like your requirements are empty. You should fill them out so that your writer knows what to do.</span>
          <TipTapEditor :deliverable="props.DeliverableData" :type="'requirements'" v-if="route.meta.roles.projectManager == user.id" />
          <div class="tiptap-content-readonly" v-html="DeliverableData.content.requirements" v-else></div>
        </div>
      </div>

      <!-- Outline -->
      <!-- Always editable by the PM -->
      <!-- Editable by the writer when they are assigned to the deliverable -->
      <div :class="['tiptap-wrap max-width xl', currentState == 3 ? 'current' : '', { 'collapsed': !sections.outline }]" ref="outlineSection" v-if="props.DeliverableData && props.DeliverableData.content.hasOutline && stateShowsOutline">
        <div class="type-label" @click="toggleSection('outline')">
          <Icon name="fluent:chevron-up-16-regular" size="1.5rem" v-if="!sections.outline" />
          <Icon name="fluent:chevron-down-16-regular" size="1.5rem" v-if="sections.outline" />
          Outline
          <span class="current-state" v-if="currentState == 3">Current State</span>
        </div>
        <div class="tiptap-content">
          <TipTapEditor :deliverable="props.DeliverableData" :type="'outline'" v-if="route.meta.roles.writer == user.id" />
          <div class="tiptap-content-readonly" v-html="DeliverableData.content.outline" v-else></div>
          <Comments :deliverable="props.DeliverableData" :type="'outline-review'" /> 
        </div>
      </div>

      <!-- Outline Review -->
      <!-- Always editable by the PM -->
      <!-- Editable by the reviewer when they are assigned to the deliverable -->
      <div :class="['tiptap-wrap max-width xl', currentState == 2 ? 'current' : '', { 'collapsed': !sections.outlinereview }]" v-if="props.DeliverableData && props.DeliverableData.content.hasOutline && stateShowsOutlineReview">
        <div class="type-label" @click="toggleSection('outlinereview')">
          <Icon name="fluent:chevron-up-16-regular" size="1.5rem" v-if="!sections.outlinereview" />
          <Icon name="fluent:chevron-down-16-regular" size="1.5rem" v-if="sections.outlinereview" />
          Outline Review
          <span class="current-state" v-if="currentState == 2">Current State</span>
        </div>
        <div class="tiptap-content">
          <TipTapEditor :deliverable="props.DeliverableData" :type="'outlinereview'"  v-if="route.meta.roles.reviewer == user.id" :review="true" />
          <div class="tiptap-content-readonly" v-html="DeliverableData.content.outline" v-else></div>
          <Comments :deliverable="props.DeliverableData" :type="'outline-review'" /> 
        </div>
      </div>

      <!-- Writing Draft -->
      <div :class="['tiptap-wrap max-width xl', currentState == 4 ? 'current' : '', { 'collapsed': !sections.draft }]" ref="draftSection" v-if="props.DeliverableData && props.DeliverableData.content.hasDraft && stateShowsWriting">
        <div class="type-label" @click="toggleSection('draft')">
          <Icon name="fluent:chevron-up-16-regular" size="1.5rem" v-if="!sections.draft" />
          <Icon name="fluent:chevron-down-16-regular" size="1.5rem" v-if="sections.draft" />
          Draft
          <span class="current-state" v-if="currentState == 4">Current State</span>
        </div>
        <div class="tiptap-content">
          <TipTapEditor :deliverable="props.DeliverableData" :type="'draft'"  v-if="route.meta.roles.writer == user.id" />
          <div class="tiptap-content-readonly" v-html="DeliverableData.content.draft" v-else></div>
          <Comments :deliverable="props.DeliverableData" :type="'draft-review'" /> 
        </div>
      </div>

      <!-- Draft Review -->
      <div :class="['tiptap-wrap max-width xl', currentState == 5 ? 'current' : '', { 'collapsed': !sections.draftreview }]" ref="draftSection" v-if="props.DeliverableData && props.DeliverableData.content.hasDraft && stateShowsWritingReview">
        <div class="type-label" @click="toggleSection('draftreview')">
          <Icon name="fluent:chevron-up-16-regular" size="1.5rem" v-if="!sections.draftreview" />
          <Icon name="fluent:chevron-down-16-regular" size="1.5rem" v-if="sections.draftreview" />
          Draft Review
          <span class="current-state" v-if="currentState == 5">Current State</span>
        </div>
        <div class="tiptap-content">
          <TipTapEditor :deliverable="props.DeliverableData" :type="'draftreview'"  v-if="route.meta.roles.reviewer == user.id" :review="true" />
          <div class="tiptap-content-readonly" v-html="DeliverableData.content.draft" v-else></div>
          <Comments :deliverable="props.DeliverableData" :type="'draft-review'" /> 
        </div>
      </div>
      
      <!-- Research -->
      <!-- Always editable by the PM -->
      <!-- Editable by the writer when they are assigned to the deliverable -->
      <div :class="['tiptap-wrap max-width xl', currentState == 7 ? 'current' : '', { 'collapsed': !sections.research }]" ref="researchSection" v-if="props.DeliverableData && props.DeliverableData.content.hasResearch && stateShowsResearch">
        <div class="type-label" @click="toggleSection('research')">
          <Icon name="fluent:chevron-up-16-regular" size="1.5rem" v-if="!sections.research" />
          <Icon name="fluent:chevron-down-16-regular" size="1.5rem" v-if="sections.research" />
          Research
          <span class="current-state" v-if="currentState == 7">Current State</span>
        </div>
        <div class="tiptap-content">
          <TipTapEditor :deliverable="props.DeliverableData" :type="'research'"  v-if="route.meta.roles.writer == user.id"  />
          <div class="tiptap-content-readonly" v-html="DeliverableData.content.research" v-else></div>
        </div>
      </div>

      <!-- Approved Draft -->
      <div :class="['tiptap-wrap max-width xl', currentState == 6 ? 'current' : '', { 'collapsed': !sections.approved }]" v-if="props.DeliverableData && props.DeliverableData.content.hasResearch && stateShowsApproved">
        <div class="type-label" @click="toggleSection('approved')">
          <Icon name="fluent:chevron-up-16-regular" size="1.5rem" v-if="!sections.approved" />
          <Icon name="fluent:chevron-down-16-regular" size="1.5rem" v-if="sections.approved" />
          Approved Draft
          <span class="current-state" v-if="currentState == 6">Final</span>
        </div>
        <div class="tiptap-content">
          <section class="approved-draft" v-html="DeliverableData.content.draft"></section>
        </div>
      </div>
      
    </section>



  </section>
</template>

<script setup>

import { ref } from 'vue';

import Comments from '~/components/Deliverables/Comments.vue';

import { useRoute } from 'vue-router';
const route = useRoute();

const user = useSupabaseUser();

const props = defineProps(['DeliverableData', 'StateData']);

// Collapsible sections state
const sections = ref({
  requirements: true,
  outline: true,
  research: true,
  draft: true,
  outlinereview: true,
  draftreview: true,
  approved: true,
});

const toggleSection = (section) => {
  sections.value[section] = !sections.value[section];
};

/*

Standard workflow is:

[
  43, // Getting started (new)
  44, // Gathering information (research)
  45, // Outline (outline)
  46, // Outline Review (outline review)
  47, // Writing (writing)
  48, // Draft Review (writing review)
  49  // Approved (approved)
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


*/

const stateDetails = ref(null);
const requirementsSection = ref(null);
const outlineSection = ref(null);
const draftSection = ref(null);
const researchSection = ref(null);
const approvedSection = ref(null);
const currentState = props.StateData[0].state_type;

const stateShowsOutline = computed(() => {
  if (
        props.StateData && 
        props.StateData[0].state_type === 3 ||
        props.StateData[0].state_type === 4 ||
        props.StateData[0].state_type === 8
      ) {
    return true;
  } else {
    return false;
  }
});

function autoCollapseSections() {
  // Check if StateData exists
  if (!props.StateData || !props.StateData.length) {
    console.warn('StateData is missing or empty');
    return;
  }

  // Be consistent with refs - use .value throughout
  Object.keys(sections.value).forEach((key) => {
    sections.value[key] = false; 
  });

  switch (currentState) {
    case 1:
      sections.value.requirements = true;
      break;
    case 2:
      sections.value.outlinereview = true;
      break;
    case 3:
      sections.value.outline = true;
      break;
    case 4:
      sections.value.draft = true;
      break; 
    case 5:
      sections.value.draftreview = true;
      break; // Fixed missing break
    case 6:
      sections.value.approved = true;  
      break; 
    case 7:
      sections.value.research = true;
      break; 
  }
}

watch(() => props.StateData, (newVal) => {
  if (newVal && newVal.length) {
    autoCollapseSections();
  }
}, { immediate: true });

const stateShowsOutlineReview = computed(() => {
  if (
        props.StateData && 
        props.StateData[0].state_type === 2
      ) {
    return true;
  } else {
    return false;
  }
});

const stateShowsResearch = computed(() => {
  if (
        props.StateData && 
        props.StateData[0].state_type === 3 ||
        props.StateData[0].state_type === 4 ||
        props.StateData[0].state_type === 7 ||
        props.StateData[0].state_type === 8
      ) {
    return true;
  } else {
    return false;
  }
});

const stateShowsWriting = computed(() => {
  if (
        props.StateData && 
        props.StateData[0].state_type === 4
      ) {
    return true;
  } else {
    return false;
  }
});

const stateShowsWritingReview = computed(() => {
  if (
        props.StateData && 
        props.StateData[0].state_type === 5
      ) {
    return true;
  } else {
    return false;
  }
});

const stateShowsRequirements = computed(() => {
  if (
        props.StateData && 
        props.StateData[0].state_type === 1 ||
        props.StateData[0].state_type === 2 ||
        props.StateData[0].state_type === 3 ||
        props.StateData[0].state_type === 4 ||
        props.StateData[0].state_type === 5 ||
        props.StateData[0].state_type === 7 ||
        props.StateData[0].state_type === 8
      ) {
    return true;
  } else {
    return false;
  }
});

const stateShowsApproved = computed(() => {
  if (
        props.StateData && 
        props.StateData[0].state_type === 6
      ) {
    return true;
  } else {
    return false;
  }
});

const noRequirements = computed(() => {
  if (props.DeliverableData.content.requirements === '' || props.DeliverableData.content.requirements === '<p></p>') {
    return true;
  } else {
    return false;
  }
});

</script>

<style lang="scss" scoped>

@use 'assets/variables' as *;

.document-content {
  display: flex;
  flex-direction: row;
  gap: $spacing-sm;
  position: relative;

  .navigation {
    display: flex;
    flex-direction: column;
    position: sticky;
    margin: $spacing-sm;
    top: $spacing-md;
    height: fit-content;
    width: 100%;
    min-width: 120px;
    max-width: 160px;
    background: $white;

    @media (max-width: 1000px) {
      display: none;
    }

    .nav-item {
      cursor: pointer;
      padding: $spacing-sm;
      border-radius: $br-lg;
      transition: all 0.2s ease;

      &.primary {
        background: rgba($brand, 0.05);
      }
    }
  }

  .documents {
    display: flex;
    flex-direction: column;
    gap: $spacing-sm;
    padding: $spacing-md;
    height: 100%;
    margin: 0 auto;
    width: 100%;

    .state-details {
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      align-content: center;
      padding: 0 0 $spacing-md 0;

      .state-buttons-wrap {
        display: flex;
        flex-direction: row;
        gap: $spacing-sm;
        border-radius: $br-lg;
        justify-content: space-between;
        align-items: center;
        border-radius: $br-xl $br-xl 0 0;
      }

      .state-intro {
        width: 100%;
        min-width: 240px;
        max-width: 400px;
        display: flex;
        flex-direction: row;
        align-items: center;
        gap: $spacing-xs;

        .state-name {
          font-size: $font-size-md;
        }
        
        .state-summary {
          color: $black;
          opacity: 0.5;
          display: flex;
          flex-direction: column;
          gap: $spacing-xxs;

        }

        p {
          margin: 0;
        }
      }

      .state-data {
        height: 100%;
        display: flex;
        flex-direction: row;
        gap: $spacing-sm;
        align-items: center;

        .due-date {
          font-size: $font-size-xxs;
          color: $brand;
          background: rgba($white, 1);
          border: 1px solid rgba($brand, 0.2);
          padding: 2px $spacing-xs;
          border-radius: $br-lg;
          margin: 0;
        }
      }
    }

    .tiptap-wrap {
      min-height: 100px;
      background: $white;
      padding: 0 $spacing-sm;
      position: relative;
      transition: border 0.2s ease;
      display: flex;
      flex-direction: column;
      border: $border;
      border-radius: $br-lg;

      &.current {
        border: 1px solid rgba($brand, 0.35);
      }

      &.collapsed {
        height: 58px;
        max-height: 58px;
        min-height: 58px;
        overflow: hidden;

        .tiptap-content {
          display: none;
        }
      }

      .type-label {
        position: relative;
        white-space: nowrap;
        position: relative;
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: flex-start;
        gap: $spacing-xxs;
        width: 100%;
        padding: $spacing-sm 0;
        font-size: $font-size-md;
        color: rgba($black, 1);
        cursor: pointer;

        &:hover {
          color: $brand;
        }

        .current-state {
          font-size: $font-size-xxs;
          color: $brand;
          background: rgba($brand, 0.1);
          padding: $spacing-xxs $spacing-sm;
          border-radius: $br-xl;
        }
      }

      .tiptap-content {
        display: flex;
        flex-direction: row;

        .approved-draft,
        .tiptap-content-readonly {
          margin: 0 0 $spacing-sm 0;
          padding: $spacing-sm;
          background: rgba($white, 1);
          border-radius: $br-lg;
          width: 100%;
          min-height: 100px;
          cursor: not-allowed;
          background: rgba($black, 0.025);
        }
      }

      .notification {
        position: absolute;
        z-index: 1;
        bottom: $spacing-sm;
        right: $spacing-sm;
        left: $spacing-sm;
      }

      &:last-child {
        margin-bottom: $spacing-xxl;
      }
    }

  }
}

</style>