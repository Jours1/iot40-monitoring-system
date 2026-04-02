module.exports = {
  BACKEND_PORT: 3000,
  MONGO_URI: 'mongodb://127.0.0.1:27017/iot40',
  DEFAULT_LIMIT: 20,
  MAX_LIMIT: 100,
  GATEWAY_HTTP_PORT: 3001,
  GATEWAY_WS_PORT: 8081,
  MQTT_URL: 'mqtt://127.0.0.1:1883',
  MQTT_TOPIC: 'iot/devices/+/telemetry',
  VITE_BACKEND_URL: 'http://localhost:3000',
  VITE_GATEWAY_URL: 'http://localhost:3001',
  VITE_WS_URL: 'ws://localhost:8081'
};
