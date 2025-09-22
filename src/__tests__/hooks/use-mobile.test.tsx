import { renderHook, act } from '@testing-library/react'
import { useIsMobile } from '@/hooks/use-mobile'

const mockMatchMedia = jest.fn()
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: mockMatchMedia,
})

Object.defineProperty(window, 'innerWidth', {
  writable: true,
  configurable: true,
  value: 1024,
})

describe('useIsMobile', () => {
  let mockMediaQueryList: {
    matches: boolean
    media: string
    onchange: null | ((event: MediaQueryListEvent) => void)
    addEventListener: jest.Mock
    removeEventListener: jest.Mock
    dispatchEvent: jest.Mock
  }

  beforeEach(() => {
    mockMediaQueryList = {
      matches: false,
      media: '(max-width: 767px)',
      onchange: null,
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
      dispatchEvent: jest.fn(),
    }

    mockMatchMedia.mockReturnValue(mockMediaQueryList)
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  it('deve retornar false para desktop (largura > 768px)', () => {
    Object.defineProperty(window, 'innerWidth', {
      value: 1024,
    })

    const { result } = renderHook(() => useIsMobile())

    expect(result.current).toBe(false)
    expect(mockMatchMedia).toHaveBeenCalledWith('(max-width: 767px)')
  })

  it('deve retornar true para mobile (largura < 768px)', () => {
    Object.defineProperty(window, 'innerWidth', {
      value: 600,
    })

    const { result } = renderHook(() => useIsMobile())

    expect(result.current).toBe(true)
  })

  it('deve retornar true para tablet (largura = 767px)', () => {
    Object.defineProperty(window, 'innerWidth', {
      value: 767,
    })

    const { result } = renderHook(() => useIsMobile())

    expect(result.current).toBe(true)
  })

  it('deve retornar false para desktop (largura = 768px)', () => {
    Object.defineProperty(window, 'innerWidth', {
      value: 768,
    })

    const { result } = renderHook(() => useIsMobile())

    expect(result.current).toBe(false)
  })

  it('deve adicionar listener para mudanças de media query', () => {
    renderHook(() => useIsMobile())

    expect(mockMediaQueryList.addEventListener).toHaveBeenCalledWith(
      'change',
      expect.any(Function)
    )
  })

  it('deve remover listener quando componente é desmontado', () => {
    const { unmount } = renderHook(() => useIsMobile())

    unmount()

    expect(mockMediaQueryList.removeEventListener).toHaveBeenCalledWith(
      'change',
      expect.any(Function)
    )
  })

  it('deve atualizar estado quando media query muda', () => {
    const { result } = renderHook(() => useIsMobile())

    Object.defineProperty(window, 'innerWidth', {
      value: 600,
    })

    const changeHandler = mockMediaQueryList.addEventListener.mock.calls[0][1]
    
    act(() => {
      changeHandler({ matches: true } as MediaQueryListEvent)
    })

    expect(result.current).toBe(true)
  })

  it('deve lidar com mudanças de largura da janela', () => {
    Object.defineProperty(window, 'innerWidth', {
      value: 1024,
    })

    const { result } = renderHook(() => useIsMobile())

    expect(result.current).toBe(false)

    Object.defineProperty(window, 'innerWidth', {
      value: 600,
    })

    const changeHandler = mockMediaQueryList.addEventListener.mock.calls[0][1]
    
    act(() => {
      changeHandler({ matches: true } as MediaQueryListEvent)
    })

    expect(result.current).toBe(true)

    Object.defineProperty(window, 'innerWidth', {
      value: 1024,
    })

    act(() => {
      changeHandler({ matches: false } as MediaQueryListEvent)
    })

    expect(result.current).toBe(false)
  })

  it('deve inicializar com valor correto baseado na largura atual', () => {
    Object.defineProperty(window, 'innerWidth', {
      value: 600,
    })

    const { result: mobileResult } = renderHook(() => useIsMobile())
    expect(mobileResult.current).toBe(true)

    Object.defineProperty(window, 'innerWidth', {
      value: 1024,
    })

    const { result: desktopResult } = renderHook(() => useIsMobile())
    expect(desktopResult.current).toBe(false)
  })
})

