<template>
  <main id="ProjectsList">
    <Loading v-if="loading" />
    <div class="empty-state" v-if="projects.length === 0 && !loading">
      <img src="/images/projects-empty-state.svg" alt="No projects found" />
      <h3>You haven’t created a project yet</h3>
      <p>That’s ok, It’s easy and we’ll do it together</p>
      <router-link to="/project/create" class="button primary">Create a project</router-link>
    </div>
    <div class="projects-list" v-else>
      <router-link :to="'/project/' + project.id" class="project-card" v-for="project in projects" :key="project.id">
        <div class="project-card-header">
          <div class="image-wrapper">
            <img :src="project.client_logos" :alt="'Client id:' + project.client" />
          </div>
          <div class="project-card-buttons">
            <button class="button" @click="edit">Edit</button>
          </div>
        </div>
        <h3>{{ project.name }}</h3>
        <div class="project-deliverables-status">
          <div class="progress-status">
            <span>Progress</span>
            <span>{{ project.complete }} / {{ project.deliverables.length }}</span>
          </div>
          <div class="progress-content">
            <div class="empty-deliverables" v-if="project.deliverables.length == 0">
              <span>No deliverables</span>
            </div>
            <div class="deliverables" v-else>
              <div class="progress-bar">
                <div class="progress" :style="{ width: (project.complete / project.deliverables.length) * 100 + '%' }"></div>
              </div>
              <!-- <span>{{ project.deliverables.length }} deliverables</span> -->
            </div>
            <!-- {{ project.deliverables  }} -->
          </div>
        </div>
      </router-link>
    </div>
  </main>
</template>

<script setup>

const projects = ref([]);
const loading = ref(true);

// Supabase
const supabase = useSupabaseClient();
const user = useSupabaseUser();

// Modal
import { useModal } from '~/stores/modal';
const modal = useModal();

const edit = () => {
  modal.visible = 1;
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

  // Deal with client logos
  projects.value = await Promise.all(data.map(async project => {
    const clientLogos = await fetchClientLogo(project.client);
    return {
      ...project,
      client_logos: clientLogos
    };
  }));

  // Deal with deliverables from a separate table
  // Calculate the progress of each project
  // Update the project object with the deliverables and progress
  projects.value = await Promise.all(projects.value.map(async project => {
    const deliverables = await fetchDeliverables(project.id);
    const complete = deliverables.filter(deliverable => deliverable.status == 1).length;
    return {
      ...project,
      deliverables: deliverables,
      complete: complete
    };
  }));

  console.log(projects.value)

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

onMounted(() => {
  fetchProjects()
})


</script>

<style lang="scss" scoped>

@import 'assets/_variables.scss';

#ProjectsList {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: flex-start;
  height: 100%;
  padding: $spacing-lg;
  margin-bottom: $spacing-lg;
  overflow-y: auto;
  // background-color: rgba($gray-light, 0.2);

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
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: $spacing-md;
    width: 100%;

    @media (max-width: 1200px) {
      grid-template-columns: repeat(2, 1fr);
    }

    @media (max-width: 768px) {
      grid-template-columns: 1fr;
    }

    .project-card {
      padding: $spacing-md;
      background-color: $white;
      border-radius: $br-lg;
      border: 1px solid rgba($black, 0.1);
      transition: border 0.18s ease;
      text-decoration: none;
      min-height: 300px;
      color: $black;
      position: relative;

      .project-card-header {
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
        margin-bottom: $spacing-md;
        flex-direction: row;

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

        .project-card-buttons {
          opacity: 0;
          transition: opacity 0.2s ease;
        }

      }

      &:hover {
        border: 1px solid rgba($purple, 1);

        .project-card-buttons {
          opacity: 1;
        }
      }

      h3 {
        font-size: $font-size-lg;
        font-family: $font-family-secondary;
        font-weight: 500;
        margin: 0 0 $spacing-sm;
      }

      p {
        font-size: $font-size-sm;
        font-weight: 400;
        color: $gray-dark;
      }

      .project-deliverables-status {
        display: flex;
        flex-direction: column;
        justify-content: flex-start;
        position: absolute;
        bottom: $spacing-md;
        width: calc(100% - #{$spacing-md * 2});

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
              background-color: $purple;
            }

          }
        }
      }
    }
  }
}

</style>