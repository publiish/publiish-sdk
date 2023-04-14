import { apiRequest } from "../Api";
import { SigninData } from "./types";

export const signin = (data: SigninData) => {
  return apiRequest({ url: "/auth/signin", method: "POST", data });
};
