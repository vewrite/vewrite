<template>
  <main id="ProjectsList">
    <Loading v-if="loading" />

    <div class="search-bar" v-if="projects.length > 0 && !loading">
      <input type="text" placeholder="Search project titles" v-model="searchQuery" :class="[listToggle]" />
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

    <div :class="['projects-list', viewMode]" v-if="!loading">
      <router-link :to="'/project/' + project.id" class="project-card" v-for="project in filteredProjects" :key="project.id">
        <div class="project-card-header">
          <div class="image-wrapper">
            <ClientImage :client="project.client" size="medium" table="logos" />
          </div>
        </div>
        <h3>{{ project.name }}</h3>
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
                <div class="progress" :style="{ width: (project.completedDeliverables / project.deliverables.length) * 100 + '%' }"></div>
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

// Supabase
const supabase = useSupabaseClient();
const user = useSupabaseUser();

// Modal
import { useModal } from '~/stores/modal';
const modal = useModal();

const edit = () => {
  modal.visible = 1;
};

const viewMode = ref('grid');

const listToggle = () => {
  viewMode.value = viewMode.value === 'grid' ? 'list' : 'grid';
};

async function fetchProjects() {
  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .eq('created_by', user.value.id)

  if (error) {
    console.error('Error fetching projects:', error.message)
    return
  }

  // The clientimage component expects a client object with an id
  projects.value = await Promise.all(data.map(async project => {
    const clientLogo = await fetchClientLogo(project.client);
    return {
      ...project,
      client: {
        id: project.client,
      }
    };
  }));

  // Get the deliverables from a separate table
  // Calculate the progress of each project
  // Update the project object with the deliverables and progress
  projects.value = await Promise.all(projects.value.map(async project => {
    const deliverables = await fetchDeliverables(project.id);

    // TODO: Calculate the progress of the project based on the deliverable status 
    const completedDeliverables = deliverables.filter(deliverable => deliverable.workflow_state == 6).length;
    return {
      ...project,
      deliverables: deliverables,
      completedDeliverables: completedDeliverables
    };
  }));

  // console.log(projects.value)

  loading.value = false
}

async function fetchClientLogo(client) {

  // get one logo based on the client id
  const { data, error } = await supabase
    .from('clients')
    .select('logo_url')
    .eq('id', client)
    .single()

  if (error) {
    console.error('Error fetching client:', error.message)
    return null
  }

  const logoBlob = await downloadImage(data.logo_url);
  return URL.createObjectURL(logoBlob);

}

async function fetchDeliverables(projectId) {

  const { data, error } = await supabase
    .from('deliverables')
    .select('*')
    .eq('project', projectId)

  if (error) {
    console.error('Error fetching deliverables:', error.message)
    return
  }

  return data
}

const downloadImage = async (path) => {
  try {
    const { data, error } = await supabase.storage
          .from('logos')
          .download(path)
      if (error) throw error
      return data
  } catch (error) {
      console.error("Error downloading image: ", error.message)
  }
}

onMounted(async () => {
  // Register onUnmounted before any await statements
  const subscription = supabase
    .from('projects')
    .on('INSERT', payload => {
      console.log('New project:', payload.new);
      projects.value.push(payload.new);
      // This is to update the dates after a new deliverable is added
      fetchProjects();
    })
    .subscribe();

  onUnmounted(() => {
    supabase.removeSubscription(subscription);
  });

  await fetchProjects();

  loading.value = false;
});

const filteredProjects = computed(() => {
  if (!searchQuery.value) {
    return projects.value
  }
  return projects.value.filter(project =>
    project.name.toLowerCase().includes(searchQuery.value.toLowerCase())
  )
})

</script>

<style lang="scss" scoped>

@import 'assets/_variables.scss';

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
  height: 100%;
  margin-bottom: $spacing-lg;
  overflow-y: auto;
  transition: padding 0.2s ease;

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
      font-size: $font-size-sm;
      font-weight: 400;
      margin: $spacing-sm 0 $spacing-md;
      color: $gray-dark;
    }

  }

  .projects-list {

    background: $white;
    height: calc(100% - 60px);

    &.grid {
      display: grid;
      grid-template-columns: repeat(5, 1fr);
      gap: $spacing-md;
      width: 100%;
      padding: $spacing-md;
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
        background-color: $white;
        border-radius: $br-md;
        border: 1px solid rgba($brand, 0.2);
        text-decoration: none;
        height: 220px;
        color: $black;
        position: relative;
        overflow: hidden;
        display: flex;
        flex-direction: row;
        gap: $spacing-sm;
        justify-content: space-between;
        transition: border, transform 0.18s ease;
        animation: cardAppear 0.2s ease;
        animation-fill-mode: forwards;
        animation-delay: 0s;
        opacity: 0;
        transform: scale(0.9);

        $project-cards: ();

        // generate the colors with an HSL model
        @for $i from 0 through 60 {
          &:nth-child(#{$i}) {
            animation-delay: #{$i * .1}s;
          }
        }

        &:hover {
          border: 1px solid rgba($brand, 1);
          transform: scale(1.05);
        }

        .project-card-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: $spacing-md;
          flex-direction: row;

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
          font-size: $font-size-sm;
          font-family: $font-family-main;
          font-weight: 600;
          margin: 0 0 $spacing-sm;
          
          a {
            color: $brand;
            text-decoration: none;
          }
        }

        p {
          font-size: $font-size-sm;
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
            margin-bottom: $spacing-sm;
            width: 100%;

            span {
              font-size: $font-size-sm;
              font-weight: 400;
              color: $gray-dark;
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
              border: 1px solid $gray-light;

              .progress {
                height: 6px;
                border-radius: $br-md;
                background-color: $brand;
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
      padding: $spacing-sm;
      align-content: flex-start;
      width: 100%;

      .project-card {
        padding: $spacing-sm;
        background-color: $white;
        border-radius: $br-md;
        transition: background-color 0.18s ease;
        text-decoration: none;
        width: 100%;
        color: $black;
        position: relative;
        overflow: hidden;
        display: flex;
        flex-direction: row;
        gap: $spacing-md;
        justify-content: space-between;

        .project-card-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          flex-direction: row;
          width: 80px;

          .image-wrapper {
            width: 80px;
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

        h3 {
          font-size: $font-size-lg;
          font-family: $font-family-secondary;
          font-weight: 500;
          margin: 0;
          align-self: center;
          width: 35%;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          
          a {
            color: $brand;
            text-decoration: none;
          }
        }

        p {
          font-size: $font-size-sm;
          font-weight: 400;
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
          background-color: rgba($brand, 0.05);

          .project-card-buttons {

          }

          .project-deliverables-status {
            
          }
        }

        .project-deliverables-status {
          display: flex;
          flex-direction: row;
          justify-content: flex-start;
          transition: all 0.2s ease;
          width: 35%;
          gap: $spacing-md;

          .progress-status {
            display: flex;
            justify-content: space-between;
            align-items: center;
            width: 50%;

            span {
              font-size: $font-size-sm;
              font-weight: 400;
              color: $gray-dark;
              white-space: nowrap;
              overflow: hidden;
              text-overflow: ellipsis;

              &:first-child {
                display: none;
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
              border: 1px solid $gray-light;

              .progress {
                height: 6px;
                border-radius: $br-md;
                background-color: $brand;
              }

            }
          }
        }
      }

      }
  }
}

</style>