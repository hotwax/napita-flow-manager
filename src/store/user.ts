import { defineStore } from "pinia";
import { UserService } from "@/services/UserService"
import { DateTime } from 'luxon';

export const useUserStore = defineStore('user', {
  state: () => {
    return {
      instanceUrl: "",
      token: {
        value: '',
        expirationTime: ''
      }as any
    }
  },
  getters: {
    getInstanceUrl(state) {
      return state.instanceUrl
    },
    getBaseUrl(state) {
      let baseURL = process.env.VUE_APP_BASE_URL;
      if (!baseURL) baseURL = state.instanceUrl;
      return baseURL.startsWith('http') ? baseURL : `https://${baseURL}.hotwax.io/nifi-api`;
    },
    getUserToken(state) {
      return state.token;
    },
    isAuthenticated(state) {
      let isTokenExpired = false
      
      if (state.token.expirationTime) {
        console.log(state.token.expirationTime);
        const currTime = DateTime.now().toMillis()
        isTokenExpired = state.token.expirationTime < currTime
      }
      console.log(state.token.value, !isTokenExpired);
      
      return state.token.value && !isTokenExpired
    }
  },
  actions: {
    async login( username: string, password:string ) {
      try {
        if (!username.length || !password.length) {
          return Promise.reject('')
        }

        const token = await UserService.login(username, password);
        console.log(token);
 
        this.token.value = token;
      
        const expirationTimeDetails = await UserService.fetchExpirationTime(token);
    
        const expirationDateTime = DateTime.fromISO(expirationTimeDetails.data.accessTokenExpiration.expiration).toMillis();
        console.log(expirationDateTime);
        
        this.token.expirationTime = expirationDateTime;
        
        return Promise.resolve(token)

      } catch(err){
        return Promise.reject(err)
      }
    },
    async setUserInstanceUrl(instanceUrl: string) {
      this.instanceUrl = instanceUrl;
    },
    async logout()
    {
      const token = this.token.value;
      this.token.value = ''
      const logtut1 = await UserService.logout(token);
      console.log(logtut1);
    
    }
  },
  persist: true,
})