import { io, Socket } from "socket.io-client";
import { config } from "../config";

let socketInstance: Socket | null = null;

export function getSocket(): Socket {
  if (socketInstance) {
    return socketInstance;
  }
  const url = config.apiUrl;
  socketInstance = io(url, {
    transports: ["websocket"],
    autoConnect: true,
  });
  return socketInstance;
}
