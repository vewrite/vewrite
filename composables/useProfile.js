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
        first_time: true,
        avatar_url: '',
        website: '',
        persona: '',
        subscription: {
          "status": "free"
        },
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

  async function createInvitedProfile(profile) {
    try {
      const { data, error } = await supabase
        .from('invited_profiles')
        .insert(profile);

      if (error) throw error

      ProfileData.value = data[0]
      return data
  
    } catch (error) {
      console.error('Error creating invited profile:', error)
    } 
  }

  async function setSubscriptionStatus(id, status) {
    console.log('Setting subscription status:', id, status);
    
    try {
      const { data, error } = await supabase
          .from('profiles')
          .update({ subscription: status })
          .eq('id', id);

      if (error) throw error;

      return data;

    } catch (error) {
      console.error('Error setting subscription status:', error);
      ProfileError.value = error.message;
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
      ProfileError.value = error.message;
      console.error('Error updating profile:', error.message);
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
      ProfileError.value = error.message;
      console.error('Error deleting profile:', error.message);
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
      return data;

    } catch (error) {
      ProfileError.value = error.message;
    }
  }

  async function fetchProfileImage(uuid) {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('avatar_url')
        .eq('id', uuid);

      if (error) throw error;

      ProfileData.value = data[0];
      return data;
    } catch (error) {
      ProfileError.value = error.message;
    }
  }

  async function fetchProfileViaEmail(email) {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('email', email);

      if (error) throw error;

      if (data.length === 0) {
        // No result found, return the inputted email address as the data
        ProfileData.value = { email };
      } else {
        ProfileData.value = data[0];
      }
    } catch (error) {
      ProfileError.value = error.message;
    }
  }

  return {
    createProfile,
    createInvitedProfile,
    updateProfile,
    deleteProfile,
    fetchSingleProfile,
    fetchProfileViaEmail,
    fetchProfileImage,
    setSubscriptionStatus,
    ProfileData,
    ProfileError,
    Profiles
  }
}
