var map, marker, infoWindow;

function initMap() {
  // Create a new StyledMapType object, passing it an array of styles,
  // and the name to be displayed on the map type control.
  var styledMapType = new google.maps.StyledMapType(
      [
        {
          elementType: 'geometry',
          stylers: [{color: '#f5f5f5'}]
        },
        {
          elementType: 'labels.icon',
          stylers: [{visibility: 'off'}]
        },
        {
          elementType: 'labels.text.fill',
          stylers: [{color: '#616161'}]
        },
        {
          elementType: 'labels.text.stroke',
          stylers: [{color: '#f5f5f5'}]
        },
        {
          featureType: 'administrative.land_parcel',
          elementType: 'labels.text.fill',
          stylers: [{color: '#bdbdbd'}]
        },
        {
          featureType: 'poi',
          elementType: 'geometry',
          stylers: [{color: '#eeeeee'}]
        },
        {
          featureType: 'poi',
          elementType: 'labels.text.fill',
          stylers: [{color: '#757575'}]
        },
        {
          featureType: 'poi.park',
          elementType: 'geometry',
          stylers: [{color: '#e5e5e5'}]
        },
        {
          featureType: 'poi.park',
          elementType: 'labels.text.fill',
          stylers: [{color: '#9e9e9e'}]
        },
        {
          featureType: 'road',
          elementType: 'geometry',
          stylers: [{color: '#ffffff'}]
        },
        {
          featureType: 'road.arterial',
          elementType: 'labels.text.fill',
          stylers: [{color: '#757575'}]
        },
        {
          featureType: 'road.highway',
          elementType: 'geometry',
          stylers: [{color: '#dadada'}]
        },
        {
          featureType: 'road.highway',
          elementType: 'labels.text.fill',
      stylers: [{color: '#616161'}]
        },
        {
          featureType: 'road.local',
          elementType: 'labels.text.fill',
          stylers: [{color: '#9e9e9e'}]
        },
        {
          featureType: 'transit.line',
          elementType: 'geometry',
          stylers: [{color: '#e5e5e5'}]
        },
        {
          featureType: 'transit.station',
          elementType: 'geometry',
          stylers: [{color: '#eeeeee'}]
        },
        {
          featureType: 'water',
          elementType: 'geometry',
          stylers: [{color: '#c9c9c9'}]
        },
        {
          featureType: 'water',
          elementType: 'labels.text.fill',
          stylers: [{color: '#9e9e9e'}]
        }
      ],
      {name: 'Greyscale'});

  // Create a map object, and include the MapTypeId to add
  // to the map type control.
  map = new google.maps.Map(document.getElementById('map'), {
    zoom: 17, // Using zoom from gmap.js
    center: {lat: 52.4621432, lng: 13.4195465}, // Using center from gmap.js
    mapTypeControlOptions: {
      mapTypeIds: ['roadmap', 'styled_map']
    },
    disableDefaultUI: true // From index.js
  });

  //Associate the styled map with the MapTypeId and set it to display.
  map.mapTypes.set('styled_map', styledMapType);
  map.setMapTypeId('styled_map');

  // This sample uses the Place Autocomplete widget to allow the user to search
  // for and select a place.
  var input = document.getElementById('pac-input');
  var autocomplete = new google.maps.places.Autocomplete(input);
  autocomplete.bindTo('bounds', map);
  map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);

  // Marker setup (combined from both files)
  var image = {
    url: 'https://raw.githubusercontent.com/jmegallen/UrbanTomato/master/img/tom.png',
    scaledSize: new google.maps.Size(25, 25)
  };
  marker = new google.maps.Marker({
    map: map,
    draggable: true,
    icon: image,
    animation: google.maps.Animation.DROP, // From index.js
    position: map.getCenter(), // Initial position set to map center
    zoomControl: true, // From index.js
    scaleControl: true // From index.js
  });

  // InfoWindow setup
  infoWindow = new google.maps.InfoWindow(); // Declare infoWindow here for broader access
  var infowindowContent = document.getElementById('infowindow-content');
  infoWindow.setContent(infowindowContent);

  // Marker click listener (combined from both files)
  marker.addListener('click', function() {
    infoWindow.open(map, marker);
    toggleBounce(); // From index.js
  });

  // Autocomplete listener
  autocomplete.addListener('place_changed', function() {
    infoWindow.close();
    var place = autocomplete.getPlace();
    if (!place.geometry) {
      return;
    }

    if (place.geometry.viewport) {
      map.fitBounds(place.geometry.viewport);
    } else {
      map.setCenter(place.geometry.location);
      map.setZoom(17);
    }

    // Set the position of the marker using the place ID and location.
    marker.setPlace({
      placeId: place.place_id,
      location: place.geometry.location
    });
    marker.setVisible(true);

    infowindowContent.children['place-name'].textContent = place.name;
    infowindowContent.children['place-id'].textContent = place.place_id;
    infowindowContent.children['place-address'].textContent =
        place.formatted_address;
    infoWindow.open(map, marker);
  });

  // GET POSITION (from index.js)
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(function(position) {
      var pos = {
        lat: position.coords.latitude,
        lng: position.coords.longitude
      };
      marker.setPosition(pos);
      marker.setTitle('Your position is '+(Math.round(pos.lat * 100) / 100)+", "+(Math.round(pos.lng * 100) / 100));
      map.setCenter(pos);
      map.setZoom(15);
    }, function() {
      handleLocationError(true, infoWindow, map.getCenter());
    });
  } else {
    // Browser doesn't support Geolocation
    handleLocationError(false, infoWindow, map.getCenter());
  }
}

// BOUNCE WHEN MARKER IS PRESSED (from index.js)
function toggleBounce() {
  if (marker.getAnimation() !== null) {
    marker.setAnimation(null);
  } else {
    marker.setAnimation(google.maps.Animation.BOUNCE);
  }
}

// ERROR HANDLING FOR GEOLOCATION (from index.js)
function handleLocationError(browserHasGeolocation, infoWindow, pos) {
  infoWindow.setPosition(pos);
  infoWindow.setContent(browserHasGeolocation ?
                        'Error: The Geolocation service failed.' :
                        'Error: Your browser doesn\'t support geolocation.');
  infoWindow.open(map);
}
// Function to get the selected radio button value
function getSelectedRadioValue(name) {
  const radios = document.getElementsByName(name);
  for (const radio of radios) {
    if (radio.checked) {
      return radio.value;
    }
  }
  return null; // No option selected
}

// Example of how to use it (e.g., when a "Save" or "Update" button is clicked)
function getPlantEnvironmentDetails() {
  const coveredStatus = getSelectedRadioValue('coveredStatus');
  const sunDirection = getSelectedRadioValue('sunDirection');

  console.log('Covered Status:', coveredStatus);
  console.log('Sun Direction:', sunDirection);

  // You can then pass these values to your weather fetching or recommendation logic
  // e.g., if (coveredStatus === 'covered') { /* adjust precipitation logic */ }
}

// You might want to call getPlantEnvironmentDetails()
// when a button is clicked, or when the user changes a selection.
// For example, if you have a "Save Details" button:
// document.getElementById('save-details-button').addEventListener('click', getPlantEnvironmentDetails);

// Or, if you want to get them when the map location updates:
// Inside your initMap or place_changed listener:
// getPlantEnvironmentDetails(); // Call this to update based on current selections