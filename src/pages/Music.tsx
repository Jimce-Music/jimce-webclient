import { useState } from "react";

export default function Music() {
  const [url, setUrl] = useState("");
  const [streamUrl, setStreamUrl] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url) return;
    
    const res = await fetch('http://localhost:4002/request-play?identifier=' + url)

    const data = await res.json()
    if(!data.success) return

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
