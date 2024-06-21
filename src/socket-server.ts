import io from 'socket.io-client';

const url = 'https://websocket-server-kqkl.onrender.com'; // Substitua pela URL da sua API de WebSocket

export const connectWebSocket = () => {
  const socket = io(url, {
    transports: ["websocket"],
  });

  return socket;
};