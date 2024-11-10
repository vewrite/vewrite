<template>
  <section class="state-manager-panel" v-if="props.states.length > 0" :class="collapsed ? 'collapsed' : ''">
    <div class="button clear toggle-panel" @click="toggleStateManagerPanel">
      <Icon name="fluent:chevron-double-right-16-regular" size="1rem" v-if="!collapsed" />
      <Icon name="fluent:chevron-double-left-16-regular" size="1rem" v-if="collapsed" />
    </div>
    <Loading v-if="loading" type="small" />
    <section v-else class="state-manager-wrapper">
      <div class="state-manager-buttons">
        <StateButton v-if="!loading && currentPositionInWorkflow == 0" type="disabledPrev" />
        <StateButton v-if="!loading && currentPositionInWorkflow > 0" :deliverableId="deliverable.id" :state="states[previousPositionInWorkflow]" type="moveToPrev" />
        <StateButton v-if="!loading && currentPositionInWorkflow < states.length - 1" :deliverableId="deliverable.id" :state="states[nextPositionInWorkflow]" type="moveToNext" />
        <StateButton v-if="!loading && currentPositionInWorkflow >= states.length - 1" type="disabledNext" />
      </div>
      <div class="state-manager-workflow">
        <div class="workflow-progress">
          <div class="progress-bar">
            <div class="progress" :style="{ height: (currentPositionInWorkflow + 1) / states.length * 100 + '%' }"></div>
          </div>
        </div>
        <section class="single-workflow">
          <!-- <StateRow v-for="state in states" :key="state" :deliverableId="deliverable.id" :state="state" :status="states[currentPositionInWorkflow] == state ? 'current' : 'default'" /> -->
          <StateRow
            v-for="(state, index) in states"
            :key="state"
            :deliverableId="deliverable.id"
            :state="state"
            :status="getStatus(index)"
          />
        </section>
      </div>
    </section>
  </section>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import StateButton from '~/components/States/StateButton.vue';
import StateRow from '~/components/States/StateRow.vue';

const props = defineProps(['deliverable', 'states']);

const currentPositionInWorkflow = ref(null);
const previousPositionInWorkflow = ref(null);
const nextPositionInWorkflow = ref(null);

const loading = ref(true);

const collapsed = ref(false)

function toggleStateManagerPanel() {
  collapsed.value = !collapsed.value
}

watch(() => props.states, () => {
  loading.value = true;
  currentPositionInWorkflow.value = props.states.findIndex((state) => state == props.deliverable.workflow_state);
  
  if (currentPositionInWorkflow.value == 0) {
    previousPositionInWorkflow.value = 0;
  } else {
    previousPositionInWorkflow.value = currentPositionInWorkflow.value - 1;
  }
  
  if (currentPositionInWorkflow.value == props.states.length - 1) {
    nextPositionInWorkflow.value = props.states.length;
  } else {
    nextPositionInWorkflow.value = currentPositionInWorkflow.value + 1;
  }
  
  loading.value = false;
});

function getStatus(index) {
  if (index === currentPositionInWorkflow.value) {
    return 'current';
  } else if (index < currentPositionInWorkflow.value) {
    return 'complete';
  } else {
    return '';
  }
}

</script>

<style scoped lang="scss">

@use 'assets/variables' as *;

.state-manager-panel {
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  border-left: $border;
  height: 100%;
  width: 480px;
  position: relative;
  background-color: $white;
  transition: width 0.3s ease;
  overflow: hidden;

  &.collapsed {
    width: 16px;

    .state-manager-wrapper {

      .state-manager-buttons {
        overflow: hidden;
      }

      .state-manager-workflow {
        overflow: hidden;
      }
    }
  }

  .toggle-panel {
    height: 100%;
    background-color: $white;
    border: none;
    border-radius: 0;
    border-right: $border;
    color: rgba($brand, 0.75);
    position: absolute;
    left: 0;
    top: 0;
    bottom: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    pointer-events: all;
    padding: 0;
    z-index: 1000;
    box-shadow: none;

    &:hover {
      color: $brand;
    }
  }

  .state-manager-wrapper {
    display: flex;
    flex-direction: column;
    gap: $spacing-xs;
    width: 100%;
    padding: 0 0 0 $spacing-sm;
    height: 100%;

    .state-manager-buttons {
      height: auto;
      transition: width, padding 0.3s ease;
      display: grid;
      grid-template-columns: 1fr 1fr;
      padding: $spacing-sm;
      width: 100%;
      gap: $spacing-xs;
    }

    .state-manager-workflow {
      display: flex;
      flex-direction: row;
      gap: $spacing-xs;
      padding: $spacing-sm;
      position: relative;
      height: auto;

      .workflow-progress {
        width: 12px;
        height: calc(100% + 20px);
        margin-top: -10px;
        border: $border;
        border-radius: $br-md;
        padding: 2px;

        .progress-bar {
          width: 100%;
          height: 100%;
          background-color: $white;
          border-radius: $br-md;
          overflow: hidden;

          .progress {
            width: 100%;
            background: linear-gradient(to bottom, $mint, $mint 80%, $brand 100%);
            border-radius: $br-md;
            transition: height 0.3s ease;
          }
        }
      }

      .single-workflow {
        display: flex;
        flex-direction: column;
        gap: $spacing-xs;
        width: 100%;
      }
    }
  }
}

</style>