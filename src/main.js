// src/main.js
import web from './application/web.js';
import { logger } from './application/logging.js';
import { WebSocket, WebSocketServer } from 'ws';

const PORT = 3000;
const server = web.listen(PORT, () => {
  logger.info(`Server running at http://localhost:${PORT}`);
});

// WebSocket setup
const wss = new WebSocketServer({ server, path: '/ws' });
let connectedClients = [];

wss.on('connection', (ws) => {
  connectedClients.push(ws);
  logger.info('WebSocket connection established');

  ws.on('close', () => {
    connectedClients = connectedClients.filter(client => client !== ws);
    logger.info('WebSocket connection closed');
  });
});

// Function to send messages to all connected clients
const sendToClients = (message) => {
  console.log("Sending to clients:", message);
  connectedClients.forEach(client => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify(message));
      console.log("Sent to client:", JSON.stringify(message));
    } else {
      console.warn("Client not open, cannot send message:", client.readyState);
    }
  });
};

// Export the sendToClients function for use in other modules
export { sendToClients };