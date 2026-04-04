import { useState } from 'react'
import { usePlayer } from '../PlayerContext'

export default function Music() {
    const [url, setUrl] = useState<string>('')
    const [justDownload, setJustDownload] = useState<boolean>(false)
    const [saveWhileStreaming, setSaveWhileStreaming] = useState<boolean>(false)
    const { play, enqueueTrack } = usePlayer()

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!url) return

        if (justDownload === true) {
            // JUST-DOWNLOAD
            console.log(`Just Download: ${justDownload}`)

            console.log('Abfragen von /request-play')
            const requestRes = await fetch(
                `http://192.168.188.27:4002/request-play?identifier=${encodeURIComponent(url)}&just-download=${justDownload}`
            )
            console.log(requestRes)
        } else if (saveWhileStreaming === true) {
            // SAVE-WHILE-STREAMING
            console.log(`Save While Streaming: ${saveWhileStreaming}`)

            console.log('Abfragen von /request-play')
            const requestRes = await fetch(
                `http://192.168.188.27:4002/request-play?identifier=${encodeURIComponent(url)}&save-while-streaming=${saveWhileStreaming}`
            )
            const data = await requestRes.json()

            if (!data.success) return
            // Call of play function
            const streamUrl = data.streamUrl
            if (streamUrl) {
                play({
                    url: data.streamUrl, // Mapping falls nötig, dein Context nutzt "url" oder "streamUrl"
                    streamUrl: data.streamUrl,
                    title: data.title,
                    artist: data.artist,
                    thumbnail: data.thumbnail,
                    link: data.link
                })
            }
        } else {
            // Optional: direct Streaming-Method without SaveWhileStreaming/JustDownload
            const requestRes = await fetch(
                `http://192.168.188.27:4002/request-play?identifier=${encodeURIComponent(url)}`
            )
            const data = await requestRes.json()

            if (!data.success) return
            play({
                url: data.streamUrl, // Mapping falls nötig, dein Context nutzt "url" oder "streamUrl"
                streamUrl: data.streamUrl,
                title: data.title,
                artist: data.artist,
                thumbnail: data.thumbnail,
                link: data.link
            })
        }
    }

    const handleAddToQueue = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!url) return

        try {
            const requestRes = await fetch(
                `http://192.168.188.27:4002/request-play?identifier=${encodeURIComponent(url)}`
            )
            const data = await requestRes.json()

            if (!data.success) {
                console.error('Fehler beim Abrufen des Songs')
                return
            }

            // Füge den Song zur Queue hinzu
            enqueueTrack({
                url: data.streamUrl,
                streamUrl: data.streamUrl,
                title: data.title,
                artist: data.artist,
                thumbnail: data.thumbnail,
                link: data.link
            })
            
            // URL-Feld zurücksetzen
            setUrl('')
            console.log(`"${data.title}" wurde zur Warteschlange hinzugefügt`)
        } catch (error) {
            console.error('Fehler beim Hinzufügen zur Queue:', error)
        }
    }

    return (
        <div>
            <form onSubmit={handleSubmit}>
                <input
                    type='text'
                    placeholder='YouTube URL eingeben'
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    style={{ width: '400px' }}
                />
                <p>Just Download</p>
                <input
                    type='checkbox'
                    checked={justDownload}
                    onChange={(e) => setJustDownload(e.target.checked)}
                />
                <p>Save While Streaming</p>
                <input
                    type='checkbox'
                    checked={saveWhileStreaming}
                    onChange={(e) => setSaveWhileStreaming(e.target.checked)}
                />
                <br />
                <button type='submit'>Abspielen</button>
                <button type='button' onClick={handleAddToQueue} style={{ marginLeft: '10px' }}>Zur Queue hinzufügen</button>
            </form>
        </div>
    )
}
