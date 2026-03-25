#include <WiFi.h>
#include <WiFiClientSecure.h>
#include <PubSubClient.h>
#include "DHT.h"

// =====================
// 📌 PINOS
// =====================
#define DHTPIN 4
#define DHTTYPE DHT22
#define SWITCH_PIN 32

DHT dht(DHTPIN, DHTTYPE);

// =====================
// 📡 WIFI
// =====================
const char* ssid = "Wokwi-GUEST";
const char* password = "";

// =====================
// 🌐 MQTT
// =====================
const char* mqtt_server = "e2f1f223343c4ecab1890a4c12312999.s1.eu.hivemq.cloud";
const int mqtt_port = 8883;
const char* mqtt_user = "BibiGica";
const char* mqtt_pass = "BibiGica123";

WiFiClientSecure espClient;
PubSubClient client(espClient);

// =====================
unsigned long lastSend = 0;
const unsigned long interval = 10000;

// controle do switch
bool lastSwitchState = HIGH;

// =====================
void setup() {
  Serial.begin(115200);

  dht.begin();
  pinMode(SWITCH_PIN, INPUT_PULLUP);

  espClient.setInsecure();

  setup_wifi();
  client.setServer(mqtt_server, mqtt_port);
}

// =====================
void loop() {

  if (!client.connected()) {
    reconnect();
  }

  client.loop();

  // 🌡️ TEMPERATURA
  if (millis() - lastSend >= interval) {
    lastSend = millis();

    float temperatura = dht.readTemperature();

    if (!isnan(temperatura)) {
      String msg = "{\"temp\": " + String(temperatura, 1) + ", \"device\": \"esp32_001\"}";
      client.publish("iot/turma2025/temperatura", msg.c_str());
      Serial.println(msg);
    }
  }

  // 🔘 SWITCH
  bool currentState = digitalRead(SWITCH_PIN);

  if (currentState != lastSwitchState) {

    if (currentState == LOW) {
      client.publish("iot/turma2025/comando", "LED_ON");
      Serial.println("SWITCH -> LED_ON");
    } else {
      client.publish("iot/turma2025/comando", "LED_OFF");
      Serial.println("SWITCH -> LED_OFF");
    }

    delay(200); // debounce simples
  }

  lastSwitchState = currentState;
}

// =====================
void setup_wifi() {
  WiFi.begin(ssid, password);
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
  }
}

// =====================
void reconnect() {
  while (!client.connected()) {
    if (client.connect("esp32_sensor", mqtt_user, mqtt_pass)) {
      Serial.println("MQTT conectado");
    } else {
      delay(2000);
    }
  }
}