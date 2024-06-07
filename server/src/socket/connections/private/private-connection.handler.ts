import { Socket } from "socket.io";
import { PrivateState } from "./private.state";
import emitRedirect from "../utils/emit.redirect";

export default function (socket: Socket, privateState: PrivateState) {
  const user = {
    name: "name_placeholder",
    image: "image_placeholder",
    id: socket.id,
  };
  privateState.addUser(user);

  socket.on("disconnect", () => {
    privateState.removeUser(user.id);
  });

  socket.on("chat", (data) => {
    const friends = privateState.getFriends(user.id);
    emitRedirect(socket, data, "chat", Object.keys(friends), user.id);
  });

  socket.on("music", (data) => {
    const friends = privateState.getFriends(user.id);
    emitRedirect(socket, data, "music", Object.keys(friends), user.id);
  });
}
