import { AuthContext } from "@/lib/context/auth/AuthContext";
import { useAuth } from "@/lib/context/auth/useAuth";
import { User } from "@/lib/hooks/useUser";
import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function App({ Component, pageProps }: AppProps) {
  const [user, setUser] = useState<User | null>(null);

  return (
    <AuthContext.Provider value={{ user, setUser }}>
      <Component {...pageProps} />
      <ToastContainer />
    </AuthContext.Provider>
  );
}
