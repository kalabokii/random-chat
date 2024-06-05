import { Socket } from "socket.io";
import eventRedirect from "../utils/emit.redirect";
import { RandomState } from "./random.state";

export default function (socket: Socket, state: RandomState) {
  const user = {
    name: "name_placeholder",
    image: "image_placeholder",
    id: socket.id,
  };

  let friendId: string | undefined;

  state.addUser(user);
  socket.on("find friend", () => {
    friendId = state.findFriend(user.id);
    if (!friendId) return;
    socket.to(friendId).emit("friend found", user);
    console.log("friend found", friendId);
    socket.emit("friend found", state.getUser(friendId));
  });

  socket.on("disconnect", () => {
    state.removeUser(user.id);
    if (friendId) {
      socket.to(friendId).emit("friend lost");
    }
  });

  socket.on("chat", (data) => {
    eventRedirect(socket, data, "chat", friendId!);
  });
  socket.on("music", (data) => {
    eventRedirect(socket, data, "music", friendId!);
  });
}
