<script lang="ts" setup>
import EmojiPicker from "../../lib/components/emoji/EmojiPicker.vue";
import TextArea from "../../lib/components/text-area/TextArea.vue";
import { Icon } from "@iconify/vue";
import { ref, watchEffect } from "vue";
import Message from "../components/chat/Message.vue";
import useChat from "../composables/chat/use-chat";
import SideAnimation from "../components/extra/SideAnimation.vue";
import Music from "../components/music/Music.vue";
import io from "socket.io-client";

const socket = io("/");

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
  userCount,
  disconnect,
  readMessage,
} = useChat(socket);

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
    <SideAnimation></SideAnimation>
    <div class="flex flex-col w-full">
      <div
        class="flex w-full text-gray-300 px-5 items-center h-14 shrink-0 border-b border-gray-600"
      >
        <div class="flex items-center w-full">
          <div
            v-if="friend !== undefined"
            class="flex gap-2 items-center w-full"
          >
            <div class="relative w-8 h-8 object-cover rounded-full shrink-0">
              <div
                :class="status === 'connected' ? 'bg-green-500' : 'bg-red-500'"
                class="w-3 h-3 absolute bottom-0 left-0 rounded-full"
              ></div>
              <img
                :src="friend.image"
                alt="avatar"
                class="w-8 h-8 object-cover"
              />
            </div>
            <div class="overflow-hidden shrink line-clamp-1">
              {{ friend.name }}
            </div>
            <Icon
              :icon="
                muted
                  ? 'teenyicons:sound-off-solid'
                  : 'teenyicons:sound-on-solid'
              "
              class="w-6 h-6 text-blue-400 cursor-pointer shrink-0"
              @click="toggleMute"
            />
            <div v-if="status === 'connected'" class="pl-5 shrink-0">
              <button
                class="text-gray-200 bg-orange-400 p-1 rounded-md"
                @click="disconnect"
              >
                გათიშვა
              </button>
            </div>
          </div>
          <div v-else class="w-full">
            <h5
              class="text-center font-medium text-lg overflow-hidden line-clamp-1"
            >
              დააჭირე მოძებნას რომ იპოვო პარტნიორი
            </h5>
          </div>
        </div>
        <div class="shrink-0 flex items-center">
          <Music :socket="socket"></Music>
          <p class="whitespace-nowrap flex items-center">
            <span class="hidden sm:block px-2"> ონლაინ:</span>
            <span
              class="sm:hidden block w-3 h-3 rounded-full bg-green-500 mx-1"
            ></span>
            <span class="font-medium">{{ userCount }}</span>
          </p>
        </div>
      </div>
      <div
        ref="messageBox"
        class="bg-gray-900 h-full overflow-auto flex flex-col relative"
      >
        <div class="sticky top-0 w-full">
          <div
            v-if="status === 'disconnected'"
            class="text-center bg-red-500 px-5 py-2"
          >
            <span class="pr-3 text-white font-medium text-lg">მარტო დარჩი</span>
            <button class="bg-green-400 p-1 rounded-md" @click="findFriend">
              მოძებნე პარტნიორი
            </button>
          </div>
          <div v-else-if="status === 'connecting'">
            <div class="text-center bg-yellow-500 px-5 py-2">
              <span class="pr-3 text-white font-medium text-lg"
                >იძებნება...</span
              >
            </div>
          </div>
        </div>
        <div class="w-full px-5">
          <Message
            v-for="message of messages"
            :key="message.id"
            :is-mine="message.sender.id == me?.id"
            :message="message"
          />
        </div>
      </div>
      <div
        class="relative items-end flex px-5 shrink-0 min-h-[3.5rem] bg-gray-900 border-t border-gray-600"
      >
        <div class="w-full py-2 h-full flex items-center">
          <TextArea
            v-model="text"
            :disabled="status !== 'connected'"
            placeholder="მესიჯი..."
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
  </div>
</template>
