import { ref } from 'vue';
import { useModal } from '~/stores/modal'

export default function useClient() {

  const clientData = ref(null)
  const clientsData = ref(null)
  const supabase = useSupabaseClient();


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
    } 
  }

  async function fetchClient(clientId) {

    const { data, error } = await supabase
      .from('clients')
      .select('*')
      .eq('id', clientId)
  
    if (error) {
      console.error('Error fetching clients:', error.message)
      return
    }

    clientData.value = data[0]
  
    // add the clients to the clients ref
    return data[0]
  
  }

  async function fetchClients(userId) {
    const { data, error } = await supabase
      .from('clients')
      .select('*')
      .eq('created_by', userId)
  
    if (error) {
      console.error('Error fetching clients:', error.message)
      return
    }
  
    // add the clients to the clients ref
    clientsData.value = data
  
    // Add the clients to the clients ref
    clientsData.value = await Promise.all(data.map(async client => {
      
      // Get the projects for the client
      const projects = await fetchClientProjects(client.id);
      
      // Download the image
      const logoBlob = await downloadImage(client.logo_url);
      
      return {
        ...client,
        projects: projects,
        logo_url: URL.createObjectURL(logoBlob)
      };
    }));

    // console.log('clientsData', clientsData.value);

    return clientsData.value
  
  }

  async function fetchClientProjects(clientId) {
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .eq('client', clientId)
  
    if (error) {
      console.error('Error fetching client projects:', error.message)
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
        // console.log(data)
        return data
    } catch (error) {
        console.error("Error downloading image: ", error.message)
    }
  }

  function createClientModal() {
    useModal().setType('large');
    useModal().setHeader('Create Client');
    useModal().setContent('CreateClientModal');
    useModal().toggleVisibility();
  }

  return {
    clientData,
    clientsData,
    createClient,
    createClientModal,  
    fetchClient,
    fetchClients,
    fetchClientProjects
  }

}

