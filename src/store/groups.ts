import { defineStore } from "pinia";
import { GroupService } from "@/services/GroupService"
import logger from "@/logger";
import { hasError } from "@/utils"

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
      try{
        const resp = await GroupService.fetchProcessGroups();
        const processGroupDetails = resp.data.processGroupFlow.flow.processGroups.map((group: any) => ({
          id: group.id,
          name: group.component.name,
          runningCount: group.runningCount,
          stoppedCount: group.stoppedCount,
          invalidCount: group.invalidCount,
          disabledCount: group.disabledCount,
          inputPortCount: group.inputPortCount,
          outputPortCount: group.outputPortCount
        }));
        if (!hasError(resp) && resp.data) {
          this.processGroups = processGroupDetails;
        } else {
          throw resp.data
        }
      } catch (error) {
        logger.error(error)
      }
    },
    async fetchProcessByGroups(id: any) {
      try{
        const resp = await GroupService.fetchProcessByGroups(id);
        const processGroupDetails = resp.data.processGroupFlow.flow.processGroups.map((group: any) => ({
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
        const processGroupConnection = resp.data.processGroupFlow.flow.connections.map((group: any) => ({
          sourceId: group.component.source.groupId,
          destinationId: group.component.destination.groupId
        }));
        if (!hasError(resp) && resp.data) {
          this.currentGroupProcesses.processes = processGroupDetails; //storing processes in state
          this.currentGroupProcesses.connections = processGroupConnection; //storing connections in state
        } else {
          throw resp.data
        }
      } catch (error) {
        logger.error(error)
      }
    },
    setcurrentProcessGroup(processGroup: any) {
      this.currentGroup = processGroup;
    },
  },
  persist: true,
})