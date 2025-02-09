import { ref } from 'vue';

export default function useProfile() {

  const ProfileData = ref(null);
  const ProfileError = ref(null);
  const TeamIds = ref([]);
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
        subscription: {
          "status": "free",
          "order_id": "",
          "plan": "free",
          "current_period_start": ""
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

  async function getPaypalAccessToken(clientId, clientSecret) {
    // console.log('clientId:', clientId);
    // console.log('clientSecret:', clientSecret);
    const auth = btoa(`${clientId}:${clientSecret}`);

    // console.log('Auth token:', auth);
    const response = await $fetch('https://api-m.sandbox.paypal.com/v1/oauth2/token', {
      method: 'POST',
      body: new URLSearchParams({ grant_type: 'client_credentials' }).toString(),
      headers: {
        Authorization: `Basic ${auth}`,
        'content-type': 'application/x-www-form-urlencoded',
      },
    });
    return response.access_token;
  }
  
  async function verifyPaypalSubscription(subscriptionId, accessToken) {
    const response = await $fetch(`https://api-m.sandbox.paypal.com/v1/billing/subscriptions/${subscriptionId}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return response;
  }

  async function setSubscriptionStatus(id, status, subscriptionId) {
    console.log('Setting subscription status:', id, status);
    
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', id);
      
      if (error) throw error;

      const profile = data[0];
      const subscription = profile.subscription;
    
      // Check with PayPal that the orderId exists
      const config = useRuntimeConfig();
      const clientId = config.public.paypal.clientId;
      const clientSecret = config.private.paypal.clientSecret;
      const accessToken = await getPaypalAccessToken(clientId, clientSecret);
      // const orderDetails = await verifyPaypalOrder(orderId, accessToken);
      console.log('Subscription:', subscriptionId);
      const subcriptionDetails = await verifyPaypalSubscription(subscriptionId, accessToken);

      console.log('Subscription details:', subcriptionDetails);

      let status = {
        "status": subcriptionDetails.status,
        "order_id": subcriptionDetails.id,
        "current_period_start": subcriptionDetails.start_time,
        "next_billing_time": subcriptionDetails.billing_info.next_billing_time,
      }

      if (subcriptionDetails.status === 'ACTIVE') {
        // If the order exists and is completed, update the subscription status
        const { data, error } = await supabase
          .from('profiles')
          .update({ subscription: status })
          .eq('id', id);

        if (error) throw error;

        ProfileData.value = data[0];
      } else {
        throw new Error('Order is not completed');
      }
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

  async function fetchInvitedTeamsForThisProfile(email) {
    try {
      const { data, error } = await supabase
        .from('invited_profiles')
        .select('*')
        .eq('email', email);

      if (error) throw error;

      TeamIds.value = data[0];
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
    fetchInvitedTeamsForThisProfile,
    setSubscriptionStatus,
    TeamIds,
    ProfileData,
    ProfileError,
    Profiles
  }
}
