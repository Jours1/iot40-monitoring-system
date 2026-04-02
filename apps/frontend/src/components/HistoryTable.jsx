/**
 * ═══════════════════════════════════════════════════════════════
 *  IoT 4.0 — Component: HistoryTable
 * ═══════════════════════════════════════════════════════════════
 *  Tabla de historial de telemetría desde la API REST + filtros.
 * ═══════════════════════════════════════════════════════════════
 */
import React, { useState, useEffect } from 'react';
import { getTelemetryHistory } from '../services/api';

export default function HistoryTable({ devices, selectedDevice }) {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [limit, setLimit] = useState(50);

  async function loadHistory() {
    setLoading(true);
    const res = await getTelemetryHistory({
      deviceId: selectedDevice || undefined,
      from: fromDate || undefined,
      to: toDate || undefined,
      limit,
    });
    setHistory(res?.data || []);
    setLoading(false);
  }

  // Cargar al montar y cuando cambie el dispositivo seleccionado
  useEffect(() => {
    loadHistory();
  }, [selectedDevice]);

  return (
    <div className="card animate-in">
      <div className="card-header">
        <span className="card-title">📚 Historial de Telemetría (MongoDB)</span>
        <span className="chip chip--amber">{history.length} registros</span>
      </div>

      {/* Filtros */}
      <div className="filters-bar">
        <div className="filter-group">
          <label className="filter-label">Dispositivo</label>
          <select
            className="filter-select"
            value={selectedDevice || ''}
            disabled
            title="Selecciona un dispositivo en la tabla superior"
          >
            <option value="">Todos</option>
            {devices.map((d) => (
              <option key={d.deviceId} value={d.deviceId}>
                {d.deviceId}
              </option>
            ))}
          </select>
        </div>

        <div className="filter-group">
          <label className="filter-label">Desde</label>
          <input
            type="datetime-local"
            className="filter-input"
            value={fromDate}
            onChange={(e) => setFromDate(e.target.value)}
          />
        </div>

        <div className="filter-group">
          <label className="filter-label">Hasta</label>
          <input
            type="datetime-local"
            className="filter-input"
            value={toDate}
            onChange={(e) => setToDate(e.target.value)}
          />
        </div>

        <div className="filter-group">
          <label className="filter-label">Límite</label>
          <select
            className="filter-select"
            value={limit}
            onChange={(e) => setLimit(Number(e.target.value))}
          >
            <option value={20}>20</option>
            <option value={50}>50</option>
            <option value={100}>100</option>
            <option value={500}>500</option>
          </select>
        </div>

        <button className="filter-btn" onClick={loadHistory} disabled={loading}>
          {loading ? '⏳ Cargando...' : '🔍 Consultar'}
        </button>
      </div>

      {/* Tabla */}
      <div className="table-wrapper">
        <table className="data-table">
          <thead>
            <tr>
              <th>Dispositivo</th>
              <th>Sensor</th>
              <th>Datos</th>
              <th>Timestamp</th>
              <th>Recibido</th>
            </tr>
          </thead>
          <tbody>
            {history.length === 0 ? (
              <tr>
                <td colSpan={5} style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '2rem' }}>
                  {loading ? 'Cargando...' : 'Sin registros'}
                </td>
              </tr>
            ) : (
              history.map((row, i) => {
                const dataStr = row.data
                  ? Object.entries(row.data)
                      .map(([k, v]) => `${k}: ${typeof v === 'number' ? v.toFixed(1) : v}`)
                      .join(', ')
                  : '—';
                return (
                  <tr key={row._id || i}>
                    <td><span className="chip chip--cyan">{row.deviceId}</span></td>
                    <td><span className="chip chip--violet">{row.sensorType}</span></td>
                    <td style={{ maxWidth: '300px', overflow: 'hidden', textOverflow: 'ellipsis' }}>{dataStr}</td>
                    <td style={{ color: 'var(--text-muted)', fontSize: '0.78rem' }}>
                      {row.timestamp ? new Date(row.timestamp).toLocaleString() : '—'}
                    </td>
                    <td style={{ color: 'var(--text-muted)', fontSize: '0.78rem' }}>
                      {row.receivedAt ? new Date(row.receivedAt).toLocaleString() : '—'}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
