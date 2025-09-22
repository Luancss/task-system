import { cn } from '@/lib/utils'

describe('utils', () => {
  describe('cn', () => {
    it('deve combinar classes CSS corretamente', () => {
      const result = cn('class1', 'class2')
      expect(result).toBe('class1 class2')
    })

    it('deve lidar com classes condicionais', () => {
      const result = cn('base', true && 'conditional', false && 'hidden')
      expect(result).toBe('base conditional')
    })

    it('deve lidar com arrays de classes', () => {
      const result = cn(['class1', 'class2'], 'class3')
      expect(result).toBe('class1 class2 class3')
    })

    it('deve lidar com objetos de classes condicionais', () => {
      const result = cn({
        'class1': true,
        'class2': false,
        'class3': true,
      })
      expect(result).toBe('class1 class3')
    })

    it('deve mesclar classes conflitantes do Tailwind', () => {
      const result = cn('px-2 px-4', 'py-1 py-2')
      expect(result).toBe('px-4 py-2')
    })

    it('deve lidar com valores undefined e null', () => {
      const result = cn('class1', undefined, null, 'class2')
      expect(result).toBe('class1 class2')
    })

    it('deve lidar com strings vazias', () => {
      const result = cn('class1', '', 'class2')
      expect(result).toBe('class1 class2')
    })
  })
})

