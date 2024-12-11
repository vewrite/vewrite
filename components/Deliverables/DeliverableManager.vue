<template>
  <section class="deliverable-manager" v-if="props.DeliverableData && props.StateData" @stateChange="handleStateChange">
    <!-- New state -->
    <div class="deliverable-editor" v-if="props.DeliverableData">
      
      <!-- Internal Editor  -->
      <TipTapEditor v-if="props.DeliverableData.content.type == 'markdown'" :deliverable="props.DeliverableData" :editable="editable" />
        
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

        <section class="external-link-warning notification warning" v-if="props.DeliverableData.content.content == ''">
          <Icon name="fluent:document-20-regular" size="3.5rem" />
          <section>
            <h4>No external link for this state</h4>
            <p>This deliverable does not have a link assigned. It's your job to create a new document and paste the link here.</p>
          </section>
        </section>
        
      </section>
    </div>
  </section>
</template>

<script setup>

// useUtils composable
import useUtils from '~/composables/useUtils';
const { copyToClipboard, openInNewTab } = useUtils();

const props = defineProps(['DeliverableData', 'StateData', 'editable']);

watch(() => props.DeliverableData, async () => {
  console.log('(DeliverableManager) DeliverableData changed:', props.DeliverableData);
});

async function handleStateChange({ deliverableId, newState }){
  console.log('State changed:', deliverableId, newState);
}

</script>

<style lang="scss" scoped>

@use 'assets/variables' as *;

.deliverable-manager {
  height: 100%;
  overflow-y: auto;
  overflow-x: hidden;
}

</style>