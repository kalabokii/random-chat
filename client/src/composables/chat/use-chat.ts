import type { MessageData } from "../../packages/message/model/message";
import { ref } from "vue";
import { Socket } from "socket.io-client";

interface EmitRedirect {
  type: string;
  payload: any;
  sender: string;
}

export default function (socket: Socket) {
  const messages = ref<MessageData[]>([]);
  const messageAudio = new Audio("audio.mp3");

  socket.on("chat", (data: EmitRedirect) => {
    switch (data.type) {
      case "message":
        document.title = "💬 Random";
        messageAudio.play();
        messages.value.push(data.payload);
        socket.emit("delivered", data.payload.id);
        break;
      case "delivered":
        const message = messages.value.find(
          (msg) => msg.id === data.payload.id,
        );
        if (message) {
          message.state = "received";
        }
        break;
    }
  });

  function sendMessage(msg: string) {
    const message: MessageData = {
      id: Math.random().toString(36).slice(2, 9),
      content: msg,
      createdAt: new Date().toISOString(),
      state: "sent",
    };
    messages.value.push(message);
    socket.emit("chat", { payload: message, type: "message" });
  }

  function readMessage() {
    document.title = "Random";
  }

  return {
    messages,
    sendMessage,
    readMessage,
  };
}
