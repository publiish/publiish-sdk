import { AuthContext } from "@/lib/context/auth/AuthContext";
import { useAuth } from "@/lib/context/auth/useAuth";
import { User } from "@/lib/hooks/useUser";
import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { useState } from "react";

export default function App({ Component, pageProps }: AppProps) {
  const [user, setUser] = useState<User | null>(null);

  return (
    <AuthContext.Provider value={{ user, setUser }}>
      <Component {...pageProps} />
    </AuthContext.Provider>
  );
}
