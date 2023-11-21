// ENTRY_UN
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

#define LED_BUILTIN 2
#define SERVO_PIN D1
#define STATION_CODE "UN"

constexpr uint8_t RST_PIN = D3;
constexpr uint8_t SS_PIN = D4;

MFRC522 rfid(SS_PIN, RST_PIN);
MFRC522::MIFARE_Key key;

String tag;
int pos = 0;

Servo myservo;
Supabase db;

String toText(int textNumber) {
  int number = textNumber * secretKey;
  char digitMap[] = {'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j'};
  String textRepresentation = "";
  while (number > 0) {
    int digit = number % 10;
    textRepresentation = digitMap[digit] + textRepresentation;
    number /= 10;
  }
  return textRepresentation;
}

int toNumber(String text) {
  String result = "";
  char digitMap[] = {'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j'};
  int arrayLength = sizeof(digitMap) / sizeof(digitMap[0]);
  for (int i = 0; i < text.length(); i++) {
    for (int j = 0; j < arrayLength; j++) {
      if (digitMap[j] == text[i]) {
        result = result + String(j);
      }
    }
  }
  int finalResult = result.toInt();
  return abs(finalResult / secretKey);
}

String encrypt(int textNumber, int s) {
  String text = toText(textNumber);
  String result = "";
  for (int i = 0; i < text.length(); i++) {
    if (isupper(text[i]))
      result += char(int(text[i] + s - 'A') % 26 + 'A');
    else
      result += char(int(text[i] + s - 'a') % 26 + 'a');
  }
  return result;
}

int decrypt(String text, int s) {
  String decypherText = "";
  for (int i = 0; i < text.length(); i++) {
    if (isupper(text[i]))
      decypherText += char((int(text[i] - s - 'A') + 26) % 26 + 'A');
    else
      decypherText += char((int(text[i] - s - 'a') + 26) % 26 + 'a');
  }
  return toNumber(decypherText);
}

String generateRandomWord() {
  char letters[] = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
  int lettersCount = sizeof(letters) - 1;
  String randomWord = "";
  for (int i = 0; i < 20; i++) {
    char randomChar = letters[random(lettersCount)];
    randomWord += randomChar;
  }
  return randomWord;
}

int dataSend(String user_id, String transId) {
  String payload = "";
  Serial.println(user_id);
  long long userId = atoll(user_id.c_str());
  Serial.println(userId);
  StaticJsonDocument<1024> doc;
  doc["transId"] = transId;
  doc["user_index"] = userId;
  doc["station_code_to"] = STATION_CODE;

  serializeJson(doc, payload);
  bool upsert = false;
  String table = "transaction";
  int status_code = db.insert(table, payload, upsert);
  db.urlQuery_reset();
  return status_code;
}

String readBalance(String id) {
  String read =
      db.from("user_data").select("balance").eq("user_index", id).doSelect();
  String jsonString = read;
  DynamicJsonDocument doc(200);
  deserializeJson(doc, read);
  JsonObject obj = doc[0];
  String balance = obj["balance"];
  db.urlQuery_reset();
  return balance;
}

int checkOnGoing(String id) {
  String read = db.from("transaction")
                    .select("*")
                    .eq("user_index", id)
                    .eq("type", "ongoing")
                    .doSelect();
  DynamicJsonDocument doc(200);
  deserializeJson(doc, read);
  size_t jsonObjectLength = doc.size();
  return jsonObjectLength;
}

void openGate() {
  for (pos = 0; pos <= 180; pos += 5) {
    myservo.write(pos);
  }
  for (pos = 180; pos >= 0; pos -= 5) {
    myservo.write(pos);
  }
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
  myservo.attach(SERVO_PIN);
  myservo.write(pos);
  Serial.println("");
  delay(1000);

  db.begin(supabase_url, anon_key);
}

void loop() {
  if (!rfid.PICC_IsNewCardPresent())
    return;
  if (rfid.PICC_ReadCardSerial()) {
    Serial.println("Scanned");
    for (byte i = 0; i < 4; i++) {
      tag += rfid.uid.uidByte[i];
    }
    String text = readBalance(tag);
    int balance = decrypt(text, shift);
    if (balance > 100) {
      if (checkOnGoing(tag) > 0) {
        Serial.println("You have an unpaid trip");
      } else {
        openGate();
        String randWord = generateRandomWord();
        int result = dataSend(tag, randWord);
        if (result == 201) {
          Serial.println("You are granted");
        }
      }
    } else {
      Serial.println("You don't have any money");
    }
    tag = "";
    rfid.PICC_HaltA();
    rfid.PCD_StopCrypto1();
  }
  delay(1000);
}
