import { Socket } from "socket.io";

export interface User {
  id: string;
  name: string;
  image: string;
}

export interface SocketEventHandler {
  (socket: Socket, data: any, event: string, friend: string | string[]): void;
}
