/**
 * ═══════════════════════════════════════════════════════════════
 *  IoT 4.0 — Shared Constants: MQTT Topics
 * ═══════════════════════════════════════════════════════════════
 *  Define los topics MQTT utilizados en todo el sistema.
 *  Centralizado para evitar inconsistencias entre módulos.
 * ═══════════════════════════════════════════════════════════════
 */

// Prefijo base para todos los topics de dispositivos IoT
const TOPIC_PREFIX = 'iot/devices';

// Topic wildcard para suscripción a telemetría de todos los dispositivos
const TELEMETRY_WILDCARD = `${TOPIC_PREFIX}/+/telemetry`;

// Topic wildcard para comandos (futuro: control de actuadores)
const COMMAND_WILDCARD = `${TOPIC_PREFIX}/+/command`;

// Topic para estado de dispositivos (futuro: LWT / heartbeat)
const STATUS_WILDCARD = `${TOPIC_PREFIX}/+/status`;

/**
 * Genera el topic de telemetría para un dispositivo específico
 * @param {string} deviceId — Identificador único del dispositivo
 * @returns {string} Topic MQTT completo
 */
function telemetryTopic(deviceId) {
  return `${TOPIC_PREFIX}/${deviceId}/telemetry`;
}

/**
 * Genera el topic de comando para un dispositivo específico
 * @param {string} deviceId
 * @returns {string}
 */
function commandTopic(deviceId) {
  return `${TOPIC_PREFIX}/${deviceId}/command`;
}

/**
 * Extrae el deviceId de un topic MQTT de telemetría
 * @param {string} topic — Ej: "iot/devices/esp32-aula-01/telemetry"
 * @returns {string|null} deviceId o null si no coincide
 */
function extractDeviceId(topic) {
  const match = topic.match(/^iot\/devices\/([^/]+)\/telemetry$/);
  return match ? match[1] : null;
}

module.exports = {
  TOPIC_PREFIX,
  TELEMETRY_WILDCARD,
  COMMAND_WILDCARD,
  STATUS_WILDCARD,
  telemetryTopic,
  commandTopic,
  extractDeviceId,
};
