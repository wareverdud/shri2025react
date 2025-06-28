import { createPortal } from 'react-dom'
import styles from './index.module.css'
import { statsMap } from '@/constants'
import type { IStats } from '@/store/types'
import { Button } from '../button'
import { StatisticElement } from '../statisticElement'

export const Modal = ({ record, close }: { record: IStats; close: () => void }) => {
    return createPortal(
        <div className={styles.modalOverlay}>
            <div className={styles.modalWindow}>
                {statsMap.map((item) => (
                    <StatisticElement key={item.id} item={item} stats={record} />
                ))}
            </div>
            <Button clear showIcon onClick={close} dataTestId="modal-close-button" />
        </div>,
        document.body,
    )
}
