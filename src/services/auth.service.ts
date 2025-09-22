import { User, LoginCredentials, RegisterData, AuthResult } from "@/types";
import {
  generateSecureToken,
  verifySecureToken,
  hashPassword,
  verifyPassword,
} from "@/lib/crypto";
import { mockUsers } from "@/lib/mocks";
import { VALIDATION_RULES, ERROR_MESSAGES } from "@/lib/constants";

export interface IAuthService {
  login(credentials: LoginCredentials): Promise<AuthResult>;
  register(data: RegisterData): Promise<AuthResult>;
  verifyToken(token: string): Promise<User | null>;
  refreshToken(token: string): Promise<string | null>;
}

export class AuthService implements IAuthService {
  private users: User[] = [];

  constructor(initialUsers: User[] = mockUsers) {
    this.users = initialUsers;
  }

  async login(credentials: LoginCredentials): Promise<AuthResult> {
    try {
      const user = this.users.find(
        (u) => u.email === credentials.email && u.isActive
      );

      if (!user) {
        return {
          success: false,
          error: ERROR_MESSAGES.AUTH.INVALID_CREDENTIALS,
        };
      }

      if (!verifyPassword(credentials.password, user.passwordHash)) {
        return {
          success: false,
          error: ERROR_MESSAGES.AUTH.INVALID_CREDENTIALS,
        };
      }

      const token = await generateSecureToken(user.id, user.email);

      return {
        success: true,
        user: { ...user, passwordHash: "" },
      };
    } catch (error) {
      console.error("Erro no login:", error);
      return {
        success: false,
        error: ERROR_MESSAGES.GENERAL.SERVER_ERROR,
      };
    }
  }

  async register(data: RegisterData): Promise<AuthResult> {
    try {
      if (!this.isValidEmail(data.email)) {
        return {
          success: false,
          error: ERROR_MESSAGES.AUTH.INVALID_CREDENTIALS,
        };
      }

      if (!this.isValidPassword(data.password)) {
        return {
          success: false,
          error: `Senha deve ter pelo menos ${VALIDATION_RULES.PASSWORD.MIN_LENGTH} caracteres`,
        };
      }

      if (this.users.some((u) => u.email === data.email)) {
        return {
          success: false,
          error: ERROR_MESSAGES.AUTH.EMAIL_ALREADY_EXISTS,
        };
      }

      const newUser: User = {
        id: this.generateUserId(),
        name: data.name.trim(),
        email: data.email.toLowerCase().trim(),
        passwordHash: hashPassword(data.password),
        createdAt: new Date(),
        isActive: true,
      };

      this.users.push(newUser);

      const token = await generateSecureToken(newUser.id, newUser.email);

      return {
        success: true,
        user: { ...newUser, passwordHash: "" },
      };
    } catch (error) {
      console.error("Erro no registro:", error);
      return {
        success: false,
        error: ERROR_MESSAGES.GENERAL.SERVER_ERROR,
      };
    }
  }

  async verifyToken(token: string): Promise<User | null> {
    try {
      const payload = await verifySecureToken(token);
      if (!payload) return null;

      const user = this.users.find(
        (u) => u.id === payload.userId && u.isActive
      );
      return user ? { ...user, passwordHash: "" } : null;
    } catch (error) {
      console.error("Erro na verificação do token:", error);
      return null;
    }
  }

  async refreshToken(token: string): Promise<string | null> {
    try {
      const payload = await verifySecureToken(token);
      if (!payload) return null;

      const user = this.users.find(
        (u) => u.id === payload.userId && u.isActive
      );
      if (!user) return null;

      return await generateSecureToken(user.id, user.email);
    } catch (error) {
      console.error("Erro ao renovar token:", error);
      return null;
    }
  }

  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  private isValidPassword(password: string): boolean {
    return password.length >= VALIDATION_RULES.PASSWORD.MIN_LENGTH;
  }

  private generateUserId(): string {
    return Date.now().toString() + Math.random().toString(36).substr(2, 9);
  }

  getUsers(): User[] {
    return this.users.map((user) => ({ ...user, passwordHash: "" }));
  }
}
