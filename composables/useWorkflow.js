import { ref } from 'vue';

/*

WORKFLOWS

A workflow is a collection of states that a project can be in. Each state is a
step in the workflow.

Workflows can have actions associated with each state, which means that we 
should be able to select an action and run it when a project is in that state.

States are assigned to a specific user.

This means we need: 

- A way to create a workflow, delete a workflow, update a workflow
- A way to fetch a workflow and its states
- A way to create an action, delete an action, update an action


*/

export function useWorkflow() {

  const WorkflowData = ref(null);
  const WorkflowError = ref(null);
  const supabase = useSupabaseClient();
  const WorkflowStates = ref([]);

  /*
  createWorkflow
  - Creates a new workflow
  - Accepts an object with the following properties:
    - name: string
    - description: string
    - created_by: uuid
    - states: array of state ids
    - type: numeric, but will always be 2 as that is a custom workflow
    - completion_step: numeric, the state that the workflow ends on
  */
  async function createWorkflow(workflow) {
    try {
      const { data, error } = await supabase
        .from('workflows')
        .insert(workflow);

      if (error) throw error;

      return data;
    } catch (error) {
      alert(error.message);
    }
  }

  /*
  updateWorkflow
  - Updates an existing workflow
  - Accepts an object with the following properties:
    - id: uuid
    - name: string
    - description: string
    - created_by: uuid
    - states: array of state ids
    - type: numeric, but will always be 2 as that is a custom workflow
    - completion_step: numeric, the state that the workflow ends on
  */
  async function updateWorkflow(workflow) {
    try {
      const { data, error } = await supabase
        .from('workflows')
        .update(workflow)
        .eq('id', workflow.id);

      if (error) throw error;

      return data;
    } catch (error) {
      alert(error.message);
    }
  } 

  /*
  deleteWorkflow
  - Deletes a workflow
  - Accepts a workflowId
  */
  async function deleteWorkflow(workflowId) {
    try {
      const { data, error } = await supabase
        .from('workflows')
        .delete()
        .eq('id', workflowId);

      if (error) throw error;

      return data;
    } catch (error) {
      alert(error.message);
    }
  }

  async function fetchProjectWorkflow(workflowId) {

    try {
      const { data, error } = await supabase
        .from('workflows')
        .select('*')
        .eq('id', workflowId);

      if (error) throw error;

      WorkflowData.value = data[0];
    } catch (error) {
      WorkflowError.value = error.message;
    }
  }

  function renderStateName(stateId) {
    const state = states.value.find(s => s.id === stateId);
    return state ? state.name : '';
  }

  async function fetchWorkflowStates(workflowId) {
    try {
      const { data, error } = await supabase
        .from('workflows')
        .select('states')
        .eq('id', workflowId);

      // Fetch the states as an array of integers
      WorkflowStates.value = data[0].states;

      // Fetch the states as an array of objects from the states table
      WorkflowStates.value = await Promise.all(WorkflowStates.value.map(async state => {
        // return await fetchState(state);
        const fetchedState = await fetchState(state);
        // console.log(fetchedState);
        return {
          ...fetchedState
        }
      }));

      if (error) throw error;

    } catch (error) {
      alert(error.message);
    }
  }

  async function fetchState(stateId) {
    try {
      const { data, error } = await supabase
        .from('states')
        .select('*')
        .eq('id', stateId);

      if (error) throw error;

      return data[0];
    } catch (error) {
      alert(error.message);
    }
  }

  return {
    fetchProjectWorkflow,
    WorkflowError,
    WorkflowData,
    WorkflowStates,
    fetchWorkflowStates,
    renderStateName
  }

}