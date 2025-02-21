import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';
import { Platform } from 'react-native';

const generatePDF = async (measurement) => {
  const { heartRate, spO2, temperature, timestamp } = measurement;
  const date = new Date(timestamp.seconds * 1000).toLocaleString();

  const html = `
    <html>
      <body>
        <h1>Measurement Report</h1>
        <p><strong>Heart Rate:</strong> ${heartRate} bpm</p>
        <p><strong>SpO2:</strong> ${spO2} %</p>
        <p><strong>Temperature:</strong> ${temperature.toFixed(1)} °C</p>
        <p><strong>Time:</strong> ${date}</p>
      </body>
    </html>
  `;

  const { uri } = await Print.printToFileAsync({ html });

  await Sharing.shareAsync(uri);

  return uri;
};

export default generatePDF;