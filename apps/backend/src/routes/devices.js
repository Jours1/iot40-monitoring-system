/**
 * ═══════════════════════════════════════════════════════════════
 *  IoT 4.0 — Backend Route: Devices
 * ═══════════════════════════════════════════════════════════════
 *  Endpoints REST para consultar dispositivos registrados.
 * ═══════════════════════════════════════════════════════════════
 */
const { Router } = require('express');
const deviceService = require('../services/deviceService');
const telemetryService = require('../services/telemetryService');
const router = Router();

/**
 * GET /api/devices
 * Lista todos los dispositivos registrados.
 */
router.get('/', async (_req, res, next) => {
  try {
    const devices = await deviceService.listDevices();
    res.json({ success: true, count: devices.length, data: devices });
  } catch (err) {
    next(err);
  }
});

/**
 * GET /api/devices/:deviceId
 * Obtiene información de un dispositivo específico.
 */
router.get('/:deviceId', async (req, res, next) => {
  try {
    const { deviceId } = req.params;
    const device = await deviceService.getDevice(deviceId);

    if (!device) {
      return res.status(404).json({ success: false, error: 'Device not found' });
    }

    res.json({ success: true, data: device });
  } catch (err) {
    next(err);
  }
});

/**
 * GET /api/devices/:deviceId/latest
 * Última lectura de telemetría para un dispositivo.
 */
router.get('/:deviceId/latest', async (req, res, next) => {
  try {
    const { deviceId } = req.params;
    const latest = await telemetryService.getLatest(deviceId);
    res.json({ success: true, deviceId, data: latest });
  } catch (err) {
    next(err);
  }
});

/**
 * GET /api/devices/:deviceId/history
 * Historial de telemetría para un dispositivo.
 * Query: ?from=ISO&to=ISO&limit=100
 */
router.get('/:deviceId/history', async (req, res, next) => {
  try {
    const { deviceId } = req.params;
    const { from, to, limit } = req.query;
    const data = await telemetryService.getByDevice(deviceId, { from, to, limit });
    res.json({ success: true, deviceId, count: data.length, data });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
