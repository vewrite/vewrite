import { ref } from 'vue';

export default function useGroup() {

  const GroupData = ref(null);
  const GroupError = ref(null);
  const supabase = useSupabaseClient();

  async function createGroup(owner_id) {
    try {

      const newGroup = {
        owner_id: owner_id
      }

      const { data, error } = await supabase
        .from('groups')
        .insert(newGroup);

      if (error) throw error;

      GroupData.value = data[0];
      return data;

    } catch (error) {
      alert(error.message);
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
      alert(error.message);
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
      alert(error.message);
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
      alert(error.message);
    }
  }

  async function fetchGroupId(owner_id) {
    try {
      const { data, error } = await supabase
        .from('groups')
        .select('id')
        .eq('owner_id', owner_id);

      if (error) throw error;

      console.log('fetching group for owner_id', owner_id);
      console.log('fetched GroupId', data[0]);

      GroupData.value = data[0];
      return data;

    } catch (error) {
      alert(error.message);
      GroupError.value = error;
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