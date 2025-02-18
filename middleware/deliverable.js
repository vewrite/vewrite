
export default defineNuxtRouteMiddleware(async (to, from) => {
  const supabase = useSupabaseClient();
  const user = useSupabaseUser();

  // For projects, I need to pass in what type of user this is from the database
  // I can then use this to determine what pages and functionality they can access

  // Start with getting which project this is from the to router
  const deliverableId = to.params.id;
  const projectId = ref(null);

  const rolesRef = ref(
    {
      projectManager: '',
      writer: '',
      reviewer: ''
    }
  );
  const roles = useState('roles', () => (rolesRef.value));

  // First we get the project id and the assignments from the deliverable
  try {
    const { data, error } = await supabase
      .from('deliverables')
      .select('*')
      .eq('id', deliverableId)
      .single();

    console.log('deliverable data', data);

    rolesRef.value.writer = data.role_assignments.Writer;
    rolesRef.value.reviewer = data.role_assignments.Reviewer;
    projectId.value = data.project;

    if (error) {
      console.error('Error fetching project team:', error.message);
    } else {
      console.log('project team', data.team);
    }
  }
  catch (error) {
    console.error('Error fetching project team:', error.message);
  }
  


  // Then we need to get that project's team from the database
  try {
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .eq('id', projectId.value)
      .single();

    rolesRef.value.projectManager = data.created_by;

    if (error) {
      console.error('Error fetching project team:', error.message);
    } else {
      console.log('project team', data.team);
    }
  }
  catch (error) {
    console.error('Error fetching project team:', error.message);
  }

  // Now we make the information available as meta properties on the route
  to.meta.project = projectId.value;
  to.meta.roles = roles;

  // Once we have the team, we can set who the three roles are:
  // - project manager (owner)
  // - writer
  // - reviewer

  // Then we can pass this as an object back into the application

  // to.meta.requiresAdmin = true; // Set a route-specific flag
  // to.meta.pageTitle = 'Admin Dashboard'; // Set a dynamic page title
});