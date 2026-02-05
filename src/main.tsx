import React, { useState, useEffect } from 'react'
import ReactDOM from 'react-dom/client'
import { HashRouter, Routes, Route, Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import './i18n/index.ts'
import * as api from '@jimce-music/jimce-api-ts'

import './styles/index.css'
import './styles/error_pages/404_page_not_found.css'

import Sidebar from './components/Sidebar.tsx'
import TopBar from './components/TopBar.tsx'
import { PlayerProvider } from './PlayerContext'

import Dashboard from './pages/Dashboard'
import Music from './pages/Music'
import Podcasts from './pages/Podcasts'
import Audiobooks from './pages/Audiobooks'
import Favorites from './pages/Favorites'
import Recent from './pages/Recent'
import Library from './pages/Library'

import Login from './pages/auth/login.tsx'
import Register from './pages/auth/register.tsx'

import SettingsModal from './modals/SettingsModal.tsx'

import PlayBar from './components/PlayBar.tsx'

//
import './utils/init_api.ts'
//

function App() {
    const [settingsOpen, setSettingsOpen] = useState(false)
    const [isChecking, setIsChecking] = useState(true)
    const [isAuthenticated, setIsAuthenticated] = useState(false)

    useEffect(() => {
        async function initAuth() {
            console.log('DEBUG: Auth-Check gestartet...')
            const token = localStorage.getItem('token')
            const currentHash = window.location.hash
            const isAuthPage =
                currentHash.includes('/auth/login') ||
                currentHash.includes('/auth/register')

            if (!token) {
                if (!isAuthPage) {
                    window.location.hash = '/auth/login'
                }
                setIsChecking(false)
                return
            }

            try {
                // WICHTIG: API für diesen Token konfigurieren
                api.setConfig({
                    headers: { Authorization: `Bearer ${token}` }
                })

                const req = await api.getApiAuthCheckToken()
                if (req.response.status === 200) {
                    setIsAuthenticated(true)
                    // Wenn eingeloggt und auf Login-Seite -> Ab zum Dashboard
                    if (isAuthPage) window.location.hash = '/'
                } else {
                    throw new Error('Invalid Token')
                }
            } catch (err) {
                console.error('DEBUG: Session ungültig', err)
                localStorage.removeItem('token')
                window.location.hash = '/auth/login'
            } finally {
                setIsChecking(false)
            }

            console.log('Auth-Status:', { isChecking, isAuthenticated })
        }

        initAuth()
    }, [])

    // Helfer: Sind wir gerade auf einer Auth-Seite?
    const isAuthPage =
        window.location.hash.includes('/auth/login') ||
        window.location.hash.includes('/auth/register')

    return (
        <HashRouter>
            <SettingsModal
                open={settingsOpen}
                onClose={() => setSettingsOpen(false)}
            />

            <PlayerProvider>
                {/* Sidebar und Bars nur anzeigen, wenn NICHT auf Login/Register-Seite */}
                {!isAuthPage && (
                    <>
                        <Sidebar />
                        <TopBar />
                        <PlayBar />
                    </>
                )}

                <div className={!isAuthPage ? 'app-container' : ''}>
                    <div className={!isAuthPage ? 'pages-container' : ''}>
                        <Routes>
                            <Route path='*' element={<NotFound />} />
                            <Route path='/' element={<Dashboard />} />
                            <Route path='/music' element={<Music />} />
                            <Route path='/podcasts' element={<Podcasts />} />
                            <Route
                                path='/audiobooks'
                                element={<Audiobooks />}
                            />
                            <Route path='/favorites' element={<Favorites />} />
                            <Route path='/recent' element={<Recent />} />
                            <Route path='/library' element={<Library />} />
                            <Route path='/auth/login' element={<Login />} />
                            <Route
                                path='/auth/register'
                                element={<Register />}
                            />
                        </Routes>
                    </div>
                </div>
            </PlayerProvider>
        </HashRouter>
    )
}

function NotFound() {
    const { t } = useTranslation()

    return (
        <div className='page_not_found_container'>
            <h1>{t('NotFound.Title')}</h1>
            <p style={{ fontSize: '18px' }}>{t('NotFound.Message')}</p>
            <Link className='home_button' to='/'>
                {t('NotFound.GoHomeButton')}
            </Link>
        </div>
    )
}

ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <App />
    </React.StrictMode>
)
