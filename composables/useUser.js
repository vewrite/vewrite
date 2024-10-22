import { ref } from 'vue';

export default function useUser() {

  const UserData = ref(null);
  const UserError = ref(null);
  const Users = ref([]);

  async function createUser(user) {

    try {

      useModal().toggleLoading();

      const newUser = {
        name: user.name,
        created_at: user.created_at,
        updated_at: user.updated_at,
        created_by: user.created_by,
        logo_url: user.logo_url,
      }
  
      let { error } = await supabase.from('users').upsert(newUser, {
          returning: 'minimal', // Don't return the value after inserting
      })
  
      useModal().toggleVisibility();
      useModal().reset();

      if (error) throw error
  
    } catch (error) {
      console.error('Error creating user:', error)
    } 
  }

  async function updateUser(user) {
    try {
      const { data, error } = await supabase
        .from('users')
        .update(user)
        .eq('id', user.id);

      if (error) throw error;

      return data;
    } catch (error) {
      alert(error.message);
    }
  }

  async function deleteUser(user) {
    try {
      const { data, error } = await supabase
        .from('users')
        .delete()
        .eq('id', user.id);

      if (error) throw error;

      return data;
    } catch (error) {
      alert(error.message);
    }
  }

  async function fetchUsers() {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*');

      if (error) throw error;

      return data;
    } catch (error) {
      UserError.value = error.message;
    }
  }

  async function fetchSingleUser(userId) {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', userId);

      if (error) throw error;

      UserData.value = data[0];
    } catch (error) {
      UserError.value = error.message;
    }
  }

  function createClientModal() {
    useModal().setType('large');
    useModal().setHeader('Create User');
    useModal().setContent('CreateUserModal');
    useModal().toggleVisibility();
  }

  return {
    createUser,
    updateUser,
    deleteUser,
    fetchUsers,
    fetchSingleUser,
    createClientModal,
    UserData,
    UserError,
    Users
  }
}
