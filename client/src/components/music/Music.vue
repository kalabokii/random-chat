<script lang="ts" setup>
import { PropType, ref } from "vue";
import { Icon } from "@iconify/vue";
import { Socket } from "socket.io-client";
import player from "../../composables/music/use-youtube-iframe.ts";
import Slider from "../slider/Slider.vue";

const videoUrl = ref("");

const props = defineProps({
  socket: {
    type: Object as PropType<Socket>,
    required: true,
  },
});

const {
  addToQueue,
  play,
  pause,
  playNext,
  playPrevious,
  // queue,
  playState,
  currentVideo,
  currentTime,
  jumpTo,
} = player(props.socket);

const showControls = ref(false);

function handleSubmit() {
  if (!videoUrl.value) {
    return;
  }
  addToQueue(videoUrl.value);
  videoUrl.value = "";
}

async function addAndPlay() {
  if (!videoUrl.value) {
    return;
  }
  const music = await addToQueue(videoUrl.value);
  videoUrl.value = "";
  if (!music) return;
  play(music.id);
}
</script>

<template>
  <div @click.stop>
    <div class="relative">
      <Icon
        :class="playState === 'playing' ? 'text-red-600' : 'text-blue-400'"
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
          {{ currentVideo.title }}
        </p>
        <div class="flex justify-between items-center">
          <Icon
            class="cursor-pointer text-gray-400 w-5 h-5"
            icon="mage:previous-fill"
            @click="playPrevious"
          ></Icon>
          <Icon
            v-if="playState !== 'playing'"
            class="cursor-pointer text-gray-400 w-5 h-5"
            icon="mage:play-fill"
            @click="play()"
          ></Icon>
          <Icon
            v-else
            class="cursor-pointer text-gray-400 w-5 h-5"
            icon="mage:pause-fill"
            @click="pause"
          ></Icon>
          <Icon
            class="cursor-pointer text-gray-400 w-5 h-5"
            icon="mage:next-fill"
            @click="playNext"
          ></Icon>
        </div>
        <Slider
          :current="currentTime"
          :total="currentVideo.duration || 0"
          type="time"
          @update:value="jumpTo"
        ></Slider>

        <form class="mt-2" @submit.prevent="handleSubmit">
          <input
            v-model="videoUrl"
            class="w-full bg-transparent border border-gray-500 outline-none rounded text-xs text-gray-500 p-1"
            placeholder="YouTube video URL"
            type="text"
          />
          <div class="flex justify-center gap-2">
            <button
              class="w-full bg-blue-400 mt-2 mx-auto shadow px-3 py-1 rounded"
              @click="addAndPlay"
            >
              play
            </button>
            <button
              class="flex w-full text-center bg-green-600 mt-2 mx-auto shadow px-3 items-center py-1 rounded"
              type="submit"
            >
              queue
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>
