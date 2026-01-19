import React, { useState } from 'react'
import ReactDOM from 'react-dom/client'
import { HashRouter, Routes, Route, Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import './i18n/index.ts'

import './styles/index.css'
import './styles/error_pages/404_page_not_found.css'

import Sidebar from './components/Sidebar.tsx'
import { closeSettingsModal } from './components/Sidebar.tsx'
import TopBar from './components/TopBar.tsx'
import { PlayerProvider } from './PlayerContext'

import Dashboard from './pages/Dashboard'
import Music from './pages/Music'
import Podcasts from './pages/Podcasts'
import Audiobooks from './pages/Audiobooks'
import Favorites from './pages/Favorites'
import Recent from './pages/Recent'
import Library from './pages/Library'

import SettingsModal from './modals/SettingsModal.tsx'

//
import './init_api'
import PlayBar from './components/PlayBar.tsx'
//
function App() {
  const [settingsOpen, setSettingsOpen] = useState(false);

  function checkSettingsModal() {
    if (settingsOpen !== null) {
      if (settingsOpen === false) {
        closeSettingsModal();
      }
      else {
        return
      }
    }
  }
  
  return (
    <HashRouter>
      <SettingsModal open={settingsOpen} onClose={() => {setSettingsOpen(false); checkSettingsModal()}} />
      <div>
        <PlayerProvider>
          <Sidebar />
          <TopBar />
          <PlayBar />
          <div className='app-container'>
            <div className='pages-container'>
              <Routes>
                <Route path='*' element={<NotFound />} />
                <Route path="/" element={<Dashboard />} />
                <Route path="/music" element={<Music />} />
                <Route path="/podcasts" element={<Podcasts />} />
                <Route path="/audiobooks" element={<Audiobooks />} />
                <Route path="/favorites" element={<Favorites />} />
                <Route path="/recent" element={<Recent />} />
                <Route path="/library" element={<Library />} />
              </Routes>
            </div>
          </div>
        </PlayerProvider>
      </div>
    </HashRouter>
  )
}

function NotFound() {
  const { t } = useTranslation();

  return (
    <div className='page_not_found_container'>
      <h1>{t("NotFound.Title")}</h1>
      <p style={{fontSize: "18px"}}>{t("NotFound.Message")}</p>
      <Link
        className='home_button'
        to="/"
      >
        {t("NotFound.GoHomeButton")}
      </Link>
    </div>
  )
}

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);