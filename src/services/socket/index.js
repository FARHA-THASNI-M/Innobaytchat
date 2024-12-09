import { io } from "socket.io-client";
import config from "./config";

let socket = null;

export const initializeSocket = () => {
  socket = io(config.SOCKET_URL, {
    // path:'/eb-api/socket.io',
    extraHeaders: {
      token: localStorage.getItem("token"),
    },
  });
};

export const resetSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};

export const getSocket = () => {
  if (!socket) {
    initializeSocket();
  }
  return socket;
};
