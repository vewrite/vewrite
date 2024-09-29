import { ref } from 'vue';

/*

TEAMS

A team is a collection of users that are working together on a project. 

Teams have a variety of properties:

- an administrator, usually the person who created the team
- a list of members that are part of the team

This means we need:

- A way to create a team, delete a team, update a team
- A way to list all teams
- A way to list all members of a team

*/

export function useTeam() {

  const TeamData = ref(null);
  const TeamError = ref(null);
  const supabase = useSupabaseClient();
  const TeamMembers = ref([]);
  const Teams = ref([]);

  async function createTeam(team) {
    try {
      const { data, error } = await supabase
        .from('teams')
        .insert(team);

      if (error) throw error;

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

  async function listTeams() {
    try {
      const { data, error } = await supabase
        .from('teams')
        .select('*');

      if (error) throw error;

      Teams.value = data;
    } catch (error) {
      alert(error.message);
    }
  }

  async function listTeamMembers(teamId) {
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

  return {
    TeamData,
    TeamError,
    TeamMembers,
    Teams,
    createTeam,
    updateTeam,
    deleteTeam,
    listTeams,
    listTeamMembers
  }

}