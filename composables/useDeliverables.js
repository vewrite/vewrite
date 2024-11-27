import { ref } from 'vue'
import { useRouter } from 'vue-router';
import { useModal } from '~/stores/modal'
import useWorkflow from '~/composables/useWorkflow'
import useProject from '~/composables/useProject'

export default function useDeliverables() {

  const DeliverableData = ref(null);
  const DeliverableError = ref(null);
  const supabase = useSupabaseClient();
  const DeliverableStates = ref([]);
  const router = useRouter();

  const { fetchProjectWorkflow, fetchStates, WorkflowData, WorkflowError } = useWorkflow();

  async function fetchProjectDeliverables(projectId) {
    try {
      const { data, error } = await supabase
        .from('deliverables')
        .select('*')
        .eq('project', projectId);

      if (error) throw error;

      return data;

    } catch (error) {
      DeliverableError.value = error.message;
    }
  }

  async function saveDeliverable(deliverable) {
    try {
      console.log('Updating deliverable', deliverable);
      
      const { error } = await supabase
        .from('deliverables')
        .update({ markdown: deliverable.markdown, updated_at: new Date() })
        .eq('id', deliverable.id);

      if (error) throw error;
    } catch (error) {
      alert(error.message);
    }
  }

  async function updateDeliverableTitle(deliverableId, title) {
    try {
      const { data, error } = await supabase
        .from('deliverables')
        .update({ title: title })
        .eq('id', deliverableId);

      if (error) throw error;

      return data;

    } catch (error) {
      DeliverableError.value = error.message;
    }
  }

  async function updateDeliverableDescription(deliverableId, description) {
    try {
      const { data, error } = await supabase
        .from('deliverables')
        .update({ description: description })
        .eq('id', deliverableId);

      if (error) throw error;

      return data;

    } catch (error) {
      DeliverableError.value = error.message;
    }
  }

  async function deleteProjectDeliverables(projectId) {
    console.log('Deleting all deliverables for project: ', projectId);
    try {
      const { data, error } = await supabase
        .from('deliverables')
        .delete()
        .eq('project', projectId);

      if (error) throw error;

      console.log(data);

      return data;

    } catch (error) {
      DeliverableError.value = error.message;
    }
  }
  
  async function fetchSingleProjectDeliverable(deliverableId) {
    try {
      const { data, error } = await supabase
        .from('deliverables')
        .select('*')
        .eq('id', deliverableId);

      if (error) throw error;

      DeliverableData.value = data[0];
      return data[0];

    } catch (error) {
      DeliverableError.value = error.message;
    }
  }

  function renderStateName(stateId) {
    const state = states.value.find(s => s.id === stateId);
    return state ? state.name : '';
  }

  async function fetchDeliverableStates(deliverableId) {
    try {
      const { data, error } = await supabase
        .from('deliverables')
        .select('states')
        .eq('id', deliverableId);

      // Fetch the states as an array of integers
      DeliverableStates.value = data[0].states;

      // Fetch the states as an array of objects from the states table
      DeliverableStates.value = await Promise.all(DeliverableStates.value.map(async state => {
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
        .from('statetypes')
        .select('*')
        .eq('id', stateId);

      if (error) throw error;

      return data[0];
    } catch (error) {
      alert(error.message);
    }
  }

  function createDeliverableModal(projectId) {
    useModal().setType('medium');
    useModal().setHeader('Create Deliverable');
    useModal().setContent('CreateDeliverableModal');
    useModal().toggleVisibility();
  }

  function deleteDeliverableModal() {
    useModal().setType('medium');
    useModal().setHeader('Delete Deliverable');
    useModal().setContent('DeleteDeliverableModal');
    useModal().toggleVisibility();
  }

  async function deleteDeliverable(deliverableId, projectId) {

    useModal().toggleLoading();
    
    try {
      const { data, error } = await supabase
        .from('deliverables')
        .delete()
        .eq('id', deliverableId);

      if (error) throw error;

      useModal().toggleVisibility();
      useModal().reset();

      router.push('/project/' + projectId);

      return data;

    } catch (error) {
      DeliverableError.value = error.message;
    }
  }


  async function updateDeliverableWorkflowState(deliverableId, newWorkflowState) {

    console.log('Updating deliverable workflow state', deliverableId, newWorkflowState);

    try {
      const { data, error } = await supabase
        .from('deliverables')
        .update({ workflow_state: newWorkflowState })
        .eq('id', deliverableId);
  
      if (error) throw error;
  
      return data;

    } catch (error) {
      console.error('Error updating deliverable:', error.message);
    }
  }

  async function createDeliverable(deliverable) {

    useModal().toggleLoading();

    // if(deliverable.type === 'markdown') {
    //   console.log('Deliverable is Markdown');
    //   deliverable.markdown = deliverable.markdown;
    //   delete deliverable.type;
    // }

    // if(deliverable.type === 'file') {
    //   console.log('Deliverable has a file');
    //   deliverable.file = deliverable.file;
    //   delete deliverable.type;
    // }

    // if(deliverable.type === 'link') {
    //   console.log('Deliverable has an external link');
    //   deliverable.link = deliverable.link;
    //   delete deliverable.type;
    // }

    const deliverableContent = ref({});

    if(deliverable.type === 'markdown') {
      deliverableContent.value = {
        type: 'markdown',
        content: 'Hello World'
      };
      delete deliverable.type;
    }

    if(deliverable.type === 'file') {
      deliverableContent.value = {
        type: 'file',
        content: deliverable.file
      };
      delete deliverable.type;
    }

    if(deliverable.type === 'link') {
      deliverableContent.value = {
        type: 'link',
        content: deliverable.link
      };
      delete deliverable.type;
    }

    let deliverableId;
    const projectId = deliverable.project;

    // const ProjectWorkflow = await fetchProjectWorkflow(deliverable.project);
    // const States = await fetchStates(ProjectWorkflow);
    const ProjectWorkflow = ref(null);
    const States = ref(null);

    try {
      ProjectWorkflow.value = await fetchProjectWorkflow(deliverable.project);
      console.log('Project Workflow:', ProjectWorkflow.value);
    } catch (error) {
      DeliverableError.value = error.message;
    }

    try {
      States.value = await fetchStates(ProjectWorkflow.value);
      console.log('States:', States.value);
    } catch (error) {
      DeliverableError.value = error.message;
    }

    try {

      let { data, error } = await supabase.from('deliverables').insert(deliverable, {
        returning: 'representation', // Return the value after inserting. We use this to identify the deliverables below
      })

      deliverableId = data[0].id;

      /* 
      We also need to set the deliverable state to the first state in the list
        1. Get the project id
        2. Get the workflow associated with that project
        3. Get the first state in the workflow
        4. Update the deliverable with the first state
      */

      console.log(States.value[0]);
      await updateDeliverableWorkflowState(data[0].id, States.value[0]);

      // if (error) throw error;

      // return data;

    } catch (error) {
      DeliverableError.value = error.message;
    }

    // For each state, I need a new deliverable_content row
    States.value.forEach(async (state) => {
      console.log(state);
      const deliverable = {
        project_id: projectId,
        deliverable_id: deliverableId,
        stateinstance_id: state,
        created_at: new Date(),
        updated_at: new Date(),
        content: deliverableContent.value
      }

      try {
        const { data, error } = await supabase
          .from('deliverable_content')
          .insert(deliverable);

        if (error) throw error;

        console.log('Deliverable created:', data[0]);
      } catch (error) {
        console.error('Error creating deliverable:', error);
      }
    });

    useModal().toggleVisibility();
    useModal().reset();
  }

  return {
    DeliverableData,
    DeliverableError,
    DeliverableStates,
    saveDeliverable,
    deleteDeliverable,
    updateDeliverableTitle,
    updateDeliverableDescription,
    createDeliverableModal,
    deleteDeliverableModal,
    createDeliverable,
    fetchSingleProjectDeliverable,
    fetchProjectDeliverables,
    fetchDeliverableStates,
    updateDeliverableWorkflowState,
    renderStateName,
    deleteProjectDeliverables
  }

}