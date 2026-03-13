import { useState } from 'react'
import { useTranslation } from 'react-i18next';

import AccountSection from './settings/sections/AccountSection';
import DesignSection from './settings/sections/DesignSection';
import LanguageSection from './settings/sections/LanguageSection';
import AutoplaySection from './settings/sections/AutoplaySection';
import CrossfadeSection from './settings/sections/CrossfadeSection';
import DownloadsSection from './settings/sections/DownloadsSection';

import '../styles/modals/SettingsModal.css'

interface Props {
    open: boolean
    onClose: () => void
}

type SettingsSection =
    | 'account'
    | 'design'
    | 'language'
    | 'autoplay'
    | 'crossfade'
    | 'downloads'

const sectionElementIds: Record<SettingsSection, string> = {
    account: 'settings-section-account',
    design: 'settings-section-design',
    language: 'settings-section-language',
    autoplay: 'settings-section-autoplay',
    crossfade: 'settings-section-crossfade',
    downloads: 'settings-section-downloads'
}

export default function SettingsModal({ open, onClose }: Props) {
    const { t } = useTranslation()
    const [activeSection, setActiveSection] = useState<SettingsSection>('account')

    const scrollToSection = (section: SettingsSection) => {
        const sectionElement = document.getElementById(sectionElementIds[section])
        if (!sectionElement) {
            return
        }

        setActiveSection(section)
        sectionElement.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }

    const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
        if (e.target === e.currentTarget) {
            onClose()
        }
    }

    return (
        <div
            className={`settings-modal-backdrop ${open ? 'active' : ''}`}
            onClick={handleBackdropClick}
        >
            <div
                className={`settings-modal ${open ? 'active' : ''}`}
            >
                <div className='settings-sidebar'>
                    <div className='settings-sidebar-top'>
                        <a className='settings-sidebar-title' style={{borderTop: 'none', paddingTop: 0}}>{t("SettingsModal.sidebar.general")}</a>
                        <button
                            type='button'
                            className={`settings-sidebar-option settings-sidebar-option-button ${
                                activeSection === 'account' ? 'active' : ''
                            }`}
                            onClick={() => scrollToSection('account')}
                        >
                            {t("SettingsModal.sidebar.account")}
                        </button>
                        <button
                            type='button'
                            className={`settings-sidebar-option settings-sidebar-option-button ${
                                activeSection === 'design' ? 'active' : ''
                            }`}
                            onClick={() => scrollToSection('design')}
                        >
                            {t("SettingsModal.sidebar.design")}
                        </button>
                        <button
                            type='button'
                            className={`settings-sidebar-option settings-sidebar-option-button ${
                                activeSection === 'language' ? 'active' : ''
                            }`}
                            onClick={() => scrollToSection('language')}
                        >
                            {t("SettingsModal.sidebar.language")}
                        </button>

                        <div className='settings-sidebar-title'>{t("SettingsModal.sidebar.playback")}</div>
                        <button
                            type='button'
                            className={`settings-sidebar-option settings-sidebar-option-button ${
                                activeSection === 'autoplay' ? 'active' : ''
                            }`}
                            onClick={() => scrollToSection('autoplay')}
                        >
                            {t("SettingsModal.sidebar.autoplay")}
                        </button>
                        <button
                            type='button'
                            className={`settings-sidebar-option settings-sidebar-option-button ${
                                activeSection === 'crossfade' ? 'active' : ''
                            }`}
                            onClick={() => scrollToSection('crossfade')}
                        >
                            {t("SettingsModal.sidebar.crossfade")}
                        </button>

                        <div className='settings-sidebar-title'>{t("SettingsModal.sidebar.library")}</div>
                        <button
                            type='button'
                            className={`settings-sidebar-option settings-sidebar-option-button ${
                                activeSection === 'downloads' ? 'active' : ''
                            }`}
                            onClick={() => scrollToSection('downloads')}
                        >
                            {t("SettingsModal.sidebar.downloads")}
                        </button>
                    </div>

                    <div className='settings-sidebar-bottom'>
                        <a
                            href='https://github.com/Jimce-Music/jimce.git'
                            className='settings-sidebar-option'
                        >
                            {t("SettingsModal.sidebar.aboutJimce")}
                        </a>
                        <a
                            href='https://github.com/Jimce-Music/jimce-webclient/issues'
                            className='settings-sidebar-option'
                        >
                            {t("SettingsModal.sidebar.help")}
                        </a>
                    </div>
                </div>
                <div className='settings-content'>
                    <div id={sectionElementIds.account} className='settings-content-component'>
                        <h2 className='settings-content-title'>{t("SettingsModal.content.account")}</h2>
                        <AccountSection />
                    </div>
                    <div id={sectionElementIds.design} className='settings-content-component'>
                        <h2 className='settings-content-title'>{t("SettingsModal.content.design")}</h2>
                        <DesignSection />
                    </div>
                    <div id={sectionElementIds.language} className='settings-content-component'>
                        <h2 className='settings-content-title'>{t("SettingsModal.content.language")}</h2>
                        <LanguageSection />
                    </div>
                    <div id={sectionElementIds.autoplay} className='settings-content-component'>
                        <h2 className='settings-content-title'>{t("SettingsModal.content.autoplay")}</h2>
                        <AutoplaySection />
                    </div>
                    <div id={sectionElementIds.crossfade} className='settings-content-component'>
                        <h2 className='settings-content-title'>{t("SettingsModal.content.crossfade")}</h2>
                        <CrossfadeSection />
                    </div>
                    <div id={sectionElementIds.downloads} className='settings-content-component'>
                        <h2 className='settings-content-title'>{t("SettingsModal.content.downloads")}</h2>
                        <DownloadsSection />
                    </div>
                </div>
            </div>
        </div>
    )
}
