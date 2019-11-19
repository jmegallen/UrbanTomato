var map, marker, infoWindow;

function initMap() {
  map = new google.maps.Map(document.getElementById('map'), {
    zoom: 4,
    center: {
      lat: 48.236100,
      lng: 21.225740
    },
    disableDefaultUI: true,
    //START STYLE
    styles: [
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
    ]
      //END STYLE
  });

  //CUSTOM MARKER ICON
  var image = {
    url: 'https://raw.githubusercontent.com/jmegallen/UrbanTomato/master/img/tom.png',
    scaledSize: new google.maps.Size(25, 25)
  };
  marker = new google.maps.Marker({
    map: map,
    draggable: true,
    icon: image,
    animation: google.maps.Animation.DROP,
    position: {
      lat: 59.909144,
      lng: 10.7436936
    },
    zoomControl: true,
    scaleControl: true
  });
  marker.addListener('click', toggleBounce);
  //END CUSTOM MARKER ICON

  // GET POSITION
  infoWindow = new google.maps.InfoWindow;

  // Try HTML5 geolocation.
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
  //END GET POSITION
  
}

//BOUNCE WHEN MARKER IS PRESSED
function toggleBounce() {
  if (marker.getAnimation() !== null) {
    marker.setAnimation(null);
  } else {
    marker.setAnimation(google.maps.Animation.BOUNCE);
  }
}
//END BOUNCE WHEN MARKER IS PRESSED

function handleLocationError(browserHasGeolocation, infoWindow, pos) {
  infoWindow.setPosition(pos);
  infoWindow.setContent(browserHasGeolocation ?
                        'Error: The Geolocation service failed.' :
                        'Error: Your browser doesn\'t support geolocation.');
  infoWindow.open(map);
}
