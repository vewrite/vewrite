<template>
  <section class="deliverable-content">
    <section class="deliverable-manager" v-if="props.DeliverableData && props.StateData" @stateChange="handleStateChange">
    
      <Instructions :icon="'fluent:question-20-regular'" :title="'New deliverable'" :content="'You must add a quick summary of the requirement for this deliverable.'" v-if="StateData.name == 'new'" />
      <Instructions :icon="'fluent:question-20-regular'" :title="'Research deliverable'" :content="'Using the requirements in the previous state, it is time to do some research. You can use this state as a scratchpad for taking notes.'" v-if="StateData.name == 'research'" />
      <Instructions :icon="'fluent:question-20-regular'" :title="'Outline deliverable'" :content="'Using the research that you gathered in the previous state, it is time to build an outline.'" v-if="StateData.name == 'outline'" />
      <Instructions :icon="'fluent:question-20-regular'" :title="'Review deliverable'" :content="'You are the assigned stakeholder and this deliverable is awaiting your feedback.'" v-if="StateData.name == 'review'" />
      <Instructions :icon="'fluent:question-20-regular'" :title="'Write your deliverable'" :content="'It\'s time for you to write your deliverable. You can always jump back to previous states and reference your work.'" v-if="StateData.name == 'writing'" />
      <Instructions :icon="'fluent:question-20-regular'" :title="'Approved deliverable'" :content="'This deliverable has been approved by your stakeholder!'" v-if="StateData.name == 'approved'" />

      <div class="deliverable-editor" v-if="props.DeliverableData">
        
        <!-- Internal Editor - New Template -->
        <section class="state new" v-if="StateData.name == 'new'">
          <!-- <Instructions :icon="'fluent:question-20-regular'" :title="'New deliverable'" :content="'You must add a quick summary of the requirement for this deliverable.'" /> -->
          <TipTapEditor v-if="props.DeliverableData.content.type == 'markdown'" :deliverable="props.DeliverableData" :editable="editable" />
        </section>

        <!-- Internal Editor - Research Template -->
        <section class="state research" v-if="StateData.name == 'research'">
          <!-- <Instructions :icon="'mingcute:question-fill'" :title="'Research deliverable'" :content="'Using the requirements in the previous state, it is time to do some research. You can use this state as a scratchpad for taking notes.'" /> -->
          <TipTapEditor v-if="props.DeliverableData.content.type == 'markdown'" :deliverable="props.DeliverableData" :editable="editable" />
        </section>

        <!-- Internal Editor - Outline Template -->
        <section class="state outline" v-if="StateData.name == 'outline'">
          <!-- <Instructions :icon="'mingcute:question-fill'" :title="'Outline deliverable'" :content="'Using the research that you gathered in the previous state, it is time to build an outline.'" /> -->
          <TipTapEditor v-if="props.DeliverableData.content.type == 'markdown'" :deliverable="props.DeliverableData" :editable="editable" />
        </section>

        <!-- Internal Editor - Review Template -->
        <section class="state review" v-if="StateData.name == 'review'">
          <!-- <Instructions :icon="'mingcute:question-fill'" :title="'Review deliverable'" :content="'You are the assigned stakeholder and this deliverable is awaiting your feedback.'" /> -->
          <TipTapEditor v-if="props.DeliverableData.content.type == 'markdown'" :deliverable="props.DeliverableData" :editable="editable" :review="true" />
        </section>

        <!-- Internal Editor - Writing Template -->
        <section class="state writing" v-if="StateData.name == 'writing'">
          <!-- <Instructions :icon="'mingcute:question-fill'" :title="'Write your deliverable'" :content="'It\'s time for you to write your deliverable. You can always jump back to previous states and reference your work.'" /> -->
          <TipTapEditor v-if="props.DeliverableData.content.type == 'markdown'" :deliverable="props.DeliverableData" :editable="editable" />
        </section>

        <!-- Internal Editor - Approved Template -->
        <section class="state approved" v-if="StateData.name == 'approved'">
          <!-- <Instructions :icon="'mingcute:question-fill'" :title="'Approved deliverable'" :content="'This deliverable has been approved by your stakeholder!'" /> -->
          <TipTapEditor v-if="props.DeliverableData.content.type == 'markdown'" :deliverable="props.DeliverableData" :editable="false" />
        </section>
          
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
    <Comments v-if="props.DeliverableData && StateData && StateData.name == 'review'" :deliverable="props.DeliverableData" /> 
  </section>
</template>

<script setup>

import Instructions from '~/components/Deliverables/Instructions.vue';
import Comments from '~/components/Deliverables/Comments.vue';

// useUtils composable
import useUtils from '~/composables/useUtils';
const { copyToClipboard, openInNewTab } = useUtils();

const props = defineProps(['DeliverableData', 'StateData', 'editable']);

</script>

<style lang="scss" scoped>

@use 'assets/variables' as *;

.deliverable-content {
  display: flex;
  flex-direction: row;
  gap: $spacing-sm;
  height: 100%;
  padding: $spacing-sm;
  overflow: auto;
  scrollbar-width: thin;

  .deliverable-manager {
    height: fit-content;
    width: 100%;
  }

  // .deliverable-comments {
    // max-width: 300px;
    // width: 100%;
    // background: rgba($brand, 0.025);
    // border-radius: $br-lg;
    // padding: $spacing-sm;
    // position: sticky;
    // top: 0;
    // overflow-y: auto;
    // scrollbar-width: thin;
  // }
}

.deliverable-editor {
  height: 100%;
  position: relative;

  .state {
    height: 100%;
    position: relative;
    display: flex;
    flex-direction: column;
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