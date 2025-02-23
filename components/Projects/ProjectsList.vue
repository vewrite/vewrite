<template>
  <main id="ProjectsList">
    <Loading v-if="loading" type="small" />

    <div class="search-bar" v-if="projects.length > 0 && !loading">
      <input type="text" placeholder="Search project titles" v-model="searchQuery" :class="[listToggle]" />
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
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M10.5 18L10.5 15C10.5 14.1716 9.82843 13.5 9 13.5L5 13.5C4.17157 13.5 3.5 14.1716 3.5 15L3.5 18C3.5 18.8284 4.17157 19.5 5 19.5L9 19.5C9.82843 19.5 10.5 18.8284 10.5 18Z" stroke="black" stroke-opacity="0.3" stroke-linecap="round"/>
            <path d="M20.5 18L20.5 15C20.5 14.1716 19.8284 13.5 19 13.5L15 13.5C14.1716 13.5 13.5 14.1716 13.5 15L13.5 18C13.5 18.8284 14.1716 19.5 15 19.5L19 19.5C19.8284 19.5 20.5 18.8284 20.5 18Z" stroke="black" stroke-opacity="0.3" stroke-linecap="round"/>
            <path d="M10.5 9L10.5 6C10.5 5.17157 9.82843 4.5 9 4.5L5 4.5C4.17157 4.5 3.5 5.17157 3.5 6L3.5 9C3.5 9.82843 4.17157 10.5 5 10.5L9 10.5C9.82843 10.5 10.5 9.82843 10.5 9Z" stroke="black" stroke-opacity="0.3" stroke-linecap="round"/>
            <path d="M20.5 9L20.5 6C20.5 5.17157 19.8284 4.5 19 4.5L15 4.5C14.1716 4.5 13.5 5.17157 13.5 6L13.5 9C13.5 9.82843 14.1716 10.5 15 10.5L19 10.5C19.8284 10.5 20.5 9.82843 20.5 9Z" stroke="black" stroke-opacity="0.3" stroke-linecap="round"/>
          </svg>
        </button>
        <button :class="['list-icon', viewMode == 'list' ? 'active' : '']" @click="listToggle">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M4 5H20" stroke="black" stroke-opacity="0.3" stroke-linecap="round"/>
            <path d="M4 19H20" stroke="black" stroke-opacity="0.3" stroke-linecap="round"/>
            <path d="M4 12H20" stroke="black" stroke-opacity="0.3" stroke-linecap="round"/>
          </svg>
        </button>
      </div>
    </div>

    <div class="empty-state" v-if="projects.length === 0 && !loading">
      <img src="/images/projects-empty-state.svg" alt="No projects found" />
      <h3>You haven’t created a project yet</h3>
      <p>That’s ok, It’s easy and we’ll do it together</p>
    </div>

    <div :class="['projects-list', viewMode]" v-if="!loading && projects.length > 0">
      <router-link :to="'/project/' + project.id" class="project-card" v-for="project in filteredProjects" :key="project.id" :class="project.completedDeliverables == project.deliverables.length && project.deliverables.length > 0 ? 'completed' : ''">
        <div class="project-card-header">
          <div class="project-card-owner">
            {{ project.tag }}
          </div>
          <div class="project-card-details">
            <ClientImage :client="project.client_id" size="medium" table="logos" />
            <h3>{{ project.name }}</h3>
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
  // Get all team_ids that the user is a member of
  // The go get all of the projects that are assigned to those teams

  const { data: teamMembers, error: teamMembersError } = await supabase
    .from('team_members')
    .select('team_id')
    .eq('user_id', user.value.id)

  if (teamMembersError) {
    console.error('Error fetching team members:', teamMembersError.message)
    return
  }

  const teamIds = teamMembers.map(team => team.team_id);

  const { data: assignedProjects, error: assignedProjectsError } = await supabase
    .from('projects')
    .select('*')
    .in('assigned_team', teamIds)

  if (assignedProjectsError) {
    console.error('Error fetching assigned projects:', assignedProjectsError.message)
    return
  }

  return assignedProjects;
}

async function fetchProjects() {
  
  const ownedProjects = await fetchOwnedProjects();
  const assignedProjects = await fetchAssignedProjects();

  const allProjects = Array.from(new Set([...ownedProjects, ...assignedProjects].map(project => project.id)))
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
  console.log('New project:', payload.new);
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
      grid-template-columns: repeat(5, 1fr);
      gap: $spacing-sm;
      width: 100%;
      padding: 0 $spacing-sm $spacing-sm;
      align-content: flex-start;

      @media (max-width: 1800px) {
        grid-template-columns: repeat(4, 1fr);
      }

      @media (max-width: 1600px) {
        grid-template-columns: repeat(3, 1fr);
      }

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
        height: 220px;
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
          position: absolute;
          right: $spacing-xxs;
          top: $spacing-xxs;
          padding: $spacing-xxxs $spacing-sm;
          border-radius: $br-md;
          font-size: $font-size-xs;
        }

        .project-card-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          flex-direction: column;
          margin-top: $spacing-sm;

          .project-card-details {
            display: flex;
            justify-content: flex-start;
            align-items: center;
            flex-direction: row;
            gap: $spacing-sm;
          }

          .image-wrapper {
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

        h3 {
          font-size: $font-size-xs;
          font-family: $font-family-main;
          font-weight: bold;
          margin: 0 0 $spacing-sm;
          
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
      padding: 0 $spacing-sm $spacing-sm;
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
          font-size: $font-size-xs;
          color: $gray-dark;
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
                background: linear-gradient(to right, $mint, $mint 80%, $brand 100%);

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