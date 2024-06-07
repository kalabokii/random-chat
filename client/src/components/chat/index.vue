<script lang="ts" setup>
import EmojiPicker from "@lib/components/emoji/EmojiPicker.vue";
import TextArea from "@lib/components/text-area/TextArea.vue";
import { Icon } from "@iconify/vue";
import { PropType, ref, watchEffect } from "vue";
import Message from "@/components/chat/Message.vue";
import useChat from "@/composables/chat/use-chat";
import { Socket } from "socket.io-client";
import { User } from "@/components/main/user";

const props = defineProps({
  socket: {
    type: Object as PropType<Socket>,
    required: true,
  },
  state: {
    type: String as PropType<"connected" | "disconnected" | "connecting">,
    default: "disconnected",
  },
  friend: {
    type: Object as PropType<User>,
    default: undefined,
  },
  me: {
    type: Object as PropType<User>,
    default: undefined,
  },
});

const text = ref("");
const messageBox = ref<HTMLElement | null>(null);

const { sendMessage, messages, readMessage } = useChat(props.socket);

function handleMessageSubmit() {
  if (!text.value) {
    return;
  }
  sendMessage(text.value);
  text.value = "";
  if (messageBox.value) {
    messageBox.value.scrollTo(0, messageBox.value.scrollHeight);
  }
}

watchEffect(() => {
  if (props.state !== "connected") {
    text.value = "";
  }
});

watchEffect(() => {
  if (messageBox.value) {
    messageBox.value.scrollTo(0, messageBox.value.scrollHeight);
  }
});
</script>

<template>
  <div class="flex flex-col h-full">
    <div
      ref="messageBox"
      class="bg-gray-900 h-full overflow-auto flex flex-col relative"
    >
      <div class="w-full px-5">
        <Message
          v-for="message of messages"
          :key="message.id"
          :is-mine="message.sender == me?.id"
          :message="message"
        />
      </div>
    </div>
    <div
      class="shrink-0 relative items-end flex px-5 min-h-[3.5rem] bg-gray-900 border-t border-gray-600"
    >
      <div class="w-full py-2 h-full flex items-center">
        <TextArea
          v-model="text"
          :disabled="state !== 'connected'"
          placeholder="message..."
          @focus="readMessage"
          @submit="handleMessageSubmit"
        ></TextArea>
      </div>
      <div
        class="h-[3.5rem] w-10 relative overflow-visible flex items-center justify-center"
      >
        <EmojiPicker v-model="text" />
      </div>
      <div class="pl-2 h-[3.5rem] flex items-center">
        <Icon
          class="h-6 w-6 text-blue-400 cursor-pointer"
          icon="fluent:send-16-filled"
          @click="handleMessageSubmit"
        />
      </div>
    </div>
  </div>
</template>
