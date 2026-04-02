/*
 * ═══════════════════════════════════════════════════════════════
 *  IoT 4.0 — ESP32 Firmware: Telemetry Publisher
 * ═══════════════════════════════════════════════════════════════
 *  
 *  Este código conecta el ESP32 a WiFi y al broker MQTT,
 *  lee los sensores conectados y publica la telemetría en
 *  formato JSON estándar al topic correspondiente.
 *
 *  REQUISITOS:
 *  - Arduino IDE o PlatformIO
 *  - Librería PubSubClient (Nick O'Leary)
 *  - Librería ArduinoJson (Benoît Blanchon) v7+
 *  - (Opcional) DHT sensor library, Adafruit BMP280, etc.
 *
 *  TOPIC: iot/devices/{DEVICE_ID}/telemetry
 *
 *  FORMATO JSON:
 *  {
 *    "deviceId": "esp32-aula-01",
 *    "timestamp": "2026-04-02T10:45:00Z",
 *    "sensorType": "environment",
 *    "data": {
 *      "temperature": 25.8,
 *      "humidity": 57.1,
 *      "gas": 120,
 *      "light": 340
 *    }
 *  }
 * ═══════════════════════════════════════════════════════════════
 */

#include <WiFi.h>
#include <PubSubClient.h>
#include <ArduinoJson.h>
#include <time.h>

// ─── CONFIGURACIÓN — AJUSTAR SEGÚN TU ENTORNO ──────────────────

// WiFi
const char* WIFI_SSID     = "TU_RED_WIFI";
const char* WIFI_PASSWORD  = "TU_CONTRASEÑA_WIFI";

// MQTT Broker (IP de tu servidor o dominio público)
const char* MQTT_SERVER    = "192.168.1.100";  // Cambiar a tu IP o dominio
const int   MQTT_PORT      = 1883;
const char* MQTT_USER      = "";               // Dejar vacío si no hay autenticación
const char* MQTT_PASS      = "";

// Dispositivo
const char* DEVICE_ID      = "esp32-aula-01";
const char* SENSOR_TYPE    = "environment";

// Intervalo de envío (milisegundos)
const unsigned long SEND_INTERVAL = 10000;  // 10 segundos

// NTP para timestamp
const char* NTP_SERVER     = "pool.ntp.org";
const long  GMT_OFFSET     = -18000;  // UTC-5 (Colombia, Perú, etc.)
const int   DST_OFFSET     = 0;

// ─── PINES DE SENSORES (AJUSTAR) ───────────────────────────────

// Sensor analógico de luz (LDR)
const int PIN_LIGHT = 34;

// Sensor analógico de gas (MQ-2, MQ-135, etc.)
const int PIN_GAS   = 35;

// DHT11/DHT22 — descomentar si se usa
// #include <DHT.h>
// #define DHTPIN 4
// #define DHTTYPE DHT22
// DHT dht(DHTPIN, DHTTYPE);

// ─── OBJETOS GLOBALES ───────────────────────────────────────────

WiFiClient   espClient;
PubSubClient mqttClient(espClient);

unsigned long lastSendTime = 0;
char topicBuffer[128];
char jsonBuffer[512];

// ─── FUNCIONES AUXILIARES ───────────────────────────────────────

/**
 * Conecta a la red WiFi configurada.
 */
void connectWiFi() {
  Serial.printf("\n🔌 Connecting to WiFi: %s", WIFI_SSID);
  WiFi.mode(WIFI_STA);
  WiFi.begin(WIFI_SSID, WIFI_PASSWORD);

  int attempts = 0;
  while (WiFi.status() != WL_CONNECTED && attempts < 30) {
    delay(500);
    Serial.print(".");
    attempts++;
  }

  if (WiFi.status() == WL_CONNECTED) {
    Serial.printf("\n✅ WiFi connected! IP: %s\n", WiFi.localIP().toString().c_str());
  } else {
    Serial.println("\n❌ WiFi connection failed! Restarting...");
    ESP.restart();
  }
}

/**
 * Conecta al broker MQTT.
 */
void connectMQTT() {
  mqttClient.setServer(MQTT_SERVER, MQTT_PORT);

  while (!mqttClient.connected()) {
    Serial.printf("🔌 Connecting to MQTT broker %s:%d...\n", MQTT_SERVER, MQTT_PORT);

    String clientId = String(DEVICE_ID) + "-" + String(random(0xffff), HEX);

    bool connected = false;
    if (strlen(MQTT_USER) > 0) {
      connected = mqttClient.connect(clientId.c_str(), MQTT_USER, MQTT_PASS);
    } else {
      connected = mqttClient.connect(clientId.c_str());
    }

    if (connected) {
      Serial.println("✅ MQTT connected!");
    } else {
      Serial.printf("❌ MQTT failed (rc=%d). Retrying in 5s...\n", mqttClient.state());
      delay(5000);
    }
  }
}

