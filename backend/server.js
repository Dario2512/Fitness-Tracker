const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');  
const btMeasurementController = require('./btMeasurementController');
const { getTodaysCalories, incrementCalories, incrementFoodCalories, getWeeklyCalories } = require('./caloriesController');
const stepsRouter = require('./stepsController');

const app = express();

app.use(cors());  // This will allow requests from all domains

// parse JSON requests
app.use(bodyParser.json());

app.get('/', (req, res) => {
  res.send('Welcome to the API!');
});


// Define POST route for saving measurements from Bluetooth
app.post('/api/measurements', btMeasurementController.handleMeasurement);

// Define GET route for fetching the last measurement from Bluetooth
app.get('/api/measurements/last', btMeasurementController.getLastMeasurement);

// Calories route
// Route to get today's calories
app.get('/todaysCalories', getTodaysCalories);

// Route to increment food calories (POST request)
app.post('/incrementFoodCalories', incrementFoodCalories);

// Route to get weekly calories
app.get('/weeklyCalories', getWeeklyCalories);

// Define steps routes
app.use('/api/steps', stepsRouter);

// Start the server
const PORT = 3000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server is running on http://0.0.0.0:${PORT}`);
});