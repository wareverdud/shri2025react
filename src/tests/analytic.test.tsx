import { describe, expect, test, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { AnalyticPage } from '@/pages/analytic'
import { useFileStore } from '@/store/file'
import userEvent from '@testing-library/user-event'
import styles from '@/pages/analytic/index.module.css'

const mockCsvContent = 'id,civ,developer_id,date,spend\n1,monsters,3565747052233,103,540'

vi.mock('@/store/file', () => ({
    useFileStore: vi.fn(),
}))

describe('Тесты аналитики', () => {
    const mockAddFile = vi.fn()
    const mockClearFile = vi.fn()
    const mockSetIsLoading = vi.fn()
    const mockSetIsError = vi.fn()
    const mockSetIsCompleted = vi.fn()
    const mockSetStats = vi.fn()

    beforeEach(() => {
        vi.clearAllMocks()
        const mockUseFileStore = useFileStore as unknown as ReturnType<typeof vi.fn>
        mockUseFileStore.mockReturnValue({
            file: null,
            addFile: mockAddFile,
            clearFile: mockClearFile,
            isLoading: false,
            setIsLoading: mockSetIsLoading,
            isError: false,
            setIsError: mockSetIsError,
            isCompleted: false,
            setIsCompleted: mockSetIsCompleted,
            stats: null,
            setStats: mockSetStats,
        })
    })

    test('начальная страница аналитики', () => {
        render(<AnalyticPage />)

        expect(screen.getByTestId('analytic-title')).toBeInTheDocument()
        expect(screen.getByText('Загрузить файл')).toBeInTheDocument()
        expect(screen.getByText('или перетащите сюда')).toBeInTheDocument()
        expect(screen.getByTestId('analytic-submit-button')).toBeDisabled()
    })

    test('при ховере над зоной загрузки фон становится зеленым', () => {
        render(<AnalyticPage />)

        const dropZone = screen.getByTestId('analytic-upload-space')

        expect(dropZone).not.toHaveClass(styles.dragging)

        fireEvent.dragEnter(dropZone)

        expect(dropZone).toHaveClass(styles.dragging)

        fireEvent.dragLeave(dropZone)

        expect(dropZone).not.toHaveClass(styles.dragging)
    })

    test('инпут принимает только csv файлы', async () => {
        const user = userEvent.setup()

        render(<AnalyticPage />)

        const input = screen.getByTestId('analytic-input')
        expect(input).toHaveAttribute('accept', '.csv')

        const csvFile = new File([mockCsvContent], 'test.csv', {
            type: 'text/csv',
        })

        const txtFile = new File(['aaaaaaa'], 'test.txt', {
            type: 'text/plain',
        })

        await user.upload(input, csvFile)
        expect(mockAddFile).toHaveBeenCalledWith(csvFile)

        vi.clearAllMocks()

        await user.upload(input, txtFile)
        expect(mockAddFile).not.toHaveBeenCalled()
    })

    test('инпут не принимает когда есть загруженный файл', async () => {
        const mockUseFileStore = useFileStore as unknown as ReturnType<typeof vi.fn>
        mockUseFileStore.mockReturnValue({
            file: new File([mockCsvContent], 'test.csv', { type: 'text/csv' }),
        })

        const user = userEvent.setup()

        render(<AnalyticPage />)

        const input = screen.getByTestId('analytic-input')
        expect(input).toHaveAttribute('accept', '.csv')

        const anotherCsvFile = new File([mockCsvContent], 'test1.csv', {
            type: 'text/csv',
        })

        await user.upload(input, anotherCsvFile)
        expect(mockAddFile).not.toHaveBeenCalled()
    })

    test('drag & drop принимает только csv файлы', () => {
        render(<AnalyticPage />)

        const dropZone = screen.getByTestId('analytic-upload-space')

        const csvFile = new File([mockCsvContent], 'test.csv', {
            type: 'text/csv',
        })

        const txtFile = new File(['aaaaaaa'], 'test.txt', {
            type: 'text/plain',
        })

        const csvDropEvent = {
            preventDefault: vi.fn(),
            stopPropagation: vi.fn(),
            dataTransfer: {
                files: [csvFile],
            },
        } as unknown as React.DragEvent<HTMLDivElement>

        fireEvent.drop(dropZone!, csvDropEvent)
        expect(mockAddFile).toHaveBeenCalledWith(csvFile)

        vi.clearAllMocks()

        const txtDropEvent = {
            preventDefault: vi.fn(),
            stopPropagation: vi.fn(),
            dataTransfer: {
                files: [txtFile],
            },
        } as unknown as React.DragEvent<HTMLDivElement>

        fireEvent.drop(dropZone!, txtDropEvent)
        expect(mockAddFile).not.toHaveBeenCalled()
    })

    test('drag & drop не принимает файлы когда уже есть загруженный файл', () => {
        const mockUseFileStore = useFileStore as unknown as ReturnType<typeof vi.fn>
        mockUseFileStore.mockReturnValue({
            file: new File([mockCsvContent], 'test.csv', { type: 'text/csv' }),
        })

        render(<AnalyticPage />)

        const dropZone = screen.getByTestId('analytic-upload-space')

        const csvFile = new File([mockCsvContent], 'test.csv', {
            type: 'text/csv',
        })

        const dropEvent = {
            preventDefault: vi.fn(),
            stopPropagation: vi.fn(),
            dataTransfer: {
                files: [csvFile],
            },
        } as unknown as React.DragEvent<HTMLDivElement>

        fireEvent.drop(dropZone!, dropEvent)
        expect(mockAddFile).not.toHaveBeenCalled()
    })

    test('отображается загруженный файл', () => {
        const csvFile = new File([mockCsvContent], 'test.csv', {
            type: 'text/csv',
        })

        const mockUseFileStore = useFileStore as unknown as ReturnType<typeof vi.fn>
        mockUseFileStore.mockReturnValue({
            file: csvFile,
        })

        render(<AnalyticPage />)

        expect(screen.getByText('test.csv')).toBeInTheDocument()
        expect(screen.getByText('файл загружен!')).toBeInTheDocument()
        expect(screen.getByTestId('analytic-clear-button')).toBeInTheDocument()
        expect(screen.getByTestId('analytic-submit-button')).toBeEnabled()
    })

    test('отправляется файл на анализ', () => {
        const csvFile = new File([mockCsvContent], 'test.csv', {
            type: 'text/csv',
        })

        const mockUseFileStore = useFileStore as unknown as ReturnType<typeof vi.fn>
        mockUseFileStore.mockReturnValue({
            file: csvFile,
            setIsLoading: mockSetIsLoading,
            setIsError: mockSetIsError,
        })

        render(<AnalyticPage />)

        const submitButton = screen.getByTestId('analytic-submit-button')

        fireEvent.click(submitButton)

        expect(mockSetIsLoading).toHaveBeenCalled()
    })

    test('отображается лоадер при загрузке файла', () => {
        const csvFile = new File([mockCsvContent], 'test.csv', {
            type: 'text/csv',
        })

        const mockUseFileStore = useFileStore as unknown as ReturnType<typeof vi.fn>
        mockUseFileStore.mockReturnValue({
            file: csvFile,
            isLoading: true,
        })

        render(<AnalyticPage />)

        expect(screen.getByText('идёт парсинг файла')).toBeInTheDocument()
        expect(screen.getByTestId('loader')).toBeInTheDocument()
        expect(screen.queryByTestId('analytic-submit-button')).not.toBeInTheDocument()
    })

    test('отображается ошибка загрузки файла', () => {
        const csvFile = new File([mockCsvContent], 'test.csv', {
            type: 'text/csv',
        })

        const mockUseFileStore = useFileStore as unknown as ReturnType<typeof vi.fn>
        mockUseFileStore.mockReturnValue({
            file: csvFile,
            isError: true,
        })

        render(<AnalyticPage />)

        expect(screen.getByText('упс, не то...')).toBeInTheDocument()
        expect(screen.queryByTestId('analytic-submit-button')).not.toBeInTheDocument()
    })

    test('загрузка завершилась успешно', () => {
        const csvFile = new File([mockCsvContent], 'test.csv', {
            type: 'text/csv',
        })

        const mockUseFileStore = useFileStore as unknown as ReturnType<typeof vi.fn>
        mockUseFileStore.mockReturnValue({
            file: csvFile,
            isCompleted: true,
        })

        render(<AnalyticPage />)

        expect(screen.getByText('готово!')).toBeInTheDocument()
        expect(screen.getByTestId('analytic-clear-button')).toBeInTheDocument()
        expect(screen.queryByTestId('analytic-submit-button')).not.toBeInTheDocument()
    })

    test('переход в начальное состояние при очистке файла при ошибке', () => {
        const csvFile = new File([mockCsvContent], 'test.csv', {
            type: 'text/csv',
        })

        const mockUseFileStore = useFileStore as unknown as ReturnType<typeof vi.fn>
        mockUseFileStore.mockReturnValue({
            file: csvFile,
            isError: true,
            clearFile: mockClearFile,
        })

        render(<AnalyticPage />)

        const clearButton = screen.getByTestId('analytic-clear-button')

        fireEvent.click(clearButton)

        expect(mockClearFile).toHaveBeenCalled()
    })

    test('переход в начальное состояние при загруженом файле', () => {
        const csvFile = new File([mockCsvContent], 'test.csv', {
            type: 'text/csv',
        })

        const mockUseFileStore = useFileStore as unknown as ReturnType<typeof vi.fn>
        mockUseFileStore.mockReturnValue({
            file: csvFile,
            clearFile: mockClearFile,
        })

        render(<AnalyticPage />)

        const clearButton = screen.getByTestId('analytic-clear-button')

        fireEvent.click(clearButton)

        expect(mockClearFile).toHaveBeenCalled()
    })

    test('переход в начальное состояние при очистке файла при успешном анализе', () => {
        const csvFile = new File([mockCsvContent], 'test.csv', {
            type: 'text/csv',
        })

        const mockUseFileStore = useFileStore as unknown as ReturnType<typeof vi.fn>
        mockUseFileStore.mockReturnValue({
            file: csvFile,
            isCompleted: true,
            clearFile: mockClearFile,
        })

        render(<AnalyticPage />)

        const clearButton = screen.getByTestId('analytic-clear-button')

        fireEvent.click(clearButton)

        expect(mockClearFile).toHaveBeenCalled()
    })
})
