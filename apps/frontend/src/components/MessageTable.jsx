/**
 * ═══════════════════════════════════════════════════════════════
 *  IoT 4.0 — Component: MessageTable
 * ═══════════════════════════════════════════════════════════════
 *  Tabla de mensajes recientes recibidos por WebSocket.
 * ═══════════════════════════════════════════════════════════════
 */
import React from 'react';

export default function MessageTable({ messages, maxRows = 30 }) {
  const displayed = messages.slice(0, maxRows);

  if (displayed.length === 0) {
    return (
      <div className="card animate-in">
        <div className="card-header">
          <span className="card-title">📋 Mensajes Recientes (WebSocket)</span>
        </div>
        <div className="empty-state">
          <div className="empty-state-icon">📋</div>
          <p className="empty-state-text">Sin mensajes en esta sesión</p>
        </div>
      </div>
    );
  }

  return (
    <div className="card animate-in">
      <div className="card-header">
        <span className="card-title">📋 Mensajes Recientes — Tiempo Real</span>
        <span className="chip chip--emerald">{messages.length} total</span>
      </div>
      <div className="table-wrapper">
        <table className="data-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Dispositivo</th>
              <th>Sensor</th>
              <th>Datos</th>
              <th>Timestamp</th>
              <th>Recibido</th>
            </tr>
          </thead>
          <tbody>
            {displayed.map((msg, i) => {
              const p = msg.payload || {};
              const dataStr = p.data
                ? Object.entries(p.data)
                    .map(([k, v]) => `${k}: ${typeof v === 'number' ? v.toFixed(1) : v}`)
                    .join(', ')
                : '—';
              return (
                <tr key={`${msg.receivedAt}-${i}`} className={i === 0 ? 'row-new' : ''}>
                  <td style={{ color: 'var(--text-muted)' }}>{messages.length - i}</td>
                  <td>
                    <span className="chip chip--cyan">{p.deviceId || '—'}</span>
                  </td>
                  <td>
                    <span className="chip chip--violet">{p.sensorType || '—'}</span>
                  </td>
                  <td style={{ maxWidth: '300px', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {dataStr}
                  </td>
                  <td style={{ color: 'var(--text-muted)', fontSize: '0.78rem' }}>
                    {p.timestamp ? new Date(p.timestamp).toLocaleTimeString() : '—'}
                  </td>
                  <td style={{ color: 'var(--text-muted)', fontSize: '0.78rem' }}>
                    {msg.receivedAt ? new Date(msg.receivedAt).toLocaleTimeString() : '—'}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
