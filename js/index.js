// Example of how to use it (e.g., when a "Save" or "Update" button is clicked)
function getPlantEnvironmentDetails() {
  const coveredStatus = getSelectedRadioValue('coveredStatus');
  const sunDirection = getSelectedRadioValue('sunDirection');

  console.log('Covered Status:', coveredStatus);
  console.log('Sun Direction:', sunDirection);

  // You can then pass these values to your weather fetching or recommendation logic
  // e.g., if (coveredStatus === 'covered') { /* adjust precipitation logic */ }
}
