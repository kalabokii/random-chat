<script lang="ts" setup>
import { PropType } from "vue";
import { User } from "@/components/main/user";

defineProps({
  friend: {
    type: Object as PropType<User>,
  },
  state: {
    type: String as PropType<"connected" | "disconnected" | "connecting">,
    default: "disconnected",
  },
  onlineUsers: {
    type: Number,
    default: 0,
  },
});
defineEmits(["find-friend"]);
</script>

<template>
  <div
    class="items-center justify-between flex border-b border-gray-600 p-3 text-gray-200"
  >
    <div
      v-if="friend"
      :class="state !== 'connected' ? 'hidden md:flex' : 'flex'"
      class="flex items-center justify-start gap-2"
    >
      <img :src="friend.image" alt="avatar" class="w-10 h-10 rounded-full" />
      <p class="text-lg font-semibold">{{ friend.name }}</p>
      <div
        :class="state === 'connected' ? 'bg-green-500' : 'bg-red-500'"
        class="w-3 h-3 rounded-full"
      ></div>
    </div>
    <div class="grow">
      <div class="flex items-center md:justify-center">
        <button
          v-if="state === 'disconnected'"
          class="px-4 py-1.5 text-sm font-semibold border border-green-600 rounded"
          @click="$emit('find-friend')"
        >
          find friend
        </button>
        <p
          v-if="state === 'connecting'"
          class="border text-center text-sm font-semibold border-yellow-400 rounded px-4 py-1.5"
        >
          connecting...
        </p>
      </div>
      <div></div>
    </div>
    <div class="shrink-0 flex items-center gap-5">
      <slot name="music"></slot>
      <div>
        <p>online: {{ onlineUsers }}</p>
      </div>
    </div>
  </div>
</template>
