import { ref } from 'vue';

export default function useGroup() {

  const GroupData = ref(null);
  const GroupError = ref(null);
  const supabase = useSupabaseClient();

  async function createGroup(owner_id) {

    console.log('Creating group for: ', owner_id);

    const InsertData = {
      owner_id: owner_id,
      created_at: new Date(),
    };

    try {

      const { data, error } = await supabase
        .from('groups')
        .insert(InsertData);

      if (error) throw error;

      console.log('Group created', data);
      GroupData.value = data;
      return data;

    } catch (error) {
      GroupError.value = error;
      console.error('Error creating group:', error.message);
    }
  }

  async function updateGroup(group) {
    try {
      const { data, error } = await supabase
        .from('groups')
        .update(group)
        .eq('id', group.id);

      if (error) throw error;

      return data;
    } catch (error) {
      GroupError.value = error;
      console.error('Error updating group:', error.message);
    }
  }

  // I'm not sure yet whether this will ever be used
  async function deleteGroup(group) {
    try {
      const { data, error } = await supabase
        .from('groups')
        .delete()
        .eq('id', group.id);

      if (error) throw error;

      return data;
    } catch (error) {
      GroupError.value = error;
      console.error('Error deleting group:', error.message);
    }
  }


  async function fetchSingleGroup(uuid) {
    try {
      const { data, error } = await supabase
        .from('groups')
        .select('*')
        .eq('owner_id', uuid);

      if (error) throw error;

      return data;
    } catch (error) {
      GroupError.value = error;
      console.error('Error fetching group:', error.message);
    }
  }

  async function fetchGroupId(owner_id) {
    try {
      const { data, error } = await supabase
        .from('groups')
        .select('id')
        .eq('owner_id', owner_id);

      if (error) throw error;

      GroupData.value = data[0];
      return data;

    } catch (error) {
      GroupError.value = error;
      console.error('Error fetching group:', error.message);
    }
  }

  return {
    GroupData,
    GroupError,
    createGroup,
    updateGroup,
    deleteGroup,
    fetchSingleGroup,
    fetchGroupId
  };

}