import { useUserStore } from '@/store/user'
import api from "@/api"
import logger from '../logger';

const fetchProcessGroups = async (): Promise<any> => {
  const userStore = useUserStore();
  const baseURL = userStore.getBaseUrl;
  try {
    const resp = await api({
      url: "flow/process-groups/a3229852-0187-1000-8abc-9e42ca1734f2",
      method: "get",
      baseURL,
    }) as any;
    return Promise.resolve(resp);
  } catch (err) {
    logger.error(err);
    return Promise.reject("Failed to fetch process groups");
  }
}

const fetchProcessByGroups = async (root: any): Promise<any> => {
  const userStore = useUserStore();
  const baseURL = userStore.getBaseUrl;

  try {
    const resp = await api({
      url: `flow/process-groups/${root}`,
      method: "get",
      baseURL,
    }) as any;
    return Promise.resolve(resp);
  } catch (err) {
    logger.error("error:",err);
    return Promise.reject("Failed to fetch processes by groups");
  }
}

export const GroupService = {
  fetchProcessGroups,
  fetchProcessByGroups
}