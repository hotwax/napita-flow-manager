import { useUserStore } from '@/store/user';
import axios from 'axios';
import { client } from "@/api"

const login = async (username: string, password: string): Promise<any> => {
  const userStore = useUserStore();
  const baseURL = userStore.getBaseUrl;
  const params = new URLSearchParams();
  params.append('username', username);
  params.append('password', password);
  //let token = ""
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

const fetchExpirationTime = async (token: any): Promise<any> => {
  // try {
  //     console.log("expire");
  //   const userStore = useUserStore();
  //   const baseUrl = userStore.getBaseUrl;
  //   const apiUrl = `https://${baseUrl}.hotwax.io/nifi-api/access/token/expiration`;
    
  //   const response = await axios.get(apiUrl, {
  //     headers: {
  //       'Authorization': `Bearer ${token}`
  //     }
  //   });
  //   return response;
  // } catch (err) {
  //   return Promise.reject("Sorry, login failed. Please try again");
  // }

  const userStore = useUserStore();
  const baseURL = userStore.getBaseUrl;

  try {
    const resp = await client({
      url: "access/token/expiration",
      method: "get",
      baseURL,
      headers: {
        'Authorization': `Bearer ${token}`
      }
    }) as any;
    // if (!hasError(resp) && resp) {
    //   expirationTimeDetails = resp
    // } else {
    //   throw "Sorry, login failed. Please try again";
    // }
    console.log(resp);
    
    return Promise.resolve(resp);
  } catch (err) {
    return Promise.reject("Sorry, login failed. Please try again");
  }

}

const logout = async (token: any): Promise<any> => {
  const userStore = useUserStore();
  const baseURL = userStore.getBaseUrl;
  let response = ''
  try {
    const resp = await client({
      url: "access/logout",
      method: "delete",
      baseURL,
      headers: {
        'Authorization': `Bearer ${token}`
      }
    }) as any;
    response = resp;
  } catch (err) {
    return Promise.reject("Sorry, logout failed. Please try again");
  }
  return response;
}

export const UserService = {
  login,
  fetchExpirationTime,
  logout
}