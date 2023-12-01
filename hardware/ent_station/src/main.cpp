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
  long long userId = atoll(user_id.c_str());
  StaticJsonDocument<1024> doc;
  doc["transId"] = transId;
  doc["user_index"] = userId;
  doc["station_code_from"] = STATION_CODE;

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
  DynamicJsonDocument doc(400);
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
  DynamicJsonDocument doc(400);
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

int checkBlck(String id) {
  String read = db.from("suspend").select("*").eq("user_index", id).doSelect();
  DynamicJsonDocument doc(400);
  deserializeJson(doc, read);
  size_t jsonObjectLength = doc.size();
  return jsonObjectLength;
}

String prevDestination(String id) {
  String read = db.from("transaction")
                    .select("*")
                    .eq("user_index", id)
                    .eq("type", "ongoing")
                    .doSelect();
  DynamicJsonDocument doc(500);
  deserializeJson(doc, read);
  JsonObject obj = doc[0];
  String value = obj["station_code_to"];
  db.urlQuery_reset();
  return value;
}

String readFromWhere(String id) {
  String read = db.from("transaction")
                    .select("*")
                    .eq("user_index", id)
                    .eq("type", "ongoing")
                    .doSelect();
  DynamicJsonDocument doc(400);
  deserializeJson(doc, read);
  JsonObject obj = doc[0];
  String value = obj["station_code_where"];
  db.urlQuery_reset();
  return value;
}

int writePrev(int cost, String user_id) {
  String payload = "";
  long long userId = atoll(user_id.c_str());
  StaticJsonDocument<1024> doc;
  doc["amount"] = cost;
  doc["status"] = true;
  doc["type"] = "spnt";

  serializeJson(doc, payload);
  String table = "transaction";
  int status_code = db.update(table)
                        .eq("user_index", String(userId))
                        .eq("type", "ongoing")
                        .doUpdate(payload);
  db.urlQuery_reset();
  return status_code;
}

int writeBalance(int balance, String user_id) {
  String encBalance = encrypt(balance, shift);
  String payload = "";
  long long userId = atoll(user_id.c_str());
  StaticJsonDocument<1024> doc;
  doc["balance"] = encBalance;

  serializeJson(doc, payload);
  String table = "user_data";
  int status_code =
      db.update(table).eq("user_index", String(userId)).doUpdate(payload);
  db.urlQuery_reset();
  return status_code;
}

int readStationValue(String staionCode) {
  String read =
      db.from("station").select("*").eq("station_code", staionCode).doSelect();
  DynamicJsonDocument doc(400);
  deserializeJson(doc, read);
  JsonObject obj = doc[0];
  int value = obj["distance"];
  db.urlQuery_reset();
  return value;
}

int calculateTrip(String to, String id) {
  String stationFrom = readFromWhere(id);
  int staionFromValue = readStationValue(stationFrom);
  int stationToValue = readStationValue(to);
  int distance = abs(staionFromValue - stationToValue);
  if (distance < 4) {
    return 20;
  } else if (distance < 7) {
    return 30;
  } else if (distance < 9) {
    return 40;
  } else if (distance < 11) {
    return 50;
  } else if (distance < 13) {
    return 60;
  } else if (distance < 14) {
    return 70;
  } else if (distance < 16) {
    return 80;
  } else if (distance < 19) {
    return 90;
  } else {
    return 100;
  }
}

void handleUnpaid(int balance, String id) {
  String lastStation = prevDestination(id);
  if (lastStation != "null") {
    int cost = calculateTrip(lastStation, id);
    int remaingBalance = balance - cost;
    writePrev(cost, id);
    writeBalance(remaingBalance, id);
  } else {
    Serial.println("How did he/she escape");
    // BUZZER AND RED LIGHT
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

    if (checkBlck(tag) >= 1) {
      Serial.println("You are blocked");
      // BUZZER AND RED LIGHT
      return;
    }

    if (balance <= 100) {
      Serial.println("You don't have any money");
      // BUZZER AND RED LIGHT
      return;
    }

    if (checkOnGoing(tag) > 0) {
      handleUnpaid(balance, tag);
    }
    openGate();
    String randWord = generateRandomWord();
    int result = dataSend(tag, randWord);
    if (result == 201) {
      Serial.println("You are granted");
    }
  }
  tag = "";
  rfid.PICC_HaltA();
  rfid.PCD_StopCrypto1();
}
delay(1000);
}
