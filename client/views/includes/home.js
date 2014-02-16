Template.home.rendered = function() {
  if (this.find("#main-map-canvas")) {
    if (mapsLoaded) {
      createMainMap();
    } else {
      google.maps.event.addDomListener(window, 'load', createMainMap);
    }
  }
};

Session.setDefault("wellsLoaded", false);
window.mainMarkers = null;
window.changeMarker = null;
function createMainMap() {
  if (Wells.find().count() > 0 && !Session.get("wellsLoaded")) {
    result = generateMap("main-map-canvas", function(marker) {
      Meteor.Router.to("/well/" + marker.title);
      changeMarker(marker.title, true);
    });
    if (result) mainMarkers = result.markers;
    Session.set("wellsLoaded", true);
  } else if (!Session.get("waitingOnLoad")) {
    waitForMap();
  }
}
Session.setDefault("waitingOnLoad", false);
function waitForMap() {
  Session.set("waitingOnLoad", true);
  Deps.autorun(function() {
    Wells.find();
    createMainMap();
  });
}


Deps.autorun(function() {
  var latestReport = Reports.findOne({}, {sort: {timestamp: -1}});
  if (latestReport) {
    var latestWell = Wells.findOne({shortcode: latestReport.wellCode});
    if (latestWell) {
      changeMarker(latestWell.shortcode);
    }
  }
});

// on well change, redo all wells
Deps.autorun(function() {
  if (changeMarker) {
    Wells.find({}).forEach(function(well) {
      changeMarker(well.shortcode);
    });
  }
});
