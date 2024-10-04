import { ref } from 'vue'
import { useRouter } from 'vue-router';
import { useModal } from '~/stores/modal'
import useDeliverables from '~/composables/useDeliverables'

export default function useProject() {

  const projectData = ref(null)
  const projectError = ref(null)
  const supabase = useSupabaseClient();
  const router = useRouter();
  const { deleteProjectDeliverables } = useDeliverables();

  function deleteProjectModal(projectId) {
    useModal().setType('medium');
    useModal().setHeader('Delete Project');
    useModal().setContent('DeleteProjectModal');
    useModal().toggleVisibility();
  }

  async function deleteProject(projectId) {
    try {
      const { error } = await supabase
        .from('projects')
        .delete()
        .eq('id', projectId);

      if (error) throw error;
    } catch (error) {
      projectError.value = error.message
    }

    // Remove all associate deliverables
    deleteProjectDeliverables(projectId);

    // Reset the modal
    useModal().setType('');
    useModal().setHeader('');
    useModal().setContent('');
    useModal().toggleVisibility();
    
    // Redirect the user to the projects
    router.push('/projects');
  }

  async function getProjectDetails(projectId) {

    try {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .eq('id', projectId);

      if (error) throw error;

      return data[0];

    } catch (error) {
      projectError.value = error.message
    }
  }

  return {
    deleteProject,
    deleteProjectModal,
    getProjectDetails,
    projectData,
    projectError
  }
}