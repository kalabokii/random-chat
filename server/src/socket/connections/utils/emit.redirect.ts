import { SocketEventHandler } from "../types/user.model";

// ? This just redirects the chat event to the friend or friends

const handler: SocketEventHandler = (socket, data, event, friend, sender) => {
  socket
    .to(friend)
    .emit(event, { ...data, payload: { ...data.payload, sender } });
};

export default handler;
