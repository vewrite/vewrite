import { ref } from 'vue';

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

export default function useWorkflowState() {

  const StateData = ref(null);
  const StateError = ref(null);
  const supabase = useSupabaseClient();
  const StateActions = ref([]);

  /*
  createState
  - Creates a new state
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
        .from('states')
        .insert(state);

      if (error) throw error;

      return data;
    } catch (error) {
      alert(error.message);
    }
  }

  /*
  updateState
  - Updates an existing state
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
        .from('states')
        .update(state)
        .eq('id', state.id);

      if (error) throw error;

      return data;
    } catch (error) {
      alert(error.message);
    }
  }

  /*
  deleteState
  - Deletes an existing state
  - Accepts an object with the following properties:
    - id: numeric
  */
  async function deleteState(state) {
    try {
      const { data, error } = await supabase
        .from('states')
        .delete()
        .eq('id', state.id);

      if (error) throw error;

      return data;
    } catch (error) {
      alert(error.message);
    }
  }

  /*
  listStates
  - Fetches all states
  */
  async function listStates() {
    try {
      const { data, error } = await supabase
        .from('states')
        .select('*');

      if (error) throw error;

      StateData.value = data;
    } catch (error) {
      StateError.value = error;
    }
  }

  /*
  fetchSingleState
  - Fetches a state by id
  - Accepts a stateId
  */
  async function fetchSingleState(stateId) {
    console.log('fetchSingleState', stateId);
    try {
      const { data, error } = await supabase
        .from('states')
        .select('*')
        .eq('id', stateId);

      if (error) throw error;

      StateData.value = data[0];
      // console.log(data[0]);
      // return data[0];
    } catch (error) {
      StateError.value = error;
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