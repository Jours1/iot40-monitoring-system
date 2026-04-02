/**
 * ═══════════════════════════════════════════════════════════════
 *  IoT 4.0 — Mongoose Model: Device
 * ═══════════════════════════════════════════════════════════════
 *  Registro opcional de dispositivos con nombre amigable,
 *  ubicación, estado y última conexión.
 * ═══════════════════════════════════════════════════════════════
 */
const mongoose = require('mongoose');

const deviceSchema = new mongoose.Schema(
  {
    // Identificador único (debe coincidir con el que usa el ESP32)
    deviceId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },

    // Nombre legible, ej: "Sensor Aula 01"
    name: {
      type: String,
      default: '',
    },

    // Ubicación descriptiva, ej: "Edificio A, Piso 2"
    location: {
      type: String,
      default: '',
    },

    // Estado del dispositivo
    status: {
      type: String,
      enum: ['online', 'offline', 'unknown'],
      default: 'unknown',
    },

    // Tipos de sensores que soporta este dispositivo
    sensorTypes: {
      type: [String],
      default: [],
    },

    // Última vez que se recibió telemetría
    lastSeen: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
    collection: 'devices',
  }
);

module.exports = mongoose.model('Device', deviceSchema);
