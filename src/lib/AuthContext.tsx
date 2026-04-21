"use client";
import React, { createContext, useContext, useState, useEffect } from "react";

export type Role = "ADMIN" | "LEADER" | "EMPLOYEE" | "GUEST";

interface AuthContextType {
  role: Role;
  setRole: (role: Role) => void;
}

const AuthContext = createContext<AuthContextType>({
  role: "ADMIN",
  setRole: () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [role, setRole] = useState<Role>("ADMIN");

  useEffect(() => {
    const savedRole = localStorage.getItem("vanthu_role") as Role;
    if (savedRole && ["ADMIN", "LEADER", "EMPLOYEE", "GUEST"].includes(savedRole)) {
      setRole(savedRole);
    }
  }, []);

  const changeRole = (newRole: Role) => {
    setRole(newRole);
    localStorage.setItem("vanthu_role", newRole);
  };

  // Avoid hydration mismatch by not rendering until mounted if needed, 
  // but for pure context, we just provide the default initially.
  
  return (
    <AuthContext.Provider value={{ role, setRole: changeRole }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
