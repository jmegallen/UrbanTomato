var map, marker, infoWindow; // Global map variables

function initMap() {
  // StyledMapType definition
  var styledMapType = new google.maps.StyledMapType(
      [
        { elementType: 'geometry', stylers: [{color: '#f5f5f5'}] },
        { elementType: 'labels.icon', stylers: [{visibility: 'off'}] },
        { elementType: 'labels.text.fill', stylers: [{color: '#616161'}] },
        { elementType: 'labels.text.stroke', stylers: [{color: '#f5f5f5'}] },
        { featureType: 'administrative.land_parcel', elementType: 'labels.text.fill', stylers: [{color: '#bdbdbd'}] },
        { featureType: 'poi', elementType: 'geometry', stylers: [{color: '#eeeeee'}] },
        { featureType: 'poi', elementType: 'labels.text.fill', stylers: [{color: '#757575'}] },
        { featureType: 'poi.park', elementType: 'geometry', stylers: [{color: '#e5e5e5'}] },
        { featureType: 'poi.park', elementType: 'labels.text.fill', stylers: [{color: '#9e9e9e'}] },
        { featureType: 'road', elementType: 'geometry', stylers: [{color: '#ffffff'}] },
        { featureType: 'road.arterial', elementType: 'labels.text.fill', stylers: [{color: '#757575'}] },
        { featureType: 'road.highway', elementType: 'geometry', stylers: [{color: '#dadada'}] },
        { featureType: 'road.highway', elementType: 'labels.text.fill', stylers: [{color: '#616161'}] },
        { featureType: 'road.local', elementType: 'labels.text.fill', stylers: [{color: '#9e9e9e'}] },
        { featureType: 'transit.line', elementType: 'geometry', stylers: [{color: '#e5e5e5'}] },
        { featureType: 'transit.station', elementType: 'geometry', stylers: [{color: '#eeeeee'}] },
        { featureType: 'water', elementType: 'geometry', stylers: [{color: '#c9c9c9'}] },
        { featureType: 'water', elementType: 'labels.text.fill', stylers: [{color: '#9e9e9e'}] }
      ],
      {name: 'Greyscale'}
  );

  map = new google.maps.Map(document.getElementById('map'), {
    zoom: 17,
    center: {lat: 52.4621432, lng: 13.4195465},
    mapTypeControlOptions: {
      mapTypeIds: ['roadmap', 'styled_map']
    },
    disableDefaultUI: true
  });

  map.mapTypes.set('styled_map', styledMapType);
  map.setMapTypeId('styled_map');

  var input = document.getElementById('pac-input');
  var autocomplete = new google.maps.places.Autocomplete(input);
  autocomplete.bindTo('bounds', map);
  map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);

  var image = {
    url: 'https://raw.githubusercontent.com/jmegallen/UrbanTomato/master/img/tom.png',
    scaledSize: new google.maps.Size(25, 25)
  };
  marker = new google.maps.Marker({
    map: map,
    draggable: true,
    icon: image,
    animation: google.maps.Animation.DROP,
    position: map.getCenter(),
    zoomControl: true,
    scaleControl: true
  });

  infoWindow = new google.maps.InfoWindow();
  var infowindowContent = document.getElementById('infowindow-content');
  infoWindow.setContent(infowindowContent);

  marker.addListener('click', function() {
    infoWindow.open(map, marker);
    toggleBounce();
  });

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

    marker.setPlace({
      placeId: place.place_id,
      location: place.geometry.location
    });
    marker.setVisible(true);

    infowindowContent.children['place-name'].textContent = place.name;
    infowindowContent.children['place-id'].textContent = place.place_id;
    infowindowContent.children['place-address'].textContent = place.formatted_address;
    infoWindow.open(map, marker);

    // Call weather data function from weather.js
    if (typeof getWeatherData === 'function') { // Check if getWeatherData is defined
        getWeatherData(place.geometry.location.lat(), place.geometry.location.lng());
    }
  });

  // GET POSITION
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
      // Call weather data function from weather.js
      if (typeof getWeatherData === 'function') { // Check if getWeatherData is defined
        getWeatherData(pos.lat, pos.lng);
      }
    }, function() {
      handleLocationError(true, infoWindow, map.getCenter());
    });
  } else {
    handleLocationError(false, infoWindow, map.getCenter());
  }

  // Initial call for weather data based on map's initial center
  if (typeof getWeatherData === 'function') { // Check if getWeatherData is defined
      getWeatherData(map.getCenter().lat(), map.getCenter().lng());
  }
}

// BOUNCE WHEN MARKER IS PRESSED
function toggleBounce() {
  if (marker.getAnimation() !== null) {
    marker.setAnimation(null);
  } else {
    marker.setAnimation(google.maps.Animation.BOUNCE);
  }
}

// ERROR HANDLING FOR GEOLOCATION
function handleLocationError(browserHasGeolocation, infoWindow, pos) {
  infoWindow.setPosition(pos);
  infoWindow.setContent(browserHasGeolocation ?
                        'Error: The Geolocation service failed.' :
                        'Error: Your browser doesn\'t support geolocation.');
  infoWindow.open(map);
}