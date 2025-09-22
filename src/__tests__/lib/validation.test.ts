import {
  validateEmail,
  validatePassword,
  validateName,
  validateTaskTitle,
  validateTaskDescription,
  validateLoginForm,
  validateRegisterForm,
  validateTaskForm,
  validateRequired,
  validateMinLength,
  validateMaxLength,
  validateDateRange,
  emailValidator,
  passwordValidator,
  nameValidator,
  taskTitleValidator,
  taskDescriptionValidator,
} from '@/lib/validation'

describe('validation', () => {
  describe('emailValidator', () => {
    it('deve validar email válido', () => {
      const result = emailValidator.validate('test@example.com')
      expect(result).toBeNull()
    })

    it('deve rejeitar email vazio', () => {
      const result = emailValidator.validate('')
      expect(result).toBe('Email é obrigatório')
    })

    it('deve rejeitar email inválido', () => {
      const result = emailValidator.validate('invalid-email')
      expect(result).toBe('Email inválido')
    })

    it('deve rejeitar email muito longo', () => {
      const longEmail = 'a'.repeat(250) + '@example.com'
      const result = emailValidator.validate(longEmail)
      expect(result).toBe('Email deve ter no máximo 254 caracteres')
    })
  })

  describe('passwordValidator', () => {
    it('deve validar senha válida', () => {
      const result = passwordValidator.validate('password123')
      expect(result).toBeNull()
    })

    it('deve rejeitar senha vazia', () => {
      const result = passwordValidator.validate('')
      expect(result).toBe('Senha é obrigatória')
    })

    it('deve rejeitar senha muito curta', () => {
      const result = passwordValidator.validate('123')
      expect(result).toBe('Senha deve ter pelo menos 6 caracteres')
    })

    it('deve rejeitar senha muito longa', () => {
      const longPassword = 'a'.repeat(130)
      const result = passwordValidator.validate(longPassword)
      expect(result).toBe('Senha deve ter no máximo 128 caracteres')
    })
  })

  describe('nameValidator', () => {
    it('deve validar nome válido', () => {
      const result = nameValidator.validate('João Silva')
      expect(result).toBeNull()
    })

    it('deve rejeitar nome vazio', () => {
      const result = nameValidator.validate('')
      expect(result).toBe('Nome é obrigatório')
    })

    it('deve rejeitar nome muito curto', () => {
      const result = nameValidator.validate('A')
      expect(result).toBe('Nome deve ter pelo menos 2 caracteres')
    })

    it('deve rejeitar nome muito longo', () => {
      const longName = 'A'.repeat(101)
      const result = nameValidator.validate(longName)
      expect(result).toBe('Nome deve ter no máximo 100 caracteres')
    })

    it('deve rejeitar nome com caracteres inválidos', () => {
      const result = nameValidator.validate('João123')
      expect(result).toBe('Nome deve conter apenas letras e espaços')
    })

    it('deve aceitar nome com acentos', () => {
      const result = nameValidator.validate('José da Silva')
      expect(result).toBeNull()
    })
  })

  describe('taskTitleValidator', () => {
    it('deve validar título válido', () => {
      const result = taskTitleValidator.validate('Tarefa importante')
      expect(result).toBeNull()
    })

    it('deve rejeitar título vazio', () => {
      const result = taskTitleValidator.validate('')
      expect(result).toBe('Título é obrigatório')
    })

    it('deve rejeitar título muito longo', () => {
      const longTitle = 'A'.repeat(201)
      const result = taskTitleValidator.validate(longTitle)
      expect(result).toBe('Título deve ter no máximo 200 caracteres')
    })
  })

  describe('taskDescriptionValidator', () => {
    it('deve validar descrição válida', () => {
      const result = taskDescriptionValidator.validate('Descrição da tarefa')
      expect(result).toBeNull()
    })

    it('deve aceitar descrição vazia', () => {
      const result = taskDescriptionValidator.validate('')
      expect(result).toBeNull()
    })

    it('deve rejeitar descrição muito longa', () => {
      const longDescription = 'A'.repeat(1001)
      const result = taskDescriptionValidator.validate(longDescription)
      expect(result).toBe('Descrição deve ter no máximo 1000 caracteres')
    })
  })

  describe('validateEmail', () => {
    it('deve retornar resultado válido para email correto', () => {
      const result = validateEmail('test@example.com')
      expect(result.isValid).toBe(true)
      expect(result.errors).toHaveLength(0)
    })

    it('deve retornar resultado inválido para email incorreto', () => {
      const result = validateEmail('invalid-email')
      expect(result.isValid).toBe(false)
      expect(result.errors).toHaveLength(1)
    })
  })

  describe('validatePassword', () => {
    it('deve retornar resultado válido para senha correta', () => {
      const result = validatePassword('password123')
      expect(result.isValid).toBe(true)
      expect(result.errors).toHaveLength(0)
    })

    it('deve retornar resultado inválido para senha incorreta', () => {
      const result = validatePassword('123')
      expect(result.isValid).toBe(false)
      expect(result.errors).toHaveLength(1)
    })
  })

  describe('validateName', () => {
    it('deve retornar resultado válido para nome correto', () => {
      const result = validateName('João Silva')
      expect(result.isValid).toBe(true)
      expect(result.errors).toHaveLength(0)
    })

    it('deve retornar resultado inválido para nome incorreto', () => {
      const result = validateName('A')
      expect(result.isValid).toBe(false)
      expect(result.errors).toHaveLength(1)
    })
  })

  describe('validateTaskTitle', () => {
    it('deve retornar resultado válido para título correto', () => {
      const result = validateTaskTitle('Tarefa importante')
      expect(result.isValid).toBe(true)
      expect(result.errors).toHaveLength(0)
    })

    it('deve retornar resultado inválido para título incorreto', () => {
      const result = validateTaskTitle('')
      expect(result.isValid).toBe(false)
      expect(result.errors).toHaveLength(1)
    })
  })

  describe('validateTaskDescription', () => {
    it('deve retornar resultado válido para descrição correta', () => {
      const result = validateTaskDescription('Descrição da tarefa')
      expect(result.isValid).toBe(true)
      expect(result.errors).toHaveLength(0)
    })

    it('deve retornar resultado válido para descrição vazia', () => {
      const result = validateTaskDescription('')
      expect(result.isValid).toBe(true)
      expect(result.errors).toHaveLength(0)
    })
  })

  describe('validateLoginForm', () => {
    it('deve validar formulário de login correto', () => {
      const data = {
        email: 'test@example.com',
        password: 'password123',
      }

      const result = validateLoginForm(data)
      expect(result.isValid).toBe(true)
      expect(result.errors).toHaveLength(0)
    })

    it('deve rejeitar formulário com email inválido', () => {
      const data = {
        email: 'invalid-email',
        password: 'password123',
      }

      const result = validateLoginForm(data)
      expect(result.isValid).toBe(false)
      expect(result.errors.length).toBeGreaterThan(0)
    })

    it('deve rejeitar formulário com senha inválida', () => {
      const data = {
        email: 'test@example.com',
        password: '123',
      }

      const result = validateLoginForm(data)
      expect(result.isValid).toBe(false)
      expect(result.errors.length).toBeGreaterThan(0)
    })
  })

  describe('validateRegisterForm', () => {
    it('deve validar formulário de registro correto', () => {
      const data = {
        name: 'João Silva',
        email: 'test@example.com',
        password: 'password123',
        confirmPassword: 'password123',
      }

      const result = validateRegisterForm(data)
      expect(result.isValid).toBe(true)
      expect(result.errors).toHaveLength(0)
    })

    it('deve rejeitar formulário com senhas diferentes', () => {
      const data = {
        name: 'João Silva',
        email: 'test@example.com',
        password: 'password123',
        confirmPassword: 'different123',
      }

      const result = validateRegisterForm(data)
      expect(result.isValid).toBe(false)
      expect(result.errors).toContain('As senhas não coincidem')
    })

    it('deve rejeitar formulário com dados inválidos', () => {
      const data = {
        name: 'A',
        email: 'invalid-email',
        password: '123',
        confirmPassword: '123',
      }

      const result = validateRegisterForm(data)
      expect(result.isValid).toBe(false)
      expect(result.errors.length).toBeGreaterThan(0)
    })
  })

  describe('validateTaskForm', () => {
    it('deve validar formulário de tarefa correto', () => {
      const tomorrow = new Date()
      tomorrow.setDate(tomorrow.getDate() + 1)

      const data = {
        title: 'Tarefa importante',
        description: 'Descrição da tarefa',
        dueDate: tomorrow.toISOString().split('T')[0],
        priority: 'high',
        status: 'pending',
        tags: 'trabalho,urgente',
      }

      const result = validateTaskForm(data)
      expect(result.isValid).toBe(true)
      expect(result.errors).toHaveLength(0)
    })

    it('deve rejeitar formulário sem data de vencimento', () => {
      const data = {
        title: 'Tarefa importante',
        description: 'Descrição da tarefa',
        dueDate: '',
        priority: 'high',
        status: 'pending',
        tags: '',
      }

      const result = validateTaskForm(data)
      expect(result.isValid).toBe(false)
      expect(result.errors).toContain('Data de vencimento é obrigatória')
    })

    it('deve rejeitar formulário com data no passado', () => {
      const yesterday = new Date()
      yesterday.setDate(yesterday.getDate() - 1)

      const data = {
        title: 'Tarefa importante',
        description: 'Descrição da tarefa',
        dueDate: yesterday.toISOString().split('T')[0],
        priority: 'high',
        status: 'pending',
        tags: '',
      }

      const result = validateTaskForm(data)
      expect(result.isValid).toBe(false)
      expect(result.errors).toContain('Data de vencimento não pode ser no passado')
    })

    it('deve rejeitar formulário com muitas tags', () => {
      const tomorrow = new Date()
      tomorrow.setDate(tomorrow.getDate() + 1)

      const data = {
        title: 'Tarefa importante',
        description: 'Descrição da tarefa',
        dueDate: tomorrow.toISOString().split('T')[0],
        priority: 'high',
        status: 'pending',
        tags: 'tag1,tag2,tag3,tag4,tag5,tag6,tag7,tag8,tag9,tag10,tag11',
      }

      const result = validateTaskForm(data)
      expect(result.isValid).toBe(false)
      expect(result.errors).toContain('Máximo de 10 tags permitidas')
    })
  })

  describe('validateRequired', () => {
    it('deve validar valor presente', () => {
      const result = validateRequired('value', 'Campo')
      expect(result).toBeNull()
    })

    it('deve rejeitar valor vazio', () => {
      const result = validateRequired('', 'Campo')
      expect(result).toBe('Campo é obrigatório')
    })

    it('deve rejeitar valor undefined', () => {
      const result = validateRequired(undefined, 'Campo')
      expect(result).toBe('Campo é obrigatório')
    })

    it('deve rejeitar valor null', () => {
      const result = validateRequired(null, 'Campo')
      expect(result).toBe('Campo é obrigatório')
    })

    it('deve rejeitar string com apenas espaços', () => {
      const result = validateRequired('   ', 'Campo')
      expect(result).toBe('Campo é obrigatório')
    })
  })

  describe('validateMinLength', () => {
    it('deve validar string com tamanho suficiente', () => {
      const result = validateMinLength('hello', 3, 'Campo')
      expect(result).toBeNull()
    })

    it('deve rejeitar string muito curta', () => {
      const result = validateMinLength('hi', 3, 'Campo')
      expect(result).toBe('Campo deve ter pelo menos 3 caracteres')
    })

    it('deve aceitar string vazia', () => {
      const result = validateMinLength('', 3, 'Campo')
      expect(result).toBeNull()
    })
  })

  describe('validateMaxLength', () => {
    it('deve validar string com tamanho adequado', () => {
      const result = validateMaxLength('hello', 10, 'Campo')
      expect(result).toBeNull()
    })

    it('deve rejeitar string muito longa', () => {
      const result = validateMaxLength('hello world', 5, 'Campo')
      expect(result).toBe('Campo deve ter no máximo 5 caracteres')
    })

    it('deve aceitar string vazia', () => {
      const result = validateMaxLength('', 5, 'Campo')
      expect(result).toBeNull()
    })
  })

  describe('validateDateRange', () => {
    const today = new Date()
    const yesterday = new Date(today)
    yesterday.setDate(yesterday.getDate() - 1)
    const tomorrow = new Date(today)
    tomorrow.setDate(tomorrow.getDate() + 1)

    it('deve validar data dentro do intervalo', () => {
      const result = validateDateRange(today, yesterday, tomorrow)
      expect(result).toBeNull()
    })

    it('deve rejeitar data anterior ao mínimo', () => {
      const result = validateDateRange(yesterday, today, tomorrow)
      expect(result).toContain('Data não pode ser anterior a')
    })

    it('deve rejeitar data posterior ao máximo', () => {
      const result = validateDateRange(tomorrow, yesterday, today)
      expect(result).toContain('Data não pode ser posterior a')
    })

    it('deve aceitar data sem restrições', () => {
      const result = validateDateRange(today)
      expect(result).toBeNull()
    })
  })
})

