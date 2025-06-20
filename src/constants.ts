import type { IStats } from './store/types'

export const statsMap: Array<{ id: keyof IStats; text: string }> = [
    { id: 'total_spend_galactic', text: 'общие расходы в галактических кредитах' },
    { id: 'less_spent_civ', text: 'цивилизация с минимальными расходами' },
    { id: 'rows_affected', text: 'количество обработанных записей' },
    { id: 'big_spent_at', text: 'день года с максимальными расходами' },
    { id: 'less_spent_at', text: 'день года с минимальными расходами' },
    { id: 'big_spent_value', text: 'максимальная сумма расходов за день' },
    { id: 'big_spent_civ', text: 'цивилизация с максимальными расходами' },
    { id: 'average_spend_galactic', text: 'средние расходы в галактических кредитах' },
]
