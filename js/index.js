// This file now contains general app logic and UI interactions,
// and orchestrates calls to functions defined in other files.

// Event listener for when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', function() {
  // Setup event listener for "Save Plant Details" button
  const saveButton = document.getElementById('save-plant-details-button');
  if (saveButton) {
    saveButton.addEventListener('click', collectPlantEnvironmentData); // Calls function from environment.js
  }

  // Any other general app setup that doesn't belong specifically to map or weather
  // For example, if you had other global event listeners or initializations.

  // Note: initMap is called by the Google Maps API script directly via callback=initMap
  // Weather data fetching is called from within map.js once location is available.
});