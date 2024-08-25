import { ref } from 'vue';

export function useWorkflow() {

  const WorkflowData = ref(null);
  const WorkflowError = ref(null);
  const supabase = useSupabaseClient();

  async function fetchProjectWorkflow(workflowId) {

    console.log('fetchProjectWorkflow', workflowId);

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

  // function renderStateName(stateId) {
  //   const state = states.value.find(s => s.id === stateId);
  //   return state ? state.name : '';
  // }

  // async function fetchWorkflowStates(workflowId) {
  //   try {
  //     const { data, error } = await supabase
  //       .from('workflows')
  //       .select('states')
  //       .eq('id', workflowId);

  //     // Fetch the states as an array of integers
  //     states.value = data[0].states;

  //     // Fetch the states as an array of objects from the states table
  //     states.value = await Promise.all(states.value.map(async state => {
  //       // return await fetchState(state);
  //       const fetchedState = await fetchState(state);
  //       console.log(fetchedState);
  //       return {
  //         ...fetchedState
  //       }
  //     }));

  //     if (error) throw error;

  //   } catch (error) {
  //     alert(error.message);
  //   }
  // }

  // async function fetchState(stateId) {
  //   try {
  //     const { data, error } = await supabase
  //       .from('states')
  //       .select('*')
  //       .eq('id', stateId);

  //     if (error) throw error;

  //     return data[0];
  //   } catch (error) {
  //     alert(error.message);
  //   }
  // }

  return {
    fetchProjectWorkflow,
    WorkflowError,
    WorkflowData,
    // fetchWorkflowStates,
    // renderStateName
  }

}