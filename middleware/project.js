
export default defineNuxtRouteMiddleware(async (to, from) => {
  const supabase = useSupabaseClient();
  const user = useSupabaseUser();

  // Start with getting which project this is from the to router
  const projectId = to.params.id;

  const roleRef = ref(null);
  const role = useState('role', () => (roleRef.value));

  // We need to know whether the user is a project owner or just a member, so that we can decide what functionality to show to that user.
  // To do this, we have to check what project the user is in, and then check if the user is the project owner.

  // // Then we need to get that project's team from the database
  try {
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .eq('id', projectId)
      .single();

    if(data.created_by === user.value.id) {
      console.log('Is the owner of this project.');
      role.value = 'owner';
    } else {
      console.log('Is a member of this project.');
      role.value = 'member';
    }

  }
  catch (error) {
    console.error('Error fetching project team:', error.message);
  }

  // Now we make the information available as meta properties on the route
  to.meta.project = projectId.value;
  to.meta.role = role;

});