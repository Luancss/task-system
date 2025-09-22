// @ts-nocheck
import { renderHook, act } from "@testing-library/react";
import { AuthProvider, useAuth } from "@/contexts/auth-context";
import { AuthService } from "@/services/auth.service";
import { LocalStorageRepository } from "@/repositories/storage.repository";
import { generateSecureToken } from "@/lib/crypto";
import { clearInvalidTokens, migrateOldTokens } from "@/lib/token-utils";
import { User, LoginCredentials, RegisterData } from "@/types";

jest.mock("@/services/auth.service");
jest.mock("@/repositories/storage.repository");
jest.mock("@/lib/crypto");
jest.mock("@/lib/token-utils");

const MockedAuthService = AuthService as jest.MockedClass<typeof AuthService>;
const MockedLocalStorageRepository = LocalStorageRepository as jest.MockedClass<
  typeof LocalStorageRepository
>;
const mockGenerateSecureToken = generateSecureToken as jest.MockedFunction<
  typeof generateSecureToken
>;
const mockClearInvalidTokens = clearInvalidTokens as jest.MockedFunction<
  typeof clearInvalidTokens
>;
const mockMigrateOldTokens = migrateOldTokens as jest.MockedFunction<
  typeof migrateOldTokens
>;

const createWrapper = () => {
  return ({ children }: { children: React.ReactNode }) => (
    <AuthProvider>{children}</AuthProvider>
  );
};

