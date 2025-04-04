import { ref } from 'vue';
import { useModal } from '~/stores/modal'

/*

STATES

A state is a step in a workflow. Each state can have actions associated with it,
and can be assigned to a user that is either part of your team, or who is a 
stakeholder that requires some visibility.

This means we need:

- A way to create a state, delete a state, update a state
- [ TODO ] A way to assign a state to a user
- [ TODO ] A way to assign an action to a state
- A way to list all states
- A way to get a state by id

*/

export default function useWorkflowStateTypes() {

  const StateData = ref(null);
  const StateError = ref(null);
  const supabase = useSupabaseClient();
  const StateActions = ref([]);

  /*
  createState
  - Creates a new statetypes
  - Accepts an object with the following properties:
    - created_at: timestamp
    - name: string
    - description: string
    - actions: array of action ids
    - icon: string
    - is_default: boolean
  */
  async function createState(state) {
    try {
      const { data, error } = await supabase
        .from('statetypes')
        .insert(state);

      if (error) throw error;

      return data;
    } catch (error) {
      StateError.value = error;
      console.log(StateError.value);
    }
  }

  /*
  updateState
  - Updates an existing statetypes
  - Accepts an object with the following properties:
    - name: string
    - description: string
    - actions: array of action ids
    - icon: string
    - is_default: boolean
  */
  async function updateState(state) {
    try {
      const { data, error } = await supabase
        .from('statetypes')
        .update(state)
        .eq('id', state.id);

      if (error) throw error;

      return data;
    } catch (error) {
      StateError.value = error;
      console.log(StateError.value);
    }
  }

  /*
  deleteState
  - Deletes an existing statetypes
  - Accepts an object with the following properties:
    - id: numeric
  */
  async function deleteState(state) {
    try {
      const { data, error } = await supabase
        .from('statetypes')
        .delete()
        .eq('id', state.id);

      if (error) throw error;

      return data;
    } catch (error) {
      StateError.value = error;
      console.log(StateError.value);
    }
  }

  /*
  listStates
  - Fetches all statetypes
  */
  async function listStates() {
    try {
      const { data, error } = await supabase
        .from('statetypes')
        .select('*');

      if (error) throw error;

      // StateData.value = data;

      return data;
    } catch (error) {
      StateError.value = error;
      console.log(StateError.value);
    }
  }

  async function fetchSingleState(stateId) {
    try {
      const { data, error } = await supabase
        .from('statetypes')
        .select('*')
        .eq('id', stateId);

      if (error) throw error;

      // StateData.value = data[0];
      return data[0];

    } catch (error) {
      StateError.value = error;
      console.log(StateError.value);
    }
  }

  return {
    StateData,
    StateError,
    StateActions,
    createState,
    updateState,
    deleteState,
    listStates,
    fetchSingleState
  }

}