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

  async function createProject(project) {
    try {
      useModal().toggleLoading();
      
      // Clean the object if needed - remove any properties that aren't in your table schema
      const cleanProject = {
        name: project.name,
        description: project.description,
        status: project.status,
        client_id: project.client_id, 
        workflow: project.workflow,
        created_at: project.created_at,
        updated_at: project.updated_at,
        created_by: project.created_by,
        project_members: project.project_members,
      };
      
      const { data, error } = await supabase
        .from('projects')
        .insert([cleanProject], { returning: 'representation' });
        
      if (error) {
        console.error('Insert error:', error);
        return null;
      }
      
      // Data should be an array - get the first element
      const newProject = data?.[0];
      
      if (!newProject) {
        console.warn('Warning: No project data returned after insert');
        
        // Try to fetch the newly created project
        const { data: fetchedProject, error: fetchError } = await supabase
          .from('projects')
          .select('*')
          .eq('name', project.name)
          .eq('created_by', project.created_by)
          .order('created_at', { ascending: false })
          .limit(1)
          .single();
          
        if (fetchError) {
          console.error('Error fetching created project:', fetchError);
        } else {
          console.log('Found project via query:', fetchedProject);

          // Now we need to go and invite any users in project_members who do not have a user_id
          fetchedProject.project_members.forEach(async (member) => {
            console.log('Checking member:', member);
            if (member.role === 'invited') {
              console.log('Inviting user:', member.email);

              const response = await $fetch(`/api/email/inviteUser?email=${member.email}&project_id=${fetchedProject.id}`);

              if (!response) {
                console.error('No response from server');
                console.error('Error inviting user:', inviteError);
                return;
              }
                
              console.log('Invited user:', invitedProfile);
            }
          });
        }
      }
      
      useModal().toggleVisibility();
      useModal().reset();
      
      return newProject;
    } catch (error) {
      console.error('Error creating project:', error);
      return null;
    } 
  }

  function manageProjectMembersModal() {
    useModal().setType('medium');
    useModal().setHeader('Manage Project Members');
    useModal().setContent('ManageProjectMembersModal');
    useModal().toggleVisibility();
  }

  function createProjectModal() {
    useModal().setType('large');
    useModal().setHeader('Create Project');
    useModal().setContent('CreateProjectModal');
    useModal().toggleVisibility();
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
        project_members: project.project_members,
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

  async function updateProjectMembers(project_id, project_members) {
    try {
      useModal().toggleLoading();

      const { data, error } = await supabase
        .from('projects')
        .update({ project_members: project_members })
        .eq('id', project_id);

      if(error) throw error;

      console.log('Updated project members:', data);

      // Now, I also need to go through the members and send out invites to any new members
      // It's not ideal that this will resend an invite each time that the project is updated
      // But it's a simple solution and we'll go with that for now
      project_members.forEach(async (member) => {
        console.log('Checking member:', member);
        if (member.role === 'invited') {
            console.log('Inviting user:', member.email);

            const response = await $fetch(`/api/email/inviteUser?email=${member.email}&project_id=${project_id}`);

            if (!response) {
              console.error('No response from server');
              console.error('Error inviting user:', inviteError);
              return;
            }
              
            console.log('Invited user:', invitedProfile);
          }
        }
      );

      useModal().toggleVisibility();
      useModal().reset();

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

    // Remove all associate deliverables
    await deleteProjectDeliverables(projectId);

    try {
      const { error } = await supabase
        .from('projects')
        .delete()
        .eq('id', projectId);

      if (error) throw error;
    } catch (error) {
      projectError.value = error.message
    }

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

  async function fetchProjectsCreatedBy(user) {
    try {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .eq('created_by', user);

      if (error) throw error;

      return data.length;

    } catch (error) {
      projectError.value = error.message;
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
    manageProjectMembersModal,
    updateProject,
    updateProjectMembers,
    updateProjectName,
    updateProjectDescription,
    deleteProject,
    deleteProjectModal,
    getProjectDetails,
    fetchProjectWorkflow,
    fetchClientProjects,
    fetchProjectsCreatedBy,
    projectData,
    ProjectsData,
    projectError,
    ProjectsError,
  }
}