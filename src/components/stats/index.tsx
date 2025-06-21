import { useFileStore } from '@/store/file'
import styles from './index.module.css'
import { statsMap } from '@/constants'
import { convertDate } from '@/utils/convertDate'
import { checkNumber } from '@/utils/checkNumber'

export const Stats = () => {
    const { stats, isError } = useFileStore()

    const show = stats && !isError

    return (
        <>
            {!show && <p className={styles.highlight}>Здесь появятся хайлайты</p>}
            {show && (
                <div className={styles.container}>
                    {statsMap.map((item) => (
                        <div className={styles.element} key={item.id}>
                            {item.type === 'date' && <p>{convertDate(String(stats?.[item.id]))}</p>}
                            {item.type === 'number' && checkNumber(stats?.[item.id]) && (
                                <p>{Math.round(Number(stats?.[item.id]))}</p>
                            )}
                            {item.type === 'string' && <p>{stats?.[item.id]}</p>}

                            <span>{item.text}</span>
                        </div>
                    ))}
                </div>
            )}
        </>
    )
}
