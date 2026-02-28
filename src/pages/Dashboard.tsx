import '../styles/pages/Dashboard.css'
import { useTranslation } from 'react-i18next'
import { usePlayer } from '../PlayerContext'

import Play from '../assets/icons/playbar/play_arrow.svg'
import Pause from '../assets/icons/playbar/pause.svg'

export default function Dashboard() {
    const { togglePlay, isPlaying, currentTrack, currentTime, duration } = usePlayer()
    const { t } = useTranslation()

    const getPlayIcon = () => (isPlaying ? Pause : Play)

    function playPause() {
        togglePlay()
    }

    // Zeit formatieren (Sekunden -> mm:ss)
    const formatTime = (seconds: number) => {
        if (!seconds || isNaN(seconds)) return '0:00'
        const mins = Math.floor(seconds / 60)
        const secs = Math.floor(seconds % 60)
        return `${mins}:${secs.toString().padStart(2, '0')}`
    }

    // Fortschritt in Prozent
    const progress = duration > 0 ? (currentTime / duration) * 100 : 0

    return (
        <div className='dashboard-page'>
            <div className="head-content">
                <div className="continue-listening-container">
                    <h3 className='continue-listening-container-header'>{t('Dashboard.continueListening')}</h3>

                    <h1 className='continue-listening-container-title'>
                        {currentTrack ? `${currentTrack.title} - ${currentTrack.artist}` : t("Dashboard.continueListeningTitle")}
                    </h1>
                    <p className='continue-listening-container-description'>{t("Dashboard.continueListeningDescription")}</p>

                    <div className="time-play-pause">
                        <button
                            className='playbar-middle-control-area-playbutton'
                            onClick={playPause}
                        >
                            <img src={getPlayIcon()} alt='' />
                        </button>

                        {currentTrack && (
                            <div className="track-progress-section">
                                <div className="track-time-display">
                                    <span>{formatTime(currentTime)}</span>
                                    <span>{formatTime(duration)}</span>
                                </div>
                                <div className="track-progress-bar">
                                    <div 
                                        className="track-progress-fill" 
                                        style={{ width: `${progress}%` }}
                                    />
                                </div>
                            </div>
                        )}
                    </div>
                </div>
                <div className="daily-mix">
                    <h1>{t('Dashboard.dailyMix')}</h1>
                </div>
            </div>
        </div>
    )
}
