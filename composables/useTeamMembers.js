import { ref } from 'vue';

export default function useTeamMembers() {

  const TeamMembersData = ref([]);
  const TeamMembersError = ref(null);
  const supabase = useSupabaseClient();

  async function addTeamMember(teamMember) {
    try {
      const { data, error } = await supabase
        .from('team_members')
        .insert(teamMember);

      if (error) throw error;

      return data;

    } catch (error) {
      TeamMembersError.value = error.message;
    }
  }

  async function deleteTeamMember(teamMemberId) {
    try {
      const { data, error } = await supabase
        .from('team_members')
        .delete()
        .eq('id', teamMemberId);

      if (error) throw error;

      return data;

    } catch (error) {
      TeamMembersError.value = error.message;
    }
  }

  async function fetchTeamMembers(teamId) {
    try {
      const { data, error } = await supabase
        .from('team_members')
        .select('*')
        .eq('team_id', teamId);

      if (error) throw error;

      TeamMembers.value = data;

      return data;

    } catch (error) {
      TeamMembersError.value = error.message;
    }
  }

  return {
    TeamMembersData,
    TeamMembersError,
    addTeamMember,
    deleteTeamMember,
    fetchTeamMembers
  }
}