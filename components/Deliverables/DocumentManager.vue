<template>

  <section class="document-content">

    <section class="documents" ref="stateDetails">

      <section class="state-details max-width xl">
        <div class="state-buttons-wrap">
          <section class="state-intro">
            <ProjectWorkflow :DeliverableData="DeliverableData" :CurrentState="StateData[0].instance_name" />
          </section>
        </div>
        <div class="state-data">
          <p class="due-date">Deliverable due <span>{{ dueDate }}</span></p>
          <StateIntroData :project="DeliverableData.project" :DeliverableData="DeliverableData" /> 
        </div>
      </section>

      <!-- Requirements -->
      <!-- Always editable by the PM -->
      <div class="tiptap-wrap max-width xl" ref="requirementsSection" v-if="props.DeliverableData && props.DeliverableData.content.hasRequirements && stateShowsRequirements" :class="{ 'collapsed': !sections.requirements }">
        <div class="type-label" @click="toggleSection('requirements')">
          <Icon name="fluent:chevron-up-16-regular" size="1.5rem" v-if="!sections.requirements" />
          <Icon name="fluent:chevron-down-16-regular" size="1.5rem" v-if="sections.requirements" />
          Requirements
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
      <div class="tiptap-wrap max-width xl" ref="outlineSection" v-if="props.DeliverableData && props.DeliverableData.content.hasOutline && stateShowsOutline" :class="{ 'collapsed': !sections.outline }">
        <div class="type-label" @click="toggleSection('outline')">
          <Icon name="fluent:chevron-up-16-regular" size="1.5rem" v-if="!sections.outline" />
          <Icon name="fluent:chevron-down-16-regular" size="1.5rem" v-if="sections.outline" />
          Outline
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
      <div class="tiptap-wrap max-width xl" ref="outlineSection" v-if="props.DeliverableData && props.DeliverableData.content.hasOutline && stateShowsOutlineReview" :class="{ 'collapsed': !sections.outlinereview }">
        <div class="type-label" @click="toggleSection('outlinereview')">
          <Icon name="fluent:chevron-up-16-regular" size="1.5rem" v-if="!sections.outlinereview" />
          <Icon name="fluent:chevron-down-16-regular" size="1.5rem" v-if="sections.outlinereview" />
          Outline Review
        </div>
        <div class="tiptap-content">
          <TipTapEditor :deliverable="props.DeliverableData" :type="'outlinereview'"  v-if="route.meta.roles.reviewer == user.id" :review="true" />
          <div class="tiptap-content-readonly" v-html="DeliverableData.content.outline" v-else></div>
          <Comments :deliverable="props.DeliverableData" :type="'outline-review'" /> 
        </div>
      </div>

      <!-- Writing Draft -->
      <div class="tiptap-wrap max-width xl" ref="draftSection" v-if="props.DeliverableData && props.DeliverableData.content.hasDraft && stateShowsWriting" :class="{ 'collapsed': !sections.draft }">
        <div class="type-label" @click="toggleSection('draft')">
          <Icon name="fluent:chevron-up-16-regular" size="1.5rem" v-if="!sections.draft" />
          <Icon name="fluent:chevron-down-16-regular" size="1.5rem" v-if="sections.draft" />
          Draft
        </div>
        <div class="tiptap-content">
          <TipTapEditor :deliverable="props.DeliverableData" :type="'draft'"  v-if="route.meta.roles.writer == user.id" />
          <div class="tiptap-content-readonly" v-html="DeliverableData.content.draft" v-else></div>
          <Comments :deliverable="props.DeliverableData" :type="'draft-review'" /> 
        </div>
      </div>

      <!-- Draft Review -->
      <div class="tiptap-wrap max-width xl" ref="draftSection" v-if="props.DeliverableData && props.DeliverableData.content.hasDraft && stateShowsWritingReview" :class="{ 'collapsed': !sections.draftreview }">
        <div class="type-label" @click="toggleSection('draftreview')">
          <Icon name="fluent:chevron-up-16-regular" size="1.5rem" v-if="!sections.draftreview" />
          <Icon name="fluent:chevron-down-16-regular" size="1.5rem" v-if="sections.draftreview" />
          Draft Review
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
      <div class="tiptap-wrap max-width xl" ref="researchSection" v-if="props.DeliverableData && props.DeliverableData.content.hasResearch && stateShowsResearch" :class="{ 'collapsed': !sections.research }">
        <div class="type-label" @click="toggleSection('research')">
          <Icon name="fluent:chevron-up-16-regular" size="1.5rem" v-if="!sections.research" />
          <Icon name="fluent:chevron-down-16-regular" size="1.5rem" v-if="sections.research" />
          Research
        </div>
        <div class="tiptap-content">
          <TipTapEditor :deliverable="props.DeliverableData" :type="'research'"  v-if="route.meta.roles.writer == user.id"  />
          <div class="tiptap-content-readonly" v-html="DeliverableData.content.research" v-else></div>
        </div>
      </div>

      <!-- Approved Draft -->
      <div class="tiptap-wrap max-width xl" ref="approvedSection" v-if="props.DeliverableData && props.DeliverableData.content.hasResearch && stateShowsApproved" :class="{ 'collapsed': !sections.approved }">
        <div class="type-label" @click="toggleSection('approved')">
          <Icon name="fluent:chevron-up-16-regular" size="1.5rem" v-if="!sections.approved" />
          <Icon name="fluent:chevron-down-16-regular" size="1.5rem" v-if="sections.approved" />
          Approved Draft
        </div>
        <div class="tiptap-content">
          <section class="approved-draft" v-html="DeliverableData.content.draft"></section>
        </div>
      </div>
      
    </section>



  </section>
</template>

<script setup>

import { ref, onMounted } from 'vue';

import ProjectWorkflow from '~/components/Deliverables/ProjectWorkflow.vue';
import StateIntroData from '~/components/Deliverables/StateIntroData.vue';
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

const dueDate = computed(() => {
  if (props.DeliverableData) {
    return new Date(props.DeliverableData.due_date).toDateString();
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

      &.collapsed {
        height: 48px;
        max-height: 48px;
        min-height: 48px;
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