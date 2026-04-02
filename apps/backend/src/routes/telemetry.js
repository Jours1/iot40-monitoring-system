/**
 * ═══════════════════════════════════════════════════════════════
 *  IoT 4.0 — Backend Route: Telemetry
 * ═══════════════════════════════════════════════════════════════
 *  Endpoints REST para consultar y guardar telemetría.
 * ═══════════════════════════════════════════════════════════════
 */
const { Router } = require('express');
const telemetryService = require('../services/telemetryService');
const deviceService = require('../services/deviceService');
const { validateTelemetry } = require('../../../../shared/validators/telemetry');
const router = Router();

/**
 * GET /api/telemetry/latest
 * Última lectura de telemetría (global).
 * Query: ?deviceId=xxx
 */
router.get('/latest', async (req, res, next) => {
  try {
    const { deviceId } = req.query;
    const latest = await telemetryService.getLatest(deviceId || null);
    res.json({ success: true, data: latest });
  } catch (err) {
    next(err);
  }
});

/**
 * GET /api/telemetry/history
 * Historial de telemetría con filtros.
 * Query: ?deviceId=xxx&from=ISO&to=ISO&limit=100&sensorType=xxx
 */
router.get('/history', async (req, res, next) => {
  try {
    const { deviceId, from, to, limit, sensorType } = req.query;
    const data = await telemetryService.getHistory({ deviceId, from, to, limit, sensorType });
    res.json({ success: true, count: data.length, data });
  } catch (err) {
    next(err);
  }
});

/**
 * GET /api/telemetry/by-device/:deviceId
 * Telemetría filtrada por dispositivo.
 * Query: ?from=ISO&to=ISO&limit=100
 */
router.get('/by-device/:deviceId', async (req, res, next) => {
  try {
    const { deviceId } = req.params;
    const { from, to, limit } = req.query;
    const data = await telemetryService.getByDevice(deviceId, { from, to, limit });
    res.json({ success: true, deviceId, count: data.length, data });
  } catch (err) {
    next(err);
  }
});

/**
 * POST /api/telemetry
 * Recibe y persiste un registro de telemetría (usado por el gateway).
 */
router.post('/', async (req, res, next) => {
  try {
    const payload = req.body;
    const validation = validateTelemetry(payload);

    if (!validation.valid) {
      return res.status(400).json({ success: false, errors: validation.errors });
    }

    const saved = await telemetryService.saveTelemetry(payload);

    // Auto-registrar dispositivo
    await deviceService.upsertDevice(payload.deviceId, payload.sensorType);

    res.status(201).json({ success: true, data: saved });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
