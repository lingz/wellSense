window.generateMap = function(elementId, markerCallback) {
  var element = $("#" + elementId);
  var result = {markers: {}};
  console.log(element.hasClass("rendered"));
  if (element.hasClass("rendered")) return;
  var mapOptions = {
    zoom: 12,
    center: new google.maps.LatLng(15.360715, 44.178987),
    mapTypeId: google.maps.MapTypeId.HYBRID
  };

  var map = new google.maps.Map(document.getElementById(elementId),
      mapOptions);

  // place the existing wells on the map
  var existingWells = Wells.find().fetch();
  for (var i = 0; i < existingWells.length; i++) {
    var selectedWell = existingWells[i];
    var latLng = new google.maps.LatLng(selectedWell.lat, selectedWell.lng);
    var marker = new google.maps.Marker({
      title: selectedWell.shortcode,
      position: latLng,
      map: map
    });
    result.markers[selectedWell.shortcode] = marker;
    (function(map, marker) {
      if (typeof markerCallback === 'function') {
        google.maps.event.addListener(marker, "click", function() {
          markerCallback(marker, selectedWell);
        });
      } else {
        var infoWindow = new google.maps.InfoWindow({
          content: "<div id='info-window'>" + selectedWell.name + " - " +
          selectedWell.shortcode + "</div>"
        });
        google.maps.event.addListener(marker, "click", function() {
          if (map.openInfo) map.openInfo.close();
          infoWindow.open(map, marker);
          map.openInfo = infoWindow;
        });
      }
    })(map, marker);
  }
  element.addClass("rendered");
  result.map = map;
  return result;
};
