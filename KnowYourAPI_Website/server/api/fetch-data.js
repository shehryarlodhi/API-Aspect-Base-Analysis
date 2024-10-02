const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');  // To make HTTP requests to the Python server
const cors = require('cors');
const app = express();

const PORT = 5003;  // Port for the Node.js server

app.use(cors());  // Enable CORS to allow requests from the frontend (port 3000)
app.use(bodyParser.json());  // To parse JSON request bodies

// API route to handle fetching data from the Python server
app.post('/api/fetch-data', async (req, res) => {
    const { url } = req.body;  // Extract the URL sent from the frontend
    console.log("Received URL from frontend:", url);  // Log for debugging

    try {
        // Make a request to the Python server (port 5004) with the URL
        const response = await axios.post('http://localhost:5004/fetch_data', { url }, {
            responseType: 'blob'  // Expect the response as a file blob
        });

        // Send the file back to the React frontend
        res.setHeader('Content-Disposition', 'attachment; filename="scraped_data.csv"');
        res.setHeader('Content-Type', 'text/csv');
        res.send(response.data);  // Send the file content as a response

    } catch (error) {
        console.error('Error calling Python server:', error.message);
        res.status(500).json({ error: 'Failed to fetch data from Python server' });
    }
});

// Start the Node.js server
app.listen(PORT, () => {
    console.log(`Node.js backend running on http://localhost:${PORT}`);
});
