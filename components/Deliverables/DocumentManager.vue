<template>
  <section class="document-content">
    <section class="navigation">
      <button @click="scrollToSection('requirements')" :class="{ 'primary': selectedSection === 'requirements' }">Requirements</button>
      <button @click="scrollToSection('outline')" :class="{ 'primary': selectedSection === 'outline' }">Outline</button>
      <button @click="scrollToSection('draft')" :class="{ 'primary': selectedSection === 'draft' }">Writing draft</button>
      <button @click="scrollToSection('research')" :class="{ 'primary': selectedSection === 'research' }">Research</button>
    </section>
    <section class="documents max-width xl">
      <div ref="requirementsSection" v-if="props.DeliverableData && props.DeliverableData.content.hasRequirements" @click="setSelectedSection('requirements')">
        <TipTapEditor :deliverable="props.DeliverableData" :type="'requirements'" />
      </div>
      <div ref="outlineSection" v-if="props.DeliverableData && props.DeliverableData.content.hasOutline" @click="setSelectedSection('outline')">
        <TipTapEditor :deliverable="props.DeliverableData" :type="'outline'" />
      </div>
      <div ref="draftSection" v-if="props.DeliverableData && props.DeliverableData.content.hasDraft" @click="setSelectedSection('draft')">
        <TipTapEditor :deliverable="props.DeliverableData" :type="'draft'" />
      </div>
      <div ref="researchSection" v-if="props.DeliverableData && props.DeliverableData.content.hasResearch" @click="setSelectedSection('research')">
        <TipTapEditor :deliverable="props.DeliverableData" :type="'research'" />
      </div>
    </section>
  </section>
</template>

<script setup>
import { ref, onMounted } from 'vue';

const props = defineProps(['DeliverableData', 'StateData']);

const requirementsSection = ref(null);
const outlineSection = ref(null);
const draftSection = ref(null);
const researchSection = ref(null);

const selectedSection = ref(null);

const scrollToSection = (section) => {
  const sectionRef = {
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

// Set the initial selected section when the component mounts
onMounted(() => {
  if (props.DeliverableData) {
    if (props.DeliverableData.content.hasRequirements) {
      scrollToSection('requirements');
    } else if (props.DeliverableData.content.hasOutline) {
      scrollToSection('outline');
    } else if (props.DeliverableData.content.hasDraft) {
      scrollToSection('draft');
    } else if (props.DeliverableData.content.hasResearch) {
      scrollToSection('research');
    }
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
    gap: $spacing-sm;
    align-items: flex-start;
    position: sticky;
    padding: $spacing-sm;
    top: $spacing-sm;
    height: fit-content;
    max-width: 400px;
  }

  .documents {
    display: flex;
    flex-direction: column;
    gap: $spacing-sm;
    padding: $spacing-sm;
    height: 100%;
    margin: 0 auto;

    div {
      border-bottom: 1px dashed rgba($black, 0.15);
      min-height: 300px;

      &:last-child {
        margin-bottom: $spacing-xxl;
        border-bottom: none;
      }
    }

  }
}

</style>