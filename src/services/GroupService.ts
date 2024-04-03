import { useUserStore } from '@/store/user'
import api from "@/api"

const FetchProcessGroups = async (root: any): Promise<any> => {
  const userStore = useUserStore();
  const baseURL = userStore.getBaseUrl;

  try {
    const resp = await api({
      url: `flow/process-groups/${root}`,
      method: "get",
      baseURL,
      cache: true
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
    return Promise.resolve(processGroupDetails);
  } catch (err) {
    console.log(err);  
    return Promise.reject("Failed to fetch process groups");
  }
}

const FetchProcessByGroups = async (root: any): Promise<any> => {
  const userStore = useUserStore();
  const baseURL = userStore.getBaseUrl;

  try {
    const resp = await api({
      url: `flow/process-groups/${root}`,
      method: "get",
      baseURL,
      cache: true
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
    console.log("error:",err);  
    return Promise.reject("Failed to fetch processes by groups");
  }
}

export const GroupService = {
  FetchProcessGroups,
  FetchProcessByGroups
}