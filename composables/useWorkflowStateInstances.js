import {ref} from 'vue';

export default function useWorkflowStateInstances() {

  const StateInstanceData = ref(null);
  const StateInstancesData = ref([]);
  const StateInstanceError = ref(null);
  const supabase = useSupabaseClient();

  // createStateInstance
  // - Creates a new state instance
  // - Accepts an object with the following properties:
  //   - created_at: timestamp
  //   - statetype: numeric, the id of the state type
  //   - created_by: uuid
  //   - assigned_to: uuid
  //   - actions: json of actions which include
  async function createStateInstance(stateInstance) {

    try {
      const { data, error } = await supabase
        .from('stateinstances')
        .insert(stateInstance);

      if (error) throw error;

      StateInstancesData.value.push(data[0].id);

      return data;

    } catch (error) {
      StateInstanceError.value = error;
      console.error('Error creating state instance:', error);
    }
  }

  async function createStateInstances(stateInstances) {
    // We'll iterate over each state instance and create it
    for (let i = 0; i < stateInstances.length; i++) {
      const stateInstance = stateInstances[i].state_instance;

      const { data, error } = await createStateInstance(stateInstance);

      if (error) throw error;
    }
    return StateInstancesData;
  }

  // updateStateInstance
  // - Updates an existing state instance
  async function updateStateInstance(stateInstance) {
    try {
      const { data, error } = await supabase
        .from('stateinstances')
        .update(stateInstance)
        .eq('id', stateInstance.id);

      if (error) throw error;

      StateInstanceData.value = data;
      return data;

    } catch (error) {
      StateInstanceError.value = error;
      console.error('Error updating state instance:', error);
    }
  }

  // deleteStateInstance
  // - Deletes an existing state instance
  async function deleteStateInstance(stateInstanceId) {
    try {
      const { data, error } = await supabase
        .from('stateinstances')
        .delete()
        .eq('id', stateInstanceId);

      if (error) throw error;

      StateInstanceData.value = data;
      return data;

    } catch (error) {
      StateInstanceError.value = error;
      console.error('Error deleting state instance:', error);
    }
  }

  async function fetchSingleStateInstance(stateInstanceId) {
    try {
      const { data, error } = await supabase
        .from('stateinstances')
        .select('*')
        .eq('id', stateInstanceId);

      if (error) throw error;

      StateInstanceData.value = data;
      return data;

    } catch (error) {
      StateInstanceError.value = error;
      console.error('Error fetching state instance:', error);
    }
  }

  async function fetchStateInstanceName(stateInstanceId) {
    try {
      const { data, error } = await supabase
        .from('stateinstances')
        .select('instance_name')
        .eq('id', stateInstanceId);

      if (error) throw error;

      StateInstanceData.value = data;
      return data;

    } catch (error) {
      StateInstanceError.value = error;
    }
  }

  return {
    StateInstanceData,
    StateInstancesData,
    StateInstanceError,
    createStateInstance,
    createStateInstances,
    updateStateInstance,
    deleteStateInstance,
    fetchSingleStateInstance,
    fetchStateInstanceName
  }

}