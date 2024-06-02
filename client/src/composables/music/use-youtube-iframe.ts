import { ref } from "vue";

interface QueueItem {
  id: string;
  title: string;
  duration: number;
  thumbnail: string;
}

function youtubeIframe() {
  const player = ref<YT.Player | null>(null);
  const queue = ref<QueueItem[]>([
    {
      id: "dQw4w9WgXcQ",
      title: "Never Gonna Give You Up (Video)",
      duration: 213,
      thumbnail: "https://i.ytimg.com/vi/dQw4w9WgXcQ/default.jpg",
    },
  ]);
  const playState = ref<"playing" | "paused" | "stopped">("stopped");
  const currentVideo = ref<QueueItem>({
    id: "dQw4w9WgXcQ",
    title: "Never Gonna Give You Up (Video)",
    duration: 213,
    thumbnail: "https://i.ytimg.com/vi/dQw4w9WgXcQ/default.jpg",
  });
  const currentTime = ref(0);
  let counterInterval: NodeJS.Timeout | undefined;

  window["onYouTubeIframeAPIReady"] = function onYouTubeIframeAPIReady() {
    player.value = new window.YT.Player("player", {
      height: "390",
      width: "640",
      videoId: currentVideo.value.id,
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
      console.log("Music ended");
    }
  }

  function getVideoId(url: string) {
    try {
      const searchParams = new URLSearchParams(url?.split("?")[1]);
      return searchParams.get("v");
    } catch (error) {
      console.error(error);
      return null;
    }
  }

  function parseQueueItem(data: any) {
    const duration = data.contentDetails.duration;
    const match = duration.match(/PT(\d+H)?(\d+M)?(\d+S)?/);
    const hours = parseInt(match[1], 10) || 0;
    const minutes = parseInt(match[2], 10) || 0;
    const seconds = parseInt(match[3], 10) || 0;
    return {
      id: data.id,
      title: data.snippet.title,
      duration: hours * 3600 + minutes * 60 + seconds,
      thumbnail: data.snippet.thumbnails.default.url,
    };
  }

  async function addToQueue(url: string) {
    const videoId = getVideoId(url);
    if (!videoId) {
      console.error("Invalid video URL");
      return;
    }
    const endpoint =
      "https://www.googleapis.com/youtube/v3/videos?" +
      new URLSearchParams({
        id: videoId,
        key: "AIzaSyC8i3iladt3Zk9yKujaIGHxs6YBsKb5PyE",
        part: "snippet,contentDetails",
      });

    const response = await fetch(endpoint);
    const data = await response.json();
    const videoData = data.items[0];
    if (!videoData) {
      console.error("Video not found");
      return;
    }

    const queueItem = parseQueueItem(videoData);
    queue.value.push(queueItem);
    return queueItem;
  }

  function play(videoId?: string) {
    if (!player.value) return;
    if (videoId) {
      player.value.loadVideoById(videoId);
      const video = queue.value.find((item) => item.id === videoId);
      if (video) currentVideo.value = video;
    }
    player.value.playVideo();
    playState.value = "playing";
    currentTime.value = player.value.getCurrentTime();
    counterInterval = setInterval(() => {
      if (!player.value) return;
      currentTime.value = player.value.getCurrentTime();
    }, 1000);
  }

  function pause() {
    if (!player.value) return;
    player.value.pauseVideo();
    playState.value = "paused";
    if (counterInterval) clearInterval(counterInterval);
  }

  function playNext() {
    const currentVideoIndex = queue.value.findIndex(
      (item) => item.id === currentVideo.value?.id,
    );
    if (currentVideoIndex === -1 || currentVideoIndex + 1 >= queue.value.length)
      return;
    play(queue.value[currentVideoIndex + 1].id);
  }

  function playPrevious() {
    const currentVideoIndex = queue.value.findIndex(
      (item) => item.id === currentVideo.value?.id,
    );
    if (currentVideoIndex === -1 || currentVideoIndex - 1 < 0) return;
    play(queue.value[currentVideoIndex - 1].id);
  }

  function jumpTo(time: number) {
    if (!player.value) return;
    player.value.seekTo(time, true);
  }

  return {
    addToQueue,
    play,
    pause,
    playNext,
    playPrevious,
    queue,
    playState,
    currentVideo,
    currentTime,
    jumpTo,
  };
}

export const player = youtubeIframe();
