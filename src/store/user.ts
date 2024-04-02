import { defineStore } from "pinia";
import { UserService } from "@/services/UserService"
import { DateTime } from 'luxon';
import logger from '../logger';
import emitter from '@/event-bus'

export const useUserStore = defineStore('user', {
  state: () => {
    return {
      instanceUrl: '',
      username: '', // This needs to be removed later when we'll user user-prfile card to display user details
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
    getUserName(state) {
      return state.username
    },
    isAuthenticated(state) {
      let isTokenExpired = false
      
      if (state.token.expirationTime ) {
        const currTime = DateTime.now().toMillis()
        isTokenExpired = state.token.expirationTime < currTime
      }
      return state.token.value && !isTokenExpired
    }
  },
  actions: {
    async login(username: string, password: string) {
      emitter.emit('presentLoader', { message: 'Logging out', backdropDismiss: false })

      try {
        if (!username.length || !password.length) {
          return Promise.reject('')
        }
        const token = await UserService.login(username, password);
        this.token.value = token;
        this.username = username;
        const expirationTimeDetails = await UserService.fetchExpirationTime();

        if (expirationTimeDetails.data) {
          const expirationDateTime = DateTime.fromISO(expirationTimeDetails.data.accessTokenExpiration.expiration).toMillis();
          this.token.expirationTime = expirationDateTime;
        }
        emitter.emit('dismissLoader')
        return Promise.resolve(token)
      } catch (err) {
        emitter.emit('dismissLoader')
        return Promise.reject(err)
      }
    },
    async setUserInstanceUrl(instanceUrl: string) {
      this.instanceUrl = instanceUrl;
    },
    async logout() { 
      emitter.emit('presentLoader', { message: 'Logging out', backdropDismiss: false })
      try {
        await UserService.logout();
        this.token.value = '';
        this.token.expirationTime = '';
        this.instanceUrl = '';
        emitter.emit('dismissLoader')
        return Promise.resolve(); 
      } catch (err) {
        emitter.emit('dismissLoader')
        logger.error('Error logging out:', err);
        return Promise.reject(err);
      }
    }
  },
  persist: true,
})