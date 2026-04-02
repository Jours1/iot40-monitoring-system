/**
 * ═══════════════════════════════════════════════════════════════
 *  IoT 4.0 — Component: StatsCards
 * ═══════════════════════════════════════════════════════════════
 *  Tarjetas de métricas principales del dashboard.
 * ═══════════════════════════════════════════════════════════════
 */
import React from 'react';
import StatusBadge from './StatusBadge';

export default function StatsCards({
  backendHealth,
  gatewayHealth,
  wsStatus,
  messageCount,
  deviceCount,
}) {
  const cards = [
    {
      icon: '🖥️',
      title: 'Backend API',
      value: backendHealth ? 'Online' : 'Offline',
      status: backendHealth ? 'online' : 'offline',
      label: backendHealth?.mongo || '—',
      labelPrefix: 'MongoDB: ',
      color: 'var(--accent-cyan)',
    },
    {
      icon: '🌐',
      title: 'Gateway',
      value: gatewayHealth ? 'Online' : 'Offline',
      status: gatewayHealth ? 'online' : 'offline',
      label: gatewayHealth?.mqtt?.connected ? 'MQTT Connected' : 'MQTT Disconnected',
      color: 'var(--accent-violet)',
    },
    {
      icon: '⚡',
      title: 'WebSocket',
      value: wsStatus === 'connected' ? 'Connected' : wsStatus,
      status: wsStatus,
      label: `Gateway WS`,
      color: 'var(--accent-emerald)',
    },
    {
      icon: '📡',
      title: 'Dispositivos',
      value: deviceCount,
      status: deviceCount > 0 ? 'online' : 'unknown',
      label: 'Registrados',
      color: 'var(--accent-amber)',
    },
    {
      icon: '📨',
      title: 'Mensajes WS',
      value: messageCount,
      status: messageCount > 0 ? 'online' : 'unknown',
      label: 'Recibidos en sesión',
      color: 'var(--accent-blue)',
    },
  ];

  return (
    <div className="grid-stats">
      {cards.map((card, i) => (
        <div
          key={i}
          className="card animate-in"
          style={{ animationDelay: `${i * 0.08}s`, borderTop: `2px solid ${card.color}` }}
        >
          <div className="card-header">
            <span className="card-title">{card.title}</span>
            <span className="card-icon">{card.icon}</span>
          </div>
          <div className="card-value" style={{ color: card.color }}>
            {card.value}
          </div>
          <div className="card-label">
            {card.labelPrefix || ''}{card.label}
          </div>
        </div>
      ))}
    </div>
  );
}
