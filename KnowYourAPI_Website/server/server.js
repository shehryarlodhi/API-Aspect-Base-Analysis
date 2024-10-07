const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 5003;

app.use(cors());
app.use(bodyParser.json());

app.post('/api/fetch-data', async (req, res) => {
    const { url } = req.body;
    console.log("Received URL in Node.js server:", url); 

    if (!url) {
        return res.status(400).json({ error: 'URL is required' });
    }

    try {
        console.log("Forwarding request to Python server...");

        const response = await axios({
            method: 'post',
            url: 'http://localhost:5004/fetch_data',
            responseType: 'stream',
            data: { url },
        });

        const filePath = path.join(__dirname, 'analyzed_data.csv');
        const writer = fs.createWriteStream(filePath);
        response.data.pipe(writer);

        writer.on('finish', () => {
            console.log("File written successfully in Node.js.");
            res.download(filePath, 'analyzed_data.csv', (err) => {
                if (err) {
                    console.error('Error sending file to client:', err);
                    res.status(500).json({ error: 'File download failed' });
                } else {
                    console.log("File sent successfully to client.");
                }

                // Remove file after sending
                fs.unlink(filePath, (unlinkErr) => {
                    if (unlinkErr) {
                        console.error('Error deleting the file:', unlinkErr);
                    } else {
                        console.log('Temporary file deleted successfully.');
                    }
                });
            });
        });

        writer.on('error', (error) => {
            console.error('Error writing the file:', error);
            res.status(500).json({ error: 'File writing error' });
        });

    } catch (error) {
        console.error('Error calling Python server:', error.message);
        res.status(500).json({ error: error.message });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
