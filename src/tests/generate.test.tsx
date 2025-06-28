import { GeneratorPage } from '@/pages/generator'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, test, vi, beforeEach } from 'vitest'
import * as api from '@/api'

vi.mock('@/api', () => ({
    generateFile: vi.fn(() => new Promise((resolve) => setTimeout(resolve, 1000))),
}))

describe('Тесты генерации', () => {
    beforeEach(() => {
        vi.clearAllMocks()
    })

    test('начальная страница генерации', () => {
        render(<GeneratorPage />)

        expect(
            screen.getByText('Сгенерируйте готовый csv-файл нажатием одной кнопки'),
        ).toBeInTheDocument()
        expect(screen.getByText('Начать генерацию')).toBeInTheDocument()
    })

    test('нажатие на кнопку генерации', async () => {
        const user = userEvent.setup()
        const mockGenerateFile = vi.mocked(api.generateFile)

        render(<GeneratorPage />)

        const generateButton = screen.getByTestId('generate-button')
        await user.click(generateButton)

        expect(screen.getByText('идёт процесс генерации')).toBeInTheDocument()
        expect(screen.queryByTestId('generate-button')).not.toBeInTheDocument()

        expect(mockGenerateFile).toHaveBeenCalledTimes(1)
    })

    test('успешная генерация файла', async () => {
        const user = userEvent.setup()
        const mockGenerateFile = vi.mocked(api.generateFile)
        mockGenerateFile.mockResolvedValue(undefined)

        render(<GeneratorPage />)

        const generateButton = screen.getByTestId('generate-button')
        await user.click(generateButton)

        expect(screen.getByText('файл сгенерирован!')).toBeInTheDocument()
        expect(screen.getByText('Done!')).toBeInTheDocument()
        expect(screen.getByTestId('clear-button')).toBeInTheDocument()
    })

    test('ошибка при генерации файла', async () => {
        const user = userEvent.setup()
        const mockGenerateFile = vi.mocked(api.generateFile)
        mockGenerateFile.mockRejectedValue(new Error())

        render(<GeneratorPage />)

        const generateButton = screen.getByTestId('generate-button')
        await user.click(generateButton)

        expect(screen.getByText('Ошибка')).toBeInTheDocument()
        expect(screen.getByText('упс, не то...')).toBeInTheDocument()
        expect(screen.getByTestId('clear-button')).toBeInTheDocument()
    })

    test('очистка состояния генерации', async () => {
        const user = userEvent.setup()
        const mockGenerateFile = vi.mocked(api.generateFile)
        mockGenerateFile.mockResolvedValue(undefined)

        render(<GeneratorPage />)

        const generateButton = screen.getByTestId('generate-button')
        await user.click(generateButton)

        expect(screen.getByText('файл сгенерирован!')).toBeInTheDocument()
        expect(screen.getByText('Done!')).toBeInTheDocument()

        const clearButton = screen.getByTestId('clear-button')
        expect(clearButton).toBeInTheDocument()
        await user.click(clearButton)

        expect(
            screen.getByText('Сгенерируйте готовый csv-файл нажатием одной кнопки'),
        ).toBeInTheDocument()
        expect(screen.getByText('Начать генерацию')).toBeInTheDocument()
        expect(screen.queryByText('файл сгенерирован!')).not.toBeInTheDocument()
        expect(screen.queryByText('Done!')).not.toBeInTheDocument()
        expect(screen.queryByTestId('clear-button')).not.toBeInTheDocument()
    })

    test('очистка состояния ошибки', async () => {
        const user = userEvent.setup()
        const mockGenerateFile = vi.mocked(api.generateFile)
        mockGenerateFile.mockRejectedValue(new Error())

        render(<GeneratorPage />)

        const generateButton = screen.getByTestId('generate-button')
        await user.click(generateButton)

        expect(screen.getByText('Ошибка')).toBeInTheDocument()
        expect(screen.getByText('упс, не то...')).toBeInTheDocument()

        const clearButton = screen.getByTestId('clear-button')
        expect(clearButton).toBeInTheDocument()
        await user.click(clearButton)

        expect(
            screen.getByText('Сгенерируйте готовый csv-файл нажатием одной кнопки'),
        ).toBeInTheDocument()
        expect(screen.getByText('Начать генерацию')).toBeInTheDocument()
        expect(screen.queryByText('Ошибка')).not.toBeInTheDocument()
        expect(screen.queryByText('упс, не то...')).not.toBeInTheDocument()
        expect(screen.queryByTestId('clear-button')).not.toBeInTheDocument()
    })
})
