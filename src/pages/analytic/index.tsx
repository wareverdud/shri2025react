import { useRef, useState } from 'react'
import classNames from 'classnames'
import styles from './index.module.css'
import { Button } from '../../components/button'
import { useFileStore } from '../../store/file'
import { sendFormData } from '../../api'
import { Stats } from '../../components/stats'
import { useRecordsStore } from '../../store/history'
import { getCurrentDate } from '../../utils/getDate'

export const AnalyticPage = () => {
    const {
        file,
        addFile,
        clearFile,
        setStats,
        setIsLoading,
        isLoading,
        setIsError,
        isError,
        isCompleted,
        setIsCompleted,
    } = useFileStore()
    const { addRecord } = useRecordsStore()

    const [dragging, setDragging] = useState(false)
    const inputRef = useRef<HTMLInputElement | null>(null)

    const handleDrop = (e: React.DragEvent) => {
        if (file) {
            return
        }
        const newFile = e.dataTransfer.files?.[0]
        if (newFile) {
            if (newFile.type !== 'text/csv') {
                setIsError(true)
            }
            addFile(newFile)
        }
    }

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (file) {
            return
        }
        const newFile = e.target.files?.[0]
        if (newFile) {
            if (newFile.type !== 'text/csv') {
                setIsError(true)
            }
            addFile(newFile)
        }
    }

    return (
        <div className={styles.container}>
            <div className={styles.uploader}>
                <p className={styles.title}>
                    Загрузите <span>csv</span> файл и получите <span>полную информацию</span> о нём
                    за сверхнизкое время
                </p>

                <div
                    className={classNames(
                        styles.uploadSpace,
                        dragging && styles.dragging,
                        Boolean(file) && styles.withFile,
                        isError && styles.hasError,
                    )}
                    onDragEnter={(e) => {
                        e.preventDefault()
                        e.stopPropagation()
                        setDragging(true)
                    }}
                    onDragOver={(e) => {
                        e.preventDefault()
                        e.stopPropagation()
                        setDragging(true)
                    }}
                    onDragLeave={(e) => {
                        e.preventDefault()
                        e.stopPropagation()
                        setDragging(false)
                    }}
                    onDrop={(e) => {
                        e.preventDefault()
                        e.stopPropagation()
                        setDragging(false)
                        handleDrop(e)
                    }}
                >
                    <input
                        ref={inputRef}
                        type="file"
                        className={styles.fileInput}
                        onChange={handleFileSelect}
                    />
                    <div className={styles.content}>
                        {!file && (
                            <>
                                <button
                                    className={styles.uploadButton}
                                    onClick={() => inputRef.current?.click()}
                                >
                                    Загрузить файл
                                </button>
                                <p className={styles.hintText}>или перетащите сюда</p>
                            </>
                        )}
                        {file && isLoading && (
                            <>
                                <Button purple>{file.name}</Button>
                                <p className={styles.hintText}>идёт парсинг файла</p>
                            </>
                        )}
                        {file && !isCompleted && !isError && !isLoading && (
                            <>
                                <div className={styles.clearableButtonContainer}>
                                    <Button purple>{file.name}</Button>
                                    <Button
                                        clear
                                        onClick={() => {
                                            clearFile()
                                            if (inputRef.current) {
                                                inputRef.current.value = ''
                                            }
                                        }}
                                    />
                                </div>
                                <p className={styles.hintText}>файл загружен!</p>
                            </>
                        )}
                        {file && isCompleted && (
                            <>
                                <div className={styles.clearableButtonContainer}>
                                    <Button completed>{file.name}</Button>
                                    <Button
                                        clear
                                        onClick={() => {
                                            clearFile()
                                            if (inputRef.current) {
                                                inputRef.current.value = ''
                                            }
                                        }}
                                    />
                                </div>
                                <p className={styles.hintText}>готово!</p>
                            </>
                        )}
                        {file && isError && (
                            <>
                                <div className={styles.clearableButtonContainer}>
                                    <Button error>{file.name}</Button>
                                    <Button
                                        clear
                                        onClick={() => {
                                            clearFile()
                                            if (inputRef.current) {
                                                inputRef.current.value = ''
                                            }
                                        }}
                                    />
                                </div>
                                <p className={styles.errorText}>упс, не то...</p>
                            </>
                        )}
                    </div>
                </div>

                {!isLoading && !isCompleted && !isError && (
                    <Button
                        disabled={!file}
                        onClick={() => {
                            if (file) {
                                setIsLoading(true)
                                sendFormData(
                                    file,
                                    10000,
                                    (obj) => {
                                        setStats(obj)
                                    },
                                    (obj) => {
                                        setIsCompleted(true)
                                        addRecord({ ...obj, date: getCurrentDate() })
                                    },
                                ).catch(() => setIsError(true))
                            }
                        }}
                    >
                        Отправить
                    </Button>
                )}
            </div>

            <Stats />
        </div>
    )
}
