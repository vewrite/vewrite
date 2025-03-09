<template>

  <section class="link-content">
    
    <section class="links" ref="stateDetails">

      <section class="state-details max-width xl"  @mouseover="setSelectedSection('stateDetails')">
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
      <div class="link-wrap max-width xl" v-if="props.DeliverableData && props.DeliverableData.content.hasRequirements && stateShowsRequirements" :class="{ 'collapsed': !sections.requirements }">
        <div class="type-label" @click="toggleSection('requirements')">
          <Icon name="fluent:chevron-up-16-regular" size="1.5rem" v-if="!sections.requirements" />
          <Icon name="fluent:chevron-down-16-regular" size="1.5rem" v-if="sections.requirements" />
          Requirements
        </div>
        <DeliverableLink v-if="props.DeliverableData && props.DeliverableData.content.hasRequirements && stateShowsRequirements" :deliverable="DeliverableData" select="content.requirements" :link="DeliverableData.content.requirements" />
      </div>

      <!-- Outline and outline review -->
      <div class="link-wrap max-width xl" v-if="props.DeliverableData && props.DeliverableData.content.hasOutline && stateShowsOutline || stateShowsOutlineReview" :class="{ 'collapsed': !sections.outline }">
        <div class="type-label" @click="toggleSection('outline')">
          <Icon name="fluent:chevron-up-16-regular" size="1.5rem" v-if="!sections.outline" />
          <Icon name="fluent:chevron-down-16-regular" size="1.5rem" v-if="sections.outline" />
          <span v-if="stateShowsOutline">Outline</span>
          <span v-if="stateShowsOutlineReview">Outline Review</span>
        </div>
        <DeliverableLink v-if="props.DeliverableData && props.DeliverableData.content.hasOutline && stateShowsOutline || stateShowsOutlineReview" :deliverable="DeliverableData" select="content.outline" :link="DeliverableData.content.outline" />
      </div>

      <!-- Draft and draft review -->
      <div class="link-wrap max-width xl" v-if="props.DeliverableData && props.DeliverableData.content.hasDraft && stateShowsWriting || stateShowsWritingReview" :class="{ 'collapsed': !sections.draft }">
        <div class="type-label" @click="toggleSection('draft')">
          <Icon name="fluent:chevron-up-16-regular" size="1.5rem" v-if="!sections.draft" />
          <Icon name="fluent:chevron-down-16-regular" size="1.5rem" v-if="sections.draft" />
          <span v-if="stateShowsWriting">Draft</span>
          <span v-if="stateShowsWritingReview">Draft Review</span>
        </div>
        <DeliverableLink v-if="props.DeliverableData && props.DeliverableData.content.hasOutline && stateShowsWriting || stateShowsWritingReview" :deliverable="DeliverableData" select="content.draft" :link="DeliverableData.content.draft" />
      </div>

      <!-- Research -->
      <div class="link-wrap max-width xl" v-if="props.DeliverableData && props.DeliverableData.content.hasDraft && stateShowsResearch" :class="{ 'collapsed': !sections.research }">
        <div class="type-label" @click="toggleSection('research')">
          <Icon name="fluent:chevron-up-16-regular" size="1.5rem" v-if="!sections.research" />
          <Icon name="fluent:chevron-down-16-regular" size="1.5rem" v-if="sections.research" />
          Research
        </div>
        <DeliverableLink v-if="props.DeliverableData && props.DeliverableData.content.hasOutline && stateShowsResearch" :deliverable="DeliverableData" select="content.research" :link="DeliverableData.content.research" />
      </div>

      <!-- Approved -->
      <div class="link-wrap max-width xl" v-if="props.DeliverableData && props.DeliverableData.content.hasDraft && stateShowsApproved" :class="{ 'collapsed': !sections.approved }">
        <div class="type-label" @click="toggleSection('approved')">
          <Icon name="fluent:chevron-up-16-regular" size="1.5rem" v-if="!sections.approved" />
          <Icon name="fluent:chevron-down-16-regular" size="1.5rem" v-if="sections.approved" />
          Approved Draft
        </div>
        <DeliverableLink v-if="props.DeliverableData && props.DeliverableData.content.hasOutline && stateShowsApproved" :deliverable="DeliverableData" select="content.draft" :link="DeliverableData.content.draft" />
      </div>

      
    </section>



  </section>
</template>

<script setup>

import { ref, onMounted } from 'vue';

import ProjectWorkflow from '~/components/Deliverables/ProjectWorkflow.vue';
import StateIntroData from '~/components/Deliverables/StateIntroData.vue';
import Comments from '~/components/Deliverables/Comments.vue';
import DeliverableLink from '~/components/Deliverables/DeliverableLink.vue';

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
const selectedSection = ref(null);
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

const scrollToSection = (section) => {
  const sectionRef = {
    stateDetails: stateDetails,
    requirements: requirementsSection,
    outline: outlineSection,
    draft: draftSection,
    research: researchSection,
    approved: approvedSection,
  }[section];

  if (sectionRef && sectionRef.value) {
    sectionRef.value.scrollIntoView({ behavior: 'smooth' });
    selectedSection.value = section;
  }
};

const setSelectedSection = (section) => {
  selectedSection.value = section;
};

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

// Set the initial selected section when the component mounts. We'll always want to default to the state details
onMounted(() => {
  if (props.DeliverableData) {
    scrollToSection('stateDetails');
  }
});
</script>

<style lang="scss" scoped>

@use 'assets/variables' as *;

.link-content {
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

  .links {
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

    .link-wrap {
      min-height: 100px;
      background: rgba($black, 0.025);
      padding: 0 $spacing-sm;
      position: relative;
      transition: border 0.2s ease;
      display: flex;
      flex-direction: column;
      border-radius: $br-lg;

      &.collapsed {
        height: 46px;
        max-height: 46px;
        min-height: 46px;
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