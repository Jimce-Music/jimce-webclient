import { useTranslation } from 'react-i18next';

import '../styles/modals/SettingsModal.css'

interface Props {
    open: boolean
    onClose: () => void
}

export default function SettingsModal({ open, onClose }: Props) {
    const { t } = useTranslation()
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
                        <a className='settings-sidebar-option active'>{t("SettingsModal.sidebar.account")}</a>
                        <a className='settings-sidebar-option'>{t("SettingsModal.sidebar.design")}</a>
                        <a className='settings-sidebar-option'>{t("SettingsModal.sidebar.language")}</a>

                        <div className='settings-sidebar-title'>{t("SettingsModal.sidebar.playback")}</div>
                        <a className='settings-sidebar-option'>{t("SettingsModal.sidebar.autoplay")}</a>
                        <a className='settings-sidebar-option'>{t("SettingsModal.sidebar.crossfade")}</a>

                        <div className='settings-sidebar-title'>{t("SettingsModal.sidebar.library")}</div>
                        <a className='settings-sidebar-option'>{t("SettingsModal.sidebar.downloads")}</a>
                        <a className='settings-sidebar-option'>{t("SettingsModal.sidebar.compactLayout")}</a>
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
                    <h1>{t("SettingsModal.title")}</h1>
                    <div className='settings-content-component'>
                        <h2 className='settings-content-title'>{t("SettingsModal.content.account")}</h2>
                    </div>
                    <div className='settings-content-component'>
                        <h2 className='settings-content-title'>{t("SettingsModal.content.design")}</h2>
                    </div>
                    <div className='settings-content-component'>
                        <h2 className='settings-content-title'>{t("SettingsModal.content.language")}</h2>
                    </div>
                    <div className='settings-content-component'>
                        <h2 className='settings-content-title'>{t("SettingsModal.content.autoplay")}</h2>
                    </div>
                    <div className='settings-content-component'>
                        <h2 className='settings-content-title'>{t("SettingsModal.content.crossfade")}</h2>
                    </div>
                    <div className='settings-content-component'>
                        <h2 className='settings-content-title'>{t("SettingsModal.content.downloads")}</h2>
                    </div>
                    <div className='settings-content-component'>
                        <h2 className='settings-content-title'>
                            {t("SettingsModal.content.compactLayout")}
                        </h2>
                    </div>
                </div>
            </div>
        </div>
    )
}
