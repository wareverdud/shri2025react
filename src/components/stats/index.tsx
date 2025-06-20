import { statsMap } from '../../constants'
import { useFileStore } from '../../store/file'
import { convertDate } from '../../utils/convertDate'
import styles from './index.module.css'

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
                            {['big_spent_at', 'less_spent_at'].includes(item.id) ? (
                                <p>{convertDate(String(stats?.[item.id]))}</p>
                            ) : (
                                <p>{stats?.[item.id]}</p>
                            )}

                            <span>{item.text}</span>
                        </div>
                    ))}
                </div>
            )}
        </>
    )
}
