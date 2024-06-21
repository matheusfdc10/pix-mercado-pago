import io from 'socket.io-client';

const SOCKET_URL = 'https://websocket-server-kqkl.onrender.com'; // Substitua pela URL da sua API de WebSocket

const socket = io(SOCKET_URL, {
  transports: ["websocket"],
  autoConnect: false,
});

export const connectWebSocket = () => {
  socket.connect();

  socket.on('connect', () => {
    console.log('Conectado ao servidor WebSocket');
  });

  return socket;
};