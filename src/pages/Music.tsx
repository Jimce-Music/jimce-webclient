import { useState } from "react"

export default function Music() {
  const [url, setUrl] = useState<string>("")
  const [justDownload, setJustDownload] = useState<boolean>(false)
  const [saveWhileStreaming, setSaveWhileStreaming] = useState<boolean>(false)

  const [streamUrl, setStreamUrl] = useState<string>("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!url) return

    if(justDownload === true) {
      console.log(`Just Download: ${justDownload}`)

      console.log("Abfragen von /request-play")
      const requestRes = await fetch(`http://192.168.188.27:4002/request-play?identifier=${url}`)
      const requestPlayData = await requestRes.json()

      console.log("Abrufen von /download")
      await fetch (`http://192.168.188.27:4002/download?id=${requestPlayData.uuid}`)
    } else if(saveWhileStreaming === true) {
      console.log(`Save While Streaming: ${saveWhileStreaming}`)

      console.log("Abfragen von /request-play")
      const requestRes = await fetch(`http://192.168.188.27:4002/request-play?identifier=${url}`)
      const requestPlayData = await requestRes.json()

      console.log("Abrufen von /stream")
      const res = await fetch (`http://192.168.188.27:4002/stream?id=${requestPlayData.uuid}`)
      const data = await res.json()

      console.log("Abrufen von /download")
      await fetch (`http://192.168.188.27:4002/download?id=${requestPlayData.uuid}`)

      console.log(data)
      if(!data.success) return

      console.log(data.downloadedCallback)

      setStreamUrl(data.downloadedCallback)
    }
  }

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="YouTube URL eingeben"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          style={{ width: "400px" }}
        />
        <input type="checkbox" checked={justDownload} onChange={(e) => setJustDownload(e.target.checked)} />
        <input type="checkbox" checked={saveWhileStreaming} onChange={(e) => setSaveWhileStreaming(e.target.checked)} />
        <button type="submit">Abspielen</button>
      </form>

      {streamUrl && (
        <audio controls autoPlay src={streamUrl} />
      )}
    </div>
  )
}
