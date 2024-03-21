import { defineStore } from "pinia";
import { UserService } from "@/services/UserService"

export const useUserStore = defineStore('user', {
  state: () => {
    return {
      instanceUrl: "",
      token: {
        value: '',
        expirationTime: ''
      }
    }
  },
  getters: {
    getInstanceUrl(state) {
      return state.instanceUrl
    },
    getBaseUrl(state) {
      let baseURL = process.env.VUE_APP_BASE_URL;
      if (!baseURL) baseURL = state.instanceUrl;
      return baseURL.startsWith('http') ? baseURL : `https://${baseURL}.hotwax.io`;
    },
    getUserToken(state) {
      return state.token;
    }
  },
  actions: {
    async login( username: string, password:string ) {
      try {
        if (!username.length || !password.length) {
          return Promise.reject('')
        }
        this.token.value = await UserService.login(username, password);
        const token = this.token.value;
        
        const expirationTime = await UserService.fetchExpirationTime(token);
        this.token.expirationTime = expirationTime.accessTokenExpiration.expiration

      } catch(err){
        return Promise.reject(err)
      }
    },
    async setUserInstanceUrl(instanceUrl: string) {
      this.instanceUrl = instanceUrl;
    }
  },
  persist: true,
})