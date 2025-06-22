import { useFileStore } from '@/store/file'
import styles from './index.module.css'
import { statsMap } from '@/constants'
import { StatisticElement } from '../statisticElement'

export const Stats = () => {
    const { stats, isError } = useFileStore()

    const show = stats && !isError

    return (
        <>
            {!show && <p className={styles.highlight}>Здесь появятся хайлайты</p>}
            {show && (
                <div className={styles.container}>
                    {statsMap.map((item) => (
                        <StatisticElement key={item.id} item={item} stats={stats} white />
                    ))}
                </div>
            )}
        </>
    )
}
