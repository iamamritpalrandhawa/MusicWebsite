declare global {
  interface Window {
    onYouTubeIframeAPIReady: () => void;
  }

  namespace YT {
    interface Player {
      playerInfo: {
        availablePlaybackRates: number[];
        availableQualityLevels: string[];
        currentTime: number;
        duration: number;
        muted: boolean;
        playbackQuality: string;
        playbackRate: number;
        playerState: PlayerState;
        playlistId: string;
        videoData: {
          author: string;
          isPlayable: boolean;
          list: string;
          title: string;
          video_id: string;
          video_quality: string;
        };
        videoUrl: string;
        volume: number;
      };
    }
  }
}

export {};
