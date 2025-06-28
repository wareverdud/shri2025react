import { describe, expect, test, beforeEach, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { HistoryPage } from '@/pages/history'
import { useRecordsStore } from '@/store/history'

const mockNavigate = vi.fn()
vi.mock('react-router-dom', async () => {
    return {
        useNavigate: () => mockNavigate,
    }
})

const localStorageMock = {
    getItem: vi.fn(),
    setItem: vi.fn(),
}
Object.defineProperty(window, 'localStorage', {
    value: localStorageMock,
})

const mockRecords = [
    {
        id: 1,
        name: 'test1.csv',
        date: '2025-01-01',
        success: true,
        entry: {
            total_spend_galactic: 1000,
            rows_affected: 50,
            less_spent_at: 100,
            big_spent_at: 500,
            less_spent_value: 10,
            big_spent_value: 100,
            average_spend_galactic: 20,
            big_spent_civ: 'civ1',
            less_spent_civ: 'civ2',
        },
    },
    {
        id: 2,
        name: 'test2.csv',
        date: '2025-01-02',
        success: false,
        entry: null,
    },
]

describe('Тесты истории', () => {
    beforeEach(() => {
        vi.clearAllMocks()

        const store = useRecordsStore.getState()
        store.clearHistory()

        localStorageMock.getItem.mockReturnValue('[]')
    })

    test('отображает пустую историю когда записей нет', () => {
        render(<HistoryPage />)

        expect(screen.getByText('История операций пуста')).toBeInTheDocument()
        expect(screen.getByText('Сгенерировать больше')).toBeInTheDocument()
        expect(screen.getByText('Очистить всё')).toBeInTheDocument()
    })

    test('отображает историю когда есть записи', () => {
        const store = useRecordsStore.getState()
        mockRecords.forEach((record) => store.addRecord(record))

        render(<HistoryPage />)

        expect(screen.getByText('test1.csv')).toBeInTheDocument()
        expect(screen.getByText('test2.csv')).toBeInTheDocument()
        expect(screen.getByText('2025-01-01')).toBeInTheDocument()
        expect(screen.getByText('2025-01-02')).toBeInTheDocument()
    })

    test('кнопка сгенерировать больше редиректит на /generator', async () => {
        const user = userEvent.setup()
        render(<HistoryPage />)

        const generateButton = screen.getByText('Сгенерировать больше')
        await user.click(generateButton)

        expect(mockNavigate).toHaveBeenCalledWith('/generator')
    })

    test('кнопка очистить всё очищает всю историю', async () => {
        const user = userEvent.setup()

        const store = useRecordsStore.getState()
        mockRecords.forEach((record) => store.addRecord(record))

        render(<HistoryPage />)

        expect(screen.getByText('test1.csv')).toBeInTheDocument()
        expect(screen.getByText('test2.csv')).toBeInTheDocument()

        const clearButton = screen.getByText('Очистить всё')
        await user.click(clearButton)

        expect(screen.getByText('История операций пуста')).toBeInTheDocument()
        expect(screen.queryByText('test1.csv')).not.toBeInTheDocument()
        expect(screen.queryByText('test2.csv')).not.toBeInTheDocument()
        expect(localStorageMock.setItem).toHaveBeenCalledWith('records', '[]')
    })

    test('кнопка корзины удаляет одну запись', async () => {
        const user = userEvent.setup()

        const store = useRecordsStore.getState()
        mockRecords.forEach((record) => store.addRecord(record))

        render(<HistoryPage />)

        expect(screen.getByText('test1.csv')).toBeInTheDocument()
        expect(screen.getByText('test2.csv')).toBeInTheDocument()

        const deleteButtons = screen.getAllByTestId('delete-button')
        await user.click(deleteButtons[0])

        expect(screen.queryByText('test1.csv')).not.toBeInTheDocument()
        expect(screen.getByText('test2.csv')).toBeInTheDocument()
    })

    test('по клику на успешную запись выскакивает модалка', async () => {
        const user = userEvent.setup()

        const store = useRecordsStore.getState()
        store.addRecord(mockRecords[0])

        render(<HistoryPage />)

        const recordRow = screen.getByText('test1.csv').closest('div')
        if (recordRow) {
            await user.click(recordRow)
        }

        expect(screen.getByText('общие расходы в галактических кредитах')).toBeInTheDocument()
        expect(screen.getByText('1000')).toBeInTheDocument()
        expect(screen.getByText('цивилизация с минимальными расходами')).toBeInTheDocument()
        expect(screen.getByText('civ2')).toBeInTheDocument()
        expect(screen.getByText('количество обработанных записей')).toBeInTheDocument()
        expect(screen.getByText('50')).toBeInTheDocument()
    })

    test('по клику на неуспешную запись модалка не выскакивает', async () => {
        const user = userEvent.setup()

        const store = useRecordsStore.getState()
        store.addRecord(mockRecords[1])

        render(<HistoryPage />)

        const row = screen.getByText('test2.csv').closest('div')
        if (row) {
            await user.click(row)
        }

        expect(screen.queryByText('общие расходы в галактических кредитах')).not.toBeInTheDocument()
        expect(screen.queryByText('цивилизация с минимальными расходами')).not.toBeInTheDocument()
        expect(screen.queryByText('количество обработанных записей')).not.toBeInTheDocument()
    })

    test('модалка закрывается при клике на кнопку закрытия', async () => {
        const user = userEvent.setup()

        const store = useRecordsStore.getState()
        store.addRecord(mockRecords[0])

        render(<HistoryPage />)

        const row = screen.getByText('test1.csv').closest('div')
        if (row) {
            await user.click(row)
        }

        expect(screen.getByText('общие расходы в галактических кредитах')).toBeInTheDocument()

        const closeButton = screen.getByTestId('modal-close-button')
        await user.click(closeButton)

        expect(screen.queryByText('общие расходы в галактических кредитах')).not.toBeInTheDocument()
    })
})
