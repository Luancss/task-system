"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
  useCallback,
} from "react";
import {
  User,
  AuthContextType,
  LoginCredentials,
  RegisterData,
  AuthResult,
} from "@/types";
import { AuthService } from "@/services/auth.service";
import { LocalStorageRepository } from "@/repositories/storage.repository";
import { generateSecureToken } from "@/lib/crypto";
import { clearInvalidTokens, migrateOldTokens } from "@/lib/token-utils";
import { STORAGE_KEYS } from "@/lib/constants";

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

// Constantes

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Injeção de dependências
  const storage = new LocalStorageRepository();
  const authService = new AuthService();

  // Inicialização do contexto
  useEffect(() => {
    // Primeiro, migra tokens antigos e limpa inválidos
    migrateOldTokens();
    clearInvalidTokens();

    // Depois inicializa a autenticação
    initializeAuth();
  }, []);

  const initializeAuth = async () => {
    try {
      setIsLoading(true);
      const token = storage.getItem(STORAGE_KEYS.AUTH_TOKEN);

      if (token) {
        try {
          const user = await authService.verifyToken(token);
          if (user) {
            setUser(user);
            setIsAuthenticated(true);
          } else {
            // Token inválido, limpar storage
            console.warn("Token inválido encontrado, limpando...");
            clearAuthData();
          }
        } catch (tokenError) {
          console.error("Erro ao verificar token:", tokenError);
          // Token corrompido ou inválido, limpar storage
          clearAuthData();
        }
      }
    } catch (error) {
      console.error("Erro na inicialização da autenticação:", error);
      clearAuthData();
    } finally {
      setIsLoading(false);
    }
  };

  const login = useCallback(
    async (credentials: LoginCredentials): Promise<AuthResult> => {
      try {
        setIsLoading(true);
        const result = await authService.login(credentials);

        if (result.success && result.user) {
          // Gerar novo token após login bem-sucedido
          const token = await generateSecureToken(
            result.user.id,
            result.user.email
          );
          if (token) {
            storage.setItem(STORAGE_KEYS.AUTH_TOKEN, token);
            setUser(result.user);
            setIsAuthenticated(true);
          }
        }

        return result;
      } catch (error) {
        console.error("Erro no login:", error);
        return {
          success: false,
          error: "Erro interno do servidor",
        };
      } finally {
        setIsLoading(false);
      }
    },
    [authService, storage]
  );

  const register = useCallback(
    async (data: RegisterData): Promise<AuthResult> => {
      try {
        setIsLoading(true);
        const result = await authService.register(data);

        if (result.success && result.user) {
          // Gerar token após registro bem-sucedido
          const token = await generateSecureToken(
            result.user.id,
            result.user.email
          );
          if (token) {
            storage.setItem(STORAGE_KEYS.AUTH_TOKEN, token);
            setUser(result.user);
            setIsAuthenticated(true);
          }
        }

        return result;
      } catch (error) {
        console.error("Erro no registro:", error);
        return {
          success: false,
          error: "Erro interno do servidor",
        };
      } finally {
        setIsLoading(false);
      }
    },
    [authService, storage]
  );

  const logout = useCallback(async (): Promise<void> => {
    try {
      clearAuthData();
    } catch (error) {
      console.error("Erro no logout:", error);
    }
  }, []);

  const refreshToken = useCallback(async (): Promise<boolean> => {
    try {
      const currentToken = storage.getItem(STORAGE_KEYS.AUTH_TOKEN);
      if (!currentToken) return false;

      const newToken = await authService.refreshToken(currentToken);
      if (newToken) {
        storage.setItem(STORAGE_KEYS.AUTH_TOKEN, newToken);
        return true;
      }

      return false;
    } catch (error) {
      console.error("Erro ao renovar token:", error);
      return false;
    }
  }, [authService, storage]);

  const clearAuthData = () => {
    storage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
    storage.removeItem(STORAGE_KEYS.REFRESH_TOKEN);
    setUser(null);
    setIsAuthenticated(false);
  };

  const value: AuthContextType = {
    user,
    isAuthenticated,
    isLoading,
    login,
    register,
    logout,
    refreshToken,
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
