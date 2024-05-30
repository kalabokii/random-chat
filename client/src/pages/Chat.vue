<script setup lang="ts">
import EmojiPicker from "../../lib/components/emoji/EmojiPicker.vue";
import TextArea from "../../lib/components/text-area/TextArea.vue";
import { Icon } from "@iconify/vue";
import { ref, watchEffect } from "vue";
import Message from "../components/chat/Message.vue";
import useChat from "../composables/chat/use-chat";

const text = ref("");
const messageBox = ref<HTMLElement | null>(null);

const {
  sendMessage,
  messages,
  me,
  status,
  friend,
  findFriend,
  toggleMute,
  muted,
} = useChat();

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
  if (status.value !== "connected") {
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
  <div class="h-full flex flex-row">
    <div class="hidden sm:block w-80 border-r border-gray-600"></div>
    <div class="flex flex-col w-full">
      <div
        class="relative flex text-gray-300 px-5 items-center h-14 shrink-0 border-b border-gray-600"
      >
        <div class="absolute right-5">
          <Icon
            @click="toggleMute"
            :icon="
              muted ? 'teenyicons:sound-off-solid' : 'teenyicons:sound-on-solid'
            "
            class="w-6 h-6 text-blue-400 cursor-pointer"
          />
        </div>
        <div v-if="friend !== undefined" class="flex gap-2 items-center w-full">
          <div class="relative w-8 h-8 object-cover rounded-full">
            <div
              class="w-3 h-3 absolute bottom-0 left-0 rounded-full"
              :class="status === 'connected' ? 'bg-green-500' : 'bg-red-500'"
            ></div>
            <img
              :src="friend.image"
              alt="avatar"
              class="w-8 h-8 object-cover"
            />
          </div>
          <div>
            <h5 class="font-medium text-lg">{{ friend.name }}</h5>
          </div>
        </div>
        <div v-else class="w-full">
          <h5 class="text-center font-medium text-lg">
            click find a friend to get started
          </h5>
        </div>
      </div>
      <div
        class="bg-gray-900 h-full overflow-auto flex flex-col relative"
        ref="messageBox"
      >
        <div class="sticky top-0 w-full">
          <div
            v-if="status === 'disconnected'"
            class="text-center bg-red-500 px-5 py-2"
          >
            <span class="pr-3 text-white font-medium text-lg"
              >You are disconnected</span
            >
            <button @click="findFriend" class="bg-green-400 p-1 rounded-md">
              Find a Friend
            </button>
          </div>
          <div v-else-if="status === 'connecting'">
            <div class="text-center bg-yellow-500 px-5 py-2">
              <span class="pr-3 text-white font-medium text-lg"
                >Connecting...</span
              >
            </div>
          </div>
        </div>
        <div class="w-full px-5">
          <Message
            v-for="message of messages"
            :message="message"
            :key="message.id"
            :is-mine="message.sender.id == me?.id"
          />
        </div>
      </div>
      <div
        class="relative items-end flex px-5 shrink-0 min-h-[3.5rem] bg-gray-900 border-t border-gray-600"
      >
        <div class="w-full py-2 h-full flex items-center">
          <TextArea
            :disabled="status !== 'connected'"
            @submit="handleMessageSubmit"
            v-model="text"
            placeholder="Message..."
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
          />
        </div>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts"></script>
