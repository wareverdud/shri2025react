import { useState } from 'react'
import styles from './index.module.css'
import loader from '@/assets/loading.svg'
import { generateFile } from '@/api'
import { Button } from '@/components/button'

export const GeneratorPage = () => {
    const [isLoading, setIsLoading] = useState(false)
    const [isCompleted, setIsCompleted] = useState(false)
    const [isError, setIsError] = useState(false)

    return (
        <div className={styles.container}>
            <p>Сгенерируйте готовый csv-файл нажатием одной кнопки</p>
            {!isLoading && !isCompleted && !isError && (
                <Button
                    onClick={() => {
                        setIsLoading(true)
                        generateFile()
                            .then(() => setIsCompleted(true))
                            .catch(() => setIsError(true))
                            .finally(() => setIsLoading(false))
                    }}
                >
                    Начать генерацию
                </Button>
            )}
            {isLoading && (
                <>
                    <Button purple className={styles.loaderButton}>
                        <img src={loader} alt="" />
                    </Button>
                    <span>идёт процесс генерации</span>
                </>
            )}
            {isCompleted && (
                <>
                    <div className={styles.clearableButtonContainer}>
                        <Button completed>Done!</Button>
                        <Button
                            clear
                            showIcon
                            onClick={() => {
                                setIsLoading(false)
                                setIsError(false)
                                setIsCompleted(false)
                            }}
                        />
                    </div>
                    <span>файл сгенерирован!</span>
                </>
            )}
            {isError && (
                <>
                    <div className={styles.clearableButtonContainer}>
                        <Button error>Ошибка</Button>
                        <Button
                            clear
                            showIcon
                            onClick={() => {
                                setIsLoading(false)
                                setIsError(false)
                                setIsCompleted(false)
                            }}
                        />
                    </div>
                    <span className={styles.errorText}>упс, не то...</span>
                </>
            )}
        </div>
    )
}
