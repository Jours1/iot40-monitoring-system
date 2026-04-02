/**
 * ═══════════════════════════════════════════════════════════════
 *  IoT 4.0 — App: Dashboard Principal
 * ═══════════════════════════════════════════════════════════════
 *  Orquesta todos los componentes del dashboard.
 *  Consume la API REST y WebSocket sin recargar la página.
 * ═══════════════════════════════════════════════════════════════
 */
import React, { useState, useEffect } from 'react';
import { useWebSocket } from './hooks/useWebSocket';
import { getBackendHealth, getGatewayHealth, getDevices } from './services/api';

import StatusBadge from './components/StatusBadge';
import StatsCards from './components/StatsCards';
import LastReading from './components/LastReading';
import DeviceList from './components/DeviceList';
import MessageTable from './components/MessageTable';
import HistoryTable from './components/HistoryTable';

// Intervalo de polling para health checks (ms)
const HEALTH_POLL_INTERVAL = 8000;
const DEVICES_POLL_INTERVAL = 15000;

export default function App() {
  // ─── Estado ──────────────────────────────────────────────────
  const [backendHealth, setBackendHealth] = useState(null);
  const [gatewayHealth, setGatewayHealth] = useState(null);
  const [devices, setDevices] = useState([]);
  const [selectedDevice, setSelectedDevice] = useState('');

  // WebSocket en tiempo real
  const { messages, lastMessage, wsStatus, messageCount } = useWebSocket();

  // ─── Polling: Health Checks ──────────────────────────────────
  useEffect(() => {
    async function checkHealth() {
      const [bh, gh] = await Promise.all([
        getBackendHealth(),
        getGatewayHealth(),
      ]);
      setBackendHealth(bh);
      setGatewayHealth(gh);
    }

    checkHealth();
    const timer = setInterval(checkHealth, HEALTH_POLL_INTERVAL);
    return () => clearInterval(timer);
  }, []);

  // ─── Polling: Dispositivos ───────────────────────────────────
  useEffect(() => {
    async function loadDevices() {
      const res = await getDevices();
      if (res?.data) setDevices(res.data);
    }

    loadDevices();
    const timer = setInterval(loadDevices, DEVICES_POLL_INTERVAL);
    return () => clearInterval(timer);
  }, []);

  // ─── Filtrar mensajes WS por dispositivo ─────────────────────
  const filteredMessages = selectedDevice
    ? messages.filter((m) => m.payload?.deviceId === selectedDevice)
    : messages;

  // ─── Render ──────────────────────────────────────────────────
  return (
    <div className="app-layout">
      {/* ─── Header ────────────────────────────────────────────── */}
      <header className="app-header">
        <div className="header-inner">
          <div className="header-brand">
            <div className="header-logo">⚡</div>
            <div>
              <div className="header-title">Sistema IoT 4.0</div>
              <div className="header-subtitle">Monitoreo Remoto con ESP32 — MQTT + WebSocket</div>
            </div>
          </div>
          <div className="header-status">
            <StatusBadge status={backendHealth ? 'online' : 'offline'} label="Backend" />
            <StatusBadge status={gatewayHealth ? 'online' : 'offline'} label="Gateway" />
            <StatusBadge status={wsStatus} label="WebSocket" />
          </div>
        </div>
      </header>

      {/* ─── Main Content ──────────────────────────────────────── */}
      <main className="app-main">
        {/* Stats */}
        <StatsCards
          backendHealth={backendHealth}
          gatewayHealth={gatewayHealth}
          wsStatus={wsStatus}
          messageCount={messageCount}
          deviceCount={devices.length}
        />

        {/* Última lectura + Dispositivos */}
        <div className="grid-two">
          <LastReading message={lastMessage} />
          <DeviceList
            devices={devices}
            selectedDevice={selectedDevice}
            onSelectDevice={setSelectedDevice}
          />
        </div>

        {/* Mensajes en tiempo real (WebSocket) */}
        <div className="grid-full">
          <MessageTable messages={filteredMessages} maxRows={25} />
        </div>

        {/* Historial desde MongoDB */}
        <div className="grid-full">
          <HistoryTable devices={devices} selectedDevice={selectedDevice} />
        </div>
      </main>

      {/* ─── Footer ────────────────────────────────────────────── */}
      <footer style={{
        textAlign: 'center',
        padding: 'var(--space-lg)',
        color: 'var(--text-muted)',
        fontSize: '0.75rem',
        borderTop: '1px solid var(--border-glass)',
      }}>
        IoT 4.0 — Sistema de Monitoreo Remoto · ESP32 + MQTT + Node.js + MongoDB + React
      </footer>
    </div>
  );
}
