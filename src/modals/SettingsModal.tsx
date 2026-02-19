import '../styles/modals/SettingsModal.css'

interface Props {
    open: boolean
    onClose: () => void
}

export default function SettingsModal({ open, onClose }: Props) {
    const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
        if (e.target === e.currentTarget) {
            onClose();
        }
    };

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
                        <a className='settings-sidebar-option active'>Konto</a>
                        <a className='settings-sidebar-option'>Design</a>
                        <a className='settings-sidebar-option'>Sprache</a>

                        <div className='settings-sidebar-title'>Wiedergabe</div>
                        <a className='settings-sidebar-option'>Autoplay</a>
                        <a className='settings-sidebar-option'>Crossfade</a>

                        <div className='settings-sidebar-title'>Bibliothek</div>
                        <a className='settings-sidebar-option'>Downloads</a>
                        <a className='settings-sidebar-option'>
                            Kompaktes Layout
                        </a>
                    </div>

                    <div className='settings-sidebar-bottom'>
                        <a
                            href='https://github.com/Jimce-Music/jimce-webclient.git'
                            className='settings-sidebar-option'
                        >
                            About Jimce
                        </a>
                        <a
                            href='https://github.com/Jimce-Music/jimce-webclient/issues'
                            className='settings-sidebar-option'
                        >
                            Hilfe
                        </a>
                    </div>
                </div>
                <div className='settings-content'>
                    <h1>Einstellungen</h1>
                    <div className='settings-content-component'>
                        <h2 className='settings-content-title'>Konto</h2>
                    </div>
                    <div className='settings-content-component'>
                        <h2 className='settings-content-title'>Design</h2>
                    </div>
                    <div className='settings-content-component'>
                        <h2 className='settings-content-title'>Sprache</h2>
                    </div>
                    <div className='settings-content-component'>
                        <h2 className='settings-content-title'>Autoplay</h2>
                    </div>
                    <div className='settings-content-component'>
                        <h2 className='settings-content-title'>Crossfade</h2>
                    </div>
                    <div className='settings-content-component'>
                        <h2 className='settings-content-title'>Downloads</h2>
                    </div>
                    <div className='settings-content-component'>
                        <h2 className='settings-content-title'>
                            Kompaktes Layout
                        </h2>
                    </div>
                </div>
            </div>
        </div>
    )
}
