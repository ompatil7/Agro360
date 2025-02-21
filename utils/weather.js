const axios = require("axios");

const OPENWEATHER_API_KEY =
  "7c459437b5mshb60e08f5a211dbcp1582a7jsn05db932d4db2";

async function getWeatherData(latitude, longitude, date) {
  try {
    const response = await axios.get(
      "https://api.openweathermap.org/data/2.5/onecall/timemachine",
      {
        params: {
          lat: latitude,
          lon: longitude,
          dt: Math.floor(date.getTime() / 1000), // Convert date to Unix timestamp
          appid: OPENWEATHER_API_KEY,
          units: "metric", // Use metric units for temperature (Celsius)
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching weather data:", error.message);
    throw error;
  }
}

module.exports = { getWeatherData };
