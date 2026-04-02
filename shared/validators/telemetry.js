/**
 * ═══════════════════════════════════════════════════════════════
 *  IoT 4.0 — Shared Validator: Telemetry Payload
 * ═══════════════════════════════════════════════════════════════
 *  Valida la estructura del mensaje JSON enviado por el ESP32.
 *  Utilizado tanto en el gateway como en el backend.
 * ═══════════════════════════════════════════════════════════════
 */

/**
 * Valida un payload de telemetría
 * @param {object} payload — Objeto JSON parseado
 * @returns {{ valid: boolean, errors: string[] }}
 */
function validateTelemetry(payload) {
  const errors = [];

  if (!payload || typeof payload !== 'object') {
    return { valid: false, errors: ['Payload must be a JSON object'] };
  }

  // deviceId — obligatorio, string no vacío
  if (!payload.deviceId || typeof payload.deviceId !== 'string') {
    errors.push('Missing or invalid "deviceId" (string required)');
  }

  // sensorType — obligatorio, string no vacío
  if (!payload.sensorType || typeof payload.sensorType !== 'string') {
    errors.push('Missing or invalid "sensorType" (string required)');
  }

  // data — obligatorio, objeto con al menos una propiedad
  if (!payload.data || typeof payload.data !== 'object' || Array.isArray(payload.data)) {
    errors.push('Missing or invalid "data" (object required)');
  } else if (Object.keys(payload.data).length === 0) {
    errors.push('"data" object must have at least one property');
  }

  // timestamp — opcional pero si existe debe ser ISO 8601 válido
  if (payload.timestamp !== undefined) {
    const d = new Date(payload.timestamp);
    if (isNaN(d.getTime())) {
      errors.push('Invalid "timestamp" (ISO 8601 format expected)');
    }
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

module.exports = { validateTelemetry };
