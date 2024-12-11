import { defineStore } from 'pinia'

export const useDeliverableStore = defineStore('deliverableStore', {
  state: () => ({
    deliverableId: null,
    stateInstanceId: null,
  }),
  actions: {
    setDeliverableState(deliverableId, stateInstanceId) {
      console.log('setDeliverableState', deliverableId, stateInstanceId);
      this.deliverableId = deliverableId;
      this.stateInstanceId = stateInstanceId;
    }
  }
})

