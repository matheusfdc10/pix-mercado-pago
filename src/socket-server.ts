import io from 'socket.io-client';

const url = 'https://websocket-server-kqkl.onrender.com';
// const url = 'http://localhost:4000';

export const connectWebSocket = () => {
  const socket = io(url, {
    transports: ["websocket"],
  });

  return socket;
};