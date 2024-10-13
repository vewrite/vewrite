import {ref} from 'vue';

export default function useWorkflowStateInstances() {

  const StateInstanceData = ref(null);
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
  //     - action_id: id
  //     - TODO: add more action properties
  async function createStateInstance(stateInstance) {
    try {
      const { data, error } = await supabase
        .from('stateinstances')
        .insert(stateInstance);

      if (error) throw error;

      return data;
    } catch (error) {
      alert(error.message);
    }
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

      return data;
    } catch (error) {
      alert(error.message);
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

      return data;
    } catch (error) {
      alert(error.message);
    }
  }


  return {
    StateInstanceData,
    StateInstanceError,
    createStateInstance,
    updateStateInstance,
    deleteStateInstance
  }

}