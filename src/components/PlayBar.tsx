import { useState } from 'react'

import '../styles/components/PlayBar.css'

import shuffle from '../assets/icons/playbar/shuffle.svg'
import skipPrevious from '../assets/icons/playbar/skip_previous.svg'
import playArrow from '../assets/icons/playbar/play_arrow.svg'
import skipNext from '../assets/icons/playbar/skip_next.svg'
import repeat from '../assets/icons/playbar/repeat.svg'
import devices from '../assets/icons/playbar/devices.svg'
import lyrics from '../assets/icons/playbar/lyrics.svg'
import volumeUp from '../assets/icons/playbar/volume_up.svg'
import volumeDown from '../assets/icons/playbar/volume_down.svg'
import volumeOff from  '../assets/icons/playbar/volume_off.svg'
import pause from '../assets/icons/playbar/pause.svg'
import musicQueue from '../assets/icons/playbar/queue_music.svg'

export default function PlayBar() {
    const [volume, setVolume] = useState(100)
    const [recentVolume, setRecentVolume] = useState(100)
    const [play, setPlay] = useState(1)

    const getPlayIcon = () => {
        if(play === 1) return playArrow
        return pause
    }

    function playPause() {
        if(play === 1) {
            setPlay(Number(0))
        } else {
            setPlay(Number(1))
        }
    }

    const getVolumeIcon = () => {
        if(volume === 0) return volumeOff
        if(volume < 70) return volumeDown
        return volumeUp
    }

    function muteVolume() {
        if(volume > 0) {
            setRecentVolume(Number(volume))
            setVolume(Number(0))
        } else {
            if(recentVolume === 0) {
                setVolume(Number(100))
            } else {
                setVolume(Number(recentVolume))
            }
            setRecentVolume(Number())
        }
    }

    return(
        <div className='playbar'>
            <div className="playbar-left">
                <div className="playbar-left-song">
                    <img src="https://i.ytimg.com/vi/RkkdYdWMfQ0/hqdefault.jpg?sqp=-oaymwEnCPYBEIoBSFryq4qpAxkIARUAAIhCGAHYAQHiAQoIGBACGAY4AUAB&rs=AOn4CLDP1y4PCZ4pnrNQVU5hIsIZIUovtQ" className='song-img' />
                    <div className="playbar-left-song-info">
                        <a href='https://www.youtube.com/watch?v=RkkdYdWMfQ0' className='playbar-left-song-info-name'>🔈BASS BOOSTED🔈 CAR MUSIC MIX 2018 🔥 BEST EDM, BOUNCE, ELECTRO HOUSE #3</a>
                        <a href='https://www.youtube.com/@BassMusicMovement' className='playbar-left-song-info-author'>Bass Music Movement</a>
                    </div>
                </div>
            </div>
            <div className="playbar-middle">
                <div className="playbar-middle-control-area">
                    <img className='playbar-middle-control-area-element' src={shuffle} alt="" />
                    <img className='playbar-middle-control-area-element' src={skipPrevious} alt="" />
                    <button 
                        className='playbar-middle-control-area-playbutton'
                        onClick={playPause}
                    >
                        <img src={getPlayIcon()} alt="" />
                    </button>
                    <img className='playbar-middle-control-area-element' src={skipNext} alt="" />
                    <img className='playbar-middle-control-area-element' src={repeat} alt="" />
                </div>
                <div className="playbar-middle-skipbar">

                </div>
            </div>
            <div className="playbar-right">
                <img className='playbar-right-element test' src={lyrics} alt="" />
                <img className='playbar-right-element' src={musicQueue} alt="" />
                <img className='playbar-right-element' src={devices} alt="" />
                <img className='playbar-right-volume playbar-right-element' src={getVolumeIcon()} alt="volume" onClick={muteVolume} />
                <input type="range" min="0" max="100" value={volume} onChange={(e) => setVolume(Number(e.target.value))} className='playbar-right-volume-slider' />
            </div>
        </div>
    )
}