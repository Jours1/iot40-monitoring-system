/**
 * ═══════════════════════════════════════════════════════════════
 *  IoT 4.0 — Gateway Entry Point
 * ═══════════════════════════════════════════════════════════════
 *  Orquesta todos los subsistemas del gateway:
 *  1. MongoDB para persistencia
 *  2. WebSocket para difusión en tiempo real
 *  3. MQTT client para recibir telemetría
 *  4. HTTP server para health checks
 * ═══════════════════════════════════════════════════════════════
 */
const { connectMongo } = require('./persistence/mongo');
const wsServer = require('./websocket/server');
const mqttClient = require('./mqtt/client');
const { handleTelemetry } = require('./mqtt/handlers');
const httpServer = require('./http/server');

async function start() {
  try {
    console.log('═══════════════════════════════════════════');
    console.log('  IoT 4.0 — Gateway Starting...');
    console.log('═══════════════════════════════════════════');

    // 1. Conectar a MongoDB
    await connectMongo();

    // 2. Iniciar WebSocket server
    wsServer.start();

    // 3. Conectar al broker MQTT y procesar mensajes
    mqttClient.connect(handleTelemetry);

    // 4. Iniciar HTTP server (health endpoint)
    httpServer.start();

    console.log('═══════════════════════════════════════════');
    console.log('  ✅ Gateway fully operational');
    console.log('═══════════════════════════════════════════');
  } catch (err) {
    console.error('❌ Gateway failed to start:', err.message);
    process.exit(1);
  }
}

// ─── Graceful Shutdown ──────────────────────────────────────────
function shutdown(signal) {
  console.log(`\n🛑 Gateway shutting down (${signal})...`);
  mqttClient.disconnect();
  wsServer.stop();
  const mongoose = require('mongoose');
  mongoose.connection.close().then(() => {
    console.log('✅ Gateway stopped cleanly');
    process.exit(0);
  });
}

process.on('SIGINT', () => shutdown('SIGINT'));
process.on('SIGTERM', () => shutdown('SIGTERM'));

start();
