/**
 * ═══════════════════════════════════════════════════════════════
 *  IoT 4.0 — Component: StatusBadge
 * ═══════════════════════════════════════════════════════════════
 */
import React from 'react';

const STATUS_MAP = {
  connected: { label: 'Online', className: 'status-badge--online' },
  online: { label: 'Online', className: 'status-badge--online' },
  running: { label: 'Running', className: 'status-badge--online' },
  disconnected: { label: 'Offline', className: 'status-badge--offline' },
  offline: { label: 'Offline', className: 'status-badge--offline' },
  connecting: { label: 'Connecting', className: 'status-badge--connecting' },
  unknown: { label: 'Unknown', className: 'status-badge--offline' },
};

export default function StatusBadge({ status, label }) {
  const config = STATUS_MAP[status] || STATUS_MAP.unknown;
  const isPulsing = status === 'connected' || status === 'online' || status === 'running';

  return (
    <span className={`status-badge ${config.className}`}>
      <span className={`status-dot ${isPulsing ? 'status-dot--pulse' : ''}`} />
      {label || config.label}
    </span>
  );
}
