MARKERS = {
  broken: "http://www.google.com/intl/en_us/mapfiles/ms/micons/red-dot.png",
  selected: "http://www.google.com/intl/en_us/mapfiles/ms/micons/yellow-dot.png",
  latest: "http://www.google.com/intl/en_us/mapfiles/ms/micons/green-dot.png",
  normal: "http://www.google.com/intl/en_us/mapfiles/ms/micons/blue-dot.png"
};
window.generateMap = function(elementId, markerCallback) {
  var element = $("#" + elementId);
  var result = {markers: {}};
  if (element.hasClass("rendered")) return;
  var mapOptions = {
    zoom: 15,
    center: new google.maps.LatLng(13.565088, 44.055991),
    mapTypeId: google.maps.MapTypeId.HYBRID
  };

  var map = new google.maps.Map(document.getElementById(elementId),
      mapOptions);

  // place the existing wells on the map
  // the latest marker
  var latestWellCode = Reports.findOne().wellCode;
  
  var existingWells = Wells.find().fetch();
  var activeWell = Session.get("activeWell");
  for (var i = 0; i < existingWells.length; i++) {
    var selectedWell = existingWells[i];
    var latLng = new google.maps.LatLng(selectedWell.lat, selectedWell.lng);
    var opts = {
      title: selectedWell.shortcode,
      position: latLng,
      map: map
    };
    if (selectedWell.status == "broken") {
      opts.icon = MARKERS.broken;
    } else if (selectedWell.shortcode == activeWell) {
      opts.icon = MARKERS.selected;
    } else if (selectedWell.shortcode == latestWellCode) {
      opts.icon = MARKERS.latest;
    } else {
      opts.icon = MARKERS.normal;
    }

    var marker = new google.maps.Marker(opts);
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
  if (activeWell) result.markers.active = activeWell;
  if (latestWellCode) result.markers.latest = latestWellCode;
  element.addClass("rendered");
  result.map = map;
  return result;
};

window.changeMarker = function(wellCode, isActive) {
  if (mainMarkers) {
    var well = Wells.findOne({shortcode: wellCode});
    var activeWell = Session.get("activeWell");
    var latestWellCode = Reports.findOne({}, {sort: {timestamp: -1}}).wellCode;
    var marker = mainMarkers[wellCode];
    if (well.status == "broken") {
      marker.setIcon(MARKERS.broken);
    } else if (well.shortcode == activeWell) {
      marker.setIcon(MARKERS.selected);
      if (mainMarkers.active != well.shortcode)
        changeMarker(mainMarkers.active);
      mainMarkers.active = wellCode;
    } else if (well.shortcode == latestWellCode) {
      marker.setIcon(MARKERS.latest);
      if (mainMarkers.latest != well.shortcode)
        changeMarker(mainMarkers.latest);
      mainMarkers.latest = wellCode;
    } else {
      marker.setIcon(MARKERS.normal);
    }
    
  }
};
