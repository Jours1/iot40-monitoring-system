/**
 * ═══════════════════════════════════════════════════════════════
 *  IoT 4.0 — Gateway Config
 * ═══════════════════════════════════════════════════════════════
 */
require('dotenv').config();
const defaults = require('../../../../shared/config/defaults');

module.exports = {
  mqtt: {
    url: process.env.MQTT_URL || defaults.MQTT_URL,
    topic: process.env.MQTT_TOPIC || 'iot/devices/+/telemetry',
    clientId: `iot40-gateway-${Date.now()}`,
    reconnectPeriod: 5000,
  },
  ws: {
    port: parseInt(process.env.WS_PORT, 10) || defaults.GATEWAY_WS_PORT,
  },
  http: {
    port: parseInt(process.env.HTTP_PORT, 10) || defaults.GATEWAY_HTTP_PORT,
  },
  mongoUri: process.env.MONGO_URI || defaults.MONGO_URI,
  backendUrl: process.env.BACKEND_URL || 'http://localhost:3000',
  nodeEnv: process.env.NODE_ENV || 'development',
};
