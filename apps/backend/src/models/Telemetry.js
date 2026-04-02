/**
 * ═══════════════════════════════════════════════════════════════
 *  IoT 4.0 — Mongoose Model: Telemetry
 * ═══════════════════════════════════════════════════════════════
 *  Almacena cada lectura de sensor recibida desde los ESP32.
 *  El campo `data` es un Schema.Types.Mixed para admitir
 *  cualquier tipo de sensor sin modificar el esquema.
 * ═══════════════════════════════════════════════════════════════
 */
const mongoose = require('mongoose');

const telemetrySchema = new mongoose.Schema(
  {
    // Identificador único del dispositivo, ej: "esp32-aula-01"
    deviceId: {
      type: String,
      required: true,
      index: true,
    },

    // Topic MQTT original, ej: "iot/devices/esp32-aula-01/telemetry"
    topic: {
      type: String,
      default: '',
    },

    // Tipo de sensor, ej: "environment", "motion", "energy"
    sensorType: {
      type: String,
      required: true,
      index: true,
    },

    // Datos del sensor — esquema flexible (Mixed)
    data: {
      type: mongoose.Schema.Types.Mixed,
      required: true,
    },

    // Timestamp reportado por el dispositivo (puede diferir del servidor)
    timestamp: {
      type: Date,
      default: Date.now,
      index: true,
    },

    // Momento en que el servidor recibió el dato
    receivedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    // Agrega createdAt / updatedAt automáticamente
    timestamps: true,
    // Colección explícita
    collection: 'telemetry',
  }
);

// Índice compuesto para consultas frecuentes por dispositivo + tiempo
telemetrySchema.index({ deviceId: 1, timestamp: -1 });

module.exports = mongoose.model('Telemetry', telemetrySchema);
