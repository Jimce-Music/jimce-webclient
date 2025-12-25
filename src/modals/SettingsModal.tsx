import '../styles/modals/SettingsModal.css';

interface Props {
  open: boolean;
  onClose: () => void;
}

export default function SettingsModal({ open, onClose }: Props) {

    return(
        <div
            className={`settings-modal-backdrop ${open ? 'active' : ''}`}
            onClick={() => onClose()}
        >
            <div
                className={`settings-modal ${open ? 'active' : ''}`}
                onClick={(e) => e.stopPropagation()}
            >
                <div className="settings-sidebar">
                    <a className='settings-sidebar-option active'>Konto</a>
                    <a className='settings-sidebar-option'>Design</a>
                    <a className='settings-sidebar-option'>Sprache</a>

                    <div className='settings-sidebar-title'>Wiedergabe</div>
                    <a className='settings-sidebar-option'>Autoplay</a>
                    <a className='settings-sidebar-option'>Crossfade</a>

                    <div className='settings-sidebar-title'>Bibliothek</div>
                    <a className='settings-sidebar-option'>Downloads</a>
                    <a className='settings-sidebar-option'>Kompaktes Layout</a>
                    
                    <div className="settings-sidebar-about">About</div>
                </div>
                <div className="settings-content">
                    <h1>Einstellungen</h1>
                    <a>Test</a>
                </div>
            </div>
        </div>
        
    )
}