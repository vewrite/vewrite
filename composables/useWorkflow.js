import { ref } from 'vue';
import useWorkflowStateTypes from '~/composables/useWorkflowStateTypes';
import useWorkflowStateInstances from '~/composables/useWorkflowStateInstances';



export default function useWorkflow() {

  const WorkflowData = ref(null);
  const WorkflowError = ref(null);
  const supabase = useSupabaseClient();
  const WorkflowStates = ref([]);

  const { listStates, fetchSingleState } = useWorkflowStateTypes();
  const { createStateInstances, updateStateInstance, deleteStateInstance, StateInstanceData, StateInstancesData } = useWorkflowStateInstances();

  /*
  createWorkflow
  - Creates a new workflow
  - Accepts an object with the following properties:
    - name: string
    - description: string
    - created_by: uuid
    - states: json state instance ids
    - type: numeric, but will always be 2 as that is a custom workflow
    - completion_step: numeric, the state that the workflow ends on

    When I create a workflow, I'm creating both the workflow and the state instances
    These instances are created in the stateinstances table and require an object per instance

    This stateinstances object should contain:
      - created_at: timestamp
      - statetype: numeric, the id of the state type
      - created_by: uuid
      - assigned_to: uuid
      - actions: json of actions which include

  */
  async function createWorkflow(workflow, stateInstances) {

    useModal().toggleLoading();

    try {

      /*
      The expected flow here is to:
      1. Pass the instances into createStateInstances
      2. createStateInstances will iterate over each instance and pass them to createStateInstance
      3. createStateInstance will create the instance and push the ids of the created state instances to StateInstancesData
      4. We can then use the ids in StateInstancesData to update the workflow object
      */

      // First we'll create the state instances
      await createStateInstances(stateInstances);
      console.log("Final output of StateInstancesData is: ", StateInstancesData);
      
      // Now we'll update the workflow object with the state instance ids
      workflow.states = StateInstancesData;

      const { data: workflowData, error: workflowError } = await supabase
        .from('workflows')
        .insert(workflow);
  
      if (workflowError) throw workflowError;

  
      useModal().toggleVisibility();
      useModal().reset();
  
      // return { workflowData, stateInstancesData };
    } catch (error) {
      console.error('Error creating workflow and state instances:', error);
      throw error;
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
      WorkflowError.value = error.message;
      console.error('Error updating workflow:', error.message);
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

      useModal().toggleVisibility();
      useModal().reset();
  
      if (deleteError) throw deleteError;
  
      return data;
    } catch (error) {
      WorkflowError.value = error.message;
      console.error('Error deleting workflow:', error.message);
    }
  }
 
  async function fetchWorkflows(uuid) {
    try {
      const { data, error } = await supabase
        .from('workflows')
        .select('*')
        .or(`created_by.eq.${uuid},type.eq.1`);

      if (error) throw error;

      return data;

    } catch (error) {
      WorkflowError.value = error.message;
      console.error('Error fetching workflows:', error.message);
    }
  }

  async function fetchDefaultWorkflows() {
    try {
      const { data, error } = await supabase
        .from('workflows')
        .select('*')
        .eq('type', 1);

      if (error) throw error;

      return data;

    } catch (error) {
      WorkflowError.value = error.message;
      console.error('Error fetching workflows:', error.message);
    }
  }

  async function fetchProjectWorkflow(projectId) {

    console.log('Fetching workflow for project:', projectId);

    try {
      const { data, error } = await supabase
        .from('projects')
        .select('workflow')
        .eq('id', projectId);

      if (error) throw error;

      // await fetchWorkflowStates(data[0].workflow);

      WorkflowData.value = data[0];
      return data[0].workflow;

    } catch (error) {
      WorkflowError.value = error.message;
    }
  }

  function renderStateName(stateId) {
    const state = states.value.find(s => s.id === stateId);
    return state ? state.name : '';
  }

  async function fetchStates(workflowId) {
    try {
      const { data, error } = await supabase
        .from('workflows')
        .select('states')
        .eq('id', workflowId);

      if (error) throw error;

      return data[0].states;

    } catch (error) {
      WorkflowError.value = error.message;
      console.error('Error fetching states:', error.message);
    }
  }

  async function fetchWorkflowStates(workflowId) {

    console.log('Fetching states for workflow:', workflowId);

    try {
      const { data, error } = await supabase
        .from('workflows')
        .select('states')
        .eq('id', workflowId);

      // Fetch the states as an array of integers
      WorkflowStates.value = data[0].states;

      // Fetch the states as an array of objects from the states table
      WorkflowStates.value = await Promise.all(WorkflowStates.value.map(async state => {
        const fetchedState = await fetchState(state);
        return {
          ...fetchedState
        }
      }));

      if (error) throw error;

    } catch (error) {
      WorkflowError.value = error.message;
      console.error(error);
    }
  }

  async function fetchState(stateId) {
    try {
      const { data, error } = await supabase
        .from('statetypes')
        .select('*')
        .eq('id', stateId);

      if (error) throw error;

      return data[0];
    } catch (error) {
      WorkflowError.value = error.message;
      console.error('Error fetching state:', error.message);
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
      WorkflowError.value = error.message;
      console.error('Error fetching associated projects:', error.message);
    }
  }

  function createWorkflowModal() {
    useModal().setType('large');
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
    fetchStates,
    renderStateName,
    fetchAssociatedProjects
  }

}