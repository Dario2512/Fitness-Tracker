#include <Wire.h>
#include <SparkFun_MAX3010x.h> // Use SparkFun MAX3010x library for MAX30102
#include <OneWire.h>
#include <DallasTemperature.h>

// Pin Definitions
#define ONE_WIRE_BUS 2  // Digital pin for DS18B20 data

OneWire oneWire(ONE_WIRE_BUS);
DallasTemperature sensors(&oneWire);

// MAX30102 Sensor
MAX30105 max30102;

// DS18B20 Sensor
#define MAX30102_I2C_ADDRESS 0x57

void setup() {
  Serial.begin(115200);

  // Initialize MAX30102 Sensor
  if (!max30102.begin()) {
    Serial.println("Could not find a valid MAX30102 sensor, check wiring!");
    while (1);
  }
  
  max30102.setup();  // Initialize MAX30102 for heart rate and SpO2
  
  // Initialize DS18B20
  sensors.begin();
  
  Serial.println("Initialization complete.");
}

void loop() {
  // Read Heart Rate and SpO2 from MAX30102
  long irValue = max30102.getIR();  // Read the IR value (infrared) from the sensor

  if (irValue < 50000) {
    Serial.println("No finger detected!");
  } else {
    float heartRate = max30102.getHeartRate();
    float oxygenLevel = max30102.getSpO2();
    
    Serial.print("Heart Rate: ");
    Serial.print(heartRate);
    Serial.print(" bpm, SpO2: ");
    Serial.print(oxygenLevel);
    Serial.println(" %");
  }
  
  // Read temperature from DS18B20
  sensors.requestTemperatures();
  float temperature = sensors.getTempCByIndex(0);  // Get the temperature in Celsius
  
  Serial.print("Temperature: ");
  Serial.print(temperature);
  Serial.println(" C");
  
  delay(1000);  // Delay 1 second before next read
}
