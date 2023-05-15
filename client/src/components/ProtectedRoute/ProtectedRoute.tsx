import { useAuth } from "@/lib/context/auth/useAuth";
import { useRouter } from "next/router";
import { useEffect } from "react";

interface IProtectedRoute {
  children: React.ReactNode;
}

export const ProtectedRoute: React.FC<IProtectedRoute> = ({ children }) => {
  const router = useRouter();
  const { user, loading } = useAuth();

  useEffect(() => {
    if (router.isReady && !loading && !user) {
      router.push("/signin");
    }
  }, [router, user, loading]);

  return <>{children}</>;
};
