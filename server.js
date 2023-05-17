const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mqtt = require('mqtt'); // Import MQTT

const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(express.static('public'));

let data = {
  temperature: 0,
  humidity: 0,
  coLevel: 0, // carbon monoxide level
  acStatus: false, // AC status
  bloodInventory: [
    { type: 'A+', count: 0 },
    { type: 'A-', count: 0 },
    { type: 'B+', count: 0 },
    { type: 'B-', count: 0 },
    { type: 'AB+', count: 0 },
    { type: 'AB-', count: 0 },
    { type: 'O+', count: 0 },
    { type: 'O-', count: 0 }
  ]
};

// Connect to the MQTT broker
const client = mqtt.connect('mqtt://broker.hivemq.com'); // replace with your broker url

client.on('connect', () => {
  console.log('Connected to MQTT broker');

  // Subscribe to the topic you're interested in
  client.subscribe('bloodbank/data', (err) => {
    if (err) {
      console.error('Failed to subscribe to topic');
    }
  });
});

client.on('message', (topic, message) => {
  if (topic === 'bloodbank/data') {
    // Update the data object with the received data
    const receivedData = JSON.parse(message.toString());

    if (receivedData.hasOwnProperty('temperature')) {
      data.temperature = receivedData.temperature;
    }

    if (receivedData.hasOwnProperty('humidity')) {
      data.humidity = receivedData.humidity;
    }

    if (receivedData.hasOwnProperty('coLevel')) {
      data.coLevel = receivedData.coLevel;
    }

    if (receivedData.hasOwnProperty('acStatus')) {
      data.acStatus = receivedData.acStatus;
    }

    if (receivedData.hasOwnProperty('bloodInventory')) {
      data.bloodInventory = receivedData.bloodInventory;
    }
  }
});

app.get('/api/data', (req, res) => {
  res.json(data);
});

app.listen(3000, () => console.log('Server running on port 3000'));
