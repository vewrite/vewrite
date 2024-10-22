import { ref } from 'vue';

export default function useProfile() {

  const ProfileData = ref(null);
  const ProfileError = ref(null);
  const Profiles = ref([]);
  const supabase = useSupabaseClient();

  async function createProfile(profile) {

    try {

      const newProfile = {
        id: profile.id,
        email: profile.email,
        username: '',
        firstTime: true,
        avatar_url: '',
        website: '',
        persona: '',
      }

      const { data, error } = await supabase
        .from('profiles')
        .insert(newProfile);

      if (error) throw error

      ProfileData.value = data[0]
      return data
  
    } catch (error) {
      console.error('Error creating profile:', error)
    } 
  }

  async function updateProfile(profile) {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .update(profile)
        .eq('id', profile.id);

      if (error) throw error;

      return data;
    } catch (error) {
      alert(error.message);
    }
  }

  async function deleteProfile(profile) {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .delete()
        .eq('id', profile.id);

      if (error) throw error;

      return data;
    } catch (error) {
      alert(error.message);
    }
  }

  async function fetchSingleProfile(profileId) {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', profileId);

      if (error) throw error;

      ProfileData.value = data[0];
    } catch (error) {
      ProfileError.value = error.message;
    }
  }

  return {
    createProfile,
    updateProfile,
    deleteProfile,
    fetchSingleProfile,
    ProfileData,
    ProfileError,
    Profiles
  }
}
