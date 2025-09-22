import { VALIDATION_RULES, REGEX_PATTERNS } from "./constants";

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
}

export interface ValidationRule<T> {
  validate: (value: T) => string | null;
}

export const emailValidator: ValidationRule<string> = {
  validate: (email: string): string | null => {
    if (!email) return "Email é obrigatório";
    if (email.length > VALIDATION_RULES.EMAIL.MAX_LENGTH) {
      return `Email deve ter no máximo ${VALIDATION_RULES.EMAIL.MAX_LENGTH} caracteres`;
    }
    if (!REGEX_PATTERNS.EMAIL.test(email)) {
      return "Email inválido";
    }
    return null;
  },
};

export const passwordValidator: ValidationRule<string> = {
  validate: (password: string): string | null => {
    if (!password) return "Senha é obrigatória";
    if (password.length < VALIDATION_RULES.PASSWORD.MIN_LENGTH) {
      return `Senha deve ter pelo menos ${VALIDATION_RULES.PASSWORD.MIN_LENGTH} caracteres`;
    }
    if (password.length > VALIDATION_RULES.PASSWORD.MAX_LENGTH) {
      return `Senha deve ter no máximo ${VALIDATION_RULES.PASSWORD.MAX_LENGTH} caracteres`;
    }
    return null;
  },
};

export const nameValidator: ValidationRule<string> = {
  validate: (name: string): string | null => {
    if (!name) return "Nome é obrigatório";
    if (name.trim().length < VALIDATION_RULES.NAME.MIN_LENGTH) {
      return `Nome deve ter pelo menos ${VALIDATION_RULES.NAME.MIN_LENGTH} caracteres`;
    }
    if (name.length > VALIDATION_RULES.NAME.MAX_LENGTH) {
      return `Nome deve ter no máximo ${VALIDATION_RULES.NAME.MAX_LENGTH} caracteres`;
    }
    if (!REGEX_PATTERNS.NAME.test(name)) {
      return "Nome deve conter apenas letras e espaços";
    }
    return null;
  },
};

export const taskTitleValidator: ValidationRule<string> = {
  validate: (title: string): string | null => {
    if (!title) return "Título é obrigatório";
    if (title.trim().length < VALIDATION_RULES.TASK.TITLE.MIN_LENGTH) {
      return `Título deve ter pelo menos ${VALIDATION_RULES.TASK.TITLE.MIN_LENGTH} caractere`;
    }
    if (title.length > VALIDATION_RULES.TASK.TITLE.MAX_LENGTH) {
      return `Título deve ter no máximo ${VALIDATION_RULES.TASK.TITLE.MAX_LENGTH} caracteres`;
    }
    return null;
  },
};

export const taskDescriptionValidator: ValidationRule<string> = {
  validate: (description: string): string | null => {
    if (
      description &&
      description.length > VALIDATION_RULES.TASK.DESCRIPTION.MAX_LENGTH
    ) {
      return `Descrição deve ter no máximo ${VALIDATION_RULES.TASK.DESCRIPTION.MAX_LENGTH} caracteres`;
    }
    return null;
  },
};

export function validateEmail(email: string): ValidationResult {
  const error = emailValidator.validate(email);
  return {
    isValid: !error,
    errors: error ? [error] : [],
  };
}

export function validatePassword(password: string): ValidationResult {
  const error = passwordValidator.validate(password);
  return {
    isValid: !error,
    errors: error ? [error] : [],
  };
}

export function validateName(name: string): ValidationResult {
  const error = nameValidator.validate(name);
  return {
    isValid: !error,
    errors: error ? [error] : [],
  };
}

export function validateTaskTitle(title: string): ValidationResult {
  const error = taskTitleValidator.validate(title);
  return {
    isValid: !error,
    errors: error ? [error] : [],
  };
}

export function validateTaskDescription(description: string): ValidationResult {
  const error = taskDescriptionValidator.validate(description);
  return {
    isValid: !error,
    errors: error ? [error] : [],
  };
}

export interface LoginFormData {
  email: string;
  password: string;
}

export interface RegisterFormData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface TaskFormData {
  title: string;
  description: string;
  dueDate: string;
  priority: string;
  status: string;
  tags: string;
}

export function validateLoginForm(data: LoginFormData): ValidationResult {
  const errors: string[] = [];

  const emailResult = validateEmail(data.email);
  if (!emailResult.isValid) errors.push(...emailResult.errors);

  const passwordResult = validatePassword(data.password);
  if (!passwordResult.isValid) errors.push(...passwordResult.errors);

  return {
    isValid: errors.length === 0,
    errors,
  };
}

export function validateRegisterForm(data: RegisterFormData): ValidationResult {
  const errors: string[] = [];

  const nameResult = validateName(data.name);
  if (!nameResult.isValid) errors.push(...nameResult.errors);

  const emailResult = validateEmail(data.email);
  if (!emailResult.isValid) errors.push(...emailResult.errors);

  const passwordResult = validatePassword(data.password);
  if (!passwordResult.isValid) errors.push(...passwordResult.errors);

  if (data.password !== data.confirmPassword) {
    errors.push("As senhas não coincidem");
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

export function validateTaskForm(data: TaskFormData): ValidationResult {
  const errors: string[] = [];

  const titleResult = validateTaskTitle(data.title);
  if (!titleResult.isValid) errors.push(...titleResult.errors);

  const descriptionResult = validateTaskDescription(data.description);
  if (!descriptionResult.isValid) errors.push(...descriptionResult.errors);

  if (!data.dueDate) {
    errors.push("Data de vencimento é obrigatória");
  } else {
    const dueDate = new Date(data.dueDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (dueDate < today) {
      errors.push("Data de vencimento não pode ser no passado");
    }
  }

  if (data.tags) {
    const tags = data.tags
      .split(",")
      .map((tag) => tag.trim())
      .filter((tag) => tag);
    if (tags.length > VALIDATION_RULES.TASK.TAGS.MAX_COUNT) {
      errors.push(
        `Máximo de ${VALIDATION_RULES.TASK.TAGS.MAX_COUNT} tags permitidas`
      );
    }

    for (const tag of tags) {
      if (tag.length > VALIDATION_RULES.TASK.TAGS.MAX_LENGTH) {
        errors.push(
          `Tag deve ter no máximo ${VALIDATION_RULES.TASK.TAGS.MAX_LENGTH} caracteres`
        );
        break;
      }
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

export function validateRequired(value: any, fieldName: string): string | null {
  if (!value || (typeof value === "string" && !value.trim())) {
    return `${fieldName} é obrigatório`;
  }
  return null;
}

export function validateMinLength(
  value: string,
  minLength: number,
  fieldName: string
): string | null {
  if (value && value.length < minLength) {
    return `${fieldName} deve ter pelo menos ${minLength} caracteres`;
  }
  return null;
}

export function validateMaxLength(
  value: string,
  maxLength: number,
  fieldName: string
): string | null {
  if (value && value.length > maxLength) {
    return `${fieldName} deve ter no máximo ${maxLength} caracteres`;
  }
  return null;
}

export function validateDateRange(
  date: Date,
  minDate?: Date,
  maxDate?: Date
): string | null {
  if (minDate && date < minDate) {
    return `Data não pode ser anterior a ${minDate.toLocaleDateString()}`;
  }
  if (maxDate && date > maxDate) {
    return `Data não pode ser posterior a ${maxDate.toLocaleDateString()}`;
  }
  return null;
}
