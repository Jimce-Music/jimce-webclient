import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { useTranslation } from 'react-i18next';
import './i18n/index.ts'

import './styles/index.css'
import './styles/error_pages/404_page_not_found.css'

import Home from './pages/Dashboard'
import Sidebar from './components/Sidebar/Sidebar';

function App() {
  return (
    <BrowserRouter>
      <Sidebar />
      <div className='app-container'>
        <Routes>
          <Route path='*' element={<NotFound />} />
          <Route path="/" element={<Home />} />
        </Routes>
      </div>
    </BrowserRouter>
  )
}

function NotFound() {
  const { t } = useTranslation();

  return (
    <div className='page_not_found_container'>
      <h1>{t("NotFound.Title")}</h1>
      <p style={{fontSize: "18px"}}>{t("NotFound.Message")}</p>
      <button
        className='home_button'
        onClick={() => { window.location.href = '/' }}
      >
        {t("NotFound.GoHomeButton")}
      </button>
    </div>
  )
}

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);