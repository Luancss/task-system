"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { User, AuthContextType } from "@/types";
import { mockUsers, generateMockToken, verifyMockToken } from "@/lib/mocks";

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (token) {
      const payload = verifyMockToken(token);
      if (payload) {
        const foundUser = mockUsers.find((u) => u.id === payload.userId);
        if (foundUser) {
          setUser(foundUser);
          setIsAuthenticated(true);
        } else {
          localStorage.removeItem("authToken");
        }
      } else {
        localStorage.removeItem("authToken");
      }
    }
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const foundUser = mockUsers.find(
        (u) => u.email === email && u.password === password
      );

      if (foundUser) {
        const token = generateMockToken(foundUser.id);
        localStorage.setItem("authToken", token);
        setUser(foundUser);
        setIsAuthenticated(true);
        return true;
      }
      return false;
    } catch (error) {
      console.error("Erro no login:", error);
      return false;
    }
  };

  const register = async (
    name: string,
    email: string,
    password: string
  ): Promise<boolean> => {
    try {
      const existingUser = mockUsers.find((u) => u.email === email);
      if (existingUser) {
        return false;
      }

      const newUser: User = {
        id: (mockUsers.length + 1).toString(),
        name,
        email,
        password,
        createdAt: new Date(),
      };

      mockUsers.push(newUser);

      const token = generateMockToken(newUser.id);
      localStorage.setItem("authToken", token);
      setUser(newUser);
      setIsAuthenticated(true);

      return true;
    } catch (error) {
      console.error("Erro no registro:", error);
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem("authToken");
    setUser(null);
    setIsAuthenticated(false);
  };

  const value: AuthContextType = {
    user,
    login,
    register,
    logout,
    isAuthenticated,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth deve ser usado dentro de um AuthProvider");
  }
  return context;
}
