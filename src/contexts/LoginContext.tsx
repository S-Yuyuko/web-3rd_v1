"use client";

import { createContext, useState, useContext } from "react";
import { loginRoute } from "../utils/routes/login"; // Import the loginRoute function
import { useNotification } from "@/contexts/NotificationContext"; // Import the global notification context
import { useRouter } from "next/navigation"; // Ensure this is imported correctly

type LoginContextType = {
  credentials: { account: string; password: string };
  setCredentials: React.Dispatch<React.SetStateAction<{ account: string; password: string }>>;
  handleLogin: () => Promise<void>;
  handleLogout: () => void;
};

const LoginContext = createContext<LoginContextType | undefined>(undefined);

export const useLogin = () => {
  const context = useContext(LoginContext);
  if (!context) {
    throw new Error("useLogin must be used within a LoginProvider");
  }
  return context;
};

export function LoginProvider({ children }: { children: React.ReactNode }) {
  const [credentials, setCredentials] = useState({ account: "", password: "" });

  const { showNotification } = useNotification();
  const router = useRouter();

  const handleLogin = async () => {
    try {
      const data = await loginRoute(credentials.account, credentials.password);
      if (data.message === "Login successful") {
        localStorage.setItem("identity", data.identity);
        router.push("/"); // Redirect to the home page after successful login
        showNotification("Login successful!", "success");
      } else {
        console.error("Unexpected response:", data);
      }
    } catch (err) {
      const error = err as Error;
      console.error("Login failed:", error.message);
      showNotification("Login failed: " + error.message, "error");
    }
  };

  const handleLogout = () => {
    // Set the identity to "user" in localStorage
    if (typeof window !== "undefined") {
      localStorage.setItem("identity", "user"); // Set localStorage to "user"
    }
    router.push("/");
    // Show a logout notification
    showNotification("Logged out successfully", "success");
  };

  return (
    <LoginContext.Provider
      value={{
        credentials,
        setCredentials,
        handleLogin,
        handleLogout,
      }}
    >
      {children}
    </LoginContext.Provider>
  );
}
