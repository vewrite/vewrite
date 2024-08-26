import { ref } from 'vue'
import { useRouter } from 'vue-router';

export default function useProject() {

  const projectData = ref(null)
  const projectError = ref(null)
  const supabase = useSupabaseClient();
  const router = useRouter();

  async function deleteProject(projectId) {
    // First get confirmation from the user
    const confirmDelete = confirm('Are you sure you want to delete this project?');
    if (!confirmDelete) return;

    try {
      const { error } = await supabase
        .from('projects')
        .delete()
        .eq('id', projectId);

      if (error) throw error;
    } catch (error) {
      projectError.value = error.message
    }

    router.push('/projects');
  }

  return {
    deleteProject
  }
}