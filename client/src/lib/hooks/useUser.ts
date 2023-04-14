import { useContext } from "react";
import { useLocalStorage } from "./useLocalStorage";
import { AuthContext } from "../context/auth/AuthContext";

export interface User {
  id: string;
  brand_name: string;
  brand_url: string;
  email: string;
  exp: number;
  iat: number;
}

export const useUser = () => {
  const { user, setUser } = useContext(AuthContext);
  const { setItem } = useLocalStorage();

  const addUser = async (userData: User, token: string) => {
    setUser(userData);
    setItem("token", token);
  };

  const removeUser = () => {
    setUser(null);
    setItem("token", "");
  };

  return { user, addUser, removeUser };
};
