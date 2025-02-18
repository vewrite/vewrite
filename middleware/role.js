
export default defineNuxtRouteMiddleware((to, from) => {
  const supabase = useSupabaseClient();
  const user = useSupabaseUser();

  // For projects, I need to pass in what type of user this is from the database
  // I can then use this to determine what pages and functionality they can access

  // Start with getting which project this is from the to router
  const project = to.params.project;
  console.log(project);

  // Then we need to get that project's team from the database

  // Once we have the team, we can set who the three roles are:
  // - project manager (owner)
  // - writer
  // - reviewer

  // Then we can pass this as an object back into the application

  // to.meta.requiresAdmin = true; // Set a route-specific flag
  // to.meta.pageTitle = 'Admin Dashboard'; // Set a dynamic page title
});