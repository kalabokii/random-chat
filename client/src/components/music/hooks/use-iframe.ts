import { ref } from "vue";

export default function useIframe(emmiter: (type: string, data?: any) => void) {
  const player = ref<YT.Player | null>(null);

  const timeTrackInterval = ref<null | NodeJS.Timeout>(null);

  window["onYouTubeIframeAPIReady"] = function onYouTubeIframeAPIReady() {
    player.value = new window.YT.Player("player", {
      height: "0",
      width: "0",
      videoId: "dQw4w9WgXcQ",
      playerVars: {
        playsinline: 1,
      },
      events: {
        onStateChange: onPlayerStateChange,
      },
    });
  };

  function onPlayerStateChange(event: any) {
    if (event.data === window.YT.PlayerState.ENDED) {
      emmiter("videoEnded");
    }
  }

  function play(videoId?: string) {
    if (!player.value) {
      return;
    }
    if (videoId) {
      player.value?.loadVideoById(videoId);
    }
    player.value?.playVideo();
    emmiter("timeTrack", player.value?.getCurrentTime());
    timeTrackInterval.value = setInterval(() => {
      emmiter("timeTrack", player.value?.getCurrentTime());
    }, 1000);
  }

  function pause() {
    player.value?.pauseVideo();
    clearInterval(timeTrackInterval.value!);
  }

  function seekTo(time: number) {
    player.value?.seekTo(time, true);
  }

  return {
    play,
    pause,
    seekTo,
  };
}
