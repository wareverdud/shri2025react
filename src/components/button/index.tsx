import classNames from 'classnames'
import styles from './index.module.css'
import xMark from '@/assets/x-mark.svg'

export const Button = ({
    children,
    className,
    clear = false,
    disabled = false,
    purple = false,
    completed = false,
    error = false,
    showIcon = false,
    onClick,
}: {
    children?: React.ReactNode
    className?: string
    clear?: boolean
    disabled?: boolean
    purple?: boolean
    completed?: boolean
    error?: boolean
    showIcon?: boolean
    onClick?: React.MouseEventHandler<HTMLButtonElement>
}) => {
    return (
        <button
            className={classNames(
                styles.button,
                disabled && styles.disabled,
                clear && styles.clear,
                purple && styles.purple,
                completed && styles.completed,
                error && styles.error,
                showIcon && styles.showIcon,
                className,
            )}
            type="button"
            disabled={disabled}
            onClick={onClick}
        >
            {children}
            {clear && showIcon && <img src={xMark} alt="" />}
        </button>
    )
}
