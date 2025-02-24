import { ref } from 'vue';
import { useModal } from '~/stores/modal'
import { useRouter } from 'vue-router';
import useTeamMembers from '~/composables/useTeamMembers'

export default function useTeam() {

  const TeamData = ref(null);
  const TeamError = ref(null);
  const supabase = useSupabaseClient();
  const TeamMembers = ref([]);
  const TeamsData = ref([]);
  const TeamsError = ref(null);
  const router = useRouter();
  const { fetchTeamMembers, TeamMembersData, TeamMembersError } = useTeamMembers();

  async function createTeam(team, UserId, UserEmail) {

    useModal().toggleLoading();

    console.log('Creating team', team);

    try {

      const { data, error } = await supabase
        .from('teams')
        .insert(team)
        .select();

      console.log('Team created:', data);

      if (error) throw error;

      // Now that we have the team_id, we can add the project manager as the first team member
      await addTeamMember(data[0].id, UserId, UserEmail);

      useModal().toggleVisibility();
      useModal().reset();

      return data;
      
    } catch (error) {
      TeamError.value = error.message;
      console.error('Error creating team:', error.message);
    }
  }

  async function updateTeam(team) {
    console.log('Updating team', team);

    try {
      const { data, error } = await supabase
        .from('teams')
        .update(team)
        .eq('id', team.id);

      if (error) throw error;

      return data;
      
    } catch (error) {
      TeamError.value = error.message;
      console.error('Error updating team:', error.message);
    }
  }

  async function deleteTeam(team_id) {

    // TODO - this must also delete team_members and projects associated with the team

    useModal().toggleLoading();

    try {
      const { data, error } = await supabase
        .from('teams')
        .delete()
        .eq('id', team_id);

      if (error) throw error;

      useModal().toggleVisibility();
      useModal().reset();

      router.push('/teams');

      return data;
    } catch (error) {
      TeamError.value = error.message;
      console.error('Error deleting team:', error.message);
    }
  }

  async function fetchSingleTeam(team_id) {
    try {
      const { data, error } = await supabase
        .from('teams')
        .select('*')
        .eq('id', team_id);

      if (error) throw error;

      TeamData.value = data[0];
      return data;

    } catch (error) {
      TeamError.value = error.message;
      console.error('Error fetching team:', error.message);
    }
  }

  async function fetchInvitedTeams(teams) {

    Promise.all(teams.map(async team => {
      try {
        const { data, error } = await supabase
          .from('teams')
          .select('*')
          .eq('id', team.team_id);

        if (error) throw error;

        TeamsData.value.push(data[0]);
        return data;

      } catch (error) {
        TeamError.value = error.message;
        console.error('Error fetching invited team:', error.message);
      }
    }))
  }

  async function fetchTeams(group_id) {
    try {
      const { data, error } = await supabase
        .from('teams')
        .select('*')
        .eq('group_id', group_id);

      if (error) throw error;

      TeamsData.value = data;
      
      TeamsData.value.forEach(team => {
        team.members = []
        team.projects = []
      })

      TeamsData.value = await Promise.all(data.map(async team => {
        TeamsData.members = []
        TeamsData.projects = []

        // TODO - when I have it ready, fetch the team members and projects like in the useClient composable
        
        try {
          // team.projects = await fetchTeamProjects(team.id);
          team.members = await fetchTeamMembers(team.id);
          TeamsData.members = await fetchTeamMembers(team.id);
        } catch (error) {
          TeamsError.value = error.message;
        }

        return {
          ...team
        }

      }))

    } catch (error) {
      TeamsError.value = error.message;
      console.error('Error fetching teams:', error.message);
    }
  }

  async function fetchOwnedTeams(group_id) {

    console.log('Fetching owned teams for group:', group_id);
    
    try {
      const { data, error } = await supabase
        .from('teams')
        .select('*')
        .eq('group_id', group_id);

      if (error) throw error;

      return data.length;

    } catch (error) {
      projectError.value = error.message;
    }
  }

  function createTeamModal() {
    useModal().setType('large');
    useModal().setHeader('Create Team');
    useModal().setContent('CreateTeamModal');
    useModal().toggleVisibility();
  }

  function deleteTeamModal(team_id) {
    useModal().setType('medium');
    useModal().setHeader('Delete Team');
    useModal().setContent('DeleteTeamModal');
    useModal().toggleVisibility();
  }

  async function addTeamMember(team_id, user_id) {
    try {
      const { data, error } = await supabase
        .from('team_members')
        .insert({ team_id, user_id });

      if (error) throw error;

      return data;
    } catch (error) {
      TeamError.value = error.message;
      console.error('Error adding team member:', error.message);
    }
  }

  async function deleteInvitedProfile(user_email) {
    try {
      const { data, error } = await supabase
        .from('invited_profiles')
        .delete()
        .eq('email', user_email);

      if (error) throw error;

      return data;
    } catch (error) {
      TeamError.value = error.message;
      console.error('Error deleting invited profile:', error.message);
    }
  }

  async function approveTeamMember(team_id, user_id, user_email) {
    // 1. Now that we have a user_id for the onboarded user, we can add them to the team_members table
    // 2. Then we must go into the invited_profiles table and delete the record
    
    try {
      await addTeamMember(team_id, user_id)
      await deleteInvitedProfile(user_email)
    } catch (error) {
      TeamError.value = error.message;
      console.error('Error approving team member:', error.message);
    }
  }

  async function rejectTeamMember(team_id, user_id, user_email) {
    try {
      await deleteInvitedProfile(user_email)
    } catch (error) {
      TeamError.value = error.message;
      console.error('Error rejecting team member:', error.message);
    }
  }

  return {
    TeamData,
    TeamsData,
    TeamError,
    TeamsError,
    TeamMembers,
    createTeam,
    updateTeam,
    deleteTeam,
    fetchTeams,
    fetchSingleTeam,
    fetchInvitedTeams,
    fetchOwnedTeams,
    createTeamModal,
    deleteTeamModal,
    approveTeamMember,
    rejectTeamMember
  }

}