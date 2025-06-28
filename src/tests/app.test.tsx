import { describe, expect, test } from 'vitest'
import { render, screen } from '@testing-library/react'
import { BrowserRouter, MemoryRouter } from 'react-router-dom'
import userEvent from '@testing-library/user-event'
import { App } from '@/app'

const renderApp = () => {
    return render(
        <BrowserRouter>
            <App />
        </BrowserRouter>,
    )
}

const renderAppWithRoute = (route: string) => {
    return render(
        <MemoryRouter initialEntries={[route]}>
            <App />
        </MemoryRouter>,
    )
}

describe('Тесты навигации', () => {
    test('отображение навигационных ссылок', () => {
        renderApp()

        expect(screen.getByText('CSV Аналитик')).toBeInTheDocument()
        expect(screen.getByText('CSV Генератор')).toBeInTheDocument()
        expect(screen.getByText('История')).toBeInTheDocument()
    })

    test('отображается страница аналитики при /', () => {
        renderApp()

        expect(screen.getByTestId('analytic-title')).toBeInTheDocument()
    })

    test('при клике на ссылку генератора происходит переключение страницы на генератор', async () => {
        const user = userEvent.setup()
        renderApp()

        const generatorLink = screen.getByText('CSV Генератор')
        await user.click(generatorLink)

        expect(
            screen.getByText('Сгенерируйте готовый csv-файл нажатием одной кнопки'),
        ).toBeInTheDocument()
        expect(screen.getByText('Начать генерацию')).toBeInTheDocument()
    })

    test('при клике на ссылку истории происходит переключение страницы на историю', async () => {
        const user = userEvent.setup()
        renderApp()

        const historyLink = screen.getByText('История')
        await user.click(historyLink)

        expect(screen.getByText('История операций пуста')).toBeInTheDocument()
        expect(screen.getByText('Сгенерировать больше')).toBeInTheDocument()
        expect(screen.getByText('Очистить всё')).toBeInTheDocument()
    })

    test('при клике на ссылку аналитики с другой страницы происходит переключение страницы на аналитику', async () => {
        const user = userEvent.setup()
        renderApp()

        const generatorLink = screen.getByText('CSV Генератор')
        await user.click(generatorLink)
        expect(
            screen.getByText('Сгенерируйте готовый csv-файл нажатием одной кнопки'),
        ).toBeInTheDocument()

        const analyticLink = screen.getByText('CSV Аналитик')
        await user.click(analyticLink)

        expect(screen.getByTestId('analytic-title')).toBeInTheDocument()
    })

    test('при несуществующей странице выходит заглушка', () => {
        renderAppWithRoute('/aaa/bbb/ccc')

        expect(screen.getByText('Такой страницы нет')).toBeInTheDocument()
    })
})
