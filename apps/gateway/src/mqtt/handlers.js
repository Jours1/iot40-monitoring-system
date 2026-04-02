/**
 * ═══════════════════════════════════════════════════════════════
 *  IoT 4.0 — Gateway: MQTT Message Handlers
 * ═══════════════════════════════════════════════════════════════
 *  Valida, persiste y difunde cada mensaje de telemetría.
 * ═══════════════════════════════════════════════════════════════
 */
const { validateTelemetry } = require('../../../../shared/validators/telemetry');
const { extractDeviceId } = require('../../../../shared/constants/topics');
const { saveTelemetry } = require('../persistence/mongo');
const { broadcast } = require('../websocket/server');

// Contador de mensajes procesados (para métricas/health)
let messageCount = 0;
let lastMessage = null;

/**
 * Handler principal para cada mensaje MQTT recibido.
 * @param {string} topic — Topic MQTT completo
 * @param {object} payload — Objeto JSON ya parseado
 */
async function handleTelemetry(topic, payload) {
  // 1. Extraer deviceId del topic
  const topicDeviceId = extractDeviceId(topic);

  // 2. Enriquecer el payload si falta info
  if (!payload.deviceId && topicDeviceId) {
    payload.deviceId = topicDeviceId;
  }

  if (!payload.timestamp) {
    payload.timestamp = new Date().toISOString();
  }

  // 3. Validar
  const validation = validateTelemetry(payload);
  if (!validation.valid) {
    console.warn(`⚠️  Invalid telemetry from ${topic}:`, validation.errors);
    return;
  }

  // 4. Log
  messageCount++;
  lastMessage = { topic, payload, receivedAt: new Date().toISOString() };
  console.log(`📥 [${messageCount}] ${payload.deviceId} → ${payload.sensorType}: ${JSON.stringify(payload.data)}`);

  // 5. Persistir en MongoDB
  try {
    await saveTelemetry({ ...payload, topic });
  } catch (err) {
    console.error('❌ Persistence error:', err.message);
  }

  // 6. Difundir por WebSocket a todos los clientes conectados
  broadcast({
    type: 'telemetry',
    topic,
    payload,
    receivedAt: new Date().toISOString(),
  });
}

/**
 * Retorna estadísticas del handler.
 */
function getStats() {
  return { messageCount, lastMessage };
}

module.exports = { handleTelemetry, getStats };
