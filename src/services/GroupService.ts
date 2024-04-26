import api from "@/api"

const fetchProcessGroups = async (): Promise<any> => {
  return api({
    url: "flow/process-groups/root",
    method: "GET"
  })
}

const fetchProcessByGroups = async (groupId: any): Promise<any> => {
  return api({
    url: `flow/process-groups/${groupId}`,
    method: "GET"
  })
}

export const GroupService = {
  fetchProcessGroups,
  fetchProcessByGroups
}