// Function to fetch weather data
async function getWeatherData(lat, lon) {
  const weatherApiUrl = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&hourly=temperature_2m,precipitation_probability,precipitation,sunshine_duration&daily=temperature_2m_max,temperature_2m_min,precipitation_sum,precipitation_hours,sunrise,sunset,uv_index_max&timezone=auto`;

  try {
    const response = await fetch(weatherApiUrl);
    const data = await response.json();
    console.log("Weather Data:", data);
    displayWeatherData(data); // Call a function to display the data
  } catch (error) {
    console.error("Error fetching weather data:", error);
  }
}

// Example of how to call it (you'd integrate this where you get map coordinates)
// For instance, after initMap sets the center or after a place is selected:
// getWeatherData(map.getCenter().lat(), map.getCenter().lng());

// When a place is selected from Autocomplete:
// autocomplete.addListener('place_changed', function() {
//   ... existing code ...
//   var place = autocomplete.getPlace();
//   if (place.geometry) {
//     getWeatherData(place.geometry.location.lat(), place.geometry.location.lng());
//   }
// });
function displayWeatherData(data) {
  const currentWeatherDiv = document.getElementById('current-weather');
  const forecastWeatherDiv = document.getElementById('forecast-weather');

  if (!data || !data.hourly || !data.daily) {
    currentWeatherDiv.innerHTML = '<p>Could not retrieve weather data.</p>';
    forecastWeatherDiv.innerHTML = '';
    return;
  }

  // Display current weather and today's sun hours/precipitation
  const currentHourIndex = new Date().getHours() - data.hourly.time[0].split('T')[1].substring(0, 2); // Calculate current hour index based on API start time
  const todayForecast = data.daily;
  const currentTemp = data.hourly.temperature_2m[currentHourIndex];
  const todayPrecipSum = todayForecast.precipitation_sum[0];
  const todaySunshine = todayForecast.sunshine_duration[0] / 3600; // Convert seconds to hours

  currentWeatherDiv.innerHTML = `
    <p><strong>Current Temperature:</strong> ${currentTemp}°C</p>
    <p><strong>Today's Estimated Sun Hours:</strong> ${todaySunshine.toFixed(1)} hours</p>
    <p><strong>Today's Total Precipitation:</strong> ${todayPrecipSum.toFixed(1)} mm</p>
  `;

  // Display a simple 3-day forecast
  let forecastHtml = '<h4 class="subtitle is-5">Next 3 Days Forecast:</h4><ul>';
  for (let i = 1; i <= 3; i++) { // Starting from tomorrow
    if (data.daily.time[i]) {
      const date = new Date(data.daily.time[i]).toLocaleDateString();
      const maxTemp = data.daily.temperature_2m_max[i];
      const minTemp = data.daily.temperature_2m_min[i];
      const precipSum = data.daily.precipitation_sum[i];
      const precipHours = data.daily.precipitation_hours[i];
      const sunshine = data.daily.sunshine_duration[i] / 3600;

      forecastHtml += `
        <li>
          <strong>${date}:</strong> Max Temp: ${maxTemp}°C, Min Temp: ${minTemp}°C,
          Sun Hours: ${sunshine.toFixed(1)}h, Precipitation: ${precipSum.toFixed(1)}mm (${precipHours.toFixed(0)} hours)
        </li>
      `;
    }
  }
  forecastHtml += '</ul>';
  forecastWeatherDiv.innerHTML = forecastHtml;
}