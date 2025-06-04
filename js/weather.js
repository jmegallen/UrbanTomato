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

// You might want to call getPlantEnvironmentDetails()
// when a button is clicked, or when the user changes a selection.
// For example, if you have a "Save Details" button:
// document.getElementById('save-details-button').addEventListener('click', getPlantEnvironmentDetails);

// Or, if you want to get them when the map location updates:
// Inside your initMap or place_changed listener:
// getPlantEnvironmentDetails(); // Call this to update based on current selections

// Add these new functions to your js/index.js,
// perhaps after handleLocationError or towards the end of the file.

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
    document.getElementById('current-weather').innerHTML = '<p>Error loading weather data.</p>';
    document.getElementById('forecast-weather').innerHTML = '';
  }
}

// Function to display weather data
function displayWeatherData(data) {
  const currentWeatherDiv = document.getElementById('current-weather');
  const forecastWeatherDiv = document.getElementById('forecast-weather');

  if (!data || !data.hourly || !data.daily) {
    currentWeatherDiv.innerHTML = '<p>Could not retrieve weather data.</p>';
    forecastWeatherDiv.innerHTML = '';
    return;
  }

  // Determine current hour index based on API start time to get current conditions accurately
  let currentHourIndex = 0;
  if (data.hourly.time && data.hourly.time.length > 0) {
      const apiStartTime = new Date(data.hourly.time[0]);
      const now = new Date();
      currentHourIndex = Math.floor((now.getTime() - apiStartTime.getTime()) / (1000 * 60 * 60));
      if (currentHourIndex < 0 || currentHourIndex >= data.hourly.time.length) {
          currentHourIndex = 0; // Fallback to first available hour if calculation is off
      }
  }


  const todayForecast = data.daily;
  const currentTemp = data.hourly.temperature_2m[currentHourIndex];
  const todayPrecipSum = todayForecast.precipitation_sum[0];
  const todaySunshine = todayForecast.sunshine_duration[0] / 3600; // Convert seconds to hours

  currentWeatherDiv.innerHTML = `
    <p><strong>Current Temperature:</strong> ${currentTemp ? currentTemp.toFixed(1) : 'N/A'}°C</p>
    <p><strong>Today's Estimated Sun Hours:</strong> ${todaySunshine ? todaySunshine.toFixed(1) : 'N/A'} hours</p>
    <p><strong>Today's Total Precipitation:</strong> ${todayPrecipSum ? todayPrecipSum.toFixed(1) : 'N/A'} mm</p>
  `;

  // Display a simple 3-day forecast
  let forecastHtml = '<h4 class="subtitle is-5">Next 3 Days Forecast:</h4><ul>';
  for (let i = 1; i <= 3; i++) { // Starting from tomorrow (index 1 for daily data)
    if (data.daily.time && data.daily.time[i]) {
      const date = new Date(data.daily.time[i]).toLocaleDateString('en-US', {weekday: 'short', month: 'short', day: 'numeric'});
      const maxTemp = data.daily.temperature_2m_max[i];
      const minTemp = data.daily.temperature_2m_min[i];
      const precipSum = data.daily.precipitation_sum[i];
      const precipHours = data.daily.precipitation_hours[i];
      const sunshine = data.daily.sunshine_duration[i] / 3600;

      forecastHtml += `
        <li>
          <strong>${date}:</strong> Max Temp: ${maxTemp ? maxTemp.toFixed(1) : 'N/A'}°C, Min Temp: ${minTemp ? minTemp.toFixed(1) : 'N/A'}°C,
          Sun Hours: ${sunshine ? sunshine.toFixed(1) : 'N/A'}h, Precipitation: ${precipSum ? precipSum.toFixed(1) : 'N/A'}mm (${precipHours ? precipHours.toFixed(0) : 'N/A'} hours)
        </li>
      `;
    }
  }
  forecastHtml += '</ul>';
  forecastWeatherDiv.innerHTML = forecastHtml;
}