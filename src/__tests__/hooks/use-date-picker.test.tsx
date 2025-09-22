import { renderHook, act } from '@testing-library/react'
import { useDatePicker } from '@/hooks/use-date-picker'

describe('useDatePicker', () => {
  it('deve inicializar com data undefined quando não fornecida', () => {
    const { result } = renderHook(() => useDatePicker())

    expect(result.current.selectedDate).toBeUndefined()
  })

  it('deve inicializar com data fornecida', () => {
    const initialDate = new Date('2024-12-31')
    const { result } = renderHook(() => useDatePicker({ initialDate }))

    expect(result.current.selectedDate).toEqual(initialDate)
  })

  it('deve permitir definir uma nova data', () => {
    const { result } = renderHook(() => useDatePicker())
    const newDate = new Date('2024-12-25')

    act(() => {
      result.current.setSelectedDate(newDate)
    })

    expect(result.current.selectedDate).toEqual(newDate)
  })

  it('deve permitir resetar a data', () => {
    const initialDate = new Date('2024-12-31')
    const { result } = renderHook(() => useDatePicker({ initialDate }))

    expect(result.current.selectedDate).toEqual(initialDate)

    act(() => {
      result.current.reset()
    })

    expect(result.current.selectedDate).toBeUndefined()
  })

  it('deve atualizar data quando initialDate muda', () => {
    const initialDate1 = new Date('2024-12-31')
    const { result, rerender } = renderHook(
      ({ initialDate }) => useDatePicker({ initialDate }),
      { initialProps: { initialDate: initialDate1 } }
    )

    expect(result.current.selectedDate).toEqual(initialDate1)

    const initialDate2 = new Date('2024-12-25')
    rerender({ initialDate: initialDate2 })

    expect(result.current.selectedDate).toEqual(initialDate2)
  })

  it('deve permitir definir data como undefined', () => {
    const initialDate = new Date('2024-12-31')
    const { result } = renderHook(() => useDatePicker({ initialDate }))

    expect(result.current.selectedDate).toEqual(initialDate)

    act(() => {
      result.current.setSelectedDate(undefined)
    })

    expect(result.current.selectedDate).toBeUndefined()
  })

  it('deve manter a mesma referência de função setSelectedDate', () => {
    const { result, rerender } = renderHook(() => useDatePicker())

    const setSelectedDate1 = result.current.setSelectedDate

    rerender()

    const setSelectedDate2 = result.current.setSelectedDate

    expect(setSelectedDate1).toBe(setSelectedDate2)
  })

})

