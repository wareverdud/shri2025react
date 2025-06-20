import { useFileStore } from '../../store/file'
import type { IStats } from '../../store/types'
import { convertDate } from '../../utils/convertDate'
import styles from './index.module.css'

const statsMap: Array<{ id: keyof IStats; text: string }> = [
    { id: 'total_spend_galactic', text: 'общие расходы в галактических кредитах' },
    { id: 'less_spent_civ', text: 'цивилизация с минимальными расходами' },
    { id: 'rows_affected', text: 'количество обработанных записей' },
    { id: 'big_spent_at', text: 'день года с максимальными расходами' },
    { id: 'less_spent_at', text: 'день года с минимальными расходами' },
    { id: 'big_spent_value', text: 'максимальная сумма расходов за день' },
    { id: 'big_spent_civ', text: 'цивилизация с максимальными расходами' },
    { id: 'average_spend_galactic', text: 'средние расходы в галактических кредитах' },
]

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
