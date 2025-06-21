import { Button } from '../../components/button'
import { useRecordsStore } from '../../store/history'
import styles from './index.module.css'
import { useNavigate } from 'react-router-dom'
import file from '../../assets/file.svg'
import smile from '../../assets/smile.svg'
import sad from '../../assets/sad.svg'
import trash from '../../assets/trash.svg'
import classNames from 'classnames'
import { useState } from 'react'
import { Modal } from '../../components/modal'
import type { IStats } from '../../store/types'

export const HistoryPage = () => {
    const [record, setRecord] = useState<IStats | null>(null)

    const navigate = useNavigate()
    const { records, clearHistory, deleteRecord } = useRecordsStore()

    return (
        <div className={styles.container}>
            <ul className={styles.history}>
                {records.map((record) => (
                    <li className={styles.rowOutline} key={record.id}>
                        <div
                            className={classNames(
                                styles.row,
                                !record.success && styles.rowDisabled,
                            )}
                            onClick={() => {
                                if (record.success) {
                                    setRecord(record.entry)
                                }
                            }}
                        >
                            <div className={styles.nameColumn}>
                                <img src={file} alt="" />
                                <p className={styles.name}>{record.name}</p>
                            </div>

                            <p>{record.date}</p>

                            <p
                                className={classNames(
                                    styles.status,
                                    !record.success && styles.faint,
                                )}
                            >
                                Обработан успешно <img src={smile} alt="" />
                            </p>
                            <p
                                className={classNames(
                                    styles.status,
                                    record.success && styles.faint,
                                )}
                            >
                                Не удалось обработать <img src={sad} alt="" />
                            </p>
                        </div>

                        <button
                            className={styles.trashWrapper}
                            onClick={() => deleteRecord(record.id)}
                        >
                            <img src={trash} alt="" />
                        </button>
                    </li>
                ))}
            </ul>

            {records.length === 0 && <p className={styles.empty}>История операций пуста</p>}

            <div className={styles.buttons}>
                <Button onClick={() => navigate('/generator')}>Сгенерировать больше</Button>
                <Button onClick={() => clearHistory()} clear>
                    Очистить всё
                </Button>
            </div>

            {!!record && <Modal record={record} close={() => setRecord(null)} />}
        </div>
    )
}
