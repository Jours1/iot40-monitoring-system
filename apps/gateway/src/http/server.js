/**
 * ═══════════════════════════════════════════════════════════════
 *  IoT 4.0 — Gateway: HTTP Health Server
 * ═══════════════════════════════════════════════════════════════
 *  Expone un endpoint /health para monitoreo del gateway.
 * ═══════════════════════════════════════════════════════════════
 */
const express = require('express');
const cors = require('cors');
const config = require('../config');
const { isConnected } = require('../mqtt/client');
const { getClientCount } = require('../websocket/server');
const { getStats } = require('../mqtt/handlers');

/**
 * Inicia el servidor HTTP del gateway.
 */
function start() {
  const app = express();
  app.use(cors());

  /**
   * GET /health
   * Estado completo del gateway: MQTT, WebSocket, mensajes procesados.
   */
  app.get('/health', (_req, res) => {
    const stats = getStats();
    res.json({
      success: true,
      service: 'iot40-gateway',
      status: 'running',
      uptime: process.uptime(),
      mqtt: {
        connected: isConnected(),
        broker: config.mqtt.url,
        topic: config.mqtt.topic,
      },
      websocket: {
        port: config.ws.port,
        clients: getClientCount(),
      },
      messages: {
        total: stats.messageCount,
        last: stats.lastMessage,
      },
      timestamp: new Date().toISOString(),
    });
  });

  // Ruta raíz informativa
  app.get('/', (_req, res) => {
    res.json({
      service: 'IoT 4.0 Gateway',
      version: '1.0.0',
      health: '/health',
    });
  });

  app.listen(config.http.port, () => {
    console.log(`🌐 Gateway HTTP running on port ${config.http.port}`);
    console.log(`   Health: http://localhost:${config.http.port}/health`);
  });
}

module.exports = { start };
