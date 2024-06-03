import { Socket } from "socket.io";

export default function handleMusicEmits(
  socket: Socket,
  { event, payload }: { event: string; payload: any },
  friendId: string,
) {
  switch (event) {
    case "play":
      socket.to(friendId).emit("play", payload);
      break;
    case "pause":
      socket.to(friendId).emit("pause");
      break;
    case "seekTo":
      socket.to(friendId).emit("seekTo", payload);
      break;
  }
}
