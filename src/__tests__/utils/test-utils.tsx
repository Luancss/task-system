import React, { ReactElement } from 'react'
import { render, RenderOptions } from '@testing-library/react'
import { AuthProvider } from '@/contexts/auth-context'
import { TaskProvider } from '@/contexts/task-context'

const AllTheProviders = ({ children }: { children: React.ReactNode }) => {
  return (
    <AuthProvider>
      <TaskProvider>
        {children}
      </TaskProvider>
    </AuthProvider>
  )
}

const customRender = (
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>,
) => render(ui, { wrapper: AllTheProviders, ...options })

export const mockUser = {
  id: '1',
  email: 'test@example.com',
  name: 'Test User',
}

export const mockTask = {
  id: '1',
  title: 'Test Task',
  description: 'Test Description',
  status: 'pending' as const,
  priority: 'medium' as const,
  dueDate: new Date('2024-12-31'),
  createdAt: new Date('2024-01-01'),
  updatedAt: new Date('2024-01-01'),
}

export const mockTasks = [
  mockTask,
  {
    ...mockTask,
    id: '2',
    title: 'Another Task',
    status: 'completed' as const,
  },
]

export const createMockTask = (overrides = {}) => ({
  ...mockTask,
  ...overrides,
})

export const createMockUser = (overrides = {}) => ({
  ...mockUser,
  ...overrides,
})

export * from '@testing-library/react'
export { customRender as render }

describe('test-utils', () => {
  it('deve exportar funções de teste corretamente', () => {
    expect(mockUser).toBeDefined()
    expect(mockTask).toBeDefined()
    expect(mockTasks).toBeDefined()
    expect(createMockTask).toBeDefined()
    expect(createMockUser).toBeDefined()
  })
})

