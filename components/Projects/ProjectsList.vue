<template>
  <main id="ProjectsList">
    <Loading v-if="loading" type="small" />

    <div class="search-bar" v-if="projects.length > 0 && !loading">
      
      <input type="text" placeholder="Search project titles" v-model="searchQuery" :class="[listToggle]" />
      
      <section class="list-filters">
        <div class="list-buttons">
          <button :class="['list-icon', projectFilter == 'all' ? 'active' : '']" @click="handleProjectFilter('all')">
            All
          </button>
          <button :class="['list-icon', projectFilter == 'owner' ? 'active' : '']" @click="handleProjectFilter('owner')">
            Owner
          </button>
          <button :class="['list-icon', projectFilter == 'member' ? 'active' : '']" @click="handleProjectFilter('member')">
            Member
          </button>
        </div>
        
        <div class="list-buttons">
          <button :class="['list-icon', viewMode == 'grid' ? 'active' : '']" @click="listToggle">
            <Icon name="fluent:grid-20-regular" size="1.65rem" />
          </button>
          <button :class="['list-icon', viewMode == 'list' ? 'active' : '']" @click="listToggle">
            <Icon name="fluent:list-20-regular" size="1.65rem" />
          </button>
        </div>
      </section>
    </div>

    <div class="empty-state" v-if="projects.length === 0 && !loading">
      <img src="/images/projects-empty-state.svg" alt="No projects found" />
      <h3>No Projects</h3>
      <p>That’s ok, It’s easy and we’ll do it together. If you're a writer, your project is on its way!</p>
    </div>

    <div :class="['projects-list', viewMode]" v-if="!loading && projects.length > 0">
      <router-link :to="'/project/' + project.id" class="project-card" v-for="project in filteredProjects" :key="project.id" :class="project.completedDeliverables == project.deliverables.length && project.deliverables.length > 0 ? 'completed' : ''">
        <div class="project-card-header">
          <div class="project-card-owner">
            {{ project.tag }}
          </div>
          <ClientImage class="client-image" :client="project.client_id" size="medium" table="logos" />
          <div class="project-card-details">
            <h3>{{ project.name }}</h3>
            <p>{{ project.description }}</p>
          </div>
        </div>
        <div class="project-deliverables-status">
          <div class="progress-status">
            <span>Progress</span>
            <span>{{ project.completedDeliverables }} / {{ project.deliverables.length }}</span>
          </div>
          <div class="progress-content">
            <div class="empty-deliverables" v-if="project.deliverables.length == 0">
              <span>No deliverables</span>
            </div>
            <div class="deliverables" v-else>
              <div class="progress-bar">
                <div class="progress" :class="project.completedDeliverables == project.deliverables.length ? 'completed' : ''" :style="{ width: (project.completedDeliverables / project.deliverables.length) * 100 + '%' }"></div>
              </div>
            </div>
          </div>
        </div>
      </router-link>
    </div>
  </main>
</template>

<script setup>

const projects = ref([]);
const loading = ref(true);
const searchQuery = ref('')

const supabase = useSupabaseClient();
const user = useSupabaseUser();

import useDeliverables from '~/composables/useDeliverables';
const { fetchProjectDeliverables } = useDeliverables();

import useWorkflow from '~/composables/useWorkflow';
const { fetchStates } = useWorkflow();

const viewMode = ref('grid');
const projectFilter = ref('all');

const listToggle = () => {
  viewMode.value = viewMode.value === 'grid' ? 'list' : 'grid';
  localStorage.setItem('viewMode', JSON.stringify(viewMode.value));
};

const handleProjectFilter = (filter) => {
  projectFilter.value = filter;
};

const assignedProjects = ref([]);

function assignProjectTag(project) {
  let tag = '';
  if (user.value.id === project.created_by) {
    tag = 'Owner'
  } else {
    tag = 'Member'
  }
  return tag;
}

async function fetchOwnedProjects() {
  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .eq('created_by', user.value.id)

  if (error) {
    console.error('Error fetching projects:', error.message)
    return
  }

  return data;
  
}

