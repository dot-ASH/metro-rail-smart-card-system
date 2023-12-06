// REG_CARDS
#include <Arduino.h>
#include <ArduinoJson.h>
#include <Data.h>
#include <ESP32_Supabase.h>
#include <ESP8266HTTPClient.h>
#include <ESP8266WiFi.h>
#include <MFRC522.h>
#include <SPI.h>
#include <Servo.h>
#include <WiFiClient.h>
#include <algorithm>
#include <ssid.h>

#define STATION_CODE "UN"
#define RED_LED_PIN D0
#define GREEN_LED_PIN D1
#define BUZZER_PIN D8

constexpr uint8_t RST_PIN = D3;
constexpr uint8_t SS_PIN = D4;

MFRC522 rfid(SS_PIN, RST_PIN);
MFRC522::MIFARE_Key key;

String tag;
int pos = 0;

Supabase db;

void success() {
  digitalWrite(GREEN_LED_PIN, HIGH);
  delay(1000);
  digitalWrite(GREEN_LED_PIN, LOW);
}

void error() {
  digitalWrite(RED_LED_PIN, HIGH);
  digitalWrite(BUZZER_PIN, HIGH);

  delay(1000);
  digitalWrite(BUZZER_PIN, LOW);
  digitalWrite(RED_LED_PIN, LOW);
}

int registerCard(String tag) {
  String payload = "";
  long long rfidId = atoll(tag.c_str());
  StaticJsonDocument<1024> doc;
  doc["tag_id"] = rfidId;

  serializeJson(doc, payload);
  bool upsert = false;
  String table = "cards";
  int status_code = db.insert(table, payload, upsert);
  db.urlQuery_reset();
  return status_code;
}

int checkTaken(String tag) {
  String read = db.from("cards").select("*").eq("tag_id", tag).doSelect();
  DynamicJsonDocument doc(400);
  deserializeJson(doc, read);
  size_t jsonObjectLength = doc.size();
  return jsonObjectLength;
}

void setup() {
  Serial.begin(115200);
  pinMode(2, OUTPUT);
  WiFi.begin(ssid, password);
  delay(100);
  Serial.println("");
  Serial.println("Connecting");
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  Serial.println("");
  Serial.print("ESP8266 already connected WiFi with IP: ");
  Serial.println(WiFi.localIP());
  SPI.begin();
  rfid.PCD_Init();
  Serial.println("");
  delay(1000);

  pinMode(RED_LED_PIN, OUTPUT);
  pinMode(GREEN_LED_PIN, OUTPUT);
  pinMode(BUZZER_PIN, OUTPUT);

  db.begin(supabase_url, anon_key);
}

void loop() {
  digitalWrite(RED_LED_PIN, LOW);
  digitalWrite(GREEN_LED_PIN, LOW);
  digitalWrite(BUZZER_PIN, LOW);

  if (!rfid.PICC_IsNewCardPresent())
    return;
  if (rfid.PICC_ReadCardSerial()) {
    Serial.println("Scanned");
    for (byte i = 0; i < 4; i++) {
      tag += rfid.uid.uidByte[i];
    }
    Serial.println(tag);
    if (checkTaken(tag) < 1) {
      Serial.println("not taken");
      int con_code = registerCard(tag);
      if (con_code == 201) {
        Serial.println("registered");
        success();
      }
    } else {
      Serial.println("already registered");
      error();
    }
    tag = "";
    rfid.PICC_HaltA();
    rfid.PCD_StopCrypto1();
  }
  tag = "";
  rfid.PICC_HaltA();
  rfid.PCD_StopCrypto1();
}
