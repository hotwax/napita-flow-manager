import { defineStore } from "pinia";
import { GroupService } from "@/services/GroupService"

export const useGroupStore = defineStore('groups', {
  state: () => {
    return {
      processGroups: [],
      currentGroupProcesses: {
        processes: [],
        connections: []
      } as any,
      currentGroup: {},
    }
  },
  getters: {
    getProcessGroups(state) {
      return state.processGroups
    },
    getCurrentGroup(state) {
      return state.currentGroup
    },
    getCurrentGroupProcesses(state) {
      return state.currentGroupProcesses.processes
    },
    getCurrentGroupconnections(state) {
      return state.currentGroupProcesses.connections
    }
  },
  actions: {
    async fetchProcessGroups() {
      const processGroups = await GroupService.fetchProcessGroups();
      const processGroupDetails = processGroups.data.processGroupFlow.flow.processGroups.map((group: any) => ({
        id: group.id,
        name: group.component.name,
        runningCount: group.runningCount,
        stoppedCount: group.stoppedCount,
        invalidCount: group.invalidCount,
        disabledCount: group.disabledCount,
        inputPortCount: group.inputPortCount,
        outputPortCount: group.outputPortCount
      }));
      this.processGroups = processGroupDetails;
      return Promise.resolve(processGroups);
    },
    async fetchProcessByGroups(id: any) {
      const processesByGroups = await GroupService.fetchProcessByGroups(id);
      const processGroupDetails = processesByGroups.data.processGroupFlow.flow.processGroups.map((group: any) => ({
        id: group.id,
        name: group.component.name,
        runningCount: group.runningCount,
        stoppedCount: group.stoppedCount,
        invalidCount: group.invalidCount,
        disabledCount: group.disabledCount,
        inputPortCount: group.inputPortCount,
        outputPortCount: group.outputPortCount
      }));
      //storing processes in state
      this.currentGroupProcesses.processes = processGroupDetails;

      const processGroupConnection = processesByGroups.data.processGroupFlow.flow.connections.map((group: any) => ({
        sourceId: group.component.source.groupId,
        destinationId: group.component.destination.groupId
      }));
      //storing connections in state
      this.currentGroupProcesses.connections = processGroupConnection
    },
    setCurrentProcessGroup(processGroup: any) {
      this.currentGroup = processGroup;
    },
  },
  persist: true,
})