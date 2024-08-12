import { defineStore } from 'pinia'

export const useUser = defineStore('userStore', {
  state: () => ({
    username: '',
    email: '',
    uuid: '',
    tier: '',
    firstTime: true
  }),
  actions: {
    setUser(user) {
      this.username = user.username;
      this.email = user.email;
      this.uuid = user.id;
      this.tier = 'free';
      this.firstTime = user.firstTime;
    },
    setFirstTime(set) {
      this.firstTime = set;
    }
  }
})

