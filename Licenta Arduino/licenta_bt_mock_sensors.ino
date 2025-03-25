#include <SoftwareSerial.h>

SoftwareSerial BTSerial(2, 3); // RX, TX

void setup() {
  Serial.begin(9600);
  BTSerial.begin(9600);
}

void loop() {
  float heartRate = random(60, 100);
  float spO2 = random(90, 100);
  float temperature = random(360, 380) / 10.0;

  String data = String(heartRate, 1) + "," + String(spO2, 1) + "," + String(temperature, 1) + "\n";

  BTSerial.print(data);  
  Serial.println("Sent data: " + data);

  delay(1000);
}
