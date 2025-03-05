import { defineStore } from 'pinia'

export const useUser = defineStore('userStore', {
  state: () => ({
    username: '',
    email: '',
    uuid: '',
    tier: '',
    persona: '',
    first_time: null,
    website: ''
  }),
  actions: {
    setUser(user) {

      if (!user) {
        console.error('setUser called with undefined user')
        return
      }

      // expects an object with username, email, id, and firstTime
      this.username = user.username;
      this.email = user.email;
      this.uuid = user.id;
      this.tier = 'free';
      this.first_time = user.first_time;
      this.website = user.website;
      this.person = user.persona;
    },
    setFirstTime(set) {
      // expects a boolean
      this.first_time = set;
    },
    setPersona(persona) {
      // expects a string
      this.persona = persona;
      console.log('setting persona to', persona)
    },
    setUsername(username) {
      // expects a string
      console.log('setting username to', username)
      this.username = username;
    },
    setWebsite(website) {
      // expects a string
      console.log('setting website to', website)
      this.website = website;
    }
  }
})

