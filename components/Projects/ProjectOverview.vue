<template>
  <section class="project-overview">
    <ClientImage :client="client" size="small" table="logos" />
    <aside class="object-overview no-border">
      <div class="object-summary">
        <input class="object-title-input" v-model="project.name" @input="debouncedUpdateProjectName(project.id, $event.target.value)" />
        <input class="object-description-input" v-model="project.description" @input="debouncedUpdateProjectDescription(project.id, $event.target.value)" placeholder="Add a project description" />
      </div>
    </aside>
    <section class="project-members">
      <div class="notification warning" v-if="membersError">You don't have enough ready members</div>
      <div class="members">
        <div class="members-image" v-for="member in project.project_members" :key="member.user_id">
          <Avatar v-if="member.user_id" :uuid="member.user_id" size="large" />
          <section v-else class="invited-member">
            <div class="icon-email">
              <Icon name="fluent:mail-unread-20-regular" size="2rem" />
            </div>
          </section>
        </div>
      </div>
    </section>
  </section>
</template>

<script setup>

const props = defineProps(['project', 'creator', 'client', 'deliverables', 'membersError']);
const { client, project } = toRefs(props)

// useProject composable
import useProject from '~/composables/useProject';
const { updateProjectName, updateProjectDescription } = useProject();

// Manual debounce function
function debounce(func, wait) {
  let timeout;
  return function(...args) {
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(this, args), wait);
  };
}

// Debounced methods
const debouncedUpdateProjectName = debounce((id, value) => updateProjectName(id, value), 1000);
const debouncedUpdateProjectDescription = debounce((id, value) => updateProjectDescription(id, value), 1000);

</script>

<style lang="scss" scoped>

@use 'assets/variables' as *;

.project-overview {
  display: grid;
  align-items: center;
  grid-template-columns: auto 1fr auto;
  gap: $spacing-sm;

  .project-members {
    display: flex;
    flex-direction: row;
    gap: $spacing-sm;
    align-items: center;
    justify-content: center;

    .notification {
      text-wrap: nowrap;
    }
  }

  .members {
    display: flex;
    flex-direction: row-reverse;
    position: relative;
    width: 100%;
    height: 40px;

    .members-image {
      position: relative;
      top: 0;
      display: none;
      border-radius: $br-xl;

      .invited-member {
        display: flex;
        flex-direction: row;
        align-items: center;
        gap: $spacing-xs;

        .icon-email {
          width: 42px;
          height: 42px;
          border-radius: $br-lg;
          background: $white;
          border: $border;
          color: $gray-dark;
          display: flex;
          justify-content: center;
          align-items: center;

        }
      }

      .user-avatar {
        border: 2px solid $white;
      }

      &:nth-child(1) {
        z-index: 3;
        right: 0px;
        top: 0px;
        display: block;
      }

      &:nth-child(2) {
        z-index: 2;
        right: -10px;
        top: 0px;
        display: block;
      }

      &:nth-child(3) {
        z-index: 1;
        right: -20px;
        top: 0px;
        display: block;
      }
    }
  }
}

</style>