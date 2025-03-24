
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

    // console.log('deliverable data', data);

    rolesRef.value.writer = data.role_assignments.Writer;
    rolesRef.value.reviewer = data.role_assignments.Reviewer;
    projectId.value = data.project;

    
  }
  catch (error) {
    console.error('Error:', error.message);
  }
  


  // Then we need to get that project's owner from the database
  try {
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .eq('id', projectId.value)
      .single();

    rolesRef.value.projectManager = data.created_by;

    console.log(data.created_by);

    if (error) {
      console.error('Error:', error.message);
    }
  }
  catch (error) {
    console.error('Error:', error.message);
  }

  // Now we make the information available as meta properties on the route
  to.meta.project = projectId.value;
  to.meta.roles = roles;

});