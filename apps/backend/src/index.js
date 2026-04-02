/**
 * ═══════════════════════════════════════════════════════════════
 *  IoT 4.0 — Backend Entry Point
 * ═══════════════════════════════════════════════════════════════
 *  Inicializa Express, conecta a MongoDB y monta las rutas REST.
 * ═══════════════════════════════════════════════════════════════
 */
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const mongoose = require('mongoose');

const config = require('./config');
const errorHandler = require('./middleware/errorHandler');

// Rutas
const healthRoutes = require('./routes/health');
const telemetryRoutes = require('./routes/telemetry');
const deviceRoutes = require('./routes/devices');

const app = express();

// ─── Middleware Global ──────────────────────────────────────────
app.use(cors());
app.use(express.json({ limit: '1mb' }));
app.use(morgan('dev'));

// ─── Rutas ──────────────────────────────────────────────────────
app.use('/api/health', healthRoutes);
app.use('/api/telemetry', telemetryRoutes);
app.use('/api/devices', deviceRoutes);

// Ruta raíz informativa
app.get('/', (_req, res) => {
  res.json({
    service: 'IoT 4.0 Backend',
    version: '1.0.0',
    docs: '/api/health',
  });
});

// ─── 404 ────────────────────────────────────────────────────────
app.use((_req, res) => {
  res.status(404).json({ success: false, error: 'Endpoint not found' });
});

// ─── Error Handler ──────────────────────────────────────────────
app.use(errorHandler);

// ─── MongoDB + Server ───────────────────────────────────────────
async function start() {
  try {
    console.log('🔌 Connecting to MongoDB...');
    await mongoose.connect(config.mongoUri);
    console.log('✅ MongoDB connected');

    app.listen(config.port, () => {
      console.log(`🚀 IoT 4.0 Backend running on port ${config.port}`);
      console.log(`   Environment: ${config.nodeEnv}`);
      console.log(`   Health:      http://localhost:${config.port}/api/health`);
    });
  } catch (err) {
    console.error('❌ Failed to start backend:', err.message);
    process.exit(1);
  }
}

// Graceful shutdown
process.on('SIGINT', async () => {
  console.log('\n🛑 Shutting down backend...');
  await mongoose.connection.close();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  await mongoose.connection.close();
  process.exit(0);
});

start();
