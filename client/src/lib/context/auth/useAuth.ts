import { useEffect } from "react";
import jwt_decode from "jwt-decode";
import { SigninData } from "@/api/auth/types";
import { useLocalStorage } from "@/lib/hooks/useLocalStorage";
import { User, useUser } from "@/lib/hooks/useUser";
import { signin } from "@/api/auth/Signin";

export const useAuth = () => {
  const { user, addUser, removeUser } = useUser();
  const { getItem } = useLocalStorage();

  useEffect(() => {
    const token = getItem("token");

    if (token) {
      const user = jwt_decode(token) as User;

      addUser(user, token);
    }
  }, []);

  const login = async (body: SigninData) => {
    const { data } = await signin(body);

    const decoded = jwt_decode(data.access_token);

    addUser(decoded as User, data.access_token);
  };

  const logout = () => {
    removeUser();
  };

  return { user, login, logout };
};
