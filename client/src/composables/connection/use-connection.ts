import { Socket } from "socket.io-client";
import { reactive, toRefs } from "vue";
import { User } from "@/components/main/user";

// todo maybe its better to create socket connection here
export default function useConnection(socket: Socket) {
  const state = reactive({
    me: undefined as User | undefined,
    friend: undefined as User | undefined,
    state: "disconnected" as "disconnected" | "connected" | "connecting",
    userCount: 0,
  });

  {
    socket.on("welcome", (user: User) => {
      state.me = user;
      console.log("welcome", user);
    });

    socket.on("friend found", (user: User) => {
      state.friend = user;
      state.state = "connected";
    });

    socket.on("friend lost", () => {
      state.friend = undefined;
      state.state = "disconnected";
    });
  }

  const findFriend = () => {
    socket.emit("find friend");
    state.state = "connecting";
  };

  function endChat() {
    socket.emit("end chat");
    state.state = "disconnected";
  }

  return {
    ...toRefs(state),
    findFriend,
    endChat,
  };
}
