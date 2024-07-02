const express = require('express');
const axios = require('axios');
const app = express();

app.get('/api/hello', async (req, res) => {
    const visitorName = req.query.visitor_name || 'Guest';
    const clientIp = req.headers['x-forwarded-for'] || req.connection.remoteAddress;

    // Replace with actual API calls
    const location = "New York"; // Dummy data
    const temperature = 11; // Dummy data

    const response = {
        "client_ip": clientIp,
        "location": location,
        "greeting": `Hello, ${visitorName}!, the temperature is ${temperature} degrees Celsius in ${location}`
    };

    res.json(response);
});

module.exports = app;
