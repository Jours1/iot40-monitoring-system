/**
 * ═══════════════════════════════════════════════════════════════
 *  IoT 4.0 — Frontend Hook: useWebSocket
 * ═══════════════════════════════════════════════════════════════
 *  Hook de React para gestión del WebSocket del gateway.
 *  Maneja conexión, reconexión automática y estado.
 * ═══════════════════════════════════════════════════════════════
 */
import { useState, useEffect, useRef, useCallback } from 'react';

const WS_URL = import.meta.env.VITE_WS_URL || 'ws://localhost:8081';
const RECONNECT_DELAY = 3000;
const MAX_MESSAGES = 200;

/**
 * @returns {{ messages, lastMessage, wsStatus, messageCount }}
 */
export function useWebSocket() {
  const [messages, setMessages] = useState([]);
  const [lastMessage, setLastMessage] = useState(null);
  const [wsStatus, setWsStatus] = useState('disconnected'); // connected | disconnected | connecting
  const [messageCount, setMessageCount] = useState(0);
  const wsRef = useRef(null);
  const reconnectTimer = useRef(null);

  const connect = useCallback(() => {
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) return;

    setWsStatus('connecting');
    const ws = new WebSocket(WS_URL);

    ws.onopen = () => {
      console.log('✅ WebSocket connected');
      setWsStatus('connected');
    };

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);

        // Ignorar mensajes de bienvenida para la tabla
        if (data.type === 'welcome') return;

        if (data.type === 'telemetry') {
          setLastMessage(data);
          setMessageCount((c) => c + 1);
          setMessages((prev) => {
            const updated = [data, ...prev];
            return updated.slice(0, MAX_MESSAGES);
          });
        }
      } catch (err) {
        console.error('WS parse error:', err);
      }
    };

    ws.onclose = () => {
      console.log('🔌 WebSocket disconnected');
      setWsStatus('disconnected');
      // Auto-reconexión
      reconnectTimer.current = setTimeout(connect, RECONNECT_DELAY);
    };

    ws.onerror = (err) => {
      console.error('WebSocket error:', err);
      ws.close();
    };

    wsRef.current = ws;
  }, []);

  useEffect(() => {
    connect();
    return () => {
      if (reconnectTimer.current) clearTimeout(reconnectTimer.current);
      if (wsRef.current) wsRef.current.close();
    };
  }, [connect]);

  return { messages, lastMessage, wsStatus, messageCount };
}
