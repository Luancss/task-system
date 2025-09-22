import {
  generateSecureToken,
  verifySecureToken,
  hashPassword,
  verifyPassword,
  encryptToken,
  decryptToken,
  JWTPayload,
} from "@/lib/crypto";

const mockCrypto = {
  getRandomValues: jest.fn((array: Uint8Array) => {
    for (let i = 0; i < array.length; i++) {
      array[i] = Math.floor(Math.random() * 256);
    }
    return array;
  }),
};

Object.defineProperty(window, "crypto", {
  value: mockCrypto,
});

describe("crypto", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("hashPassword", () => {
    it("deve gerar hash consistente para a mesma senha", () => {
      const password = "testpassword";
      const hash1 = hashPassword(password);
      const hash2 = hashPassword(password);

      expect(hash1).toBe(hash2);
      expect(hash1).toBeDefined();
      expect(typeof hash1).toBe("string");
    });

    it("deve gerar hashes diferentes para senhas diferentes", () => {
      const hash1 = hashPassword("password1");
      const hash2 = hashPassword("password2");

      expect(hash1).not.toBe(hash2);
    });
  });

  describe("verifyPassword", () => {
    it("deve verificar senha correta", () => {
      const password = "testpassword";
      const hash = hashPassword(password);

      expect(verifyPassword(password, hash)).toBe(true);
    });

    it("deve rejeitar senha incorreta", () => {
      const password = "testpassword";
      const hash = hashPassword(password);

      expect(verifyPassword("wrongpassword", hash)).toBe(false);
    });
  });

  describe("generateSecureToken", () => {
    it("deve gerar token válido", async () => {
      const token = await generateSecureToken("user123", "test@example.com");

      expect(token).toBeDefined();
      expect(typeof token).toBe("string");
      expect(token.length).toBeGreaterThan(0);
    });

    it("deve gerar tokens diferentes para chamadas diferentes", async () => {
      const token1 = await generateSecureToken("user123", "test@example.com");
      const token2 = await generateSecureToken("user123", "test@example.com");

      expect(token1).not.toBe(token2);
    });
  });

  describe("verifySecureToken", () => {
    it("deve verificar token válido", async () => {
      const token = await generateSecureToken("user123", "test@example.com");
      const payload = await verifySecureToken(token);

      expect(payload).toBeDefined();
      expect(payload?.userId).toBe("user123");
      expect(payload?.email).toBe("test@example.com");
      expect(payload?.iat).toBeDefined();
      expect(payload?.exp).toBeDefined();
      expect(payload?.sessionId).toBeDefined();
    });

    it("deve retornar null para token inválido", async () => {
      const payload = await verifySecureToken("invalid-token");

      expect(payload).toBeNull();
    });

    it("deve retornar null para token expirado", async () => {
      const expiredPayload: JWTPayload = {
        userId: "user123",
        email: "test@example.com",
        iat: Date.now() - 2 * 24 * 60 * 60 * 1000, // 2 dias atrás
        exp: Date.now() - 24 * 60 * 60 * 1000, // 1 dia atrás
        sessionId: "session123",
      };

      const token = await encryptToken(expiredPayload);
      const payload = await verifySecureToken(token);

      expect(payload).toBeNull();
    });
  });

  describe("encryptToken", () => {
    it("deve criptografar payload corretamente", async () => {
      const payload: JWTPayload = {
        userId: "user123",
        email: "test@example.com",
        iat: Date.now(),
        exp: Date.now() + 24 * 60 * 60 * 1000,
        sessionId: "session123",
      };

      const token = await encryptToken(payload);

      expect(token).toBeDefined();
      expect(typeof token).toBe("string");
      expect(token.length).toBeGreaterThan(0);
    });

    it("deve gerar tokens diferentes para o mesmo payload", async () => {
      const payload: JWTPayload = {
        userId: "user123",
        email: "test@example.com",
        iat: Date.now(),
        exp: Date.now() + 24 * 60 * 60 * 1000,
        sessionId: "session123",
      };

      const token1 = await encryptToken(payload);
      const token2 = await encryptToken(payload);

      expect(token1).not.toBe(token2);
    });
  });

  describe("decryptToken", () => {
    it("deve descriptografar token válido", async () => {
      const originalPayload: JWTPayload = {
        userId: "user123",
        email: "test@example.com",
        iat: Date.now(),
        exp: Date.now() + 24 * 60 * 60 * 1000,
        sessionId: "session123",
      };

      const token = await encryptToken(originalPayload);
      const decryptedPayload = await decryptToken(token);

      expect(decryptedPayload).toBeDefined();
      expect(decryptedPayload?.userId).toBe(originalPayload.userId);
      expect(decryptedPayload?.email).toBe(originalPayload.email);
      expect(decryptedPayload?.sessionId).toBe(originalPayload.sessionId);
    });

    it("deve retornar null para token malformado", async () => {
      const result = await decryptToken("invalid-base64-token");

      expect(result).toBeNull();
    });

    it("deve retornar null para token com hash incorreto", async () => {
      const tokenData = {
        payload: JSON.stringify({
          userId: "user123",
          email: "test@example.com",
          iat: Date.now(),
          exp: Date.now() + 24 * 60 * 60 * 1000,
        }),
        salt: "invalid-salt",
        hash: "invalid-hash",
      };

      const token = btoa(JSON.stringify(tokenData));
      const result = await decryptToken(token);

      expect(result).toBeNull();
    });

    it("deve suportar formato de token antigo", async () => {
      const oldFormatPayload: JWTPayload = {
        userId: "user123",
        email: "test@example.com",
        iat: Date.now(),
        exp: Date.now() + 24 * 60 * 60 * 1000,
      };

      const token = btoa(JSON.stringify(oldFormatPayload));
      const result = await decryptToken(token);

      expect(result).toBeDefined();
      expect(result?.userId).toBe(oldFormatPayload.userId);
      expect(result?.email).toBe(oldFormatPayload.email);
    });
  });
});
