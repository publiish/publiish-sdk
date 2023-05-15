import { apiRequest } from "../Api";
import { SigninData } from "./types";

export const signin = (data: SigninData) => {
  return apiRequest<SigninData, { access_token: string }>({
    url: "/auth/signin",
    method: "POST",
    data,
  });
};