/**
 * Obtiene el timestamp actual en formato ISO 8601.
 */
String getTimestamp() {
  struct tm timeinfo;
  if (!getLocalTime(&timeinfo)) {
    return String("1970-01-01T00:00:00Z");
  }
  char buf[30];
  strftime(buf, sizeof(buf), "%Y-%m-%dT%H:%M:%SZ", &timeinfo);
  return String(buf);
}

/**
 * Lee los sensores y retorna los valores.
 * Adaptar según los sensores realmente conectados.
 */
void readSensors(float &temperature, float &humidity, int &gas, int &light) {
  // ── Sensor de luz (LDR analógico) ──
  light = analogRead(PIN_LIGHT);

  // ── Sensor de gas (MQ analógico) ──
  gas = analogRead(PIN_GAS);

  // ── DHT22 (descomentar si se usa) ──
  // humidity = dht.readHumidity();
  // temperature = dht.readTemperature();
  // if (isnan(humidity) || isnan(temperature)) {
  //   Serial.println("⚠️  DHT read failed, using simulated values");
  //   temperature = 22.0 + random(-20, 30) / 10.0;
  //   humidity = 50.0 + random(-100, 100) / 10.0;
  // }

  // ── Valores simulados (quitar cuando tengas sensores reales) ──
  temperature = 22.0 + random(-30, 40) / 10.0;
  humidity = 50.0 + random(-100, 100) / 10.0;
}

/**
 * Construye y publica el JSON de telemetría por MQTT.
 */
void publishTelemetry() {
  float temperature, humidity;
  int gas, light;

  readSensors(temperature, humidity, gas, light);

  // Construir topic
  snprintf(topicBuffer, sizeof(topicBuffer), "iot/devices/%s/telemetry", DEVICE_ID);

  // Construir JSON con ArduinoJson
  JsonDocument doc;
  doc["deviceId"]   = DEVICE_ID;
  doc["timestamp"]  = getTimestamp();
  doc["sensorType"] = SENSOR_TYPE;

  JsonObject data = doc["data"].to<JsonObject>();
  data["temperature"] = round(temperature * 10) / 10.0;
  data["humidity"]    = round(humidity * 10) / 10.0;
  data["gas"]         = gas;
  data["light"]       = light;

  size_t len = serializeJson(doc, jsonBuffer, sizeof(jsonBuffer));

  // Publicar
  if (mqttClient.publish(topicBuffer, jsonBuffer)) {
    Serial.printf("📤 Published to %s (%d bytes)\n", topicBuffer, len);
    Serial.printf("   T=%.1f°C H=%.1f%% Gas=%d Light=%d\n", temperature, humidity, gas, light);
  } else {
    Serial.println("❌ Publish failed!");
  }
}

// ─── SETUP ──────────────────────────────────────────────────────

void setup() {
  Serial.begin(115200);
  delay(1000);

  Serial.println("═══════════════════════════════════════════");
  Serial.println("  IoT 4.0 — ESP32 Telemetry Publisher");
  Serial.printf("  Device: %s\n", DEVICE_ID);
  Serial.println("═══════════════════════════════════════════");

  // Inicializar pines analógicos
  analogReadResolution(12);  // 0-4095

  // Inicializar DHT (descomentar si se usa)
  // dht.begin();

  // Conectar WiFi
  connectWiFi();

  // Configurar NTP
  configTime(GMT_OFFSET, DST_OFFSET, NTP_SERVER);
  Serial.println("🕐 NTP time sync configured");

  // Conectar MQTT
  connectMQTT();

  // Seed random
  randomSeed(analogRead(0));

  Serial.println("✅ System ready! Publishing telemetry...\n");
}

// ─── LOOP ───────────────────────────────────────────────────────

void loop() {
  // Mantener conexión MQTT
  if (!mqttClient.connected()) {
    connectMQTT();
  }
  mqttClient.loop();

  // Reconectar WiFi si se pierde
  if (WiFi.status() != WL_CONNECTED) {
    Serial.println("⚠️  WiFi lost! Reconnecting...");
    connectWiFi();
  }

  // Enviar telemetría cada SEND_INTERVAL
  unsigned long now = millis();
  if (now - lastSendTime >= SEND_INTERVAL) {
    lastSendTime = now;
    publishTelemetry();
  }
}
