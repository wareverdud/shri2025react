import { describe, expect, test, vi, beforeEach } from 'vitest'
import { render, screen, waitFor, act } from '@testing-library/react'
import { Stats } from '@/components/stats'
import { useFileStore } from '@/store/file'

const mockStats = {
    total_spend_galactic: 1000,
    rows_affected: 50,
    less_spent_at: 100,
    big_spent_at: 500,
    less_spent_value: 10,
    big_spent_value: 100,
    average_spend_galactic: 20,
    big_spent_civ: 'civ1',
    less_spent_civ: 'civ2',
}

const updatedMockStats = {
    total_spend_galactic: 2000,
    rows_affected: 100,
    less_spent_at: 200,
    big_spent_at: 1000,
    less_spent_value: 20,
    big_spent_value: 200,
    average_spend_galactic: 40,
    big_spent_civ: 'civ3',
    less_spent_civ: 'civ4',
}

vi.mock('@/store/file', () => ({
    useFileStore: vi.fn(),
}))

describe('Тесты статистики', () => {
    beforeEach(() => {
        vi.clearAllMocks()
        const mockUseFileStore = useFileStore as unknown as ReturnType<typeof vi.fn>
        mockUseFileStore.mockReturnValue({
            stats: null,
        })
    })

    test('пустая статистика', () => {
        render(<Stats />)

        expect(screen.getByText('Здесь появятся хайлайты')).toBeInTheDocument()
    })

    test('отображается ошибка', () => {
        const mockUseFileStore = useFileStore as unknown as ReturnType<typeof vi.fn>
        mockUseFileStore.mockReturnValue({
            stats: null,
            isError: true,
        })

        render(<Stats />)

        expect(screen.getByText('Здесь появятся хайлайты')).toBeInTheDocument()
    })

    test('отображается статистика', () => {
        const mockUseFileStore = useFileStore as unknown as ReturnType<typeof vi.fn>
        mockUseFileStore.mockReturnValue({
            stats: mockStats,
        })

        render(<Stats />)

        expect(screen.getByText('1000')).toBeInTheDocument()
        expect(screen.getByText('общие расходы в галактических кредитах')).toBeInTheDocument()
        expect(screen.getByText('50')).toBeInTheDocument()
        expect(screen.getByText('количество обработанных записей')).toBeInTheDocument()
    })

    test('статистика обновляется через время и меняется отображение', async () => {
        const mockUseFileStore = useFileStore as unknown as ReturnType<typeof vi.fn>

        mockUseFileStore.mockReturnValue({
            stats: null,
        })

        const { rerender } = render(<Stats />)

        expect(screen.getByText('Здесь появятся хайлайты')).toBeInTheDocument()
        expect(screen.queryByText('1000')).not.toBeInTheDocument()

        await act(async () => {
            mockUseFileStore.mockReturnValue({
                stats: mockStats,
            })

            rerender(<Stats />)

            await new Promise((resolve) => setTimeout(resolve, 100))
        })

        await waitFor(() => {
            expect(screen.getByText('1000')).toBeInTheDocument()
            expect(screen.getByText('общие расходы в галактических кредитах')).toBeInTheDocument()
            expect(screen.getByText('50')).toBeInTheDocument()
            expect(screen.getByText('количество обработанных записей')).toBeInTheDocument()
        })

        await act(async () => {
            mockUseFileStore.mockReturnValue({
                stats: updatedMockStats,
            })

            rerender(<Stats />)
            await new Promise((resolve) => setTimeout(resolve, 100))
        })

        await waitFor(() => {
            expect(screen.getByText('2000')).toBeInTheDocument()
            expect(screen.getByText('100')).toBeInTheDocument()
        })

        expect(screen.queryByText('1000')).not.toBeInTheDocument()
        expect(screen.queryByText('50')).not.toBeInTheDocument()
    })
})
