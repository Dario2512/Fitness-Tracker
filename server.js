// server.js
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');  // Import cors
const measurementController = require('./measurementController');

const app = express();

// Enable CORS for all origins
app.use(cors());  // This will allow requests from all domains

// Use bodyParser to parse JSON requests
app.use(bodyParser.json());

// Define POST route for saving measurements
app.post('/api/measurements', measurementController.handleMeasurement);

// Define GET route for fetching the last measurement
app.get('/api/measurements/last', measurementController.getLastMeasurement);

// Start the server
const PORT = 3000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server is running on http://0.0.0.0:${PORT}`);
});
