import { describe, expect, test, beforeEach } from 'vitest'
import { useFileStore } from '@/store/file'
import type { IStats } from '@/store/types'

const mockCsvContent = 'id,civ,developer_id,date,spend\n1,monsters,3565747052233,103,540'

const mockStats1: IStats = {
    total_spend_galactic: 1000,
    rows_affected: 50,
    less_spent_at: 1,
    big_spent_at: 1,
    less_spent_value: 10,
    big_spent_value: 1000,
    average_spend_galactic: 500,
    big_spent_civ: 'civ',
    less_spent_civ: 'civ2',
}

const mockStats2: IStats = {
    total_spend_galactic: 2000,
    rows_affected: 100,
    less_spent_at: 2,
    big_spent_at: 1,
    less_spent_value: 20,
    big_spent_value: 2000,
    average_spend_galactic: 1000,
    big_spent_civ: 'civ3',
    less_spent_civ: 'civ4',
}

describe('useFileStore', () => {
    beforeEach(() => {
        useFileStore.getState().clearFile()
    })

    test('изначально file null', () => {
        const { file } = useFileStore.getState()
        expect(file).toBeNull()
    })

    test('addFile добавляет файл', () => {
        const mockFile = new File([mockCsvContent], 'test.csv', { type: 'text/csv' })
        const { addFile } = useFileStore.getState()

        addFile(mockFile)

        const { file } = useFileStore.getState()
        expect(file).toBe(mockFile)
        expect(file?.name).toBe('test.csv')
    })

    test('clearFile очищает файл и состояние', () => {
        const mockFile = new File([mockCsvContent], 'test.csv', { type: 'text/csv' })

        const { addFile, setStats, setIsLoading, setIsError, setIsCompleted, clearFile } =
            useFileStore.getState()

        addFile(mockFile)
        setStats(mockStats1)
        setIsLoading(true)
        setIsError(true)
        setIsCompleted(true)

        clearFile()

        const state = useFileStore.getState()
        expect(state.file).toBeNull()
        expect(state.stats).toBeNull()
        expect(state.isLoading).toBe(false)
        expect(state.isError).toBe(false)
        expect(state.isCompleted).toBe(false)
    })

    test('isError изначально false', () => {
        const { isError } = useFileStore.getState()
        expect(isError).toBe(false)
    })

    test('setIsError устанавливает isError', () => {
        const { setIsError } = useFileStore.getState()

        setIsError(true)

        const { isError } = useFileStore.getState()
        expect(isError).toBe(true)
    })

    test('isLoading сбрасывается при isError', () => {
        const { setIsLoading, setIsError } = useFileStore.getState()

        setIsLoading(true)
        setIsError(true)

        const { isError, isLoading } = useFileStore.getState()
        expect(isError).toBe(true)
        expect(isLoading).toBe(false)
    })

    test('isLoading изначально false', () => {
        const { isLoading } = useFileStore.getState()
        expect(isLoading).toBe(false)
    })

    test('setIsLoading устанавливает isLoading', () => {
        const { setIsLoading } = useFileStore.getState()

        setIsLoading(true)

        const { isLoading } = useFileStore.getState()
        expect(isLoading).toBe(true)
    })

    test('isCompleted изначально false', () => {
        const { isCompleted } = useFileStore.getState()
        expect(isCompleted).toBe(false)
    })

    test('setIsCompleted устанавливает isCompleted', () => {
        const { setIsCompleted } = useFileStore.getState()

        setIsCompleted(true)

        const { isCompleted } = useFileStore.getState()
        expect(isCompleted).toBe(true)
    })

    test('isLoading сбрасывается при isCompleted', () => {
        const { setIsLoading, setIsCompleted } = useFileStore.getState()

        setIsLoading(true)
        setIsCompleted(true)

        const { isCompleted, isLoading } = useFileStore.getState()
        expect(isCompleted).toBe(true)
        expect(isLoading).toBe(false)
    })

    test('stats изначально null', () => {
        const { stats } = useFileStore.getState()
        expect(stats).toBeNull()
    })

    test('setStats устанавливает stats', () => {
        const { setStats } = useFileStore.getState()

        setStats(mockStats1)

        const { stats } = useFileStore.getState()
        expect(stats).toEqual(mockStats1)
        expect(stats?.total_spend_galactic).toBe(1000)
        expect(stats?.big_spent_civ).toBe('civ')
    })

    test('setStats заменяет существующие stats', () => {
        const { setStats } = useFileStore.getState()

        setStats(mockStats1)
        setStats(mockStats2)

        const { stats } = useFileStore.getState()
        expect(stats).toEqual(mockStats2)
        expect(stats?.total_spend_galactic).toBe(2000)
        expect(stats?.big_spent_civ).toBe('civ3')
    })
})
