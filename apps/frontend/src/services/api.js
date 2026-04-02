/**
 * ═══════════════════════════════════════════════════════════════
 *  IoT 4.0 — Frontend: API Service
 * ═══════════════════════════════════════════════════════════════
 *  Centraliza todas las llamadas al backend REST.
 * ═══════════════════════════════════════════════════════════════
 */

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000';
const GATEWAY_URL = import.meta.env.VITE_GATEWAY_URL || 'http://localhost:3001';

/**
 * Fetch wrapper con manejo de errores.
 */
async function fetchJSON(url) {
  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } catch (err) {
    console.error(`API Error [${url}]:`, err.message);
    return null;
  }
}

/** GET /api/health — Estado del backend */
export async function getBackendHealth() {
  return fetchJSON(`${BACKEND_URL}/api/health`);
}

/** GET /health — Estado del gateway */
export async function getGatewayHealth() {
  return fetchJSON(`${GATEWAY_URL}/health`);
}

/** GET /api/telemetry/latest — Última lectura global */
export async function getLatestTelemetry(deviceId = '') {
  const qs = deviceId ? `?deviceId=${encodeURIComponent(deviceId)}` : '';
  return fetchJSON(`${BACKEND_URL}/api/telemetry/latest${qs}`);
}

/** GET /api/telemetry/history — Historial con filtros */
export async function getTelemetryHistory({ deviceId, from, to, limit } = {}) {
  const params = new URLSearchParams();
  if (deviceId) params.set('deviceId', deviceId);
  if (from) params.set('from', from);
  if (to) params.set('to', to);
  if (limit) params.set('limit', String(limit));
  const qs = params.toString() ? `?${params.toString()}` : '';
  return fetchJSON(`${BACKEND_URL}/api/telemetry/history${qs}`);
}

/** GET /api/devices — Lista de dispositivos */
export async function getDevices() {
  return fetchJSON(`${BACKEND_URL}/api/devices`);
}

/** GET /api/devices/:id/latest — Última lectura de un dispositivo */
export async function getDeviceLatest(deviceId) {
  return fetchJSON(`${BACKEND_URL}/api/devices/${encodeURIComponent(deviceId)}/latest`);
}

/** GET /api/devices/:id/history — Historial de un dispositivo */
export async function getDeviceHistory(deviceId, { from, to, limit } = {}) {
  const params = new URLSearchParams();
  if (from) params.set('from', from);
  if (to) params.set('to', to);
  if (limit) params.set('limit', String(limit));
  const qs = params.toString() ? `?${params.toString()}` : '';
  return fetchJSON(`${BACKEND_URL}/api/devices/${encodeURIComponent(deviceId)}/history${qs}`);
}
