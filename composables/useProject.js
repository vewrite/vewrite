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
  const ProjectsData = ref(null)
  const projectError = ref(null)
  const ProjectsError = ref(null)
  const supabase = useSupabaseClient();
  const router = useRouter();
  const { deleteProjectDeliverables } = useDeliverables();

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

    console.log('Creating project', project);
    
    try {
      useModal().toggleLoading();

      const updates = {
        name: project.name,
        description: project.description,
        status: project.status,
        client_id: project.client_id,
        workflow: project.workflow,
        created_at: project.created_at,
        updated_at: project.updated_at,
        created_by: project.created_by,
        assigned_team: project.assigned_team,
      }

      let { error } = await supabase.from('projects').upsert(updates, {
          returning: 'minimal', // Don't return the value after inserting
      })

      useModal().toggleVisibility();
      useModal().reset();

      if (error) throw error

    } catch (error) {
      console.error('Error creating project:', error)
    } 
  }

  async function updateProject(project) {
    try {
      useModal().toggleLoading();

      const updates = {
        id: project.id,
        name: project.name,
        description: project.description,
        status: project.status,
        client: project.client,
        workflow: project.workflow,
        created_at: project.created_at,
        updated_at: project.updated_at,
        created_by: project.created_by,
        assigned_team: project.assigned_team,
      }

      let { error } = await supabase.from('projects').upsert(updates, {
          returning: 'minimal', // Don't return the value after inserting
      })

      useModal().toggleVisibility();
      useModal().reset();

      if (error) throw error

    } catch (error) {
      console.error('Error updating project:', error)
    } 
  }

  async function updateProjectName(projectId, name) {

    console.log(projectId, name);
    try {
      const { data, error } = await supabase
        .from('projects')
        .update({ name: name })
        .eq('id', projectId);

      if (error) throw error;

      return data;

    } catch (error) {
      projectError.value = error.message;
    }
  }

  async function updateProjectDescription(projectId, description) {
    try {
      const { data, error } = await supabase
        .from('projects')
        .update({ description: description })
        .eq('id', projectId);

      if (error) throw error;

      return data;

    } catch (error) {
      projectError.value = error.message;
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

  async function fetchProjectWorkflow(projectId) {
    try {
      const { data, error } = await supabase
        .from('projects')
        .select('workflow')
        .eq('id', projectId);

      if (error) throw error;

      return data[0];

    } catch (error) {
      projectError.value = error.message;
    }
  }

  async function fetchClientProjects(clientId) {
    try {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .eq('client_id', clientId);

      if (error) throw error;

      ProjectsData.value = data;
      return data;

    } catch (error) {
      ProjectsError.value = error.message;
    }
  }

  return {
    createProject,
    createProjectModal,
    updateProject,
    updateProjectName,
    updateProjectDescription,
    deleteProject,
    deleteProjectModal,
    getProjectDetails,
    fetchProjectWorkflow,
    fetchClientProjects,
    projectData,
    ProjectsData,
    projectError,
    ProjectsError,
  }
}