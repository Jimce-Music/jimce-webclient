import { useState } from "react";

export default function Music() {
  const [url, setUrl] = useState("");
  const [streamUrl, setStreamUrl] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url) return;

    console.log("Abfragen von /request-play")
    const requestRes = await fetch(`http://192.168.188.27:4002/request-play?identifier=${url}`)
    const requestPlayData = await requestRes.json()

    console.log("Abrufen von /stream")
    const res = await fetch (`http://192.168.188.27:4002/stream?id=${requestPlayData.uuid}`)
    const data = await res.json()

    console.log(data)
    if(!data.success) return

    console.log(data.downloadedCallback)

    setStreamUrl(data.downloadedCallback)
  };

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
        <button type="submit">Abspielen</button>
      </form>

      {streamUrl && (
        <audio controls autoPlay src={streamUrl} />
      )}
    </div>
  );
}
