import io from 'socket.io-client';

const url = 'https://websocket-server-kqkl.onrender.com'; // Substitua pela URL da sua API de WebSocket

const socket = io(url, {
  autoConnect: false, // Desabilita a conexão automática ao criar o cliente
});

export const connectWebSocket = () => {
  socket.connect(); // Conecta-se ao servidor WebSocket

  socket.on('connect', () => {
    console.log('Conectado ao servidor WebSocket');
  });

  socket.on('disconnect', () => {
    console.log('Desconectado do servidor WebSocket');
  });

  return socket;
};