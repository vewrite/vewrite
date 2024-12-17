<template>
  <section class="deliverable-manager" v-if="props.DeliverableData && props.StateData" @stateChange="handleStateChange">
    <!-- New state -->
    <div class="deliverable-editor" v-if="props.DeliverableData">
      
      <!-- Internal Editor - New Template -->
      <section class="state new" v-if="StateData.name == 'new'">
        <Instructions :icon="'mingcute:question-fill'" :title="'New deliverable'" :content="'You must add a quick summary of the requirement for this deliverable.'" />
        <TipTapEditor v-if="props.DeliverableData.content.type == 'markdown'" :deliverable="props.DeliverableData" :editable="editable" />
      </section>

      <!-- Internal Editor - Research Template -->
      <section class="state research" v-if="StateData.name == 'research'">
        <Instructions :icon="'mingcute:question-fill'" :title="'Research deliverable'" :content="'You must add a quick summary of the requirement for this deliverable.'" />
        <TipTapEditor v-if="props.DeliverableData.content.type == 'markdown'" :deliverable="props.DeliverableData" :editable="editable" />
      </section>

      <!-- <TipTapEditor v-if="props.DeliverableData.content.type == 'markdown'" :deliverable="props.DeliverableData" :editable="editable" /> -->
        
      <!-- External Link -->
      <section class="external-link" v-if="props.DeliverableData.content.type == 'link'" >
        <section class="instruction-set">
          <p class="instruction-information">{{ props.StateData.name }} deliverable</p>
          <p>{{ props.StateData.description }}</p>
          <section class="link-set">
            <section class="link-content">
              <div class="form-input">
                <label for="external-link">This state's content location</label>
                <input name="external-link" class="link-value" type="text" v-model="props.DeliverableData.content.content" @input="updateDeliContent" />
              </div>
              <button class="button primary large" @click="openInNewTab(props.DeliverableData.content.content)">
                <Icon name="fluent:open-16-regular" size="1.5rem" />
              </button>
              <button class="button large" @click="copyToClipboard(props.DeliverableData.content.content)">
                <Icon name="fluent:copy-16-regular" size="1.5rem" />
              </button>
            </section>
          </section>
        </section>

        <section class="external-link-warning notification warning small" v-if="props.DeliverableData.content.content == ''">
          <Icon name="fluent:document-20-regular" size="3.5rem" />
          <section>
            <p><strong>No external link for this state</strong> - This deliverable does not have a link assigned. It's your job to create a new document and paste the link here.</p>
          </section>
        </section>
        
      </section>
    </div>
  </section>
</template>

<script setup>

import Instructions from '~/components/Deliverables/Instructions.vue';

// useUtils composable
import useUtils from '~/composables/useUtils';
const { copyToClipboard, openInNewTab } = useUtils();

const props = defineProps(['DeliverableData', 'StateData', 'editable']);

</script>

<style lang="scss" scoped>

@use 'assets/variables' as *;

.deliverable-manager {
  height: 100%;
  overflow-y: auto;
  overflow-x: hidden;
}

.deliverable-editor {
  height: 100%;
  position: relative;

  .state {
    height: 100%;
    position: relative;
  }
}

.external-link {
  display: flex;
  flex-direction: column;
  gap: $spacing-sm;
  max-width: 600px;
  width: 100%;
  margin: 0 auto;
  padding: 0 $spacing-sm;
  height: 100%;
  align-items: center;
  justify-content: center;

  .instruction-set {
    display: flex;
    flex-direction: column;
    width: 100%;

    .instruction-information {
      font-size: $font-size-xs;
      font-weight: bold;
      text-transform: capitalize;
    }

    .link-set {
      .link-content {
        display: flex;
        flex-direction: row;
        gap: $spacing-sm;

        .form-input {
          margin: 0;
        }
      }
    }
  }
}


</style>