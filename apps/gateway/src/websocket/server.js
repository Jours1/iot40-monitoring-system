/**
 * ═══════════════════════════════════════════════════════════════
 *  IoT 4.0 — Gateway: WebSocket Server
 * ═══════════════════════════════════════════════════════════════
 *  Difunde mensajes de telemetría en tiempo real a los clientes
 *  web conectados (frontend dashboard).
 * ═══════════════════════════════════════════════════════════════
 */
const { WebSocketServer } = require('ws');
const config = require('../config');

let wss = null;

/**
 * Inicia el servidor WebSocket.
 */
function start() {
  wss = new WebSocketServer({ port: config.ws.port });

  wss.on('listening', () => {
    console.log(`🌐 WebSocket server running on port ${config.ws.port}`);
  });

  wss.on('connection', (ws, req) => {
    const clientIp = req.socket.remoteAddress;
    console.log(`🔗 WS: Client connected (${clientIp}) — Total: ${wss.clients.size}`);

    // Enviar mensaje de bienvenida
    ws.send(JSON.stringify({
      type: 'welcome',
      message: 'Connected to IoT 4.0 Gateway WebSocket',
      timestamp: new Date().toISOString(),
    }));

    ws.on('close', () => {
      console.log(`🔌 WS: Client disconnected — Total: ${wss.clients.size}`);
    });

    ws.on('error', (err) => {
      console.error('⚠️  WS: Client error:', err.message);
    });
  });

  wss.on('error', (err) => {
    console.error('❌ WS Server error:', err.message);
  });

  return wss;
}

/**
 * Difunde un mensaje JSON a todos los clientes conectados.
 * @param {object} data — Datos a enviar
 */
function broadcast(data) {
  if (!wss) return;

  const message = JSON.stringify(data);
  let sent = 0;

  wss.clients.forEach((client) => {
    if (client.readyState === 1) { // WebSocket.OPEN
      client.send(message);
      sent++;
    }
  });

  if (sent > 0) {
    console.log(`📤 WS: Broadcast to ${sent} client(s)`);
  }
}

/**
 * Retorna el número de clientes conectados.
 */
function getClientCount() {
  return wss ? wss.clients.size : 0;
}

/**
 * Cierra el servidor WebSocket.
 */
function stop() {
  if (wss) {
    wss.close();
    console.log('🛑 WebSocket server stopped');
  }
}

module.exports = { start, broadcast, getClientCount, stop };
