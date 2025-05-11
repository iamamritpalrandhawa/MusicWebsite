import { useEffect, useState } from "react";
import { PlayerDetails, PlayerState } from "./types";

interface Options {
  origin: string;
  autoplay: boolean;
  host: string;
  loop: boolean;
  mute: boolean;
  start: number;
  end: number;
}

interface Props {
  id: string;
  type: "playlist" | "video";
  options?: Partial<Options>;
  events?: Partial<{
    onReady: (event: YT.PlayerEvent) => void;
    onStateChange: (event: YT.OnStateChangeEvent) => void;
    onError: (event: YT.OnErrorEvent) => void;
  }>;
}

interface Actions {
  playVideo: () => void;
  stopVideo: () => void;
  pauseVideo: () => void;
  nextVideo: () => void;
  previousVideo: () => void;
  setVolume: (volume: number) => void;
  seekTo: (seconds: number, allowSeekAhead: boolean) => void;
}

interface YoutubeHook {
  playerDetails: PlayerDetails;
  actions: Actions;
}

let player: YT.Player;

const initializeIframe = (id: string) => {
  const iframe = document.createElement("div");
  iframe.id = `youtube-player-${id}`;
  // iframe.style.setProperty("display", "none");
  document.body.appendChild(iframe);
};

const loadApi = (id: string, options: YT.PlayerOptions) => {
  if (document.querySelector("[data-youtube]") && window.YT) {
    player = new YT.Player(`youtube-player-${id}`, options);
    return;
  }

  const tag = document.createElement("script");
  tag.src = "https://www.youtube.com/iframe_api";
  tag.dataset.youtube = "true";
  const firstScriptTag: HTMLHeadElement =
    document.getElementsByTagName("head")[0];
  firstScriptTag.appendChild(tag);

  window.onYouTubeIframeAPIReady = () => {
    player = new YT.Player(`youtube-player-${id}`, options);
  };
};

export const useYoutube = ({
  id,
  type,
  options,
  events,
}: Props): YoutubeHook => {
  const getPlayerOptions = (
    type: "video" | "playlist",
    options?: Partial<Options>
  ): YT.PlayerOptions => ({
    videoId: type === "video" ? id : undefined,
    host: options?.host,
    playerVars: {
      listType: type === "playlist" ? type : undefined,
      list: type === "playlist" ? id : undefined,
      origin: options?.origin,
      autoplay: options?.autoplay ? 1 : 0,
      loop: options?.loop ? 1 : 0,
      mute: options?.mute ? 1 : 0,
      start: options?.start,
      end: options?.end,
      modestbranding: 1, // Removes YouTube branding
      playsinline: 1, // Allows inline playback
    },
    events: {
      onReady: (event: YT.PlayerEvent) => {
        setState(event.target);
        event.target.setPlaybackQuality("small");
        events?.onReady?.(event);
      },
      onStateChange: (event: YT.OnStateChangeEvent) => {
        setState(event.target);
        events?.onStateChange?.(event);
      },
      onError: (event: YT.OnErrorEvent) => {
        events?.onError?.(event);
      },
    },
  });

  const [playerDetails, setPlayerDetails] = useState<PlayerDetails>({
    id: "",
    state: PlayerState.UNSTARTED,
    title: "",
    duration: 0,
    currentTime: 0,
    volume: 0,
  });

  useEffect(() => {
    initializeIframe(id);
    loadApi(id, getPlayerOptions(type, options));

    return () => {
      player?.destroy();
    };
  }, [id, type]);

  const setState = ({
    playerInfo: { videoData, ...playerInfo },
  }: YT.Player) => {
    setPlayerDetails({
      id: videoData.video_id,
      state: playerInfo.playerState,
      title: videoData.title,
      duration: playerInfo.duration,
      volume: playerInfo.volume,
      currentTime: playerInfo.currentTime,
    });
  };
  const proxy = (functionName: keyof Actions, args: unknown[] = []) => {
    if (typeof player?.[functionName] === "function") {
      (player[functionName] as (...args: unknown[]) => void).call(
        player,
        ...args
      );
    } else {
      console.error("Player not initialized.");
    }
  };

  return {
    playerDetails,
    actions: {
      playVideo: () => proxy("playVideo"),
      stopVideo: () => proxy("stopVideo"),
      pauseVideo: () => proxy("pauseVideo"),
      nextVideo: () => proxy("nextVideo"),
      previousVideo: () => proxy("previousVideo"),
      setVolume: (volume: number) => {
        setPlayerDetails((prevState) => ({ ...prevState, volume }));
        proxy("setVolume", [volume]);
      },
      seekTo: (seconds: number, allowSeekAhead: boolean) => {
        setPlayerDetails((prevState) => ({
          ...prevState,
          currentTime: seconds,
        }));
        proxy("seekTo", [seconds, allowSeekAhead]);
      },
    },
  };
};
