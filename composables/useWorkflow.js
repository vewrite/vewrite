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
- A way to get all projects that use a specific workflow

*/

export default function useWorkflow() {

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

    useModal().toggleLoading();

    try {
      const { data, error } = await supabase
        .from('workflows')
        .insert(workflow);

      useModal().reset();

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
  - Sets all projects that use the workflow to the default workflow
  */
  async function deleteWorkflow(workflowId) {
    const DEFAULT_WORKFLOW_ID = 1; // Replace with your actual default workflow ID

    useModal().toggleLoading();
  
    try {
      // Fetch all projects that use the workflow
      const { data: projects, error: fetchError } = await supabase
        .from('projects')
        .select('id')
        .eq('workflow', workflowId);
  
      if (fetchError) throw fetchError;
  
      // Update all projects to use the default workflow
      const projectIds = projects.map(project => project.id);
      if (projectIds.length > 0) {
        const { error: updateError } = await supabase
          .from('projects')
          .update({ workflow: DEFAULT_WORKFLOW_ID })
          .in('id', projectIds);
  
        if (updateError) throw updateError;
      }
  
      // Delete the workflow
      const { data, error: deleteError } = await supabase
        .from('workflows')
        .delete()
        .eq('id', workflowId);

      useModal().reset();
  
      if (deleteError) throw deleteError;
  
      return data;
    } catch (error) {
      alert(error.message);
    }
  }

  async function fetchWorkflows(uuid) {
    try {
      const { data, error } = await supabase
        .from('workflows')
        .select('*')
        .eq('created_by', uuid);

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

  async function fetchAssociatedProjects(workflowId) {
    try {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .eq('workflow', workflowId.value);

      if (error) throw error;

      return data;
    } catch (error) {
      alert(error.message);
    }
  }

  function createWorkflowModal() {
    useModal().setType('medium');
    useModal().setHeader('Create Workflow');
    useModal().setContent('CreateWorkflowModal');
    useModal().toggleVisibility();
  }

  function deleteWorkflowModal(workflowId) {
    useModal().setType('medium');
    useModal().setWorkflowId(workflowId);
    useModal().setHeader('Delete Workflow');
    useModal().setContent('DeleteWorkflowModal');
    useModal().toggleVisibility();
  }

  return {
    fetchWorkflows,
    fetchProjectWorkflow,
    WorkflowError,
    WorkflowData,
    WorkflowStates,
    createWorkflow,
    createWorkflowModal,
    deleteWorkflowModal,
    deleteWorkflow,
    fetchWorkflowStates,
    renderStateName,
    fetchAssociatedProjects
  }

}