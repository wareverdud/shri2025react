import { create } from 'zustand'
import type { IRecord } from './types'

interface RecordsStore {
    records: Array<IRecord>
    addRecord: (record: IRecord) => void
    clearHistory: () => void
    deleteRecord: (id: number) => void
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
    clearHistory: () =>
        set(() => {
            localStorage.setItem('records', JSON.stringify([]))
            return { records: [] }
        }),

    deleteRecord: (id) =>
        set((state) => {
            const updatedRecords = state.records.filter((record) => record.id !== id)
            localStorage.setItem('records', JSON.stringify(updatedRecords))
            return { records: updatedRecords }
        }),
}))
