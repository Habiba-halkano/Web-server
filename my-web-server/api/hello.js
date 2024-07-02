const express = require('express');
const axios = require('axios');
const app = express();
const PORT = process.env.PORT || 3000;

const ipInfoToken = 'YOUR_IPINFO_TOKEN';

app.get('/api/hello', async (req, res) => {
    const visitorName = req.query.visitor_name || 'Guest';
    const clientIp = req.headers['x-forwarded-for'] || req.connection.remoteAddress;

    // Get location
    const locationResponse = await axios.get(`https://ipinfo.io/${clientIp}?token=${ipInfoToken}`);
    const location = locationResponse.data.city;

    // Get weather
    const weatherResponse = await axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${location}&units=metric&appid=${openWeatherApiKey}`);
    const temperature = weatherResponse.data.main.temp;

    const response = {
        "client_ip": clientIp,
        "location": location,
        "greeting": `Hello, ${visitorName}!, the temperature is ${temperature} degrees Celsius in ${location}`
    };

    res.json(response);
});
;

// app.listen(PORT, () => {
//     console.log(`Server is running on port ${PORT}`);
// });
