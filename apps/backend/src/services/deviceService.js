/**
 * ═══════════════════════════════════════════════════════════════
 *  IoT 4.0 — Backend Service: Device
 * ═══════════════════════════════════════════════════════════════
 *  Lógica de negocio para gestión de dispositivos.
 *  Auto-registra dispositivos cuando llega telemetría nueva.
 * ═══════════════════════════════════════════════════════════════
 */
const Device = require('../models/Device');

/**
 * Lista todos los dispositivos registrados.
 */
async function listDevices() {
  return Device.find().sort({ lastSeen: -1 }).lean();
}

/**
 * Obtiene un dispositivo por su deviceId.
 */
async function getDevice(deviceId) {
  return Device.findOne({ deviceId }).lean();
}

/**
 * Registra o actualiza un dispositivo (upsert).
 * Se invoca automáticamente cada vez que llega telemetría.
 */
async function upsertDevice(deviceId, sensorType) {
  const update = {
    $set: {
      lastSeen: new Date(),
      status: 'online',
    },
    $addToSet: {},
  };

  if (sensorType) {
    update.$addToSet.sensorTypes = sensorType;
  }

  return Device.findOneAndUpdate(
    { deviceId },
    update,
    { upsert: true, new: true, setDefaultsOnInsert: true }
  );
}

/**
 * Obtiene la lista de deviceIds únicos desde la colección de telemetría.
 * Útil como fallback si no se usa la colección devices.
 */
async function getUniqueDeviceIds() {
  const Telemetry = require('../models/Telemetry');
  return Telemetry.distinct('deviceId');
}

module.exports = {
  listDevices,
  getDevice,
  upsertDevice,
  getUniqueDeviceIds,
};
