import { ref } from 'vue';

export default function useTeamMembers() {

  const TeamMembersData = ref([]);
  const TeamMembersError = ref(null);
  const supabase = useSupabaseClient();

  async function addTeamMember(member) {

    // First remove the email property from the member object
    delete member.email;

    try {
      const { data, error } = await supabase
        .from('team_members')
        .insert(member);

      if (error) throw error;

      TeamMembersData.value = data;
      return data;

    } catch (error) {
      TeamMembersError.value = error.message;
    }
  }

  async function addTeamMembers(teamMembers, teamId) {
    try {

      Promise.all(teamMembers.map(async (teamMember) => {
        const { data, error } = await supabase
          .from('team_members')
          .insert({ ...teamMember, team_id: teamId });

        if (error) throw error;

        return data;
      }));

    } catch (error) {
      TeamMembersError.value = error.message;
    }

  }


  async function deleteTeamMember(user_id) {

    console.log('Deleting team member', user_id);

    try {
      const { data, error } = await supabase
        .from('team_members')
        .delete()
        .eq('user_id', user_id);

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

      return data;

    } catch (error) {
      TeamMembersError.value = error.message;
    }
  }

  function addTeamMembersModal() {
    useModal().setType('large');
    useModal().setHeader('Add Team Members');
    useModal().setContent('AddTeamMemberModal');
    useModal().toggleVisibility();
  }

  return {
    TeamMembersData,
    TeamMembersError,
    addTeamMember,
    deleteTeamMember,
    fetchTeamMembers,
    addTeamMembersModal
  }
}