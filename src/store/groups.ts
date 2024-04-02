import { defineStore } from "pinia";
import { GroupService } from "@/services/GroupService"


export const useGroupStore = defineStore('groups', {
    state: () => {
      return {
        processGroups: {},
        processByGroups: {} as any,
        currentProcessGroup: {},
				root:'a3229852-0187-1000-8abc-9e42ca1734f2'
      }
    },
    getters: {
      getCurrentProcessGroup(state) {
        return state.currentProcessGroup
      }
    },
    actions: {
      async fetchProcessGroups() {
				const processGroups = await GroupService.FetchProcessGroups(this.root);
        this.processGroups = processGroups;
				return Promise.resolve(processGroups);
			}
    },
    persist: true,
  })