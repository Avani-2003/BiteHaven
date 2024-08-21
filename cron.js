const axios = require('axios');
const cron = require('node-cron');

// Function to make the request
const pingServer = async () => {
  try {
    const response = await axios.get('http://localhost:3000/ping');
    console.log(`Ping successful: ${response.status}`);
  } catch (error) {
    console.error(`Ping failed: ${error.message}`);
  }
};

// Schedule the job to run every 5 minutes
cron.schedule('*/5 * * * *', pingServer);

console.log('Cron job scheduled to ping /ping every 5 minutes.');