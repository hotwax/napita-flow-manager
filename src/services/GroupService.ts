import { useUserStore } from '@/store/user'
import api from "@/api"

const userStore = useUserStore();
const baseURL = userStore.getBaseUrl;

const fetchProcessGroups = async (): Promise<any> => {
  return api({
    url: "flow/process-groups/root",
    method: "GET",
    baseURL,
  })
}

const fetchProcessByGroups = async (root: any): Promise<any> => {
  return api({
    url: `flow/process-groups/${root}`,
    method: "GET",
    baseURL,
  })
}

export const GroupService = {
  fetchProcessGroups,
  fetchProcessByGroups
}