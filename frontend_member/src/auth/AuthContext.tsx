// auth/AuthContext.tsx
import { createContext, useContext, useState, useEffect, ReactNode } from "react";

interface AuthContextType {
  isAuthenticated: boolean;
  permission: string | null;
  login: (permission?: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [permission, setPermission] = useState<string | null>(null);

  // Load from localStorage on mount
  useEffect(() => {
    const storedAuth = localStorage.getItem("isAuthenticated") === "true";
    const storedPermission = localStorage.getItem("permission");

    setIsAuthenticated(storedAuth);
    if (storedPermission) setPermission(storedPermission);
  }, []);

  const login = (permission?: string) => {
    setIsAuthenticated(true);
    localStorage.setItem("isAuthenticated", "true");

    if (permission) {
      setPermission(permission);
      localStorage.setItem("permission", permission);
    }
  };

  const logout = () => {
    setIsAuthenticated(false);
    setPermission(null);
    localStorage.removeItem("isAuthenticated");
    localStorage.removeItem("permission");
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, permission, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
