import { create } from 'zustand'
import type { IStats } from './types'

interface RecordsStore {
    records: Array<IStats>
    addRecord: (record: IStats) => void
    clearHistory: () => void
}

const getInitialRecords = () => {
    const records = localStorage.getItem('records')
    if (records) {
        return JSON.parse(records)
    }
    return []
}

export const useRecordsStore = create<RecordsStore>((set) => ({
    records: getInitialRecords(),
    addRecord: (record) =>
        set((state) => {
            const updatedRecords = [...state.records, record]
            localStorage.setItem('records', JSON.stringify(updatedRecords))
            return { records: updatedRecords }
        }),
    clearHistory: () => {
        localStorage.setItem('records', JSON.stringify([]))
        return { records: [] }
    },
}))
