/**
 * ═══════════════════════════════════════════════════════════════
 *  IoT 4.0 — Component: DeviceList
 * ═══════════════════════════════════════════════════════════════
 *  Lista de dispositivos registrados con estado y última conexión.
 * ═══════════════════════════════════════════════════════════════
 */
import React from 'react';
import StatusBadge from './StatusBadge';

export default function DeviceList({ devices, selectedDevice, onSelectDevice }) {
  if (!devices || devices.length === 0) {
    return (
      <div className="card animate-in">
        <div className="card-header">
          <span className="card-title">📱 Dispositivos</span>
        </div>
        <div className="empty-state">
          <div className="empty-state-icon">📱</div>
          <p className="empty-state-text">Sin dispositivos registrados</p>
        </div>
      </div>
    );
  }

  return (
    <div className="card animate-in">
      <div className="card-header">
        <span className="card-title">📱 Dispositivos ({devices.length})</span>
      </div>
      <div className="table-wrapper">
        <table className="data-table">
          <thead>
            <tr>
              <th>Device ID</th>
              <th>Nombre</th>
              <th>Ubicación</th>
              <th>Estado</th>
              <th>Última vez</th>
            </tr>
          </thead>
          <tbody>
            {devices.map((device) => (
              <tr
                key={device.deviceId}
                onClick={() => onSelectDevice?.(device.deviceId === selectedDevice ? '' : device.deviceId)}
                style={{
                  cursor: 'pointer',
                  background: device.deviceId === selectedDevice
                    ? 'rgba(6, 182, 212, 0.1)'
                    : 'transparent',
                }}
              >
                <td>
                  <span className="chip chip--cyan">{device.deviceId}</span>
                </td>
                <td style={{ color: 'var(--text-secondary)' }}>
                  {device.name || '—'}
                </td>
                <td style={{ color: 'var(--text-muted)' }}>
                  {device.location || '—'}
                </td>
                <td>
                  <StatusBadge status={device.status} />
                </td>
                <td style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>
                  {device.lastSeen ? new Date(device.lastSeen).toLocaleString() : 'Nunca'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
