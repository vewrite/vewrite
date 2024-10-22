import { ref } from 'vue';
import { useModal } from '~/stores/modal'

export default function useTeam() {

  const TeamData = ref(null);
  const TeamError = ref(null);
  const supabase = useSupabaseClient();
  const TeamMembers = ref([]);
  const Teams = ref([]);

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
    try {
      const { data, error } = await supabase
        .from('teams')
        .update(team)
        .eq('id', team.id);

      if (error) throw error;

      return data;
    } catch (error) {
      alert(error.message);
    }
  }

  async function deleteTeam(team) {
    try {
      const { data, error } = await supabase
        .from('teams')
        .delete()
        .eq('id', team.id);

      if (error) throw error;

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
      return data;

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

  return {
    TeamData,
    TeamError,
    TeamMembers,
    Teams,
    createTeam,
    updateTeam,
    deleteTeam,
    fetchTeams,
    fetchTeamMembers,
    createTeamModal
  }

}