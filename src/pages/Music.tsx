import { useState } from "react";
import { usePlayer } from "../PlayerContext";

export default function Music() {
  const [url, setUrl] = useState<string>("");
  const [justDownload, setJustDownload] = useState<boolean>(false);
  const [saveWhileStreaming, setSaveWhileStreaming] = useState<boolean>(false);
  const { play } = usePlayer();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url) return;

    if (justDownload === true) {
      console.log(`Just Download: ${justDownload}`);

      console.log("Abfragen von /request-play");
      const requestRes = await fetch(`http://192.168.188.27:4002/request-play?identifier=${encodeURIComponent(url)}`);
      const requestPlayData = await requestRes.json();

      console.log("Abrufen von /download");
      await fetch(`http://192.168.188.27:4002/download?id=${encodeURIComponent(requestPlayData.uuid)}`);
    } else if (saveWhileStreaming === true) {
      console.log(`Save While Streaming: ${saveWhileStreaming}`);

      console.log("Abfragen von /request-play");
      const requestRes = await fetch(`http://192.168.188.27:4002/request-play?identifier=${encodeURIComponent(url)}`);
      const requestPlayData = await requestRes.json();

      console.log("Abrufen von /stream");
      const res = await fetch(`http://192.168.188.27:4002/stream?id=${encodeURIComponent(requestPlayData.uuid)}`);
      const data = await res.json();

      if (!data.success) return;

      // WICHTIG: play muss mit der tatsächlich empfangenen URL aufgerufen werden,
      // nicht mit dem (noch) nicht aktualisierten state variable
      const streamUrl = data.downloadedCallback;
      if (streamUrl) {
        play(streamUrl);
      }
    } else {
      // Optional: direkte Streaming-Variante ohne SaveWhileStreaming/JustDownload
      const requestRes = await fetch(`http://192.168.188.27:4002/request-play?identifier=${encodeURIComponent(url)}`);
      const requestPlayData = await requestRes.json();
      const res = await fetch(`http://192.168.188.27:4002/stream?id=${encodeURIComponent(requestPlayData.uuid)}`);
      const data = await res.json();
      if (!data.success) return;
      play(data.downloadedCallback);
    }
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
        <p>Just Download</p>
        <input type="checkbox" checked={justDownload} onChange={(e) => setJustDownload(e.target.checked)} />
        <p>Save While Streaming</p>
        <input type="checkbox" checked={saveWhileStreaming} onChange={(e) => setSaveWhileStreaming(e.target.checked)} />
        <br />
        <button type="submit">Abspielen</button>
      </form>
    </div>
  );
}