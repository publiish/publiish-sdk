import { loginEmail } from "@/lib/magic";
import { apiRequest } from "../Api";
import { SigninData } from "./types";

export const signin = async (data: SigninData) => {
  const didToken = await loginEmail(data.email, "");
  console.log("xxxxxxxx", didToken)
  return apiRequest<SigninData, { access_token: string }>({
    url: "/auth/signin",
    method: "POST",
    headers: {
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + didToken,
    },
    data,
  });
};
