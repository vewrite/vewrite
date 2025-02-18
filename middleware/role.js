
export default defineNuxtRouteMiddleware((to, from) => {
  const supabase = useSupabaseClient();
  const user = useSupabaseUser();

  // For projects, I need to pass in what type of user this is from the database
  // I can then use this to determine what pages and functionality they can access

  

  // to.meta.requiresAdmin = true; // Set a route-specific flag
  // to.meta.pageTitle = 'Admin Dashboard'; // Set a dynamic page title
});