import { ref } from 'vue';

/*

TALENT

The talent are the people that exist on the open marketplace within Vewrite. These are the users who sell their services to clients.

Talent have a variety of properties:

- A name
- A story that they tell about themselves which gives clients an idea of who they are. It's a pitch that they can use to sell themselves.
- Types of work that they like to take on
- The price that they charge for their services, defined as a per-deliverable rate.
- Previous clients (ids)
- Current status (available, engaged, unavailable)

This means we need:

- A way to create a talent, delete a talent, update a talent
- A way to list all talent of a certain status (all, available, engaged, unavailable)
- A way to change the status of a talent
- A way to list all previous clients of a talent (getClients by id)
- A way to list all deliverables of a talent (getDeliverables by id) so that we can build a public portfolio based on previous work

*/

export function useTalent() {

  const TalentData = ref(null);
  const TalentError = ref(null);
  const supabase = useSupabaseClient();
  const TalentList = ref([]);
  const TalentClients = ref([]);
  const TalentDeliverables = ref([]);

  async function createTalent(talent) {
    try {
      const { data, error } = await supabase
        .from('talent')
        .insert(talent);

      if (error) throw error;

      return data;
    } catch (error) {
      alert(error.message);
    }
  }

  async function updateTalent(talent) {
    try {
      const { data, error } = await supabase
        .from('talent')
        .update(talent)
        .eq('id', talent.id);

      if (error) throw error;

      return data;
    } catch (error) {
      alert(error.message);
    }
  }

  async function deleteTalent(talent) {
    try {
      const { data, error } = await supabase
        .from('talent')
        .delete()
        .eq('id', talent.id);

      if (error) throw error;

      return data;
    } catch (error) {
      alert(error.message);
    }
  }

  async function listTalent(status) {
    try {
      const { data, error } = await supabase
        .from('talent')
        .select('*')
        .eq('status', status);

      if (error) throw error;

      TalentList.value = data;
    } catch (error) {
      alert(error.message);
    }
  }

  async function listTalentClients(talentId) {
    try {
      const { data, error } = await supabase
        .from('talent')
        .select('clients')
        .eq('id', talentId);

      if (error) throw error;

      TalentClients.value = data;
    } catch (error) {
      alert(error.message);
    }
  }

  async function listTalentDeliverables(talentId) {
    try {
      const { data, error } = await supabase
        .from('talent')
        .select('deliverables')
        .eq('id', talentId);

      if (error) throw error;

      TalentDeliverables.value = data;
    } catch (error) {
      alert(error.message);
    }
  }

  return {
    TalentData,
    TalentError,
    TalentList,
    TalentClients,
    TalentDeliverables,
    createTalent,
    updateTalent,
    deleteTalent,
    listTalent,
    listTalentClients,
    listTalentDeliverables
  }

}