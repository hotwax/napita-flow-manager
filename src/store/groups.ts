import { defineStore } from "pinia";
import { GroupService } from "@/services/GroupService"

export const useGroupStore = defineStore('groups', {
    state: () => {
      return {
        processGroups: [],
        processByGroups: {} as any,
        currentProcessGroup: {},
				root:'a3229852-0187-1000-8abc-9e42ca1734f2'
      }
    },
    getters: {
      getProcessGroups(state) {
        return state.processGroups
      },
      getCurrentProcessGroup(state) {
        return state.currentProcessGroup
      },
      getProcessByGroups(state) {
        return state.processByGroups
      }
    },
    actions: {
      async fetchProcessGroups() {
				const processGroups = await GroupService.FetchProcessGroups(this.root);
        this.processGroups = processGroups;
				return Promise.resolve(processGroups);
			},
      async fetchProcessByGroups(id: any) {
				const processByGroups = await GroupService.FetchProcessByGroups(id);
        this.processByGroups = processByGroups;
			},
      setCurrentProcessGroup(processGroup: any) {
        this.currentProcessGroup = processGroup;
      },
    },
    persist: true,
  })