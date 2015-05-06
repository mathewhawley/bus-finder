var Map = function() {

  var mainMap = null;

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

  function setCurrentPosition(newCoords) {
    mainMap.setOptions({
      center: newCoords,
      zoom: 17
    });
  }

  return {
    mainInit: mainInit,
    setCurrentPosition: setCurrentPosition
  };

};