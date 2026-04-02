/**
 * ═══════════════════════════════════════════════════════════════
 *  IoT 4.0 — Backend Service: Telemetry
 * ═══════════════════════════════════════════════════════════════
 *  Lógica de negocio separada de las rutas HTTP.
 * ═══════════════════════════════════════════════════════════════
 */
const Telemetry = require('../models/Telemetry');
const config = require('../config');

/**
 * Persiste un registro de telemetría en MongoDB.
 */
async function saveTelemetry({ deviceId, topic, sensorType, data, timestamp }) {
  const doc = new Telemetry({
    deviceId,
    topic: topic || '',
    sensorType,
    data,
    timestamp: timestamp ? new Date(timestamp) : new Date(),
    receivedAt: new Date(),
  });
  return doc.save();
}

/**
 * Obtiene la última lectura de telemetría (global o por dispositivo).
 */
async function getLatest(deviceId = null) {
  const filter = deviceId ? { deviceId } : {};
  return Telemetry.findOne(filter).sort({ timestamp: -1 }).lean();
}

/**
 * Obtiene historial de telemetría con filtros opcionales.
 */
async function getHistory({ deviceId, from, to, limit, sensorType } = {}) {
  const filter = {};

  if (deviceId) filter.deviceId = deviceId;
  if (sensorType) filter.sensorType = sensorType;

  if (from || to) {
    filter.timestamp = {};
    if (from) filter.timestamp.$gte = new Date(from);
    if (to) filter.timestamp.$lte = new Date(to);
  }

  const maxResults = Math.min(
    parseInt(limit, 10) || config.defaultLimit,
    config.maxLimit
  );

  return Telemetry.find(filter)
    .sort({ timestamp: -1 })
    .limit(maxResults)
    .lean();
}

/**
 * Obtiene telemetría filtrada por dispositivo.
 */
async function getByDevice(deviceId, { from, to, limit } = {}) {
  return getHistory({ deviceId, from, to, limit });
}

module.exports = {
  saveTelemetry,
  getLatest,
  getHistory,
  getByDevice,
};
