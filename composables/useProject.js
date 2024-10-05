import { ref } from 'vue'
import { useRouter } from 'vue-router';
import { useModal } from '~/stores/modal'
import useDeliverables from '~/composables/useDeliverables'
import useClient from '~/composables/useClient'

// Vuelidate
// TODO - Implement vuelidate again within the composable
// import { useVuelidate } from '@vuelidate/core'
// import { required, email } from '@vuelidate/validators'

export default function useProject() {

  const projectData = ref(null)
  const projectError = ref(null)
  const supabase = useSupabaseClient();
  const router = useRouter();
  const { deleteProjectDeliverables } = useDeliverables();
  // const { fetchClients } = useClient();

  function createProjectModal() {
    useModal().setType('large');
    useModal().setHeader('Create Project');
    useModal().setContent('CreateProjectModal');
    useModal().toggleVisibility();
  }

  async function createProject(project) {

    // const $v = useVuelidate(rules, { project })

    // $v.value.$touch()

    // if ($v.value.$invalid) {
    //   console.log(project)
    //   console.log($v.value)
    //   console.log('Form is invalid')
    //   return
    // }
    
    try {
      useModal().toggleLoading();

      const updates = {
        name: project.name,
        description: project.description,
        status: project.status,
        client: project.client,
        deliverables: project.deliverables,
        workflow: project.workflow,
        created_at: project.created_at,
        updated_at: project.updated_at,
        created_by: project.created_by,
        stakeholders: project.stakeholders
      }

      let { error } = await supabase.from('projects').upsert(updates, {
          returning: 'minimal', // Don't return the value after inserting
      })

      useModal().reset();

      if (error) throw error

    } catch (error) {
      console.error('Error creating project:', error)
    } 
  }

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
    createProject,
    createProjectModal,
    deleteProject,
    deleteProjectModal,
    getProjectDetails,
    projectData,
    projectError
  }
}