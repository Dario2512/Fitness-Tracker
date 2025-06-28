#include <Wire.h>
#include <BLEDevice.h>
#include <BLEServer.h>
#include <BLEUtils.h>
#include <BLE2902.h>

#include <MAX30100_PulseOximeter.h>
#include <ClosedCube_MAX30205.h>

#define SERVICE_UUID        "0000ffe0-0000-1000-8000-00805f9b34fb"
#define CHARACTERISTIC_UUID "0000ffe1-0000-1000-8000-00805f9b34fb"

PulseOximeter pox;
ClosedCube_MAX30205 tempSensor;
BLECharacteristic *pCharacteristic;
bool deviceConnected = false;

unsigned long lastUpdate = 0;

class MyServerCallbacks: public BLEServerCallbacks {
  void onConnect(BLEServer* pServer) {
    deviceConnected = true;
  }

  void onDisconnect(BLEServer* pServer) {
    deviceConnected = false;
  }
};

void setup() {
  Serial.begin(115200);
  Wire.begin();

  // Setup MAX30205
  tempSensor.begin(0x48);

  // Setup MAX30100
  if (!pox.begin()) {
    Serial.println("MAX30100 init failed. Check wiring!");
    while (1);
  }

  pox.setOnBeatDetectedCallback([]() {
    Serial.println("Beat!");
  });

  // BLE setup
  BLEDevice::init("Trackario");
  BLEServer *pServer = BLEDevice::createServer();
  pServer->setCallbacks(new MyServerCallbacks());

  BLEService *pService = pServer->createService(SERVICE_UUID);

  pCharacteristic = pService->createCharacteristic(
                      CHARACTERISTIC_UUID,
                      BLECharacteristic::PROPERTY_READ |
                      BLECharacteristic::PROPERTY_NOTIFY
                    );

  pCharacteristic->addDescriptor(new BLE2902());

  pService->start();
  BLEAdvertising *pAdvertising = BLEDevice::getAdvertising();
  pAdvertising->addServiceUUID(SERVICE_UUID);
  pAdvertising->start();

  Serial.println("Waiting for a client connection...");
}

void loop() {
  pox.update();

  if (deviceConnected && millis() - lastUpdate > 1000) {
    lastUpdate = millis();

    float bpm = pox.getHeartRate();
    uint8_t spo2 = pox.getSpO2();
    float temp = tempSensor.readTemperature();

    String data = String(bpm, 1) + "," + String(spo2) + "," + String(temp, 1);
    pCharacteristic->setValue(data.c_str());
    pCharacteristic->notify();

    Serial.println("Sent: " + data);
  }
}
