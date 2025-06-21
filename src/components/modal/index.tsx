import { createPortal } from 'react-dom'
import styles from './index.module.css'
import { statsMap } from '@/constants'
import type { IStats } from '@/store/types'
import { convertDate } from '@/utils/convertDate'
import { Button } from '../button'
import { checkNumber } from '@/utils/checkNumber'

export const Modal = ({ record, close }: { record: IStats; close: () => void }) => {
    return createPortal(
        <div className={styles.modalOverlay}>
            <div className={styles.modalWindow}>
                {statsMap.map((item) => (
                    <div className={styles.element} key={item.id}>
                        {item.type === 'date' && <p>{convertDate(String(record?.[item.id]))}</p>}
                        {item.type === 'number' && checkNumber(record?.[item.id]) && (
                            <p>{Math.round(Number(record?.[item.id]))}</p>
                        )}
                        {item.type === 'string' && <p>{record?.[item.id]}</p>}

                        <span>{item.text}</span>
                    </div>
                ))}
            </div>
            <Button clear showIcon onClick={close} />
        </div>,
        document.body,
    )
}
