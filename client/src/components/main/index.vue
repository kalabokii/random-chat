<script lang="ts" setup>
import Header from "@/components/main/Header.vue";
import SideAnimation from "@/components/extra/SideAnimation.vue";
import Music from "@/components/music/Music.vue";
import io from "socket.io-client";
import useConnection from "@/composables/connection/use-connection.ts";
import Chat from "@/components/chat/index.vue";

const socket = io("http://localhost:3001");
const connection = useConnection(socket);
</script>

<template>
  <div class="flex h-full w-full">
    <SideAnimation></SideAnimation>
    <div class="grow flex flex-col">
      <Header
        :friend="connection.friend.value"
        :state="connection.state.value"
        @find-friend="connection.findFriend()"
      >
        <template #music>
          <Music :socket="socket"></Music>
        </template>
      </Header>
      <Chat
        :friend="connection.friend.value"
        :me="connection.me.value"
        :socket="socket"
        :state="connection.state.value"
      >
      </Chat>
    </div>
  </div>
</template>
