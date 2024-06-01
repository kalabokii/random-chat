<script lang="ts" setup>
import { PropType, ref, watchEffect } from "vue";
import { Icon } from "@iconify/vue";
import Slider from "@/components/slider/Slider.vue";
import { Socket } from "socket.io-client";

const props = defineProps({
  socket: {
    type: Object as PropType<Socket>,
    required: true,
  },
});

const video = ref("");

const showControls = ref(false);

function onPlayerReady(event: any) {
  // event.target.playVideo();
}

const time = ref(0);
const duration = ref(213);
const name = ref("Give You Up");

let interval: any;

// function onPlayerStateChange(event: any) {
//   if (event.data === window.YT.PlayerState.PLAYING && !done) {
//     setTimeout(stopVideo, 6000);
//     done = true;
//   }
// }

const player = ref<any>(null);

const playerState = ref<any>(false);

// @ts-ignore

window["onYouTubeIframeAPIReady"] = function onYouTubeIframeAPIReady() {
  player.value = new window.YT.Player("player", {
    height: "390",
    width: "640",
    videoId: "dQw4w9WgXcQ",
    playerVars: {
      playsinline: 1,
    },
    events: {
      onReady: onPlayerReady,
      onStateChange: onPlayerStateChange,
    },
  });
};

function onPlayerStateChange(event) {
  if (event.data === YT.PlayerState.ENDED) {
    // Video or music has ended
    console.log("Music ended");
    // You can do something here, like play the next track
  }
}

function setCurrentTime() {
  time.value = player.value.getCurrentTime();
}

function playVideo() {
  player.value?.playVideo();
  playerState.value = true;
  setTimeout(() => {
    duration.value = player.value.getDuration();
    name.value = player.value.getVideoData().title;
  }, 600);

  interval = setInterval(setCurrentTime, 1000);
}

props.socket.on("music", (videoId: string) => {
  player.value.loadVideoById(videoId);
  playVideo();
});

function handleVideoLoad(e: Event) {
  if (!video.value) return;
  e.preventDefault();
  const videoId = video.value.split("v=")[1].split("&")[0];
  player.value.loadVideoById(videoId);
  video.value = "";
  playVideo();
  props.socket.emit("music", videoId);
}

function stopVideo() {
  player.value.pauseVideo();
  playerState.value = false;
  if (interval) clearInterval(interval);
}

function handleSlide(value: number) {
  player.value.seekTo(value);
}

watchEffect((onInvalidate) => {
  if (showControls.value === true) {
    const changeState = () => (showControls.value = false);

    document.addEventListener("click", changeState);
    onInvalidate(() => {
      document.removeEventListener("click", changeState);
      console.log("removed");
    });
  }
});
</script>

<template>
  <div @click.stop>
    <div class="hidden">
      <div id="player"></div>
    </div>
    <div class="relative">
      <Icon
        :class="playerState ? 'text-red-600' : 'text-blue-400'"
        class="cursor-pointer w-6 h-6"
        icon="simple-icons:youtubemusic"
        @click="showControls = !showControls"
      ></Icon>
      <div
        v-if="showControls"
        class="md:-translate-x-[calc(50%-16px)] z-50 -translate-x-[calc(100%-16px)] bg-gray-800 w-48 left-0 -bottom-2 translate-y-full py-2 px-4 rounded border border-gray-700 absolute"
      >
        <p
          class="my-2 overflow-clip line-clamp-1 text-center text-sm font-medium text-blue-50"
        >
          {{ name }}
        </p>
        <div class="flex justify-between items-center">
          <Icon
            class="cursor-pointer text-gray-400 w-5 h-5"
            icon="mage:previous-fill"
          ></Icon>
          <Icon
            v-if="!playerState"
            class="cursor-pointer text-gray-400 w-5 h-5"
            icon="mage:play-fill"
            @click="playVideo"
          ></Icon>
          <Icon
            v-else
            class="cursor-pointer text-gray-400 w-5 h-5"
            icon="mage:pause-fill"
            @click="stopVideo"
          ></Icon>
          <Icon
            class="cursor-pointer text-gray-400 w-5 h-5"
            icon="mage:next-fill"
          ></Icon>
        </div>
        <Slider
          :current="time"
          :total="duration"
          type="time"
          @update:value="handleSlide"
        ></Slider>

        <Form class="mt-2" @submit="handleVideoLoad">
          <input
            v-model="video"
            class="w-full bg-transparent border border-gray-500 outline-none rounded text-xs text-gray-500 p-1"
            placeholder="YouTube video URL"
            type="text"
          />
          <div class="flex justify-center">
            <button
              class="w-full bg-blue-400 mt-2 mx-auto shadow px-3 py-1 rounded"
              type="submit"
            >
              play
            </button>
          </div>
        </Form>
      </div>
    </div>
  </div>
</template>
