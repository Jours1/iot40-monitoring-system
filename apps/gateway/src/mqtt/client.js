/**
 * ═══════════════════════════════════════════════════════════════
 *  IoT 4.0 — Gateway: MQTT Client
 * ═══════════════════════════════════════════════════════════════
 *  Se conecta al broker Mosquitto y se suscribe a los topics
 *  de telemetría. Delega el procesamiento a los handlers.
 * ═══════════════════════════════════════════════════════════════
 */
const mqtt = require('mqtt');
const config = require('../config');

let client = null;

/**
 * Conecta al broker MQTT y configura eventos.
 * @param {Function} onMessage — Callback (topic, payload) para cada mensaje recibido
 * @returns {mqtt.MqttClient}
 */
function connect(onMessage) {
  console.log(`🔌 MQTT: Connecting to ${config.mqtt.url}...`);

  client = mqtt.connect(config.mqtt.url, {
    clientId: config.mqtt.clientId,
    reconnectPeriod: config.mqtt.reconnectPeriod,
    clean: true,
  });

  client.on('connect', () => {
    console.log('✅ MQTT: Connected to broker');
    client.subscribe(config.mqtt.topic, { qos: 1 }, (err) => {
      if (err) {
        console.error('❌ MQTT: Subscribe error:', err.message);
      } else {
        console.log(`📡 MQTT: Subscribed to "${config.mqtt.topic}"`);
      }
    });
  });

  client.on('message', (topic, message) => {
    try {
      const payload = JSON.parse(message.toString());
      onMessage(topic, payload);
    } catch (err) {
      console.error(`⚠️  MQTT: Failed to parse message on ${topic}:`, err.message);
    }
  });

  client.on('reconnect', () => {
    console.log('🔄 MQTT: Reconnecting...');
  });

  client.on('error', (err) => {
    console.error('❌ MQTT: Error:', err.message);
  });

  client.on('close', () => {
    console.log('🔌 MQTT: Connection closed');
  });

  client.on('offline', () => {
    console.log('⚠️  MQTT: Client offline');
  });

  return client;
}

/**
 * Desconecta limpiamente.
 */
function disconnect() {
  if (client) {
    client.end(true);
    console.log('🛑 MQTT: Disconnected');
  }
}

/**
 * Retorna si el cliente está conectado.
 */
function isConnected() {
  return client && client.connected;
}

module.exports = { connect, disconnect, isConnected };
