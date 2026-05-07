import { createContext, useContext, useEffect, useRef, useState } from 'react'

const PlayerContext = createContext<any>(null)

export interface Track {
    url: string
    title: string
    artist: string
    thumbnail: string
    link?: string
    streamUrl?: string
}

export function PlayerProvider({ children }: any) {
    const audioRef = useRef<HTMLAudioElement | null>(null)
    const [src, setSrc] = useState<string | null>(null)
    const [volume, setVolumeState] = useState(1) // 0-1
    const [shouldPlay, setShouldPlay] = useState(false)
    const [isPlaying, setIsPlaying] = useState(false)
    const [currentTrack, setCurrentTrack] = useState<Track | null>(null)
    const [currentTime, setCurrentTime] = useState(0)
    const [duration, setDuration] = useState(0)
    const [queue, setQueue] = useState<Track[]>([])
    const [shuffledQueue, setShuffledQueue] = useState<Track[]>([])
    const [currentQueueIndex, setCurrentQueueIndex] = useState(-1)
    const [repeatMode, setRepeatMode] = useState<'off' | 'one'>('off')
    const [shuffle, setShuffle] = useState(false)

    const getTrackKey = (track: Track) => track.streamUrl || track.url || `${track.title}-${track.artist}`

    const getActiveQueue = () => (shuffle ? shuffledQueue : queue)

    const shuffleQueueArray = (tracksToShuffle: Track[]): Track[] => {
        const shuffled = [...tracksToShuffle]
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1))
            ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
        }
        return shuffled
    }

    const rebuildShuffledQueue = (
        baseQueue: Track[],
        currentTrackToKeep: Track | null = currentTrack
    ) => {
        if (baseQueue.length === 0) {
            setShuffledQueue([])
            setCurrentQueueIndex(-1)
            return
        }

        const nextShuffledQueue = shuffleQueueArray(baseQueue)

        if (currentTrackToKeep) {
            const currentKey = getTrackKey(currentTrackToKeep)
            const currentIndex = nextShuffledQueue.findIndex(
                (track) => getTrackKey(track) === currentKey
            )

            if (currentIndex > 0) {
                [nextShuffledQueue[0], nextShuffledQueue[currentIndex]] = [
                    nextShuffledQueue[currentIndex],
                    nextShuffledQueue[0]
                ]
            }
        }

        setShuffledQueue(nextShuffledQueue)
        setCurrentQueueIndex(0)
    }

    // Hauptfunktion: Spiele einen Track ab (wird als neue Queue behandelt)
    const play = (trackData: any) => {
        const track: Track = {
            url: trackData.url || trackData.streamUrl || '',
            title: trackData.title || '',
            artist: trackData.artist || '',
            thumbnail: trackData.thumbnail || '',
            link: trackData.link,
            streamUrl: trackData.streamUrl
        }

        setQueue([track])
        setShuffledQueue([track])
        setCurrentQueueIndex(0)

        setSrc(track.streamUrl || track.url)
        setCurrentTrack(track)
        setShouldPlay(true)
    }

    // Spielen eines Tracks aus der Queue (intern)
    const playQueueTrack = (trackData: Track) => {
        setSrc(trackData.streamUrl || trackData.url)
        setCurrentTrack(trackData)
        setShouldPlay(true)
    }

    const playQueueTrackAtIndex = (index: number) => {
        const activeQueue = getActiveQueue()

        if (index < 0 || index >= activeQueue.length) return

        setCurrentQueueIndex(index)
        playQueueTrack(activeQueue[index])
    }

    // Queue-Management
    const enqueueTrack = (track: Track) => {
        const nextQueue = [...queue, track]
        setQueue(nextQueue)

        if (shuffle) {
            rebuildShuffledQueue(nextQueue)
        }
    }

    const enqueueTracks = (tracks: Track[]) => {
        const nextQueue = [...queue, ...tracks]
        setQueue(nextQueue)

        if (shuffle) {
            rebuildShuffledQueue(nextQueue)
        }
    }

    const clearQueue = () => {
        setQueue([])
        setShuffledQueue([])
        setCurrentQueueIndex(-1)
    }

    const removeFromQueue = (index: number) => {
        const newQueue = queue.filter((_, i) => i !== index)
        setQueue(newQueue)

        if (shuffle) {
            rebuildShuffledQueue(newQueue)
            return
        }

        if (currentQueueIndex >= newQueue.length) {
            setCurrentQueueIndex(Math.max(-1, newQueue.length - 1))
        }
    }

    const playNext = () => {
        const activeQueue = getActiveQueue()

        if (activeQueue.length === 0) return

        let nextIndex = currentQueueIndex + 1

        if (nextIndex >= activeQueue.length) {
            return
        }

        setCurrentQueueIndex(nextIndex)
        playQueueTrack(activeQueue[nextIndex])
    }

    const playPrevious = () => {
        const activeQueue = getActiveQueue()

        if (activeQueue.length === 0) return

        const playedSeconds = audioRef.current?.currentTime ?? currentTime

        if (currentQueueIndex <= 0 || playedSeconds >= 5) {
            if (audioRef.current) {
                audioRef.current.currentTime = 0
                audioRef.current.play().catch(() =>
                    console.warn('Audio konnte nicht automatisch starten')
                )
            }
            return
        }

        let prevIndex = currentQueueIndex - 1

        if (prevIndex < 0) {
            prevIndex = 0
        }

        setCurrentQueueIndex(prevIndex)
        playQueueTrack(activeQueue[prevIndex])
    }

    const toggleRepeatMode = () => {
        setRepeatMode(repeatMode === 'one' ? 'off' : 'one')
    }

    const toggleShuffle = () => {
        if (shuffle) {
            setShuffle(false)

            if (currentTrack) {
                const originalIndex = queue.findIndex(
                    (track) => getTrackKey(track) === getTrackKey(currentTrack)
                )
                setCurrentQueueIndex(originalIndex >= 0 ? originalIndex : 0)
            }

            return
        }

        rebuildShuffledQueue(queue, currentTrack)
        setShuffle(true)
    }

    // Toggle Play/Pause
    const togglePlay = () => {
        if (!audioRef.current) return
        if (audioRef.current.paused) {
            audioRef.current
                .play()
                .catch(() =>
                    console.warn('Audio konnte nicht automatisch starten')
                )
        } else {
            audioRef.current.pause()
        }
    }

    // Lautstärke setzen (erwartet 0-100)
    const setVolume = (v: number) => {
        const vol = Math.max(0, Math.min(1, v / 100))
        setVolumeState(vol)
        if (audioRef.current) {
            audioRef.current.volume = vol
        }
    }

    // Wenn das Audio-Element gemountet ist -> Events binden
    useEffect(() => {
        const a = audioRef.current
        if (!a) return

        const onPlay = () => setIsPlaying(true)
        const onPause = () => setIsPlaying(false)
        const onLoaded = () => {
            // stelle sicher, dass die aktuelle Lautstärke angewendet wird
            a.volume = volume
            if (shouldPlay) {
                a.play().catch(() =>
                    console.warn('Audio konnte nicht automatisch starten')
                )
                setShouldPlay(false)
            }
        }
        const onTimeUpdate = () => setCurrentTime(a.currentTime)
        const onDurationChange = () => setDuration(a.duration)
        const onEnded = () => {
            // Auto-play nächster Track in Queue
            if (repeatMode === 'one') {
                // Wiederhole den aktuellen Track
                if (a && a.readyState >= 2) {
                    a.currentTime = 0
                    a.play().catch(() =>
                        console.warn('Audio konnte nicht automatisch starten')
                    )
                }
            } else if (queue.length > 0) {
                // Spiele nächsten Track
                setTimeout(() => playNext(), 100)
            }
        }

        a.addEventListener('play', onPlay)
        a.addEventListener('pause', onPause)
        a.addEventListener('loadedmetadata', onLoaded)
        a.addEventListener('timeupdate', onTimeUpdate)
        a.addEventListener('durationchange', onDurationChange)
        a.addEventListener('ended', onEnded)

        return () => {
            a.removeEventListener('play', onPlay)
            a.removeEventListener('pause', onPause)
            a.removeEventListener('loadedmetadata', onLoaded)
            a.removeEventListener('timeupdate', onTimeUpdate)
            a.removeEventListener('durationchange', onDurationChange)
            a.removeEventListener('ended', onEnded)
        }
    }, [volume, shouldPlay, queue, currentQueueIndex, repeatMode])

    // Effekt: src oder shouldPlay ändern
    useEffect(() => {
        if (!audioRef.current) return

        // setze src direkt auf das Element (sicherstellen)
        if (src) {
            if (audioRef.current.src !== src) {
                audioRef.current.src = src
            }
        } else {
            audioRef.current.removeAttribute('src')
        }

        audioRef.current.volume = volume

        if (src && shouldPlay) {
            audioRef.current
                .play()
                .catch(() =>
                    console.warn('Audio konnte nicht automatisch starten')
                )
            setShouldPlay(false)
        }
    }, [src, shouldPlay, volume])

    return (
        <PlayerContext.Provider
            value={{
                audioRef,
                play,
                playQueueTrackAtIndex,
                togglePlay,
                setVolume,
                src,
                isPlaying,
                currentTrack,
                currentTime,
                duration,
                queue,
                activeQueue: getActiveQueue(),
                currentQueueIndex,
                enqueueTrack,
                enqueueTracks,
                clearQueue,
                removeFromQueue,
                playNext,
                playPrevious,
                repeatMode,
                toggleRepeatMode,
                shuffle,
                toggleShuffle
            }}
        >
            {children}
            {/* Ein einziges, zentrale Audio-Element */}
            <audio ref={audioRef} style={{ display: 'none' }} />
        </PlayerContext.Provider>
    )
}

export const usePlayer = () => useContext(PlayerContext)
