import { test, expect } from '@playwright/test'

test('скачивание файла после генерации', async ({ page }) => {
    await page.goto('/generator')

    await page.waitForSelector('[data-testid="generate-button"]')

    const downloadEvent = page.waitForEvent('download')

    await page.click('[data-testid="generate-button"]')

    await page.waitForSelector('text=идёт процесс генерации', { timeout: 1000 })

    await page.waitForSelector('text=файл сгенерирован!')

    const download = await downloadEvent

    expect(download.suggestedFilename()).toBe('report.csv')
})
