import { apiRequest } from "../Api";

export const getApiKeys = (token: string) => {
  const headers = {
    Authorization: `Bearer ${token}`
  };

  return apiRequest<null, { data: any }>({
    url: `/apikey`,
    method: "GET",
    headers
  });
};

export const createApiKey = (data: any, token: string) => {
  const headers = {
    Authorization: `Bearer ${token}`
  };

  return apiRequest({ url: "/apikey", method: "POST", data, headers});
};

export const deleteApiKey = (apikey: string, token: string) => {
  const headers = {
    Authorization: `Bearer ${token}`
  };

  return apiRequest({ url: `/apikey/${apikey}`, method: "DELETE", headers});
};