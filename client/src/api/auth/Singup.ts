import { apiRequest } from "../Api";
import { SignupData } from "./types";

export const signup = (data: SignupData) => {
  return apiRequest({ url: "/auth/signup", method: "POST", data });
};
