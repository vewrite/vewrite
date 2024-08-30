import { ref } from 'vue';

export default function useDeliverables() {

  const DeliverableData = ref(null);
  const DeliverableError = ref(null);
  const supabase = useSupabaseClient();
  const DeliverableStates = ref([]);

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

    console.log('fetchProjectDeliverable', deliverableId);

    try {
      const { data, error } = await supabase
        .from('deliverables')
        .select('*')
        .eq('id', deliverableId);

      if (error) throw error;

      // DeliverableData.value = data[0];
      console.log(data[0]);
      
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
        .from('states')
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

  async function createDeliverable(deliverable) {

    console.log('Creating deliverable for project: ', deliverable.project);
    console.log(deliverable);

    console.log('Deliverable type: ', deliverable.type);

    if(deliverable.type === 'markdown') {
      console.log('Markdown');
      deliverable.markdown = '';
      delete deliverable.type;
    }

    if(deliverable.type === 'file') {
      console.log('File');
      deliverable.file = '';
      delete deliverable.type;
    }

    if(deliverable.type === 'link') {
      console.log('Link');
      deliverable.link = deliverable.link;
      delete deliverable.type;
    }

    // switch (deliverable.type) {
    //   case 0:
    //     console.log('Markdown');
    //     deliverable.markdown = '';
    //     delete deliverable.type;
    //     break;
    //   case 1:
    //     console.log('File');
    //     deliverable.file = '';
    //     delete deliverable.type;
    //     break;
    //   case 2:
    //     console.log('Link');
    //     deliverable.link = '';
    //     delete deliverable.type;
    //     break;
      
    //   default:
    //     deliverable.markdown = '';
    //     delete deliverable.type;
    // }

    try {
      const { data, error } = await supabase
        .from('deliverables')
        .insert(deliverable);

      useModal().reset();

      if (error) throw error;

      return data;

    } catch (error) {
      DeliverableError.value = error.message;
    }
  }

  return {
    DeliverableData,
    DeliverableError,
    DeliverableStates,
    createDeliverableModal,
    createDeliverable,
    fetchSingleProjectDeliverable,
    fetchProjectDeliverables,
    fetchDeliverableStates,
    renderStateName,
    deleteProjectDeliverables
  }

}