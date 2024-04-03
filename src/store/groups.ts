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
      try {
        const resp = await GroupService.fetchProcessGroups();
        if (!hasError(resp) && resp.data) {
          const processGroups = resp.data.processGroupFlow.flow.processGroups.map((group: any) => ({
            id: group.id,
            name: group.component.name,
            runningCount: group.runningCount,
            stoppedCount: group.stoppedCount,
            invalidCount: group.invalidCount,
            disabledCount: group.disabledCount,
            inputPortCount: group.inputPortCount,
            outputPortCount: group.outputPortCount
          }));
          processGroups.sort((a:any, b: any) => a.name.localeCompare(b.name));
          this.processGroups = processGroups;
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
        if (!hasError(resp) && resp.data) {
          const processes = resp.data.processGroupFlow.flow.processGroups.map((group: any) => ({
            id: group.id,
            name: group.component.name,
            runningCount: group.runningCount,
            stoppedCount: group.stoppedCount,
            invalidCount: group.invalidCount,
            disabledCount: group.disabledCount,
            inputPortCount: group.inputPortCount,
            outputPortCount: group.outputPortCount
          }));

          const connections = resp.data.processGroupFlow.flow.connections.map((group: any) => ({
            sourceId: group.component.source.groupId,
            destinationId: group.component.destination.groupId
          }));

          processes.sort((a:any, b: any) => a.name.localeCompare(b.name));
          this.currentGroupProcesses.processes = processes;
          this.currentGroupProcesses.connections = connections;
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