require('dotenv').config();
const express = require('express');
const axios = require('axios');
const app = express();
const PORT = process.env.PORT || 3001;
const WEATHER_API_KEY = process.env.WEATHER_API_KEY;

app.get('/api/hello', async (req, res) => {
    try {
        const visitorName = req.query.visitor_name || 'Guest';
        const clientIp = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
        let city= "unknown"

        try {
            const locationResponse = await axios.get(`http://ip-api.com/json/${clientIp}`);
            city = locationResponse?.data?.city || "unknown";
        } catch (error) {
            console.error("Error occurred:", error);
        }
        let temperature = 0; 
        try {
            const temperatureResponse = await axios.get(`http://api.weatherapi.com/v1/current.json?key=${WEATHER_API_KEY}&q=${city}`)
            temperature = temperatureResponse?.data?.current?.temp_c || 0;
        } catch (error) {
            console.log("Error occurred:", error);
        }
        const response = {
            "client_ip": clientIp,
            "location": city,
            "greeting": `Hello, ${visitorName}!, the temperature is ${temperature} degrees Celsius in ${city}`
        };

        res.json(response);
    } catch (error) {
        console.error("Error occurred:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
