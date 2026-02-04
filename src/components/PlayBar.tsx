import React, { useEffect, useState } from "react";
import { usePlayer } from "../PlayerContext";

import "../styles/components/PlayBar.css";

import shuffle from "../assets/icons/playbar/shuffle.svg";
import skipPrevious from "../assets/icons/playbar/skip_previous.svg";
import playArrow from "../assets/icons/playbar/play_arrow.svg";
import skipNext from "../assets/icons/playbar/skip_next.svg";
import repeat from "../assets/icons/playbar/repeat.svg";
import devices from "../assets/icons/playbar/devices.svg";
import lyrics from "../assets/icons/playbar/lyrics.svg";
import volumeUp from "../assets/icons/playbar/volume_up.svg";
import volumeDown from "../assets/icons/playbar/volume_down.svg";
import volumeOff from "../assets/icons/playbar/volume_off.svg";
import pause from "../assets/icons/playbar/pause.svg";
import musicQueue from "../assets/icons/playbar/queue_music.svg";

function formatTime(seconds: number | null) {
  if (seconds === null || isNaN(seconds) || !isFinite(seconds)) return "--:--";
  const sec = Math.floor(seconds);
  const h = Math.floor(sec / 3600);
  const m = Math.floor((sec % 3600) / 60);
  const s = sec % 60;
  if (h > 0) return `${h}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
  return `${m}:${String(s).padStart(2, "0")}`;
}

export default function PlayBar() {
  const { audioRef, src, setVolume, togglePlay, isPlaying, currentTrack } = usePlayer();

  const [volume, setVol] = useState<number>(100);
  const [recentVolume, setRecentVolume] = useState<number>(100);

  const [duration, setDuration] = useState<number | null>(null);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [seeking, setSeeking] = useState(false);
  const [seekValue, setSeekValue] = useState<number>(0);

  const getPlayIcon = () => (isPlaying ? pause : playArrow);

  function playPause() {
    togglePlay();
  }

  const getVolumeIcon = () => {
    if (volume === 0) return volumeOff;
    if (volume < 70) return volumeDown;
    return volumeUp;
  };

  function muteVolume() {
    if (volume > 0) {
      setRecentVolume(volume);
      setVol(0);
      setVolume(0);
    } else {
      const newVol = recentVolume === 0 ? 100 : recentVolume;
      setVol(newVol);
      setVolume(newVol);
    }
  }

  // Audio event listeners — binde an das zentrale audio-Element
  useEffect(() => {
    const audio = audioRef?.current;
    if (!audio) return;

    const onLoaded = () => {
      const dur = isFinite(audio.duration) ? audio.duration : null;
      setDuration(dur);
      // stelle Lautstärke sicher
      audio.volume = Math.max(0, Math.min(1, volume / 100));
      // Debug: entferne nach Test
      // console.log("loadedmetadata:", { src: audio.src, duration: dur });
    };

    const onTimeUpdate = () => {
      if (!seeking) setCurrentTime(audio.currentTime);
    };

    const onEnded = () => {
      setCurrentTime(0);
    };

    audio.addEventListener("loadedmetadata", onLoaded);
    audio.addEventListener("timeupdate", onTimeUpdate);
    audio.addEventListener("ended", onEnded);

    // Falls bereits geladen
    if (audio.readyState >= 1) {
      const dur = isFinite(audio.duration) ? audio.duration : null;
      setDuration(dur);
      setCurrentTime(audio.currentTime);
    }

    return () => {
      audio.removeEventListener("loadedmetadata", onLoaded);
      audio.removeEventListener("timeupdate", onTimeUpdate);
      audio.removeEventListener("ended", onEnded);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [audioRef, seeking]);

  // Reset bei src-Wechsel
  useEffect(() => {
    setCurrentTime(0);
    setDuration(null);
    setSeeking(false);
    setSeekValue(0);
  }, [src]);

  // Seek-Handler mit korrekten Typen
  function handleSeekStartMouse(e: React.MouseEvent<HTMLInputElement>) {
    setSeeking(true);
    setSeekValue(Number(e.currentTarget.value));
  }
  function handleSeekStartTouch(e: React.TouchEvent<HTMLInputElement>) {
    setSeeking(true);
    setSeekValue(Number(e.currentTarget.value));
  }
  function handleSeekChange(e: React.ChangeEvent<HTMLInputElement>) {
    setSeekValue(Number(e.currentTarget.value));
  }
  function applySeekValue(v: number) {
    const audio = audioRef?.current;
    setSeeking(false);
    setCurrentTime(v);
    setSeekValue(v);
    if (!audio) return;
    if (isFinite(audio.duration)) {
      audio.currentTime = Math.max(0, Math.min(audio.duration, v));
    } else {
      audio.currentTime = Math.max(0, v);
    }
  }
  function handleSeekEndMouse(e: React.MouseEvent<HTMLInputElement>) {
    applySeekValue(Number(e.currentTarget.value));
  }
  function handleSeekEndTouch(e: React.TouchEvent<HTMLInputElement>) {
    applySeekValue(Number(e.currentTarget.value));
  }
  function handleSeekEndBlur(e: React.FocusEvent<HTMLInputElement>) {
    applySeekValue(Number(e.currentTarget.value));
  }

  const displayedTime = seeking ? seekValue : currentTime;
  const pastTime = formatTime(displayedTime);
  const remainingTime = duration === null ? "--:--" : formatTime(Math.max(0, (duration || 0) - displayedTime));

  const hasDuration = duration !== null && isFinite(duration) && duration > 0;
  const skipMax = hasDuration ? Math.floor(duration as number) : 100;

  return (
    <div className="playbar">
      <div className="playbar-left">
        <div className="playbar-left-song">
          <img src={currentTrack?.thumbnail} className="song-img" alt={currentTrack?.title} />
          <div className="playbar-left-song-info">
            <a href={currentTrack?.link} className="playbar-left-song-info-name">
              {currentTrack?.title}
            </a>
            <a href={currentTrack?.link} className="playbar-left-song-info-author">
              {currentTrack?.artist}
            </a>
          </div>
        </div>
      </div>

      <div className="playbar-middle">
        <div className="playbar-middle-control-area">
          <img className="playbar-middle-control-area-element" src={shuffle} alt="" />
          <img className="playbar-middle-control-area-element" src={skipPrevious} alt="" />
          <button className="playbar-middle-control-area-playbutton" onClick={playPause}>
            <img src={getPlayIcon()} alt="" />
          </button>
          <img className="playbar-middle-control-area-element" src={skipNext} alt="" />
          <img className="playbar-middle-control-area-element" src={repeat} alt="" />
        </div>

        <div className="playbar-middle-skipbar">
          <p className="past-time">{pastTime}</p>
          <input
            className={`skipbar ${!hasDuration ? "skipbar--no-duration" : ""}`}
            type="range"
            name="skipbar"
            min={0}
            max={skipMax}
            step={0.1}
            value={Math.max(0, Math.min(skipMax || 0, displayedTime))}
            onMouseDown={handleSeekStartMouse}
            onTouchStart={handleSeekStartTouch}
            onChange={handleSeekChange}
            onMouseUp={handleSeekEndMouse}
            onTouchEnd={handleSeekEndTouch}
            onBlur={handleSeekEndBlur}
            disabled={!hasDuration}
            aria-disabled={!hasDuration}
            title={!hasDuration ? "Dauer noch nicht verfügbar" : "Sprung zur Zeit"}
          />
          <p className="remaining-time">{remainingTime}</p>
        </div>
      </div>

      <div className="playbar-right">
        <img className="playbar-right-element test" src={lyrics} alt="" />
        <img className="playbar-right-element" src={musicQueue} alt="" />
        <img className="playbar-right-element" src={devices} alt="" />
        <img
          className="playbar-right-volume playbar-right-element"
          src={getVolumeIcon()}
          alt="volume"
          onClick={muteVolume}
        />
        <input
          className="playbar-right-volume-control"
          type="range"
          min="0"
          max="100"
          value={volume}
          onChange={(e) => {
            const v = Number(e.target.value);
            setVol(v);
            setVolume(v);
          }}
        />
      </div>
    </div>
  );
}