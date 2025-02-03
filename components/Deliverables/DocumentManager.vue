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
          <section class="state-intro-top">
            <p class="state-summary">You're expected to</p>
            <h2>{{ StateData[0].instance_name }}</h2>
          </section>
          <section class="state-intro-bottom">
            <StateBar v-if="StateData" :StateData="StateData" :DeliverableData="DeliverableData" />
          </section>
        </div>
        <div class="state-data">
          <StateIntroData :project="DeliverableData.project" :DeliverableData="DeliverableData" /> 
        </div>
      </section>
      <div class="tiptap-wrap" ref="requirementsSection" v-if="props.DeliverableData && props.DeliverableData.content.hasRequirements" @mouseover="setSelectedSection('requirements')">
        <TipTapEditor :deliverable="props.DeliverableData" :type="'requirements'" />
      </div>
      <div class="tiptap-wrap" ref="outlineSection" v-if="props.DeliverableData && props.DeliverableData.content.hasOutline && stateShowsOutline" @mouseover="setSelectedSection('outline')">
        <TipTapEditor :deliverable="props.DeliverableData" :type="'outline'" />
      </div>
      <div class="tiptap-wrap" ref="draftSection" v-if="props.DeliverableData && props.DeliverableData.content.hasDraft && stateShowsWriting" @mouseover="setSelectedSection('draft')">
        <TipTapEditor :deliverable="props.DeliverableData" :type="'draft'" />
      </div>
      <div class="tiptap-wrap" ref="researchSection" v-if="props.DeliverableData && props.DeliverableData.content.hasResearch && stateShowsResearch" @mouseover="setSelectedSection('research')">
        <TipTapEditor :deliverable="props.DeliverableData" :type="'research'" />
      </div>

      <!-- 
      
        I still need:

        - outline review template
        - writing review template
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

const props = defineProps(['DeliverableData', 'StateData']);

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
        props.StateData[0].state_type === 2 ||
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
        props.StateData[0].state_type === 4 ||
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
    padding: $spacing-xs;
    margin: $spacing-sm;
    top: $spacing-md;
    height: fit-content;
    width: 100%;
    min-width: 180px;
    max-width: 240px;
    border: $border;
    border-radius: $br-xl;

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
      border-radius: $br-xl;
      border: 1px solid rgba($brand, .25);
      overflow: hidden;

      .state-intro {
        min-height: 200px;
        width: 100%;
        min-width: 240px;
        max-width: 400px;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        padding: $spacing-md;
        background: rgba($brand, 0.025);
        
        .state-summary {
          color: $brand;
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
        padding: $spacing-md;
        min-height: 200px;
        width: 100%;
      }
    }

    div.tiptap-wrap {
      min-height: 100px;

      &:last-child {
        margin-bottom: $spacing-xxl;
      }
    }

  }
}

</style>