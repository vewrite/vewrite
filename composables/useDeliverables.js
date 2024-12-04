import { ref } from 'vue'
import { useRouter } from 'vue-router';
import { useModal } from '~/stores/modal'
import useWorkflow from '~/composables/useWorkflow'

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
        .update(deliverable)
        .eq('id', deliverable.id);

      if (error) throw error;
    } catch (error) {
      alert(error.message);
    }
  }

  async function saveDeliverableContent(deliverable) {
    try {
      console.log('Updating deliverable', deliverable);
      
      const { error } = await supabase
        .from('deliverable_content')
        .update({ content: deliverable.content, updated_at: new Date() })
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
        .from('deliverable_content')
        .delete()
        .eq('project_id', projectId);

      if (error) throw error;
      
    } catch (error) {
      DeliverableError.value = error.message;
    }

    console.log('Deleted all deliverable content for project: ', projectId);

    try {
      const { data, error } = await supabase
        .from('deliverables')
        .delete()
        .eq('project', projectId);

      if (error) throw error;

      console.log('Deleted project deliverables', data);

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

  async function fetchSingleProjectDeliverableByState(deliverableId, stateinstance_id) {
    console.log('Fetching deliverable content for deliverable and state:', deliverableId, stateinstance_id);
    try {
      const { data, error } = await supabase
        .from('deliverable_content')
        .select('*')
        .eq('deliverable_id', deliverableId)
        .eq('stateinstance_id', stateinstance_id);

      if (error) throw error;

      DeliverableData.value = data[0];
      return data[0];

    } catch (error) {
      DeliverableError.value = error.message;
    }
  }

  async function updateDeliverableContent(deliverableId, stateinstance_id, content) {
    try {
      const { data, error } = await supabase
        .from('deliverable_content')
        .select('*')
        .eq('deliverable_id', deliverableId)
        .eq('stateinstance_id', stateinstance_id)
        .update({ content: content });

      if (error) throw error;

      return data;

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

  async function fetchDeliverableContentType(deliverableId, stateId){
    try {
      const { data, error } = await supabase
        .from('deliverable_content')
        .select('*')
        .eq('deliverable_id', deliverableId)
        .eq('stateinstance_id', stateId)

      if (error) throw error;

      return data

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
        .from('deliverable_content')
        .delete()
        .eq('deliverable_id', deliverableId);

      if (error) throw error;

    } catch (error) {
      DeliverableError.value = error.message;
    }
    
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

    console.log('Creating deliverable:', deliverable);

    useModal().toggleLoading();

    const deliverableContent = ref({});

    if(deliverable.type === 'markdown') {
      deliverableContent.value = {
        type: 'markdown',
        content: ''
      };
      console.log('Markdown content:', deliverableContent.value);
      delete deliverable.markdown;
    }

    // if(deliverable.type === 'file') {
    //   deliverableContent.value = {
    //     type: 'file',
    //     content: deliverable.file
    //   };
    //   delete deliverable.type;
    // }

    if(deliverable.type === 'link') {
      deliverableContent.value = {
        type: 'link',
        content: deliverable.link
      };
      console.log('Link content:', deliverableContent.value);
      delete deliverable.link;
    }

    const deliverableId = ref(null);
    const projectId = deliverable.project;
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

      delete deliverable.type;

      console.log('Last try Creating deliverable:', deliverable);

      let { data } = await supabase.from('deliverables').insert(deliverable, {
        returning: 'representation', // Return the new deliverable id
      })

      deliverableId.value = data[0].id;

      // We also need to set the deliverable state to the first state in the list
      await updateDeliverableWorkflowState(data[0].id, States.value[0]);

    } catch (error) {
      DeliverableError.value = error.message;
    }

    // For each state, I need a new deliverable_content row
    for (let i = 0; i < States.value.length; i++) {
      
      const state = States.value[i];

      if (i == 0) {
        // First state of a link will already have its value filled in by the project manager
        deliverable = {
          project_id: projectId,
          deliverable_id: deliverableId.value,
          stateinstance_id: state,
          created_at: new Date(),
          updated_at: new Date(),
          content: deliverableContent.value
        }
      } else {
        deliverable = {
          project_id: projectId,
          deliverable_id: deliverableId.value,
          stateinstance_id: state,
          created_at: new Date(),
          updated_at: new Date(),
          content: {
            type: 'link',
            content:''
          }
        }
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
    };

    useModal().toggleVisibility();
    useModal().reset();
  }

  return {
    DeliverableData,
    DeliverableError,
    DeliverableStates,
    saveDeliverable,
    saveDeliverableContent,
    deleteDeliverable,
    fetchDeliverableContentType,
    updateDeliverableTitle,
    updateDeliverableDescription,
    createDeliverableModal,
    deleteDeliverableModal,
    createDeliverable,
    fetchSingleProjectDeliverable,
    fetchSingleProjectDeliverableByState,
    updateDeliverableContent,
    fetchProjectDeliverables,
    fetchDeliverableStates,
    updateDeliverableWorkflowState,
    renderStateName,
    deleteProjectDeliverables
  }

}