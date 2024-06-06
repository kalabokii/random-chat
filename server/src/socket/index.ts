import http from "http";
import { Server } from "socket.io";
import privateConnectionHandler from "./connections/private/private-connection.handler";
import randomConnectionHandler from "./connections/random/random-connection.handler";
import randomState from "./connections/random/random.state";
import roomsState from "./connections/private/rooms.state";

//? This is the place which will handle first socket connection and split them between room and random chat

export default (
  server: http.Server<typeof http.IncomingMessage, typeof http.ServerResponse>,
) => {
  const io = new Server(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
    },
  });

  io.on("connection", (socket) => {
    if (!socket.handshake.query.chatId) {
      randomConnectionHandler(socket, randomState);
    } else {
      privateConnectionHandler(
        socket,
        roomsState.getRoom(socket.handshake.query.chatId as string),
      );
    }
  });
};
