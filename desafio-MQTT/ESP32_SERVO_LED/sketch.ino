#include <WiFi.h>
#include <WiFiClientSecure.h>
#include <PubSubClient.h>

#define LED_PIN 2

const char* ssid = "Wokwi-GUEST";
const char* password = "";

const char* mqtt_server = "e2f1f223343c4ecab1890a4c12312999.s1.eu.hivemq.cloud";
const int mqtt_port = 8883;
const char* mqtt_user = "BibiGica";
const char* mqtt_pass = "BibiGica123";

WiFiClientSecure espClient;
PubSubClient client(espClient);

// =====================
void setup() {
  Serial.begin(115200);

  pinMode(LED_PIN, OUTPUT);
  digitalWrite(LED_PIN, LOW);

  espClient.setInsecure();

  setup_wifi();
  client.setServer(mqtt_server, mqtt_port);
  client.setCallback(callback);
}

// =====================
void loop() {
  if (!client.connected()) {
    reconnect();
  }
  client.loop();
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
    if (client.connect("esp32_led", mqtt_user, mqtt_pass)) {
      client.subscribe("iot/turma2025/comando");
      Serial.println("Inscrito no tópico");
    } else {
      delay(2000);
    }
  }
}

// =====================
void callback(char* topic, byte* payload, unsigned int length) {

  String msg;

  for (int i = 0; i < length; i++) {
    msg += (char)payload[i];
  }

  Serial.print("Topico: ");
  Serial.println(topic);

  Serial.print("Mensagem: ");
  Serial.println(msg);

  if (String(topic) == "iot/turma2025/comando") {

    if (msg == "LED_ON") {
      digitalWrite(LED_PIN, HIGH);
      client.publish("iot/turma2025/status", "LED_ON");
      Serial.println("LED LIGADO");
    } 
    else if (msg == "LED_OFF") {
      digitalWrite(LED_PIN, LOW);
      client.publish("iot/turma2025/status", "LED_OFF");
      Serial.println("LED DESLIGADO");
    }
  }
}