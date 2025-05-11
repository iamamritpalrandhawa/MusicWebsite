"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/store/store";
import { setSongID } from "@/store/Slice/song";
import { getNextSong, addtoFront } from "@/store/Slice/queue";
import { useMusic } from "@/contexts/music-context";
import { useAuth } from "@/contexts/auth-context";

interface ControllerContextType {
  play: () => void;
  pause: () => void;
  next: () => void;
  previous: () => void;
  seekTo: (seconds: number) => void;
  songDetails: { id: string; title: string; artist: { name: string }; album: string; thumbnailUrl: string };
  setVolume: (volume: number) => void;
  progress: number;
  playerDetails: { state: number; currentTime: number; duration: number, volume: number };
  formatTime: (time: number) => string;
  isPlaying: boolean;
  setIsPlaying: React.Dispatch<React.SetStateAction<boolean>>;
}

const ControllerContext = createContext<ControllerContextType | undefined>(undefined);

export default function ControllerProvider({ children }: { children: React.ReactNode }) {
  const { addRecent, setRecentSongs } = useAuth();
  const { getMusicById, getSuggestions } = useMusic();
  const dispatch = useDispatch();
  const audioRef = React.useRef<HTMLAudioElement | null>(null);

  const [songDetails, setSongDetails] = useState<{ id: string; title: string; artist: { name: '' }; album: string; thumbnailUrl: string }>({ id: '', title: '', artist: { name: '' }, album: '', thumbnailUrl: '' });
  const [progress, setProgress] = useState<number>(0);
  const [streamUrl, setStreamUrl] = useState<string>("");
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState<number>(50);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [duration, setDuration] = useState<number>(0);
  const [songs, setSongs] = useState<string[]>([]);

  const songID = useSelector((state: RootState) => state.songID.songID);
  const queue = useSelector((state: RootState) => state.queue.queue);


  useEffect(() => {
    if (songID !== "") {
      getMusicById(songID).then((song) => setSongDetails(song));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [songID]);


  useEffect(() => {
    if (songID !== "") {
      fetch(`https://sound-scribe.vercel.app/stream/${songID}`)
        .then((response) => {
          if (!response.ok) {
            throw new Error("Failed to fetch stream");
          }
          return response.blob();
        })
        .then(async (blob) => {
          const url = URL.createObjectURL(blob);
          setStreamUrl(url);
          setRecentSongs((prev: string[]) => [...prev, songID]);
          await addRecent(songID);
          setIsPlaying(true);
        })
        .catch((error) => console.error("Error fetching stream:", error));
    }
  }, [songID]);

  useEffect(() => {
    if (audioRef.current) {
      const audio = audioRef.current;
      audio.volume = volume / 100;

      const updateProgress = () => {
        setCurrentTime(audio.currentTime);
        setProgress((audio.currentTime / audio.duration) * 100);
      };

      audio.addEventListener("timeupdate", updateProgress);

      return () => {
        audio.removeEventListener("timeupdate", updateProgress);
      };
    }
  }, [volume]);

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const seekTo = (time: number) => {
    if (audioRef.current) {
      audioRef.current.currentTime = time;
    }
  };

  const next = async () => {
    if (queue.length > 0) {
      setSongs((prev) => [...prev, songID]); // Add the song to the playback history
      const nextSong = queue[0]; // Get the next song from the queue
      dispatch(setSongID(nextSong)); // Set the song ID
      dispatch(getNextSong()); // Update the queue by removing the first song
      setIsPlaying(true);
    } else if (queue.length == 0) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const data = await getSuggestions(songID);
      setSongs((prev) => [...prev, songID]);
      dispatch(setSongID(data[0].youtubeId));
    }
  };

  const previous = () => {
    if (songs.length > 0) {
      dispatch(addtoFront(songID)); // Add the song back to the front of the queue
      const previousSong = songs[songs.length - 1]; // Get the last played song
      setSongs((prev) => prev.slice(0, -1));
      dispatch(setSongID(previousSong)); // Set the song ID
      setIsPlaying(true);
    } else {
      console.log("No previous songs available.");
    }
  };

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };

  return (
    <ControllerContext.Provider
      value={{
        play: togglePlay,
        pause: () => {
          if (audioRef.current) audioRef.current.pause();
          setIsPlaying(false);
        },
        next,
        previous,
        progress,
        songDetails,
        seekTo,
        setVolume,
        playerDetails: { state: isPlaying ? 1 : 0, currentTime, duration, volume },
        formatTime,
        isPlaying,
        setIsPlaying
      }}
    >
      {children}
      <audio
        ref={audioRef}
        src={streamUrl}
        autoPlay
        preload="auto"
        onLoadedMetadata={(e) => setDuration(e.currentTarget.duration)}
        onEnded={async () => {
          setIsPlaying(false); // Stop the current song
          await next(); // Play the next song automatically
        }}
      />
    </ControllerContext.Provider>
  );
}

export function useController(): ControllerContextType {
  const context = useContext(ControllerContext);
  if (!context) {
    throw new Error("useController must be used within a ControllerProvider");
  }
  return context;
}
