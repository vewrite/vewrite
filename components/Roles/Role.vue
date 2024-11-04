<template>
  <div class="single-role">
    <Loading v-if="loading" type="tiny" />
    <Dropdown  v-if="RoleData">
      <template v-slot:trigger>
        <span class="details">Role:</span> {{ RoleData.name }}
      </template>
      <template v-slot:menu>
        <div class="dropdown-item" v-for="role in RolesData" :key="role.id" @click="setRole(user, team, role.id, role.name)" :class="role.id === RoleData.id ? 'active' : ''">
          {{ role.name }}
        </div>
      </template>
    </Dropdown>
  </div>
</template>

<script setup>

const props = defineProps(['user', 'team', 'role']);
const supabase = useSupabaseClient();
import useRoles from '~/composables/useRoles';
const { fetchRoles, fetchSingleRole, setRole, RolesData, RoleData, RolesError, RoleError } = useRoles();
const loading = ref(false);

onMounted(async () => {

  loading.value = true;

  // const subscription = supabase
  //   .from('team_members')
  //   .on('*', (payload) => {
  //     console.log('Change received!', payload);
  //     fetchRoles();
  //     fetchSingleRole(props.role);
  //   })
  //   .subscribe();

  //   onUnmounted(() => {
  //     supabase.removeSubscription(subscription);
  //   });

  //   await fetchRoles();
  //   await fetchSingleRole(props.role);

  // loading.value = false;
  try {
    console.log('Fetching role:', props.role);
    await fetchRoles();
    await fetchSingleRole(props.role);
    loading.value = false;
  } catch (error) {
    console.error('Error fetching role:', error.message);
    RoleError.value = error.message;
    loading.value = false;
  }
});

</script>

<style lang="scss" scoped>

@import 'assets/_variables.scss';

.single-role {
  display: flex;
  flex-direction: row;
  
  .active {
    background-color: $brand;
    color: white;
  }
}

</style>