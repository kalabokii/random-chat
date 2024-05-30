<script setup lang="ts">
import type { MessageData } from "../../packages/message/model/message.ts";
import { Icon } from "@iconify/vue";
import { PropType } from "vue";

defineProps({
  message: {
    type: Object as PropType<MessageData>,
    required: true,
  },
  isMine: {
    type: Boolean,
    required: true,
  },
});

const timeStamp = (date: string) => {
  const time = new Date(date);
  return `${(time.getHours() + "").padStart(2, "0")}:${(
    time.getMinutes() + ""
  ).padStart(2, "0")}`;
};
</script>

<template>
  <div class="flex gap-3 py-4">
    <div>
      <img
        class="w-8 h-8 rounded-full mt-1 object-cover"
        :src="message.sender?.image"
        alt="avatar"
      />
    </div>
    <div class="w-full">
      <p class="text-blue-400">{{ message.sender?.name }}</p>
      <div></div>
      <p>
        {{ message.content }}
      </p>
    </div>
    <div class="flex gap-1">
      <div v-if="isMine">
        <Icon
          v-if="message.state === 'sent'"
          icon="quill:checkmark"
          class="w-5 h-5 text-blue-400"
        />
        <Icon
          v-else
          icon="quill:checkmark-double"
          class="w-5 h-5 text-blue-400"
        />
      </div>
      <p class="text-sm">{{ timeStamp(message.createdAt) }}</p>
    </div>
  </div>
</template>
