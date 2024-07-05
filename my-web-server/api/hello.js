require('dotenv').config();
const express = require('express');
const axios = require('axios');
const app = express();
const PORT = process.env.PORT || 3001;
const WEATHER_API_KEY = process.env.WEATHER_API_KEY;

app.get('/api/hello', async (req, res) => {
    try {
        const visitorName = req.query.visitor_name || 'Guest';
        let clientIp = req.headers['x-forwarded-for'] || req.headers['x-real-ip'] || req.connection.remoteAddress;

        // Handle cases where clientIp is a list of IPs (comma separated)
        if (clientIp.includes(',')) {
            clientIp = clientIp.split(',')[0].trim();
        }

        // Convert IPv6 localhost to IPv4
        if (clientIp === '::1' || clientIp === '::ffff:127.0.0.1') {
            clientIp = '127.0.0.1';
        }

        let city = "unknown";

        try {
            const locationResponse = await axios.get(`http://ip-api.com/json/${clientIp}`);
            city = locationResponse?.data?.city || "unknown";
            console.log(`City identified: ${city}`);
        } catch (error) {
            console.error("Location API Error:", error);
        }

        let temperature = 0;
        try {
            if (city !== "unknown") {
                const temperatureResponse = await axios.get(`http://api.weatherapi.com/v1/current.json?key=${WEATHER_API_KEY}&q=${city}`);
                temperature = temperatureResponse?.data?.current?.temp_c || 0;
                console.log(`Temperature identified: ${temperature}`);
            }
        } catch (error) {
            console.log("Weather API Error:", error);
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