describe("AuthContext", () => {
  let mockAuthService: jest.Mocked<AuthService>;
  let mockStorage: jest.Mocked<LocalStorageRepository>;

  beforeEach(() => {
    mockAuthService = {
      login: jest.fn(),
      register: jest.fn(),
      verifyToken: jest.fn(),
      refreshToken: jest.fn(),
      getUsers: jest.fn(),
    } as any;

    mockStorage = {
      getItem: jest.fn(),
      setItem: jest.fn(),
      removeItem: jest.fn(),
      clear: jest.fn(),
    } as any;

    MockedAuthService.mockImplementation(() => mockAuthService);
    MockedLocalStorageRepository.mockImplementation(() => mockStorage);
    mockGenerateSecureToken.mockResolvedValue("mock-token");
    mockClearInvalidTokens.mockImplementation(() => Promise.resolve());
    mockMigrateOldTokens.mockImplementation(() => Promise.resolve());
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("inicialização", () => {
    it("deve inicializar com usuário não autenticado", async () => {
      mockStorage.getItem.mockReturnValue(null);

      const { result } = renderHook(() => useAuth(), {
        wrapper: createWrapper(),
      });

      await act(async () => {});

      expect(result.current.isAuthenticated).toBe(false);
      expect(result.current.user).toBeNull();
      expect(result.current.isLoading).toBe(false);
    });

    it("deve verificar token válido na inicialização", async () => {
      const mockUser: User = {
        id: "1",
        name: "Test User",
        email: "test@example.com",
        passwordHash: "",
        createdAt: new Date(),
        isActive: true,
      };

      mockStorage.getItem.mockReturnValue("valid-token");
      mockAuthService.verifyToken.mockResolvedValue(mockUser);

      const { result } = renderHook(() => useAuth(), {
        wrapper: createWrapper(),
      });

      await act(async () => {});

      expect(result.current.isAuthenticated).toBe(true);
      expect(result.current.user).toEqual(mockUser);
      expect(result.current.isLoading).toBe(false);
    });

    it("deve limpar dados quando token é inválido", async () => {
      mockStorage.getItem.mockReturnValue("invalid-token");
      mockAuthService.verifyToken.mockResolvedValue(null);

      const { result } = renderHook(() => useAuth(), {
        wrapper: createWrapper(),
      });

      await act(async () => {});

      expect(result.current.isAuthenticated).toBe(false);
      expect(result.current.user).toBeNull();
      expect(result.current.isLoading).toBe(false);
    });

    it("deve migrar tokens antigos na inicialização", async () => {
      mockStorage.getItem.mockReturnValue(null);

      renderHook(() => useAuth(), {
        wrapper: createWrapper(),
      });

      await act(async () => {});

      expect(mockMigrateOldTokens).toHaveBeenCalled();
      expect(mockClearInvalidTokens).toHaveBeenCalled();
    });
  });

  describe("login", () => {
    it("deve fazer login com sucesso", async () => {
      const mockUser: User = {
        id: "1",
        name: "Test User",
        email: "test@example.com",
        passwordHash: "",
        createdAt: new Date(),
        isActive: true,
      };

      const credentials: LoginCredentials = {
        email: "test@example.com",
        password: "password123",
      };

      mockAuthService.login.mockResolvedValue({
        success: true,
        user: mockUser,
      });

      const { result } = renderHook(() => useAuth(), {
        wrapper: createWrapper(),
      });

      let loginResult;
      await act(async () => {
        loginResult = await result.current.login(credentials);
      });

      expect(loginResult?.success).toBe(true);
      expect(result.current.isAuthenticated).toBe(true);
      expect(result.current.user).toEqual(mockUser);
      expect(mockStorage.setItem).toHaveBeenCalledWith(
        "authToken",
        "mock-token"
      );
    });

    it("deve falhar no login com credenciais inválidas", async () => {
      const credentials: LoginCredentials = {
        email: "test@example.com",
        password: "wrongpassword",
      };

      mockAuthService.login.mockResolvedValue({
        success: false,
        error: "Credenciais inválidas",
      });

      const { result } = renderHook(() => useAuth(), {
        wrapper: createWrapper(),
      });

      let loginResult;
      await act(async () => {
        loginResult = await result.current.login(credentials);
      });

      expect(loginResult?.success).toBe(false);
      expect(result.current.isAuthenticated).toBe(false);
      expect(result.current.user).toBeNull();
    });

    it("deve lidar com erro durante o login", async () => {
      const credentials: LoginCredentials = {
        email: "test@example.com",
        password: "password123",
      };

      mockAuthService.login.mockRejectedValue(new Error("Network error"));

      const { result } = renderHook(() => useAuth(), {
        wrapper: createWrapper(),
      });

      let loginResult;
      await act(async () => {
        loginResult = await result.current.login(credentials);
      });

      expect(loginResult?.success).toBe(false);
      expect(loginResult?.error).toBe("Erro interno do servidor");
    });
  });

  describe("register", () => {
    it("deve registrar usuário com sucesso", async () => {
      const mockUser: User = {
        id: "1",
        name: "New User",
        email: "newuser@example.com",
        passwordHash: "",
        createdAt: new Date(),
        isActive: true,
      };

      const registerData: RegisterData = {
        name: "New User",
        email: "newuser@example.com",
        password: "password123",
      };

      mockAuthService.register.mockResolvedValue({
        success: true,
        user: mockUser,
      });

      const { result } = renderHook(() => useAuth(), {
        wrapper: createWrapper(),
      });

      let registerResult;
      await act(async () => {
        registerResult = await result.current.register(registerData);
      });

      expect(registerResult?.success).toBe(true);
      expect(result.current.isAuthenticated).toBe(true);
      expect(result.current.user).toEqual(mockUser);
      expect(mockStorage.setItem).toHaveBeenCalledWith(
        "authToken",
        "mock-token"
      );
    });

    it("deve falhar no registro com dados inválidos", async () => {
      const registerData: RegisterData = {
        name: "New User",
        email: "invalid-email",
        password: "123",
      };

      mockAuthService.register.mockResolvedValue({
        success: false,
        error: "Dados inválidos",
      });

      const { result } = renderHook(() => useAuth(), {
        wrapper: createWrapper(),
      });

      let registerResult;
      await act(async () => {
        registerResult = await result.current.register(registerData);
      });

      expect(registerResult.success).toBe(false);
      expect(result.current.isAuthenticated).toBe(false);
      expect(result.current.user).toBeNull();
    });
  });

  describe("logout", () => {
    it("deve fazer logout com sucesso", async () => {
      const mockUser: User = {
        id: "1",
        name: "Test User",
        email: "test@example.com",
        passwordHash: "",
        createdAt: new Date(),
        isActive: true,
      };

      mockAuthService.login.mockResolvedValue({
        success: true,
        user: mockUser,
      });

      const { result } = renderHook(() => useAuth(), {
        wrapper: createWrapper(),
      });

      await act(async () => {
        await result.current.login({
          email: "test@example.com",
          password: "password123",
        });
      });

      expect(result.current.isAuthenticated).toBe(true);

      await act(async () => {
        await result.current.logout();
      });

      expect(result.current.isAuthenticated).toBe(false);
      expect(result.current.user).toBeNull();
      expect(mockStorage.removeItem).toHaveBeenCalledWith("authToken");
      expect(mockStorage.removeItem).toHaveBeenCalledWith("refreshToken");
    });
  });

  describe("refreshToken", () => {
    it("deve renovar token com sucesso", async () => {
      mockStorage.getItem.mockReturnValue("old-token");
      mockAuthService.refreshToken.mockResolvedValue("new-token");

      const { result } = renderHook(() => useAuth(), {
        wrapper: createWrapper(),
      });

      let refreshResult;
      await act(async () => {
        refreshResult = await result.current.refreshToken();
      });

      expect(refreshResult).toBe(true);
      expect(mockStorage.setItem).toHaveBeenCalledWith(
        "authToken",
        "new-token"
      );
    });

    it("deve falhar ao renovar token quando não há token atual", async () => {
      mockStorage.getItem.mockReturnValue(null);

      const { result } = renderHook(() => useAuth(), {
        wrapper: createWrapper(),
      });

      let refreshResult;
      await act(async () => {
        refreshResult = await result.current.refreshToken();
      });

      expect(refreshResult).toBe(false);
    });

    it("deve falhar ao renovar token quando serviço retorna null", async () => {
      mockStorage.getItem.mockReturnValue("old-token");
      mockAuthService.refreshToken.mockResolvedValue(null);

      const { result } = renderHook(() => useAuth(), {
        wrapper: createWrapper(),
      });

      let refreshResult;
      await act(async () => {
        refreshResult = await result.current.refreshToken();
      });

      expect(refreshResult).toBe(false);
    });
  });

  describe("useAuth hook", () => {
    it("deve lançar erro quando usado fora do AuthProvider", () => {
      const consoleSpy = jest
        .spyOn(console, "error")
        .mockImplementation(() => {});

      expect(() => {
        renderHook(() => useAuth());
      }).toThrow("useAuth deve ser usado dentro de um AuthProvider");

      consoleSpy.mockRestore();
    });
  });
});
