import { ref } from 'vue'

export default function useRoles() {

  const RolesData = ref([])
  const RoleData = ref(null)
  const RolesError = ref(null)
  const RoleError = ref(null)
  const supabase = useSupabaseClient();

  async function fetchRoles() {
    try {
      const { data, error } = await supabase
        .from('roles')
        .select('*')

      if (error) throw error

      RolesData.value = data
      return data
    } catch (error) {
      RolesError.value = error.message
      console.error('Error fetching roles:', error.message)
    }
  }

  async function fetchUserTeamRole(userId, teamId) {
    try {
      const { data, error } = await supabase
        .from('team_members')
        .select('role')
        .eq('user_id', userId)
        .eq('team_id', teamId)

      if (error) throw error

      RoleData.value = data[0]
      return data

    } catch (error) {
      RolesError.value = error.message
      console.error('Error fetching user team role:', error.message)
    }
  }

  async function fetchSingleRole(id) {

    console.log('fetchSingleRole', id)
    try {
      const { data, error } = await supabase
        .from('roles')
        .select('*')
        .eq('id', id)

      if (error) throw error

      console.log(data)
      RoleData.value = data[0]
      return data

    } catch (error) {
      RolesError.value = error.message
      console.error('Error fetching role:', error.message)
    }
  }

  async function setRole(userId, teamId, roleId, roleName) {

    console.log('Setting role', userId, teamId, roleId)

    try {
      const { data, error } = await supabase
        .from('team_members')
        .update({ role: roleId })
        .eq('user_id', userId)
        .eq('team_id', teamId)

      if (error) throw error

      RoleData.value.name = roleName
      RoleData.value.id = roleId
      return data

    } catch (error) {
      RolesError.value = error.message
      console.error('Error setting role:', error.message)
    }
  }

  return { 
    RolesData,
    RoleData,
    RolesError, 
    RoleError,
    fetchRoles,
    fetchUserTeamRole,
    fetchSingleRole,
    setRole
  }
}