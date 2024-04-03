import { useUserStore } from '@/store/user';
import api, { client } from "@/api"

const login = async (username: string, password: string): Promise<any> => {
  const userStore = useUserStore();
  const baseURL = userStore.getBaseUrl;
  const params = new URLSearchParams();
  params.append('username', username);
  params.append('password', password);
  try {
    const resp = await client({
      url: "access/token",
      method: "post",
      baseURL,
      data: params,
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    }) as any;

    return Promise.resolve(resp.data);
  } catch(err) {
    return Promise.reject("Sorry, login failed. Please try again");
  }
}

const fetchExpirationTime = async (): Promise<any> => {
  const userStore = useUserStore();
  const baseURL = userStore.getBaseUrl;

  try {
    const resp = await api({
      url: "access/token/expiration",
      method: "get",
      baseURL,
    }) as any;  
    return Promise.resolve(resp);
  } catch (err) {
    return Promise.reject("Sorry, login failed. Please try again");
  }
}

const logout = async (): Promise<any> => {
  try {
    const resp = await api({
      url: "access/logout",
      method: "delete",
    }) as any;
    return Promise.resolve(resp);
  } catch (err) {
    return Promise.reject("Sorry, logout failed. Please try again");
  }
}

export const UserService = {
  login,
  fetchExpirationTime,
  logout
}