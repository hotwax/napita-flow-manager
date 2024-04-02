import { useUserStore } from '@/store/user'
import { useGroupStore } from '@/store/groups'
import api, { client } from "@/api"

const FetchProcessGroups = async (root: any): Promise<any> => {
  const userStore = useUserStore();
  const baseURL = userStore.getBaseUrl;

  try {
    const resp = await api({
      url: `flow/process-groups/${root}`,
      method: "get",
      baseURL,
    }) as any;
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
    console.log(processGroupDetails);
    
    return Promise.resolve(processGroupDetails);
  } catch (err) {
    console.log(err);  
    return Promise.reject("Failed to fetch process groups");
  }
}

const FetchProcessGroupsConnection = async (root: any, token: any, groupId: any): Promise<any> => {
  const userStore = useUserStore();
  const groupStore = useGroupStore()
  const baseURL = userStore.getBaseUrl;
  const id = groupStore.getCurrentProcessGroup.id
  try {
    const resp = await client({
      url: `flow/process-groups/${id}`,
      method: "get",
      baseURL,
      headers: {
        'Authorization': `Bearer ${token}`
      }
    }) as any;
    const connections = resp.data.processGroupFlow.flow.connections.map((group: any) => ({
       sourceId: group.component.source.groupId,
       destinationId: group.component.destination.groupId
    }));  
    // Find the connection with destinationId equal to groupId
    const findConnection = connections.find((connection: any) => connection.destinationId === groupId);

    if (findConnection) {
      return Promise.resolve({ sourceId: findConnection.sourceId, destinationId: findConnection.destinationId });
    } else {
      return Promise.reject("Connection not found for groupId: " + groupId);
    }
  } catch (err) {
    console.log(err);  
    return Promise.reject("Failed to fetch process groups connections");
  }
}

export const GroupService = {
  FetchProcessGroups,
  FetchProcessGroupsConnection
}