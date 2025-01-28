<template>
  <!-- <pre class="state-data">
    {{StateData }}
  </pre> -->
  <section class="document-content">
    <section class="navigation">
      <div class="nav-item" @click="scrollToSection('stateDetails')" :class="{ 'primary': selectedSection === 'stateDetails' }">State Details</div>
      <div class="nav-item" @click="scrollToSection('requirements')" :class="{ 'primary': selectedSection === 'requirements' }">Requirements</div>
      <div class="nav-item" @click="scrollToSection('outline')" v-if="stateShowsOutline" :class="{ 'primary': selectedSection === 'outline' }">Outline</div>
      <div class="nav-item" @click="scrollToSection('draft')" v-if="stateShowsWriting" :class="{ 'primary': selectedSection === 'draft' }">Writing draft</div>
      <div class="nav-item" @click="scrollToSection('research')" v-if="stateShowsResearch" :class="{ 'primary': selectedSection === 'research' }">Research</div>
    </section>
    <section class="documents max-width xl">
      <section class="state-details" ref="stateDetails" @click="setSelectedSection('stateDetails')">
        <div class="state-intro">
          <p class="state-summary">You're expected to</p>
          <h2>{{ StateData[0].instance_name }}</h2>
        </div>
        <div class="state-data">
          <!-- 

            Show here:
            - The team associated with this project
            - The assigned user for this state
            - The due date for this state
          
          -->
          
          <!-- <Assigned :deliverable="props.DeliverableData" :state="StateData" /> -->
        </div>
      </section>
      <div class="tiptap-wrap" ref="requirementsSection" v-if="props.DeliverableData && props.DeliverableData.content.hasRequirements" @click="setSelectedSection('requirements')">
        <TipTapEditor :deliverable="props.DeliverableData" :type="'requirements'" />
      </div>
      <div class="tiptap-wrap" ref="outlineSection" v-if="props.DeliverableData && props.DeliverableData.content.hasOutline && stateShowsOutline" @click="setSelectedSection('outline')">
        <TipTapEditor :deliverable="props.DeliverableData" :type="'outline'" />
      </div>
      <div class="tiptap-wrap" ref="draftSection" v-if="props.DeliverableData && props.DeliverableData.content.hasDraft && stateShowsWriting" @click="setSelectedSection('draft')">
        <TipTapEditor :deliverable="props.DeliverableData" :type="'draft'" />
      </div>
      <div class="tiptap-wrap" ref="researchSection" v-if="props.DeliverableData && props.DeliverableData.content.hasResearch && stateShowsResearch" @click="setSelectedSection('research')">
        <TipTapEditor :deliverable="props.DeliverableData" :type="'research'" />
      </div>
    </section>



  </section>
</template>

<script setup>

import { ref, onMounted } from 'vue';
import Assigned from '~/components/Deliverables/Assigned.vue';

const props = defineProps(['DeliverableData', 'StateData']);

/*

Standard workflow is:

[
  43, // Getting started (new)
  44, // Gathering information (research)
  45, // Outline (outline)
  46, // Review (outline review)
  47, // Writing (writing)
  48, // Review (writing review)
  49  // Approved (approved)
]

StateTypes reference:

1. new
2. ready
3. outline
4. writing
5. review
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
        props.StateData[0].state_type === 5 ||
        props.StateData[0].state_type === 6 ||
        props.StateData[0].state_type === 7 ||
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

.state-data {
  min-height: 200px;
}

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
    top: $spacing-sm;
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
      border: $border;
      overflow: hidden;

      .state-intro {
        min-height: 200px;
        width: 100%;
        min-width: 180px;
        max-width: 300px;

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
      }
    }

    div.tiptap-wrap {
      min-height: 300px;

      &:last-child {
        margin-bottom: $spacing-xxl;
      }
    }

  }
}

</style>