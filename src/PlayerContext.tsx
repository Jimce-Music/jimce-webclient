import { createContext, useContext, useEffect, useRef, useState } from "react";

const PlayerContext = createContext<any>(null);

export function PlayerProvider({ children }: any) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [src, setSrc] = useState<string | null>(null);
  const [volume, setVolumeState] = useState(1); // 0-1
  const [shouldPlay, setShouldPlay] = useState(false);
  const [audioReady, setAudioReady] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);

  console.log(audioReady)

  // Play-Funktion: src setzen und play anfordern
  const play = (url: string) => {
    setSrc(url);
    setShouldPlay(true);
  };

  // Toggle Play/Pause
  const togglePlay = () => {
    if (!audioRef.current) return;
    if (audioRef.current.paused) {
      audioRef.current.play().catch(() => console.warn("Audio konnte nicht automatisch starten"));
    } else {
      audioRef.current.pause();
    }
  };

  // Lautstärke setzen (erwartet 0-100)
  const setVolume = (v: number) => {
    const vol = Math.max(0, Math.min(1, v / 100));
    setVolumeState(vol);
    if (audioRef.current) {
      audioRef.current.volume = vol;
    }
  };

  // Wenn das Audio-Element gemountet ist -> Events binden
  useEffect(() => {
    const a = audioRef.current;
    if (!a) return;

    const onPlay = () => setIsPlaying(true);
    const onPause = () => setIsPlaying(false);
    const onLoaded = () => {
      setAudioReady(true);
      // stelle sicher, dass die aktuelle Lautstärke angewendet wird
      a.volume = volume;
      if (shouldPlay) {
        a.play().catch(() => console.warn("Audio konnte nicht automatisch starten"));
        setShouldPlay(false);
      }
    };

    a.addEventListener("play", onPlay);
    a.addEventListener("pause", onPause);
    a.addEventListener("loadedmetadata", onLoaded);

    return () => {
      a.removeEventListener("play", onPlay);
      a.removeEventListener("pause", onPause);
      a.removeEventListener("loadedmetadata", onLoaded);
    };
  }, [volume, shouldPlay]);

  // Effekt: src oder shouldPlay ändern
  useEffect(() => {
    if (!audioRef.current) return;

    // setze src direkt auf das Element (sicherstellen)
    if (src) {
      if (audioRef.current.src !== src) {
        audioRef.current.src = src;
      }
    } else {
      audioRef.current.removeAttribute("src");
    }

    audioRef.current.volume = volume;

    if (src && shouldPlay) {
      audioRef.current
        .play()
        .catch(() => console.warn("Audio konnte nicht automatisch starten"));
      setShouldPlay(false);
    }
  }, [src, shouldPlay, volume]);

  return (
    <PlayerContext.Provider value={{ audioRef, play, togglePlay, setVolume, src, isPlaying }}>
      {children}
      {/* Ein einziges, zentrale Audio-Element */}
      <audio ref={audioRef} style={{ display: "none" }} />
    </PlayerContext.Provider>
  );
}

export const usePlayer = () => useContext(PlayerContext);