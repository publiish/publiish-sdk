import { apiRequest } from "../Api";
import { BrandStatsData } from "./types";

export const getStats = (brand_id: number) => {
  return apiRequest<null, { data: BrandStatsData }>({
    url: `/brands/stats/${brand_id}`,
    method: "GET",
  });
};
