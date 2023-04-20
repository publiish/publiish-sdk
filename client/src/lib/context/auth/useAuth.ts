import { useEffect, useState } from "react";
import jwt_decode from "jwt-decode";
import { SigninData } from "@/api/auth/types";
import { useLocalStorage } from "@/lib/hooks/useLocalStorage";
import { User, useUser } from "@/lib/hooks/useUser";
import { signin } from "@/api/auth/Signin";
import { useRouter } from "next/router";

export const useAuth = () => {
  const router = useRouter();
  const { user, addUser, removeUser } = useUser();
  const [loading, setLoading] = useState(true);
  const { getItem } = useLocalStorage();

  useEffect(() => {
    (async () => {
      setLoading(true);
      const token = getItem("token");

      if (token) {
        const user = decodeToken(token) as User;

        await addUser(user, token);
      }
      setLoading(false);
    })();
  }, []);

  const login = async (body: SigninData) => {
    const { data } = await signin(body);

    const decoded = decodeToken(data.access_token) as User;

    addUser(decoded, data.access_token);
  };

  const logout = () => {
    removeUser();
  };

  const decodeToken = (token: string) => {
    const decoded = jwt_decode(token) as User;

    const currentTime = Math.floor(Date.now() / 1000); // convert to seconds

    if (decoded.exp < currentTime) {
      return router.push("/signin");
    }

    return decoded;
  };

  return { user, login, logout, loading };
};
