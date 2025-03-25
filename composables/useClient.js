import { ref } from 'vue';
import { useModal } from '~/stores/modal'
import { useRouter } from 'vue-router';

export default function useClient() {

  const ClientData = ref(null)
  const ClientError = ref(null)
  const clientsData = ref(null)
  const ClientProjects = ref([])
  const supabase = useSupabaseClient()
  const router = useRouter();


  async function createClient(client) {

    try {

      useModal().toggleLoading();

      const newClient = {
        name: client.name,
        created_at: client.created_at,
        updated_at: client.updated_at,
        created_by: client.created_by,
        logo_url: client.logo_url,
      }
  
      let { error } = await supabase.from('clients').upsert(newClient, {
          returning: 'minimal', // Don't return the value after inserting
      })
  
      useModal().toggleVisibility();
      useModal().reset();

      if (error) throw error
  
    } catch (error) {
      console.error('Error creating client:', error)
      ClientError.value = error.message
    } 
  }

  async function updateClient(client) {
    console.log('Updating client', client);

    try {
      const { data, error } = await supabase
        .from('clients')
        .update(client)
        .eq('client_id', client.client_id);

      if (error) throw error;

      return data;
    } catch (error) {
      ClientError.value = error.message;
      console.error('Error updating client:', error.message);
    }
  }

  async function fetchClient(clientId) {

    const { data, error } = await supabase
      .from('clients')
      .select('*')
      .eq('client_id', clientId)
  
    if (error) {
      console.error('Error fetching clients:', error.message)
      ClientError.value = error.message
      return
    }

    ClientData.value = data[0]
    return data[0]
  
  }

  async function deleteClient(deliverables, projects, clientId) {

    useModal().toggleLoading();

    try {

      for (let i = 0; i < deliverables.length; i++) {
        await supabase
          .from('deliverables')
          .delete()
          .eq('id', deliverables[i].id);
          console.log('Deleting deliverable',  deliverables[i].id);
      }

      for (let i = 0; i < projects.length; i++) {
        await supabase
          .from('projects')
          .delete()
          .eq('id', projects[i].id);
          console.log('Deleting project', projects[i].id);
      }

      const { data, error } = await supabase
        .from('clients')
        .delete()
        .eq('client_id', clientId);

      if (error) throw error;

      useModal().toggleVisibility();
      useModal().reset();
  
      router.push('/clients');

      return data;

    } catch (error) {
      console.error('Error deleting client:', error.message);
      ClientError.value = error.message
    }

  }

  async function fetchProjectsFromSpecificClient(clientId) {
    const { data, error } = await supabase
      .from('clients')
      .select(`*,projects (*)`)
      .eq('client_id', clientId);
  
    if (error) {
      console.error('Error fetching client projects:', error.message)
      ClientError.value = error.message
      return
    }
  
    ClientProjects.value = data
    return data
  }
    

  async function fetchClients(userId) {
    try {
      const { data, error } = await supabase
        .from('clients')
        .select('*')
        .eq('created_by', userId)

      if (error) {
        console.error('Error fetching clients:', error.message)
        ClientError.value = error.message
        return
      }

      console.log('Clients:', data)

      if (!data) {
        return
      } else {
        clientsData.value = await Promise.all(data.map(async client => {
          clientsData.projects = [];
          clientsData.projects = await fetchClientProjects(client.client_id);
          
          // Download the image
          if (client.logo_url === '') {
            console.log('No logo found');
            const logoBlob = await fetch('./images/vewrite-personal-project.png').then(res => res.blob());
            return {
              ...client,
              logo_url: URL.createObjectURL(logoBlob)
            };
          } else {
            const logoBlob = await downloadImage(client.logo_url);
            return {
              ...client,
              logo_url: URL.createObjectURL(logoBlob)
            };
          }
        }));
    
        return clientsData.value
      }
    
    } catch (error) {
      console.error('Error fetching clients:', error.message)
      ClientError.value = error.message
    }
  
  }

  async function fetchClientsOwnedBy(userId) {
    try {
      const { data, error } = await supabase
        .from('clients')
        .select('*')
        .eq('created_by', userId)

      if (error) {
        console.error('Error fetching clients:', error.message)
        ClientError.value = error.message
        return
      }

      return data.length
    
    } catch (error) {
      console.error('Error fetching clients:', error.message)
      ClientError.value = error.message
    }
  }

  async function fetchClientProjects(clientId) {

    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .eq('client_id', clientId)
  
    if (error) {
      console.error('Error fetching client projects:', error.message)
      ClientError.value = error.message
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
        ClientError.value = error.message
    }
  }

  function createClientModal() {
    useModal().setType('large');
    useModal().setHeader('Create Client');
    useModal().setContent('CreateClientModal');
    useModal().toggleVisibility();
  }

  function deleteClientModal() {
    useModal().setType('medium');
    useModal().setHeader('Delete Client');
    useModal().setContent('DeleteClientModal');
    useModal().toggleVisibility();
  }

  return {
    ClientData,
    ClientProjects,
    ClientError,
    clientsData,
    createClient,
    createClientModal,  
    deleteClientModal,
    deleteClient,
    updateClient,
    fetchClient,
    fetchClients,
    fetchClientsOwnedBy,
    fetchClientProjects,
    fetchProjectsFromSpecificClient
  }

}

