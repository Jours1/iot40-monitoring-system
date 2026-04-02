/**
 * ═══════════════════════════════════════════════════════════════
 *  IoT 4.0 — Gateway: MongoDB Persistence
 * ═══════════════════════════════════════════════════════════════
 *  Guarda la telemetría directamente en MongoDB desde el gateway.
 *  Reutiliza el mismo esquema que el backend.
 * ═══════════════════════════════════════════════════════════════
 */
const mongoose = require('mongoose');
const config = require('../config');

// ─── Esquema de Telemetry (duplicado ligero para independencia) ─
const telemetrySchema = new mongoose.Schema(
  {
    deviceId: { type: String, required: true, index: true },
    topic: { type: String, default: '' },
    sensorType: { type: String, required: true, index: true },
    data: { type: mongoose.Schema.Types.Mixed, required: true },
    timestamp: { type: Date, default: Date.now, index: true },
    receivedAt: { type: Date, default: Date.now },
  },
  { timestamps: true, collection: 'telemetry' }
);

telemetrySchema.index({ deviceId: 1, timestamp: -1 });

// Evitar OverwriteModelError si ya está registrado
const Telemetry = mongoose.models.Telemetry || mongoose.model('Telemetry', telemetrySchema);

// ─── Esquema de Device (para auto-registro) ────────────────────
const deviceSchema = new mongoose.Schema(
  {
    deviceId: { type: String, required: true, unique: true, index: true },
    name: { type: String, default: '' },
    location: { type: String, default: '' },
    status: { type: String, enum: ['online', 'offline', 'unknown'], default: 'unknown' },
    sensorTypes: { type: [String], default: [] },
    lastSeen: { type: Date, default: null },
  },
  { timestamps: true, collection: 'devices' }
);

const Device = mongoose.models.Device || mongoose.model('Device', deviceSchema);

/**
 * Conecta a MongoDB.
 */
async function connectMongo() {
  try {
    console.log('🔌 Gateway MongoDB: Connecting...');
    await mongoose.connect(config.mongoUri);
    console.log('✅ Gateway MongoDB: Connected');
  } catch (err) {
    console.error('❌ Gateway MongoDB: Connection failed:', err.message);
    throw err;
  }
}

/**
 * Guarda un registro de telemetría y auto-registra el dispositivo.
 */
async function saveTelemetry({ deviceId, topic, sensorType, data, timestamp }) {
  // Persistir telemetría
  const doc = new Telemetry({
    deviceId,
    topic: topic || '',
    sensorType,
    data,
    timestamp: timestamp ? new Date(timestamp) : new Date(),
    receivedAt: new Date(),
  });
  await doc.save();

  // Auto-registrar/actualizar dispositivo
  try {
    await Device.findOneAndUpdate(
      { deviceId },
      {
        $set: { lastSeen: new Date(), status: 'online' },
        $addToSet: sensorType ? { sensorTypes: sensorType } : {},
      },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );
  } catch (err) {
    // No-fatal: el dispositivo puede no registrarse correctamente en edge cases
    console.warn('⚠️  Device upsert warning:', err.message);
  }
}

module.exports = { connectMongo, saveTelemetry };
