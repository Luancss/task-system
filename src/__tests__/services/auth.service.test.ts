import { AuthService } from "@/services/auth.service";
import { User, LoginCredentials } from "@/types";

jest.mock("@/lib/crypto", () => ({
  generateSecureToken: jest.fn().mockResolvedValue("mock-token"),
  verifySecureToken: jest
    .fn()
    .mockResolvedValue({ userId: "1", email: "test@example.com" }),
  hashPassword: jest.fn().mockReturnValue("hashed-password"),
  verifyPassword: jest.fn().mockReturnValue(true),
}));

describe("AuthService", () => {
  let authService: AuthService;
  let mockUsersData: User[];

  beforeEach(() => {
    mockUsersData = [
      {
        id: "1",
        name: "Test User",
        email: "test@example.com",
        passwordHash: "hashed-password",
        createdAt: new Date("2024-01-01"),
        isActive: true,
      },
      {
        id: "2",
        name: "Inactive User",
        email: "inactive@example.com",
        passwordHash: "hashed-password",
        createdAt: new Date("2024-01-01"),
        isActive: false,
      },
    ];
    authService = new AuthService(mockUsersData);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("login", () => {
    it("deve fazer login com credenciais válidas", async () => {
      const credentials: LoginCredentials = {
        email: "test@example.com",
        password: "password123",
      };

      const result = await authService.login(credentials);

      expect(result.success).toBe(true);
      expect(result.user).toBeDefined();
      expect(result.user?.email).toBe("test@example.com");
      expect(result.user?.passwordHash).toBe("");
    });

    it("deve falhar com credenciais inválidas", async () => {
      const credentials: LoginCredentials = {
        email: "nonexistent@example.com",
        password: "wrongpassword",
      };

      const result = await authService.login(credentials);

      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
      expect(result.user).toBeUndefined();
    });

    it("deve falhar com usuário inativo", async () => {
      const credentials: LoginCredentials = {
        email: "inactive@example.com",
        password: "password123",
      };

      const result = await authService.login(credentials);

      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
    });

    it("deve falhar com senha incorreta", async () => {
      const { verifyPassword } = require("@/lib/crypto");
      verifyPassword.mockReturnValue(false);

      const credentials: LoginCredentials = {
        email: "test@example.com",
        password: "wrongpassword",
      };

      const result = await authService.login(credentials);

      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
    });
  });

  describe("getUsers", () => {
    it("deve retornar usuários sem passwordHash", () => {
      const users = authService.getUsers();

      expect(users).toHaveLength(2);
      expect(users[0].passwordHash).toBe("");
      expect(users[1].passwordHash).toBe("");
    });
  });
});
