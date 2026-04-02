/**
 * ═══════════════════════════════════════════════════════════════
 *  IoT 4.0 — Backend Route: Health
 * ═══════════════════════════════════════════════════════════════
 */
const { Router } = require('express');
const mongoose = require('mongoose');
const router = Router();

/**
 * GET /api/health
 * Retorna el estado del backend y la conexión a MongoDB.
 */
router.get('/', (_req, res) => {
  const mongoState = mongoose.connection.readyState;
  const stateMap = { 0: 'disconnected', 1: 'connected', 2: 'connecting', 3: 'disconnecting' };

  res.json({
    success: true,
    service: 'iot40-backend',
    status: 'running',
    uptime: process.uptime(),
    mongo: stateMap[mongoState] || 'unknown',
    timestamp: new Date().toISOString(),
  });
});

module.exports = router;