async function fetchAssignedProjects() {
  const userId = user.value.id;
  
  /*
  
  This uses an RPC function to get the list of project IDs assigned to the user.

  CREATE OR REPLACE FUNCTION find_project_ids_for_user(user_id_param UUID)
  RETURNS BIGINT[] AS $$
    SELECT array_agg(id)
    FROM projects
    WHERE EXISTS (
      SELECT 1
      FROM unnest(project_members) as member
      WHERE member->>'user_id' = user_id_param::text
    );
  $$ LANGUAGE sql;

  */  

  // First, get the list of project IDs
  const { data: projectIds, error: idError } = await supabase
    .rpc('find_project_ids_for_user', { user_id_param: userId })

  if (idError) {
    console.error('Error finding project IDs:', idError.message)
    return
  }
  
  // Then, fetch the actual projects
  if (projectIds && projectIds.length > 0) {
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .in('id', projectIds)
    
    if (error) {
      console.error('Error fetching projects:', error.message)
      return
    }
    
    return data

  } else {
    return []
  }
}

async function fetchProjects() {
  
  const ownedProjects = await fetchOwnedProjects();
  const assignedProjects = await fetchAssignedProjects();

  const allProjects = [...new Set([...ownedProjects, ...assignedProjects].map(project => project.id))]
    .map(id => {
      return [...ownedProjects, ...assignedProjects].find(project => project.id === id);
    });

  projects.value = await Promise.all(allProjects.map(async project => {
    return {
      ...project,
      client: {
        client_id: project.client,
      }
    };
  }));

  projects.value = await Promise.all(projects.value.map(async project => {
    const deliverables = await fetchProjectDeliverables(project.id);
    const states = await fetchStates(project.workflow);
    const LastState = states[states.length - 1];
    const completedDeliverables = deliverables.filter(deliverable => deliverable.workflow_state == LastState).length;
    const tag = assignProjectTag(project);
    return {
      ...project,
      tag: tag,
      deliverables: deliverables,
      completedDeliverables: completedDeliverables,
      states: states,
    };
  }));

  loading.value = false
}

const handleProjectInserts = (payload) => {
  projects.value.push(payload.new);
  fetchProjects();
}

onMounted(async () => {
  // grid/list state
  const savedState = localStorage.getItem('viewMode');
  if (savedState !== null) {
    viewMode.value = JSON.parse(savedState);
  }

  // subscription
  const subscription = supabase
    .channel('projects')
    .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'projects' }, handleProjectInserts)
    .subscribe();

  onUnmounted(() => {
    supabase.removeChannel(subscription);
  });

  await fetchProjects();

  loading.value = false;
});

const filteredProjects = computed(() => {
  if (projectFilter.value === 'all') {
    return projects.value.filter(
      project => 
        project.name.toLowerCase().includes(searchQuery.value.toLowerCase())
    )
  }
  if (projectFilter.value === 'owner') {
    return projects.value.filter(
      project => 
        project.name.toLowerCase().includes(searchQuery.value.toLowerCase())
        && project.tag === 'Owner'
    )
  }

  if (projectFilter.value === 'member') {
    return projects.value.filter(
      project => 
        project.name.toLowerCase().includes(searchQuery.value.toLowerCase())
        && project.tag === 'Member'
    )
  }
  if (!searchQuery.value) {
    return projects.value
  }
})

</script>

<style lang="scss" scoped>

@use 'assets/variables' as *;

@keyframes cardAppear {
  0% {
    opacity: 0;
    transform: scale(0.9);
  }
  100% {
    opacity: 1;
    transform: scale(1);
  }
}

