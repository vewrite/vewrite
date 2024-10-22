import { ref } from 'vue';

export default function useGroup() {

  GroupData = ref(null);
  GroupError = ref(null);

  async function createGroup(group) {
    try {
      const { data, error } = await supabase
        .from('groups')
        .insert(group);

      if (error) throw error;

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

  return {
    GroupData,
    GroupError,
    createGroup,
    updateGroup,
    deleteGroup,
    fetchSingleGroup
  };

}