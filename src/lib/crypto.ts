const isNode = typeof window === "undefined";

function generateRandomBytes(size: number): Uint8Array {
  if (isNode) {
    const crypto = require("crypto");
    return crypto.randomBytes(size);
  } else {
    const array = new Uint8Array(size);
    window.crypto.getRandomValues(array);
    return array;
  }
}

function generateHash(data: string): string {
  if (isNode) {
    const crypto = require("crypto");
    return crypto.createHash("sha256").update(data).digest("hex");
  } else {
    let hash = 0;
    for (let i = 0; i < data.length; i++) {
      const char = data.charCodeAt(i);
      hash = (hash << 5) - hash + char;
      hash = hash & hash;
    }
    return Math.abs(hash).toString(16);
  }
}

const ENCRYPTION_KEY =
  process.env.JWT_ENCRYPTION_KEY || "vylex-secret-key-32-characters-long!";

export interface JWTPayload {
  userId: string;
  email: string;
  iat: number;
  exp: number;
  sessionId?: string;
}

export async function encryptToken(payload: JWTPayload): Promise<string> {
  try {
    const payloadString = JSON.stringify(payload);
    const randomSalt = Array.from(generateRandomBytes(16))
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("");

    const combinedData = payloadString + randomSalt + ENCRYPTION_KEY;
    const hash = generateHash(combinedData);

    const tokenData = {
      payload: payloadString,
      salt: randomSalt,
      hash: hash,
    };

    return btoa(JSON.stringify(tokenData));
  } catch (error) {
    console.error("Erro ao criptografar token:", error);
    throw new Error("Falha na criptografia do token");
  }
}

export async function decryptToken(
  encryptedToken: string
): Promise<JWTPayload | null> {
  try {
    let decodedToken: string;
    try {
      decodedToken = atob(encryptedToken);
    } catch (decodeError) {
      // console.error("Erro ao decodificar token base64:", decodeError);
      return null;
    }

    let tokenData: any;
    try {
      tokenData = JSON.parse(decodedToken);
    } catch (parseError) {
      console.error("Erro ao fazer parse do token JSON:", parseError);
      return null;
    }

    if (tokenData.payload && tokenData.salt && tokenData.hash) {
      const combinedData = tokenData.payload + tokenData.salt + ENCRYPTION_KEY;
      const expectedHash = generateHash(combinedData);

      if (tokenData.hash !== expectedHash) {
        // console.error("Hash do token não confere");
        return null;
      }

      const payload = JSON.parse(tokenData.payload) as JWTPayload;

      if (payload.exp && payload.exp < Date.now()) {
        // console.error("Token expirado");
        return null;
      }

      return payload;
    } else if (tokenData.userId && tokenData.iat && tokenData.exp) {
      // console.warn("Token no formato antigo detectado, migrando...");

      const payload = tokenData as JWTPayload;

      if (payload.exp && payload.exp < Date.now()) {
        // console.error("Token expirado");
        return null;
      }

      return payload;
    } else {
      console.error("Formato de token inválido");
      return null;
    }
  } catch (error) {
    console.error("Erro ao descriptografar token:", error);
    return null;
  }
}

export async function generateSecureToken(
  userId: string,
  email: string
): Promise<string> {
  const now = Date.now();
  const sessionId = Array.from(generateRandomBytes(16))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");

  const payload: JWTPayload = {
    userId,
    email,
    iat: now,
    exp: now + 24 * 60 * 60 * 1000,
    sessionId,
  };

  return await encryptToken(payload);
}

export async function verifySecureToken(
  token: string
): Promise<JWTPayload | null> {
  return await decryptToken(token);
}

export function hashPassword(password: string): string {
  return generateHash(password + ENCRYPTION_KEY);
}

export function verifyPassword(password: string, hash: string): boolean {
  return hashPassword(password) === hash;
}
