export interface IStats {
    total_spend_galactic: number
    rows_affected: number
    less_spent_at: number
    big_spent_at: number
    less_spent_value: number
    big_spent_value: number
    average_spend_galactic: number
    big_spent_civ: string
    less_spent_civ: string
}

export interface IRecord {
    name: string
    date: string
    success: boolean
    id: number
    entry: IStats | null
}
