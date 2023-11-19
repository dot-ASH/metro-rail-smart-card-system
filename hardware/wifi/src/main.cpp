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

Servo myservo;
Supabase db;

String toText(String textNumber) {
  int number = textNumber.toInt() * secretKey;
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
  /*   return finalResult; */
  return abs(finalResult / secretKey);
}

String encrypt(String textNumber, int s) {
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

String decrypt(String text, int s) {
  String decypherText = "";
  for (int i = 0; i < text.length(); i++) {
    if (isupper(text[i]))
      decypherText += char((int(text[i] - s - 'A') + 26) % 26 + 'A');
    else
      decypherText += char((int(text[i] - s - 'a') + 26) % 26 + 'a');
  }
  /*   int decryptNumber = toNumber(decypherText); */
  return decypherText;
}
String readBalance(String id) {
  String read = db.from("decrypted_user_data")
                    .select("*")
                    .eq("user_index", id)
                    .doSelect();
  Serial.println(read);
  String jsonString = read;
  DynamicJsonDocument doc(200);
  deserializeJson(doc, read);
  JsonObject obj = doc[0];

  String balance = obj["balance"];
  Serial.print("Balance: ");
  db.urlQuery_reset();
  return balance;
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

  db.begin(supabase_url, anon_key);

  String text = "200";
  String cipher = encrypt(text, shift);
  Serial.print("Cipher: ");
  Serial.println(cipher);
  String decipher = decrypt(cipher, shift);
  Serial.print("Decipher: ");
  Serial.println(decipher);
  Serial.println(toNumber(decipher));
}

void loop() {}

// constexpr uint8_t RST_PIN = D3;
// constexpr uint8_t SS_PIN = D4;

// MFRC522 rfid(SS_PIN, RST_PIN);
// MFRC522::MIFARE_Key key;

// String tag;
// int pos = 0;
// void setup() {
//   Serial.begin(115200);
//   SPI.begin();     // Init SPI bus
//   rfid.PCD_Init(); // Init MFRC522
//   myservo.attach(SERVO_PIN);
//   myservo.write(pos);
//   Serial.println("");
//   delay(1000);
// }

// void openGate() {
//   for (pos = 0; pos <= 180; pos += 5) {
//     myservo.write(pos);
//   }
//   for (pos = 180; pos >= 0; pos -= 5) {
//     myservo.write(pos);
//   }
// }

// void loop() {
//   if (!rfid.PICC_IsNewCardPresent())
//     return;
//   if (rfid.PICC_ReadCardSerial()) {
//     for (byte i = 0; i < 4; i++) {
//       tag += rfid.uid.uidByte[i];
//     }
//     Serial.println(tag);
//     if (tag == "24220910126") {
//       openGate();
//     }
//     tag = "";
//     rfid.PICC_HaltA();
//     rfid.PCD_StopCrypto1();
//   }
//   delay(1000);
// }
