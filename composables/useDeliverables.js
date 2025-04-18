import { ref } from 'vue'
import { useRouter } from 'vue-router';
import { useModal } from '~/stores/modal'
import useWorkflow from '~/composables/useWorkflow'
import { format, parseISO } from 'date-fns'

export default function useDeliverables() {

  const DeliverableData = ref(null);
  const DeliverableError = ref(null);
  const DeliverableWorkflowStateData = ref(null);
  const DeliverableWorkflowStateError = ref(null);
  const supabase = useSupabaseClient();
  const DeliverableStates = ref([]);
  const router = useRouter();
  const useSelectedDate = () => {
    return useState('selected-date', () => null)
  }

  const { fetchProjectWorkflow, fetchStates, WorkflowData, WorkflowError } = useWorkflow();

  async function fetchDeliverable(deliverableId) {
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
      console.log("Couldn't update the deliverable: ", deliverable);
    }
  }

  async function saveDeliverableContent(deliverable) {
    try {
      console.log('Updating deliverable content', deliverable.content, "for deliverable: ", deliverable.id);
      
      const { error } = await supabase
        .from('deliverables')
        .update({ content: deliverable.content, updated_at: new Date() })
        .eq('id', deliverable.id);

      if (error) throw error;
    } catch (error) {
      console.log("Couldn't update the deliverable: ", deliverable);
    }
  }

  async function duplicateContentToNextState(deliverableId, currentStateId, nextStateId) {
    try {
      const { data, error } = await supabase
        .from('deliverable_content')
        .select('*')
        .eq('deliverable_id', deliverableId)
        .eq('stateinstance_id', currentStateId);

      if (error) throw error;

      const content = data[0].content;

      const newDeliverableContent = {
        project_id: data[0].project_id,
        deliverable_id: data[0].deliverable_id,
        stateinstance_id: nextStateId,
        created_at: new Date(),
        updated_at: new Date(),
        content: content,
        status: 0
      }

      const { data: newContent, error: newError } = await supabase
        .from('deliverable_content')
        .insert(newDeliverableContent);

      if (newError) throw newError;

      return newContent;
    } catch (error) {
      DeliverableError.value = error.message;
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
    // console.log('Fetching deliverable content for deliverable/state:', deliverableId, stateinstance_id);
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

  async function fetchDeliverableState(deliverable_id){
    try {
      const { data, error } = await supabase
        .from('deliverables')
        .select('*')
        .eq('id', deliverable_id)
        .single();
  
      if (error) throw error;
  
      DeliverableWorkflowStateData.value = data.workflow_state;
  
    } catch (error) {
      console.error(error);
    }
  }

  async function updateDeliverableContent(deliverableId, stateinstance_id, content) {
    try {
      const { data, error } = await supabase
        .from('deliverable_content')
        .update({ content: content })
        .eq('deliverable_id', deliverableId)
        .eq('stateinstance_id', stateinstance_id)

      if (error) throw error;

      return data;

    } catch (error) {
      console.log(error)
      DeliverableError.value = error.message;
    }
  }

  async function updateRoleAssignments(deliverableId, roleAssignments) {
    
    try {

      useModal().toggleLoading();

      const { data, error } = await supabase
        .from('deliverables')
        .update({ role_assignments: roleAssignments })
        .eq('id', deliverableId);

      if (error) throw error;

      useModal().toggleVisibility();
      useModal().reset();

      return data;

    } catch (error) {
      console.error('Error updating role assignments:', error.message);
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

  function addImageModal(deliverableId) {
    useModal().setType('large');
    useModal().setHeader('Add Image to Deliverable');
    useModal().setContent('AddImageModal');
    useModal().toggleVisibility();
  }

  function createDeliverableModal(projectId, selectedDate) {
    useModal().setType('large');
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

  function changeAssignmentsModal() {
    useModal().setType('medium');
    useModal().setHeader('Change Assignments');
    useModal().setContent('ChangeAssignmentsModal');
    useModal().toggleVisibility();
  }

  function approvalModal(workflowState, deliverableId, stateInstanceId, userId) {
    useModal().setProps([workflowState, deliverableId, stateInstanceId, userId]);
    useModal().setType('medium');
    useModal().setHeader('Approval');
    useModal().setContent('ApprovalModal');
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

  async function setDeliverableContentStatus(deliverableId, stateId, status) {
    try {
      const { data, error } = await supabase
        .from('deliverable_content')
        .update({ status: status })
        .eq('deliverable_id', deliverableId)
        .eq('stateinstance_id', stateId);

      if (error) throw error;

      return data;

    } catch (error) {
      console.error('Error updating deliverable content status:', error.message);
    }
  }

  async function updateDeliverableWorkflowState(deliverableId, newWorkflowState) {
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

  async function fetchDeliverableStateStatus(deliverableId, stateId) {
    try {
      const {data, error } = await supabase
        .from('deliverable_content')
        .select('status')
        .eq('deliverable_id', deliverableId)
        .eq('stateinstance_id', stateId)
      
      if (error) throw error;
  
      return data[0];
  
    } catch (error) {
      console.error('Error fetching state status:', error.message)
      error.value = error.message
    }
  }

  async function assignToRole(deliverableId, userId) {

    console.log('Assigning deliverable to user:', deliverableId, userId);

    try {
      const { data, error } = await supabase
        .from('deliverables')
        .update({ assigned_to: userId })
        .eq('id', deliverableId);

      if (error) throw error;

      return data;

    } catch (error) {
      console.error('Error assigning deliverable to user:', error.message);
    }
  }

  async function createDeliverable(deliverable) {

    console.log('Creating deliverable:', deliverable);

    try {

      useModal().toggleLoading();
      useModal().toggleVisibility();
      useModal().reset();

      let { data } = await supabase.from('deliverables').insert(deliverable, {
        returning: 'representation', 
      })

    } catch (error) {
      DeliverableError.value = error.message;
    }

  }

  function formatDate(date){
    // If date is already a string in ISO format
    let dateObj;
    
    if (typeof date === 'string') {
      // Parse the ISO string to a Date object
      dateObj = parseISO(date);
    } else {
      // Already a Date object
      dateObj = date;
    }
    
    // Format to yyyy-MM-dd and return
    return format(dateObj, 'yyyy-MM-dd');
  }
  
  const onDateSelect = async (deliverableId, newDate) => {
  
    try {
      // Convert date to date format for postgres using the format 'yyyy-MM-dd'
      let newDateConverted = formatDate(newDate);
      newDateConverted = new Date(newDateConverted);
      console.log('New date:', newDateConverted);
      
      // Update in database first
      await updateDeliverableDate(deliverableId, newDateConverted);
      
    } catch (error) {
      console.error('Error updating date:', error);
    }
  };
  
  const updateDeliverableDate = async (deliverableId, newDate) => {
    try {
      const { error } = await supabase
        .from('deliverables')
        .update({ due_date: newDate })
        .eq('id', deliverableId);
  
      if (error) throw error;
  
    } catch (error) {
      console.error('Error updating deliverable:', error.message);
    }
  };

  return {
    DeliverableData,
    DeliverableError,
    DeliverableWorkflowStateData,
    DeliverableWorkflowStateError,
    DeliverableStates,
    saveDeliverable,
    saveDeliverableContent,
    deleteDeliverable,
    fetchDeliverable,
    fetchDeliverableContentType,
    fetchDeliverableState,
    updateDeliverableTitle,
    updateDeliverableDescription,
    updateRoleAssignments,
    updateDeliverableContent,
    createDeliverableModal,
    deleteDeliverableModal,
    changeAssignmentsModal,
    addImageModal,
    approvalModal,
    createDeliverable,
    fetchSingleProjectDeliverable,
    fetchSingleProjectDeliverableByState,
    fetchDeliverableStateStatus,
    setDeliverableContentStatus,
    fetchProjectDeliverables,
    fetchDeliverableStates,
    updateDeliverableWorkflowState,
    renderStateName,
    deleteProjectDeliverables,
    duplicateContentToNextState,
    assignToRole,
    formatDate,
    onDateSelect,
    updateDeliverableDate,
    useSelectedDate
  }

}