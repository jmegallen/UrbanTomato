// Function to get the selected radio button value by its 'name' attribute
function getSelectedRadioValue(name) {
  const radios = document.getElementsByName(name);
  for (const radio of radios) {
    if (radio.checked) {
      return radio.value;
    }
  }
  return null; // No option selected
}

// Function to collect plant environment data
function collectPlantEnvironmentData() {
  const coveredStatus = getSelectedRadioValue('coveredStatus');
  const sunDirection = getSelectedRadioValue('sunDirection');

  console.log('Collected Covered Status:', coveredStatus);
  console.log('Collected Sun Direction:', sunDirection);

  // You can now use these values for your app logic.
  // For example, you might pass them to a function that gives specific advice.
  // Or store them in a way that allows other parts of the app to access them.
}