#ProjectsList {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: flex-start;
  margin-bottom: $spacing-lg;
  transition: padding 0.2s ease;
  min-height: calc(100% - 60px);
  height: calc(100% - 60px);

  .empty-state {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 100%;

    img {
      width: 200px;
    }

    h3 {
      font-size: $font-size-lg;
      font-family: $font-family-secondary;
      font-weight: 500;
      margin: $spacing-md 0 0;
    }

    p {
      font-size: $font-size-xs;
      font-weight: 400;
      margin: $spacing-sm 0 $spacing-md;
      color: $gray-dark;
    }

  }

  .projects-list {
    height: calc(100% - 60px);

    &.grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: $spacing-sm;
      width: 100%;
      padding: $spacing-sm $spacing-md $spacing-md;
      align-content: flex-start;

      @media (max-width: 1200px) {
        grid-template-columns: repeat(2, 1fr);
      }

      @media (max-width: 768px) {
        grid-template-columns: 1fr;
      }

      .project-card {
        padding: $spacing-md;
        background: $white;
        border-radius: $br-lg;
        border: $border;
        text-decoration: none;
        height: 320px;
        color: $black;
        position: relative;
        overflow: hidden;
        display: flex;
        flex-direction: column;
        gap: $spacing-sm;
        justify-content: space-between;
        transition: border, transform 0.18s ease;
        animation: cardAppear 0.2s ease;
        animation-fill-mode: forwards;
        animation-delay: 0s;
        opacity: 0;
        transform: scale(0.9);
        background: $white linear-gradient(to bottom, $white 70%, rgba($brand-light, 0.025) 90%, rgba($brand-light, 0.05) 100%);
        outline: 1px solid $white;
        outline-offset: -2px;

        &.completed {
          background: $white linear-gradient(to bottom, $white 70%, rgba($mint-light, 0.25) 90%, rgba($mint-light, 0.1) 100%);
        }

        $project-cards: ();

        @for $i from 0 through 60 {
          &:nth-child(#{$i}) {
            animation-delay: #{$i * .1}s;
          }
        }

        &:hover {
          border: 1px solid rgba($brand, 1);
          transform: scale(1.05);
        }

        .project-card-owner {
          border: $border;
          color: rgba($brand, 0.5);
          padding: $spacing-xxxs $spacing-sm;
          border-radius: $br-md;
          font-size: $font-size-xs;
        }

        .project-card-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          flex-direction: column;
          gap: $spacing-sm;

          .client-image {
            width: 60px;
            height: 60px;
            border-radius: $br-md;
            overflow: hidden;
            background-color: $gray-light;
            display: flex;
            justify-content: center;
            align-items: center;
            position: absolute;
            top: $spacing-md;
            right: $spacing-md;
          }

          .project-card-details {
            display: flex;
            flex-direction: column;
            gap: $spacing-sm;
            width: calc(100% - 80px - $spacing-sm);
          }

          .image-wrapper {
            border-radius: $br-md;
            overflow: hidden;
            background-color: $gray-light;
            display: flex;
            justify-content: center;
            align-items: center;

            img {
              width: 120px;
              height: 100%;
            }
          }

        }

        h3 {
          font-size: $font-size-lg;
          font-family: $font-family-main;
          font-weight: bold;
          margin: 0;
          width: 100%;
          text-wrap: balance;
          
          a {
            color: $brand;
            text-decoration: none;
          }
        }

        p {
          font-size: $font-size-xs;
          font-weight: 400;
          color: $gray-dark;
        }

        .project-card-buttons {
          opacity: 0;
          transition: bottom 0.2s ease;
          z-index: 10;
          position: absolute;
          bottom: -80px;
          left: 0;
          right: 0;
          display: flex;
          justify-content: flex-end;
          gap: $spacing-xs;
          padding: $spacing-sm $spacing-md;
          background-color: $brand;
          backdrop-filter: blur(10px);
          border-top: 1px solid rgba($black, 0.1);
          border-radius: $br-lg $br-lg 0 0;

          a, button {
            width: 50%;
            justify-content: center;
          }
        }

        .project-deliverables-status {
          display: flex;
          flex-direction: column;
          justify-content: flex-start;
          position: absolute;
          bottom: $spacing-md;
          width: calc(100% - #{$spacing-md * 2});
          transition: bottom 0.2s ease;

          .progress-status {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: $spacing-xs;
            width: 100%;

            span {
              font-size: $font-size-xs;
              font-weight: 400;
              color: rgba($black, 0.5);
            }
          }

          .progress-content {
            width: 100%;

            .progress-bar {
              width: 100%;
              padding: 2px;
              min-height: 10px;
              border-radius: $br-md;
              background-color: $white;
              border: $border;

              .progress {
                height: 6px;
                border-radius: $br-md;
                background: linear-gradient(to right, $mint-light, $mint-light 80%, $brand 100%);

                &.completed {
                  background: $mint-light;
                }
              }

            }
          }
        }
      }

    }

    &.list {
      display: flex;
      flex-direction: column;
      justify-content: flex-start;
      align-content: center;
      width: calc(100% - $spacing-md - $spacing-md);
      padding: $spacing-sm $spacing-md $spacing-sm;
      align-content: flex-start;
      width: 100%;
      gap: $spacing-xs;

      .project-card {
        padding: $spacing-sm;
        transition: border 0.2s ease;
        text-decoration: none;
        width: 100%;
        color: $black;
        position: relative;
        overflow: hidden;
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        gap: $spacing-md;
        border: 1px solid transparent;
        border-radius: $br-md;
        border: $border;
        background-color: $white;

        .project-card-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex-direction: row;
          gap: $spacing-md;
          width: auto;

          .project-card-owner {
            border: $border;
            color: rgba($brand, 0.5);
            padding: $spacing-xxxs $spacing-sm;
            border-radius: $br-md;
            font-size: $font-size-xs;
            min-width: 80px;
            text-align: center;
          }

          .image-wrapper {
            width: 54px;
            min-height: 54px;
            height: 54px;
            border-radius: $br-md;
            overflow: hidden;
            background-color: $gray-light;
            display: flex;
            justify-content: center;
            align-items: center;

            img {
              width: auto;
              height: 100%;
            }
          }

        }

        .project-card-details {
          display: flex;
          justify-content: flex-start;
          align-items: center;
          flex-direction: row;
          gap: $spacing-md;
          width: 100%;

        }

        h3 {
          font-size: $font-size-xs;
          font-family: $font-family-secondary;
          font-weight: bold;
          margin: 0;
          align-self: center;
          width: 100%;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          
          a {
            color: $brand;
            text-decoration: none;
          }
        }

        p {
          display: none;
        }

        .project-card-buttons {
          transition: none;
          display: flex;
          justify-content: flex-end;
          gap: $spacing-xs;
          padding: $spacing-sm 0;
          align-self: flex-end;

          a, button {
            justify-content: center;
          }
        }

        &:hover {
          border: 1px solid $brand;

          p {
            color: $brand;
          }
        }

        .project-deliverables-status {
          display: flex;
          flex-direction: row;
          justify-content: flex-end;
          transition: all 0.2s ease;
          width: 35%;
          gap: $spacing-md;

          .progress-status {
            display: flex;
            justify-content: space-between;
            align-items: center;

            span {
              font-size: $font-size-xs;
              font-weight: 400;
              color: rgba($black, 0.5);
              white-space: nowrap;
              overflow: hidden;
              text-overflow: ellipsis;

              &:first-child {
                margin-right: $spacing-sm;
              }
            }
          }

          .progress-content {
            width: 100%;
            display: flex;
            justify-content: center;
            align-items: center;
            align-content: center;

            .empty-deliverables {
              width: 100%;
              display: flex;
              justify-content: center;
              align-items: center;
              color: $gray-dark;
              white-space: nowrap;
              overflow: hidden;
              text-overflow: ellipsis;
            }

            .deliverables {
              width: 100%;
            }

            .progress-bar {
              width: 100%;
              padding: 2px;
              min-height: 10px;
              border-radius: $br-md;
              background-color: $white;
              border: $border;

              .progress {
                height: 6px;
                border-radius: $br-md;
                background: linear-gradient(to right, $mint-light, $mint-light 80%, $brand 100%);

                &.completed {
                  background: $mint;
                }
              }

            }
          }
        }
      }

      }
  }
}

</style>