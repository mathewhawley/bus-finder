var Map = function() {

  var mainMap = null,
      markerArray = [];

  function mainInit() {
    var mapDiv = document.getElementById('js-map-canvas');
    var mapOptions = {
      center: new google.maps.LatLng(51.508800, -0.127477),
      zoom: 12,
      scrollwheel: false,
      zoomControlOptions: {
        style: google.maps.ZoomControlStyle.LARGE,
        position: google.maps.ControlPosition.RIGHT
      },
      streetViewControl: false,
      panControl: false,
      mapTypeControl: false
    };
    mainMap = new google.maps.Map(mapDiv, mapOptions);
  }

  function setNewLocation(position) {
    mainMap.setOptions({
      center: position,
      zoom: 17
    });
  }

  function addMarker(position) {
    if (markerArray.length > 0)
      deleteMarkers();

    var customMarkerImage = '../images/markers/user_location_marker.svg';
    var marker = new google.maps.Marker({
      position: position,
      map: mainMap,
      icon: customMarkerImage
    });

    markerArray.push(marker);
  }

  function getNewBounds() {
    var swLat = mainMap.getBounds().Ga.C,
        swLng = mainMap.getBounds().xa.j,
        neLat = mainMap.getBounds().Ga.j,
        neLng = mainMap.getBounds().xa.C,
        url = 'http://digitaslbi-id-test.herokuapp.com/bus-stops?northEast=' + neLat + ',' + neLng + '&southWest=' + swLat + ',' + swLng;
    return url;
  }

  function addNearestMarkers(markers) {
    markers.forEach(function(el) {
      var position = new google.maps.LatLng(el.lat, el.lng);
      var customMarkerImage = '../images/markers/bus_stop_marker.svg';
      var marker = new MarkerWithLabel({
        position: position,
        map: mainMap,
        icon: customMarkerImage,
        labelContent: el.stopIndicator,
        labelAnchor: new google.maps.Point(10, 34),
        labelClass: 'marker-label',
        labelInBackground: false
      });
      markerArray.push(marker);
    });
  }

  function clearMarkers() {
    for (var i = 0; i < markerArray.length; i++) {
      markerArray[i].setMap(null);
    }
  }

  function deleteMarkers() {
    clearMarkers();
    markerArray = [];
  }


  return {
    mainInit: mainInit,
    setNewLocation: setNewLocation,
    addMarker: addMarker,
    getNewBounds: getNewBounds,
    addNearestMarkers: addNearestMarkers
  };

};