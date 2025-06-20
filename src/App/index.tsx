import { Route, Link, Routes, useLocation } from 'react-router-dom'
import logoUrl from '../assets/logo.svg'
import upload from '../assets/upload.svg'
import generator from '../assets/generator.svg'
import history from '../assets/history.svg'
import { EmptyPage } from '../pages/empty-page'
import classNames from 'classnames'
import styles from './index.module.css'

const links = ['/generator', '/history', '/']

export const App = () => {
    const { pathname } = useLocation()

    const activeTabIdx = links.findIndex((link) => pathname.match(link))

    return (
        <div>
            <nav className={styles.navbar}>
                <div className={styles.title}>
                    <img src={logoUrl} alt="" />
                    <p>МЕЖГАЛАКТИЧЕСКАЯ АНАЛИТИКА</p>
                </div>

                <ul className={styles.links}>
                    <li>
                        <Link
                            to="/"
                            className={classNames(styles.link, activeTabIdx === 2 && styles.active)}
                        >
                            <img src={upload} alt="" />
                            <span>CSV Аналитик</span>
                        </Link>
                    </li>
                    <li>
                        <Link
                            to="/generator"
                            className={classNames(styles.link, activeTabIdx === 0 && styles.active)}
                        >
                            <img src={generator} alt="" />
                            <span>CSV Генератор</span>
                        </Link>
                    </li>
                    <li>
                        <Link
                            to="/history"
                            className={classNames(styles.link, activeTabIdx === 1 && styles.active)}
                        >
                            <img src={history} alt="" />
                            <span>История</span>
                        </Link>
                    </li>
                </ul>
            </nav>

            <main className={styles.content}>
                <Routes>
                    <Route path="/" element={<div>CSV Аналитик</div>} />
                    <Route path="/generator" element={<div>CSV Генератор</div>} />
                    <Route path="/history" element={<div>История</div>} />
                    <Route path="*" element={<EmptyPage />} />
                </Routes>
            </main>
        </div>
    )
}
