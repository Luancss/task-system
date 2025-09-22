/**
 * Constantes em geral
 * Centraliza todas as constantes em um local para facilitar manutenção
 */

export const STORAGE_KEYS = {
  AUTH_TOKEN: "authToken",
  REFRESH_TOKEN: "refreshToken",
} as const;

export const VALIDATION_RULES = {
  PASSWORD: {
    MIN_LENGTH: 6,
    MAX_LENGTH: 128,
    REQUIRE_UPPERCASE: false,
    REQUIRE_LOWERCASE: false,
    REQUIRE_NUMBERS: false,
    REQUIRE_SPECIAL_CHARS: false,
  },
  EMAIL: {
    MAX_LENGTH: 254,
  },
  NAME: {
    MIN_LENGTH: 2,
    MAX_LENGTH: 100,
  },
  TASK: {
    TITLE: {
      MIN_LENGTH: 1,
      MAX_LENGTH: 200,
    },
    DESCRIPTION: {
      MAX_LENGTH: 1000,
    },
    TAGS: {
      MAX_COUNT: 10,
      MAX_LENGTH: 50,
    },
  },
} as const;

export const ERROR_MESSAGES = {
  AUTH: {
    INVALID_CREDENTIALS: "Email ou senha incorretos",
    EMAIL_ALREADY_EXISTS: "Email já está em uso",
    USER_NOT_FOUND: "Usuário não encontrado",
    TOKEN_EXPIRED: "Sessão expirada. Faça login novamente",
    UNAUTHORIZED: "Acesso não autorizado",
  },
  TASKS: {
    NOT_FOUND: "Tarefa não encontrada",
    UNAUTHORIZED: "Você não tem permissão para acessar esta tarefa",
    VALIDATION_ERROR: "Dados da tarefa inválidos",
  },
  GENERAL: {
    NETWORK_ERROR: "Erro de conexão. Verifique sua internet",
    SERVER_ERROR: "Erro interno do servidor",
    UNKNOWN_ERROR: "Erro desconhecido",
  },
} as const;

export const SUCCESS_MESSAGES = {
  AUTH: {
    LOGIN_SUCCESS: "Login realizado com sucesso",
    REGISTER_SUCCESS: "Conta criada com sucesso",
    LOGOUT_SUCCESS: "Logout realizado com sucesso",
  },
  TASKS: {
    CREATED: "Tarefa criada com sucesso",
    UPDATED: "Tarefa atualizada com sucesso",
    DELETED: "Tarefa excluída com sucesso",
  },
} as const;

export const DATE_FORMATS = {
  DISPLAY: "dd/MM/yyyy",
  DISPLAY_WITH_TIME: "dd/MM/yyyy HH:mm",
  API: "yyyy-MM-dd",
  API_WITH_TIME: "yyyy-MM-dd'T'HH:mm:ss.SSS'Z'",
} as const;

export const TASK_CONSTANTS = {
  DEFAULT_PRIORITY: "medium" as const,
  DEFAULT_STATUS: "pending" as const,
  MAX_TAGS_PER_TASK: 10,
  MAX_TAG_LENGTH: 50,
} as const;

export const REGEX_PATTERNS = {
  EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  PASSWORD: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
  NAME: /^[a-zA-ZÀ-ÿ\s]+$/,
} as const;
