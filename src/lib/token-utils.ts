import { verifySecureToken } from "./crypto";
import { STORAGE_KEYS } from "./constants";

export function clearInvalidTokens(): void {
  if (typeof window === "undefined") return;

  const keys = [STORAGE_KEYS.AUTH_TOKEN, STORAGE_KEYS.REFRESH_TOKEN];

  keys.forEach((key) => {
    try {
      const token = localStorage.getItem(key);
      if (token) {
        verifySecureToken(token)
          .then((isValid) => {
            if (!isValid) {
              console.warn(`Removendo token inválido: ${key}`);
              localStorage.removeItem(key);
            }
          })
          .catch(() => {
            console.warn(`Removendo token corrompido: ${key}`);
            localStorage.removeItem(key);
          });
      }
    } catch (error) {
      console.error(`Erro ao verificar token ${key}:`, error);
      localStorage.removeItem(key);
    }
  });
}

export function isValidTokenFormat(token: string): boolean {
  if (!token) return false;

  try {
    const decoded = atob(token);
    const parsed = JSON.parse(decoded);

    return !!(parsed.userId || (parsed.payload && parsed.salt && parsed.hash));
  } catch {
    return false;
  }
}

export async function migrateOldTokens(): Promise<void> {
  if (typeof window === "undefined") return;

  const authToken = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
  if (!authToken) return;

  try {
    const decoded = atob(authToken);
    const tokenData = JSON.parse(decoded);

    if (tokenData.userId && !tokenData.hash) {
      console.info(
        "Token antigo detectado, removendo para forçar novo login..."
      );
      localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
    }
  } catch (error) {
    console.error("Erro ao migrar tokens:", error);
    localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
  }
}
