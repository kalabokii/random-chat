import type { MessageData, Sender } from "../../packages/message/model/message";
import { ref } from "vue";
import { Socket } from "socket.io-client";

export default function (socket: Socket) {
  const messages = ref<MessageData[]>([]);
  const me = ref<Sender>();
  const friend = ref<Sender>();
  const userCount = ref(0);
  const status = ref<"connected" | "disconnected" | "connecting">(
    "disconnected",
  );
  const muted = ref(false);

  const audioMessage = new Audio("audio.mp3");
  // const socket = io("http://localhost:3001");
  socket.on("welcome", (user: Sender) => {
    me.value = user;
  });

  socket.on("user-count", (count: number) => {
    userCount.value = count;
  });

  socket.on("new chat", (user) => {
    messages.value = [];
    friend.value = user;
    status.value = "connected";
  });

  socket.on("chat message", (message: MessageData) => {
    document.title = "💬 Random";
    if (!muted.value) audioMessage.play();
    messages.value.push(message);
    socket.emit("delivered", message.id);
  });

  socket.on("delivered", (id: string) => {
    const message = messages.value.find((msg) => msg.id === id);
    if (message) {
      message.state = "received";
    }
  });

  socket.on("disconnected", () => {
    socket.emit("disconnected");
    status.value = "disconnected";
  });

  socket.on("friend found", (user) => {
    socket.emit("friend found", user);
  });

  function sendMessage(msg: string) {
    const message: MessageData = {
      id: Math.random().toString(36).slice(2, 9),
      sender: me.value as Sender,
      content: msg,
      createdAt: new Date().toISOString(),
      state: "sent",
    };
    messages.value.push(message);
    socket.emit("chat message", message);
  }

  function findFriend() {
    status.value = "connecting";
    socket.emit("find friend");
  }

  function toggleMute() {
    muted.value = !muted.value;
  }

  function disconnect() {
    socket.emit("disconnected");
    status.value = "disconnected";
  }

  function readMessage() {
    document.title = "Random";
  }

  return {
    messages,
    me,
    friend,
    status,
    sendMessage,
    findFriend,
    toggleMute,
    muted,
    userCount,
    disconnect,
    readMessage,
  };
}
