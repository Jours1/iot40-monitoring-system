/**
 * ═══════════════════════════════════════════════════════════════
 *  IoT 4.0 — Component: LastReading
 * ═══════════════════════════════════════════════════════════════
 *  Muestra el último mensaje recibido con detalle de sensores.
 * ═══════════════════════════════════════════════════════════════
 */
import React from 'react';

const SENSOR_UNITS = {
  temperature: '°C',
  humidity: '%',
  gas: 'ppm',
  light: 'lux',
  pressure: 'hPa',
  co2: 'ppm',
  voltage: 'V',
  current: 'A',
  power: 'W',
};

const SENSOR_ICONS = {
  temperature: '🌡️',
  humidity: '💧',
  gas: '💨',
  light: '☀️',
  pressure: '🌀',
  co2: '🫧',
  voltage: '⚡',
  current: '🔌',
  power: '🔋',
};

export default function LastReading({ message }) {
  if (!message) {
    return (
      <div className="card animate-in">
        <div className="card-header">
          <span className="card-title">📊 Última Lectura</span>
        </div>
        <div className="empty-state">
          <div className="empty-state-icon">📡</div>
          <p className="empty-state-text">Esperando datos del ESP32...</p>
        </div>
      </div>
    );
  }

  const { payload } = message;
  const sensorData = payload?.data || {};

  return (
    <div className="card animate-in">
      <div className="card-header">
        <span className="card-title">📊 Última Lectura en Vivo</span>
        <span className="chip chip--cyan">{payload?.deviceId || '—'}</span>
      </div>

      <div style={{ marginBottom: 'var(--space-sm)', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
        <span>Sensor: <strong style={{ color: 'var(--accent-violet)' }}>{payload?.sensorType || '—'}</strong></span>
        <span style={{ marginLeft: '1rem' }}>
          {payload?.timestamp ? new Date(payload.timestamp).toLocaleString() : '—'}
        </span>
      </div>

      <div className="sensor-grid">
        {Object.entries(sensorData).map(([key, value]) => (
          <div key={key} className="sensor-item">
            <div style={{ fontSize: '1.5rem', marginBottom: '0.25rem' }}>
              {SENSOR_ICONS[key] || '📈'}
            </div>
            <div className="sensor-value">
              {typeof value === 'number' ? value.toFixed(1) : String(value)}
              <span className="sensor-unit"> {SENSOR_UNITS[key] || ''}</span>
            </div>
            <div className="sensor-label">{key}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
