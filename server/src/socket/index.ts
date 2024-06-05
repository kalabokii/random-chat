import http from "http";
import { Server } from "socket.io";
import privateConnectionHandler from "./connections/private/private-connection.handler";
import randomConnectionHandler from "./connections/random/random-connection.handler";
import privateState from "./connections/private/private.state";
import randomState from "./connections/random/random.state"; //? This is the place which will handle first socket connection and split them between room and random chat

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
      privateConnectionHandler(socket, privateState);
    }
  });
};
