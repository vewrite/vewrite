import { ref } from 'vue';

export default function useTeamMembers() {

  const InvitedTeamMembersData = ref([]);
  const InvitedTeamMembersError = ref(null);
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

  async function deleteInvitedMember(email, teamId) {
    
    console.log('Deleting invited team member', email);

    try {
      const { data, error } = await supabase
        .from('invited_profiles')
        .delete()
        .eq('email', email)
        .eq('team_id', teamId);

      if (error) throw error;

      return data;

    } catch (error) {
      InvitedTeamMembersError.value = error.message;
    }
  }

  async function fetchTeamMembers(teamId) {
    try {
      const { data, error } = await supabase
        .from('team_members')
        .select('*')
        .eq('team_id', teamId);

      if (error) throw error;

      TeamMembersData.value = data;
      return data;

    } catch (error) {
      TeamMembersError.value = error.message;
    }
  }

  async function fetchInvitedTeamMembers(teamId) {
    try {
      const { data, error } = await supabase
        .from('invited_profiles')
        .select('*')
        .eq('team_id', teamId);

      if (error) throw error;

      InvitedTeamMembersData.value = data;
      return data;

    } catch (error) {
      InvitedTeamMembersError.value = error.message;
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
    InvitedTeamMembersData,
    InvitedTeamMembersError,
    addTeamMember,
    deleteTeamMember,
    deleteInvitedMember,
    fetchTeamMembers,
    fetchInvitedTeamMembers,
    addTeamMembersModal
  }
}