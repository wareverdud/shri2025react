import type { IStats } from './store/types'

export const statsMap: Array<{
    id: keyof IStats
    text: string
    type: 'number' | 'date' | 'string'
}> = [
    { id: 'total_spend_galactic', text: 'общие расходы в галактических кредитах', type: 'number' },
    { id: 'less_spent_civ', text: 'цивилизация с минимальными расходами', type: 'string' },
    { id: 'rows_affected', text: 'количество обработанных записей', type: 'number' },
    { id: 'big_spent_at', text: 'день года с максимальными расходами', type: 'date' },
    { id: 'less_spent_at', text: 'день года с минимальными расходами', type: 'date' },
    { id: 'big_spent_value', text: 'максимальная сумма расходов за день', type: 'number' },
    { id: 'big_spent_civ', text: 'цивилизация с максимальными расходами', type: 'string' },
    {
        id: 'average_spend_galactic',
        text: 'средние расходы в галактических кредитах',
        type: 'number',
    },
]
