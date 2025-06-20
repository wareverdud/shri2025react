import { create } from 'zustand'
import type { IStats } from './types'

interface FileStore {
    file: File | null
    addFile: (newFile: File) => void
    clearFile: () => void

    isError: boolean
    setIsError: (value: boolean) => void

    isLoading: boolean
    setIsLoading: (value: boolean) => void

    isCompleted: boolean
    setIsCompleted: (value: boolean) => void

    stats: IStats | null
    setStats: (newStats: IStats) => void
}

export const useFileStore = create<FileStore>((set) => ({
    file: null,
    addFile: (newFile: File) => set((state) => ({ ...state, file: newFile })),
    clearFile: () =>
        set((state) => ({
            ...state,
            file: null,
            stats: null,
            isCompleted: false,
            isError: false,
            isLoading: false,
        })),

    isError: false,
    setIsError: (value: boolean) =>
        set((state) => ({ ...state, isError: value, isLoading: false })),

    isLoading: false,
    setIsLoading: (value: boolean) => set((state) => ({ ...state, isLoading: value })),

    isCompleted: false,
    setIsCompleted: (value: boolean) =>
        set((state) => ({ ...state, isCompleted: value, isLoading: false })),

    stats: null,
    setStats: (newStats: IStats) => set((state) => ({ ...state, stats: newStats })),
}))
