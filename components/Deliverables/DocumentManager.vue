<template>

  <section class="document-content">
    <section class="navigation">
      <div class="nav-item" @click="scrollToSection('stateDetails')" :class="{ 'primary': selectedSection === 'stateDetails' }">State Manager</div>
      <div class="nav-item" @click="scrollToSection('requirements')" :class="{ 'primary': selectedSection === 'requirements' }">Requirements</div>
      <div class="nav-item" @click="scrollToSection('outline')" v-if="stateShowsOutline" :class="{ 'primary': selectedSection === 'outline' }">Outline</div>
      <div class="nav-item" @click="scrollToSection('draft')" v-if="stateShowsWriting" :class="{ 'primary': selectedSection === 'draft' }">Writing draft</div>
      <div class="nav-item" @click="scrollToSection('research')" v-if="stateShowsResearch" :class="{ 'primary': selectedSection === 'research' }">Research</div>
    </section>
    <section class="documents max-width xl" ref="stateDetails">

      <section class="state-details"  @mouseover="setSelectedSection('stateDetails')">
        <div class="state-intro">
          <p class="due-date">Due <span>{{ dueDate }}</span></p>
          <h2>{{ StateData[0].instance_name }}</h2>
          <StateBar v-if="StateData" :StateData="StateData" :DeliverableData="DeliverableData" />
        </div>
        <div class="state-data">
          <StateIntroData :project="DeliverableData.project" :DeliverableData="DeliverableData" /> 
        </div>
      </section>

      <div class="tiptap-wrap" ref="requirementsSection" v-if="props.DeliverableData && props.DeliverableData.content.hasRequirements" @mouseover="setSelectedSection('requirements')" :class="{ 'collapsed': !sections.requirements }">
        <div class="type-label" @click="toggleSection('requirements')">Requirements</div>
        <div class="tiptap-content">
          <span class="notification warning" v-if="noRequirements">It looks like your requirements are empty. You should fill them out so that your writer knows what to do.</span>
          <TipTapEditor :deliverable="props.DeliverableData" :type="'requirements'" />
        </div>
      </div>

      <div class="tiptap-wrap" ref="outlineSection" v-if="props.DeliverableData && props.DeliverableData.content.hasOutline && stateShowsOutline" @mouseover="setSelectedSection('outline')" :class="{ 'collapsed': !sections.outline }">
        <div class="type-label" @click="toggleSection('outline')">Outline</div>
        <div class="tiptap-content">
          <TipTapEditor :deliverable="props.DeliverableData" :type="'outline'" />
          <Comments :deliverable="props.DeliverableData" :type="'outline-review'" /> 
        </div>
      </div>

      <div class="tiptap-wrap" ref="outlineSection" v-if="props.DeliverableData && props.DeliverableData.content.hasOutline && stateShowsOutlineReview" @mouseover="setSelectedSection('outline')" :class="{ 'collapsed': !sections.outlinereview }">
        <div class="type-label" @click="toggleSection('outlinereview')">Outline Review</div>
        <div class="tiptap-content">
          <TipTapEditor :deliverable="props.DeliverableData" :type="'outlinereview'" :review="true" />
          <Comments :deliverable="props.DeliverableData" :type="'outline-review'" /> 
        </div>
      </div>

      <div class="tiptap-wrap" ref="draftSection" v-if="props.DeliverableData && props.DeliverableData.content.hasDraft && stateShowsWriting" @mouseover="setSelectedSection('draft')" :class="{ 'collapsed': !sections.draft }">
        <div class="type-label" @click="toggleSection('draft')">Draft</div>
        <div class="tiptap-content">
          <TipTapEditor :deliverable="props.DeliverableData" :type="'draft'" />
          <Comments :deliverable="props.DeliverableData" :type="'draft-review'" /> 
        </div>
      </div>

      <div class="tiptap-wrap" ref="draftSection" v-if="props.DeliverableData && props.DeliverableData.content.hasDraft && stateShowsWritingReview" @mouseover="setSelectedSection('draft')" :class="{ 'collapsed': !sections.draftreview }">
        <div class="type-label" @click="toggleSection('draftreview')">Draft Review</div>
        <div class="tiptap-content">
          <TipTapEditor :deliverable="props.DeliverableData" :type="'draftreview'" :review="true" />
          <Comments :deliverable="props.DeliverableData" :type="'draft-review'" /> 
        </div>
      </div>
      
      <div class="tiptap-wrap" ref="researchSection" v-if="props.DeliverableData && props.DeliverableData.content.hasResearch && stateShowsResearch" @mouseover="setSelectedSection('research')" :class="{ 'collapsed': !sections.research }">
        <div class="type-label" @click="toggleSection('research')">Research</div>
        <div class="tiptap-content">
          <TipTapEditor :deliverable="props.DeliverableData" :type="'research'" />
        </div>
      </div>

      <!-- 
      
        I still need:

        - approved template 
      
      -->
    </section>



  </section>
</template>

<script setup>

import { ref, onMounted } from 'vue';
import Assigned from '~/components/Deliverables/Assigned.vue';
import StateBar from '~/components/Deliverables/StateBar.vue';
import StateIntroData from '~/components/Deliverables/StateIntroData.vue';
import Comments from '~/components/Deliverables/Comments.vue';

const props = defineProps(['DeliverableData', 'StateData']);

// Collapsible sections state
const sections = ref({
  requirements: true,
  outline: true,
  research: true,
  draft: true,
  outlinereview: true,
  draftreview: true
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

const stateShowsOutline = computed(() => {
  if (
        props.StateData && 
        props.StateData[0].state_type === 3 ||
        props.StateData[0].state_type === 4 ||
        props.StateData[0].state_type === 6 ||
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
        props.StateData[0].state_type === 6 ||
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

const scrollToSection = (section) => {
  const sectionRef = {
    stateDetails: stateDetails,
    requirements: requirementsSection,
    outline: outlineSection,
    draft: draftSection,
    research: researchSection,
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
    min-width: 180px;
    max-width: 240px;
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
    padding: $spacing-sm;
    height: 100%;
    margin: 0 auto;

    .state-details {
      display: flex;
      flex-direction: row;
      gap: $spacing-xxs;

      .state-intro {
        width: 100%;
        min-width: 240px;
        max-width: 400px;
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        gap: $spacing-xs;

        .due-date {
          font-size: $font-size-xxs;
          color: $brand;
          background: rgba($brand, 0.1);
          padding: 2px $spacing-xs;
          border-radius: $br-lg;
          font-weight: bold;
          align-self: flex-start;
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

        h2 {
          margin: 0;
          color: $brand;
        }
      }

      .state-data {
        height: 100%;
        padding-top: $spacing-sm;
        width: 100%;
      }
    }

    .tiptap-wrap {
      min-height: 100px;
      background: $white;
      border-radius: $br-lg;
      border: $border;
      position: relative;
      transition: border 0.2s ease;
      display: flex;
      flex-direction: column;

      &.collapsed {
        height: 42px;
        max-height: 42px;
        min-height: 42px;
        overflow: hidden;

        .tiptap-content {
          display: none;
        }
      }

      .type-label {
        position: relative;
        white-space: nowrap;
        position: relative;
        align-self: flex-start;
        width: 100%;
        padding: $spacing-sm;
        border-bottom: $border;
        background: $white;
        border-radius: $br-lg $br-lg 0 0;
        font-size: $font-size-xs;
        color: rgba($black, 0.65);
        cursor: pointer;

        &:hover {
          background: rgba($black, 0.025);
        }
      }

      .tiptap-content {
        display: flex;
        flex-direction: row;
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