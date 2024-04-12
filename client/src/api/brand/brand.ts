import { apiRequest } from "../Api";
import { BrandStatsData, BrandUpdateData } from "./types";

export const getStats = (brand_id: number) => {
  return apiRequest<null, { data: BrandStatsData }>({
    url: `/brands/stats/${brand_id}`,
    method: "GET",
  });
};

export const brandUpdate = (data: BrandUpdateData, token: string) => {
  const headers = {
    Authorization: `Bearer ${token}`
  };

  return apiRequest({ url: "/brands", method: "POST", data, headers});
};