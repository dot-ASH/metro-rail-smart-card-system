#include <Arduino.h>
#include <ESP32_Supabase.h>
#include <ESP8266WiFi.h>
#include <ESP8266HTTPClient.h>
#include <WiFiClient.h>
#include <ArduinoJson.h>
#include <Data.h>
#include <Ssid.h>

#define LED_BUILTIN 2

Supabase db;

void setup()
{
  Serial.begin(115200);
  pinMode(2, OUTPUT);
  WiFi.begin(ssid, password);
  Serial.println("Connecting");
  while (WiFi.status() != WL_CONNECTED)
  {
    delay(500);
    Serial.print(".");
  }
  Serial.println("");
  Serial.print("ESP8266 already connected WiFi with IP: ");
  Serial.println(WiFi.localIP());

  db.begin(supabase_url, anon_key);
  String read = db.from("user").select("balance").eq("id", "1").doSelect();
  Serial.println(read);
  String jsonString = "[{\"balance\":400}]";
  DynamicJsonDocument doc(200);
  deserializeJson(doc, jsonString);
  JsonObject obj = doc[0];

  int balance = obj["balance"];
  Serial.print("Balance: ");
  Serial.println(balance);
  db.urlQuery_reset();
}

void loop()
{
  delay(10000);
  digitalWrite(2, LOW);
  delay(1000);
  digitalWrite(2, HIGH);
}
