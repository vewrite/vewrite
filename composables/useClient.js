import { ref } from 'vue';

export default function useClient() {

  const clientData = ref(null)
  const clientsData = ref(null)
  const supabase = useSupabaseClient();

  async function fetchClient(clientId) {
    console.log('fetchClient', clientId)

    const { data, error } = await supabase
      .from('clients')
      .select('*')
      .eq('id', clientId)
  
    if (error) {
      console.error('Error fetching clients:', error.message)
      return
    }

    clientData.value = data[0]

    console.log('clientData', clientData.value);
  
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
      const logoBlob = await downloadImage(client.logo_url);
      return {
        ...client,
        logo_url: URL.createObjectURL(logoBlob)
      };
    }));

    console.log('clientsData', clientsData.value);

    return clientsData.value
  
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

  return {
    clientData,
    clientsData,
    fetchClient,
    fetchClients
  }

}

