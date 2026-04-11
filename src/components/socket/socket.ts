import { io, type Socket } from "socket.io-client";
import { STORAGE_KEYS } from "../../api/api";

const SOCKET_URL = "https://api.connectfour.oluwatobii.xyz";

/**
 * Create a socket connection with JWT auth.
 * The token is read from localStorage at connection time.
 */
const createSocket = (): Socket => {
  const token = localStorage.getItem(STORAGE_KEYS.accessToken) ?? "";

  return io(SOCKET_URL, {
    auth: { token },
    autoConnect: false, // we connect manually after game creation
  });
};

let socket = createSocket();

/**
 * Reconnect the socket (e.g. after token refresh).
 * Disconnects the old socket and creates a fresh one with the new token.
 */
export const reconnectSocket = (): Socket => {
  if (socket.connected) {
    socket.disconnect();
  }
  socket = createSocket();
  socket.connect();
  return socket;
};

export default socket;
