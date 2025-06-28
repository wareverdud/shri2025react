import { describe, expect, test, vi } from 'vitest'
import { getCurrentDate } from '@/utils/getDate'
import { convertDate } from '@/utils/convertDate'

describe('тесты вспомогательных функций', () => {
    test('возвращает дату в формате DD.MM.YY', () => {
        const singleDigitDate = new Date('2025-06-28T12:34:56Z')
        vi.setSystemTime(singleDigitDate)

        const formatted = getCurrentDate()
        expect(formatted).toBe('28.06.25')
    })

    test('добавляет 0 перед числами', () => {
        const singleDigitDate = new Date('2025-01-01T00:00:00Z')
        vi.setSystemTime(singleDigitDate)

        const formatted = getCurrentDate()
        expect(formatted).toBe('01.01.25')
    })

    test('корректно преобразует день года в дату', () => {
        expect(convertDate(1)).toBe('1 января')
        expect(convertDate(365)).toBe('31 декабря')
        expect(convertDate(100)).toBe('10 апреля')
    })
})
