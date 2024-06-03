import { Socket } from "socket.io-client";
import { reactive, toRefs } from "vue";
import useIframe from "./use-iframe.ts";

export interface Video {
  id: string;
  title: string;
  duration: number;
  thumbnail: string;
}

export default function useMiddleMan(socket: Socket) {
  const iframe = useIframe(iframeListener);

  const state = reactive({
    playState: "paused" as "playing" | "paused",
    currentTime: 0,
    currentVideo: "dQw4w9WgXcQ",
    queue: [
      {
        id: "dQw4w9WgXcQ",
        title: "Never Gonna Give You Up (Video)",
        duration: 213,
        thumbnail: "https://i.ytimg.com/vi/dQw4w9WgXcQ/default.jpg",
      },
    ] as Video[],
  });

  function socketEmit(event: string, payload: any) {
    socket.emit("music", {
      event,
      payload,
    });
  }

  function iframeListener(type: string, data: any) {
    switch (type) {
      case "timeTrack":
        state.currentTime = data;
        break;
      case "video-ended":
        playNext();
        break;
    }
  }

  socket.on("play", (videoId: string | undefined) => {
    if (videoId) {
      state.currentVideo = videoId;
      iframe.play(videoId);
    } else {
      iframe.play();
    }
    state.playState = "playing";
  });

  socket.on("pause", () => {
    iframe.pause();
    state.playState = "paused";
  });

  socket.on("seekTo", (time: number) => {
    iframe.seekTo(time);
    state.currentTime = time;
  });

  function play(videoId?: string) {
    iframe.play(videoId);
    socketEmit("play", videoId);
    state.playState = "playing";
  }

  function pause() {
    iframe.pause();
    socketEmit("pause", {});
    state.playState = "paused";
  }

  function seekTo(time: number) {
    iframe.seekTo(time);
    state.currentTime = time;
    socketEmit("seekTo", time);
    if (state.playState === "paused") iframe.pause();
  }

  async function addToQueue(videoUrl: string) {
    const videoId = new URL(videoUrl).searchParams.get("v");
    // TODO: Add error handling
    await fetch(`/api/video-info?videoId=${videoId}`)
      .then((res) => res.json())
      .then((data) => state.queue.push(data))
      .catch(console.error);
  }

  function playNext() {
    const currentVideoIndex = state.queue.findIndex(
      (item) => item.id === state.currentVideo,
    );
    if (currentVideoIndex === -1 || currentVideoIndex + 1 >= state.queue.length)
      return;
    play(state.queue[currentVideoIndex + 1].id);
  }

  function playPrevious() {
    const currentVideoIndex = state.queue.findIndex(
      (item) => item.id === state.currentVideo,
    );
    if (currentVideoIndex === -1 || currentVideoIndex - 1 < 0) return;
    play(state.queue[currentVideoIndex - 1].id);
  }

  return {
    play,
    pause,
    seekTo,
    addToQueue,
    playNext,
    playPrevious,
    ...toRefs(state),
  };
}
