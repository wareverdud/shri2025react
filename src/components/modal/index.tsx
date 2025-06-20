import { createPortal } from 'react-dom'
import styles from './index.module.css'
import type { IStats } from '../../store/types'
import { Button } from '../button'
import { statsMap } from '../../constants'
import { convertDate } from '../../utils/convertDate'

export const Modal = ({ record, close }: { record: IStats; close: () => void }) => {
    return createPortal(
        <div className={styles.modalOverlay}>
            <div className={styles.modalWindow}>
                {statsMap.map((item) => (
                    <div className={styles.element} key={item.id}>
                        {['big_spent_at', 'less_spent_at'].includes(item.id) ? (
                            <p>{convertDate(String(record?.[item.id]))}</p>
                        ) : (
                            <p>{record?.[item.id]}</p>
                        )}

                        <span>{item.text}</span>
                    </div>
                ))}
            </div>
            <Button clear showIcon onClick={close} />
        </div>,
        document.body,
    )
}
