import { ref } from 'vue';
import { useModal } from '~/stores/modal'
import { useRouter } from 'vue-router';

export default function useTeam() {

  const TeamData = ref(null);
  const TeamError = ref(null);
  const supabase = useSupabaseClient();
  const TeamMembers = ref([]);
  const Teams = ref([]);
  const router = useRouter();

  async function createTeam(team) {

    useModal().toggleLoading();

    try {
      const { data, error } = await supabase
        .from('teams')
        .insert(team);

      if (error) throw error;

      useModal().toggleVisibility();
      useModal().reset();

      return data;
      
    } catch (error) {
      alert(error.message);
    }
  }

  async function updateTeam(team) {
    console.log('Updating team', team);

    try {
      const { data, error } = await supabase
        .from('teams')
        .update(team)
        .eq('id', team[0].id);

      if (error) throw error;

      return data;
    } catch (error) {
      alert(error.message);
    }
  }

  async function deleteTeam(team_id) {

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
      alert(error.message);
    }
  }

  async function fetchSingleTeam(team_id) {
    try {
      const { data, error } = await supabase
        .from('teams')
        .select('*')
        .eq('id', team_id);

      if (error) throw error;

      TeamData.value = data;
      return data;

    } catch (error) {
      alert(error.message);
    }
  }

  async function fetchTeams(group_id) {
    try {
      const { data, error } = await supabase
        .from('teams')
        .select('*')
        .eq('group_id', group_id);

      if (error) throw error;

      TeamData.value = data;
      
      TeamData.value.forEach(team => {
        team.members = []
        team.projects = []
      })

      TeamData.value = await Promise.all(data.map(async team => {
        TeamData.members = []
        TeamData.projects = []

        // TODO - when I have it ready, fetch the team members and projects like in the useClient composable

        return {
          ...team
        }

      }))

    } catch (error) {
      alert(error.message);
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
    } catch (error) {
      alert(error.message);
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

  return {
    TeamData,
    TeamError,
    TeamMembers,
    Teams,
    createTeam,
    updateTeam,
    deleteTeam,
    fetchTeams,
    fetchSingleTeam,
    fetchTeamMembers,
    createTeamModal,
    deleteTeamModal
  }

}