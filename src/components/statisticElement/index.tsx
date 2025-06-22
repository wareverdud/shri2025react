import { convertDate } from '@/utils/convertDate'
import styles from './index.module.css'
import type { IStats } from '@/store/types'
import classNames from 'classnames'

interface StatisticElementProps {
    item: {
        id: keyof IStats
        text: string
        type: 'number' | 'date' | 'string'
    }
    stats: IStats
    white?: boolean
}

export const StatisticElement = ({ item, stats, white }: StatisticElementProps) => {
    let titleJsx = null

    const title = stats?.[item.id]
    if (title && typeof title === 'number' && !isNaN(Number(title)) && item.type === 'date') {
        titleJsx = <p>{convertDate(title)}</p>
    }

    if (title && item.type === 'string') {
        titleJsx = <p>{title}</p>
    }

    if (item.type === 'number' && title && typeof title === 'number') {
        titleJsx = <p>{Math.round(title)}</p>
    }

    if (titleJsx === null) {
        titleJsx = <p>-</p>
    }

    return (
        <div className={classNames(styles.element, white && styles.white)} key={item.id}>
            {titleJsx}
            <span>{item.text}</span>
        </div>
    )
}
